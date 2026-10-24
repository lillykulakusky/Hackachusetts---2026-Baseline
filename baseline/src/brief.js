// Turn computed findings into prose. NO numbers are invented here: every number
// comes straight from the findings object produced by analyze.js.
// Language is non-diagnostic by construction (states changes, not causes).

function phrase(f) {
  const dirWord = f.direction === "up" ? "up" : "down";
  const absDelta = Math.abs(f.delta);
  const absPct = Math.abs(f.pct);
  if (f.key === "restingHeartRate") {
    return `Resting heart rate is ${dirWord} ${absDelta} bpm versus the patient's baseline (${f.baseMean} to ${f.recentMean} bpm).`;
  }
  if (f.key === "hrv") {
    return `HRV is ${dirWord} ${absPct}% from baseline (${f.baseMean} to ${f.recentMean} ms).`;
  }
  if (f.key === "sleepHours") {
    return `Sleep has moved from ${f.baseMean} to ${f.recentMean} hours per night (${dirWord} ${absPct}%).`;
  }
  if (f.key === "respiratoryRate") {
    return `Respiratory rate is ${dirWord} ${absDelta} rpm from baseline (${f.baseMean} to ${f.recentMean} rpm).`;
  }
  return `${f.label} is ${dirWord} ${absPct}% from baseline.`;
}

export function buildBrief(patient) {
  const { findings, status } = patient;
  const concerning = findings.filter((f) => f.concerning);

  if (status === "green" || concerning.length === 0) {
    return {
      summary:
        "No notable changes. All tracked metrics are within this patient's own baseline range over the recent window.",
      sentences: [],
      questions: [],
    };
  }

  const sentences = concerning
    .sort((a, b) => Math.abs(b.z) - Math.abs(a.z))
    .map(phrase);

  const questions = buildQuestions(concerning).slice(0, 3);

  return {
    summary: sentences.join(" "),
    sentences,
    questions,
  };
}

function buildQuestions(findings) {
  const qs = [];
  const has = (k) => findings.find((f) => f.key === k);
  if (has("restingHeartRate") && has("hrv")) {
    qs.push("Ask about recent stress, illness, or new medication since the change began.");
  } else if (has("restingHeartRate")) {
    qs.push("Ask whether anything changed in activity, caffeine, or medication recently.");
  }
  if (has("sleepHours")) {
    qs.push("Ask about sleep quality and any change in routine or schedule.");
  }
  if (has("hrv") && !has("restingHeartRate")) {
    qs.push("Ask about recovery, training load, or stress over the past few weeks.");
  }
  if (has("respiratoryRate")) {
    qs.push("Ask about any respiratory symptoms since the change began.");
  }
  if (qs.length === 0) {
    qs.push("Review the flagged trend with the patient and ask what changed recently.");
  }
  return qs;
}

export function briefToText(patient, brief) {
  const lines = [];
  lines.push(`Baseline pre-visit brief — ${patient.name} (${patient.device})`);
  lines.push("");
  lines.push(brief.summary);
  if (brief.questions.length) {
    lines.push("");
    lines.push("Suggested questions:");
    brief.questions.forEach((q) => lines.push(`- ${q}`));
  }
  lines.push("");
  lines.push("Insights are based on the patient's own baseline. Not a diagnosis.");
  return lines.join("\n");
}
