import { parseCsv, detectBrand } from "./parse.js";
import { normalize } from "./normalize.js";
import { analyze, METRICS } from "./analyze.js";
import { buildBrief, briefToText } from "./brief.js";

const DATASETS = [
  { file: "data/patient-a-whoop.csv", name: "Jordan Alvarez" },
  { file: "data/patient-b-oura.csv", name: "Priya Menon" },
  { file: "data/patient-c-apple.csv", name: "Sam Whitaker" },
];

const STATUS_LABEL = { red: "Notable change", yellow: "Worth a look", green: "Stable" };

let patients = [];
let selectedId = null;
let charts = [];

async function loadPatient(ds, id) {
  const res = await fetch(ds.file);
  const text = await res.text();
  const { headers, rows } = parseCsv(text);
  const device = detectBrand(headers);
  const records = normalize(device, rows);
  const analysis = analyze(records);
  return { id, name: ds.name, device, records, ...analysis };
}

async function init() {
  patients = await Promise.all(DATASETS.map((ds, i) => loadPatient(ds, i)));
  patients.sort((a, b) => b.urgency - a.urgency);
  renderList();
  if (patients.length) selectPatient(patients[0].id);
}

function renderList() {
  const el = document.getElementById("patient-list");
  el.innerHTML = "";
  for (const p of patients) {
    const li = document.createElement("button");
    li.className = "patient-item" + (p.id === selectedId ? " active" : "");
    li.onclick = () => selectPatient(p.id);
    li.innerHTML = `
      <span class="dot ${p.status}"></span>
      <span class="pinfo">
        <span class="pname">${p.name}</span>
        <span class="pmeta">${p.device} · ${STATUS_LABEL[p.status]}</span>
      </span>`;
    el.appendChild(li);
  }
}

function selectPatient(id) {
  selectedId = id;
  renderList();
  const p = patients.find((x) => x.id === id);
  const brief = buildBrief(p);
  renderDetail(p, brief);
}

function renderDetail(p, brief) {
  const el = document.getElementById("detail");
  const questionsHtml = brief.questions.length
    ? `<div class="questions"><h3>Suggested questions</h3><ul>${brief.questions
        .map((q) => `<li>${q}</li>`)
        .join("")}</ul></div>`
    : "";

  el.innerHTML = `
    <header class="detail-head">
      <div>
        <h2>${p.name}</h2>
        <div class="subtle">${p.device} · last ${p.recentCount} readings vs baseline</div>
      </div>
      <span class="badge ${p.status}">${STATUS_LABEL[p.status]}</span>
    </header>

    <section class="brief">
      <div class="brief-head">
        <h3>30-second brief</h3>
        <button id="copy-btn" class="copy">Copy to note</button>
      </div>
      <p class="summary">${brief.summary}</p>
    </section>

    ${questionsHtml}

    <section class="charts" id="charts"></section>
    <p class="disclaimer">Insights are based on this patient's own baseline. Not a diagnosis.</p>
  `;

  document.getElementById("copy-btn").onclick = () => {
    navigator.clipboard.writeText(briefToText(p, brief));
    const b = document.getElementById("copy-btn");
    b.textContent = "Copied";
    setTimeout(() => (b.textContent = "Copy to note"), 1500);
  };

  renderCharts(p);
}

function renderCharts(p) {
  charts.forEach((c) => c.destroy());
  charts = [];
  const wrap = document.getElementById("charts");
  const flaggedKeys = new Set(p.findings.map((f) => f.key));
  const labels = p.records.map((r) => r.date.slice(5));

  for (const metric of METRICS) {
    const vals = p.records.map((r) => r[metric.key]);
    if (vals.every((v) => v == null)) continue;
    const base = p.baseline[metric.key];
    const flagged = flaggedKeys.has(metric.key);

    const card = document.createElement("div");
    card.className = "chart-card" + (flagged ? " flagged" : "");
    card.innerHTML = `<div class="chart-title">${metric.label} (${metric.unit})${
      flagged ? ' <span class="flag">flagged</span>' : ""
    }</div><canvas></canvas>`;
    wrap.appendChild(card);

    const ctx = card.querySelector("canvas");
    const bandHi = base ? p.records.map(() => base.hi) : [];
    const bandLo = base ? p.records.map(() => base.lo) : [];

    const c = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "baseline high",
            data: bandHi,
            borderWidth: 0,
            pointRadius: 0,
            backgroundColor: "rgba(99,102,241,0.10)",
            fill: "+1",
          },
          {
            label: "baseline low",
            data: bandLo,
            borderWidth: 0,
            pointRadius: 0,
            fill: false,
          },
          {
            label: metric.label,
            data: vals,
            borderColor: flagged ? "#dc2626" : "#2563eb",
            backgroundColor: flagged ? "#dc2626" : "#2563eb",
            borderWidth: 2,
            pointRadius: 2,
            tension: 0.25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { maxTicksLimit: 6, font: { size: 10 } } } },
      },
    });
    charts.push(c);
  }
}

init();
