// Baseline math + anomaly detection + status.
// This is the deterministic layer. The brief may only phrase what this computes.

export const METRICS = [
  { key: "restingHeartRate", label: "Resting heart rate", unit: "bpm", goodDir: "down" },
  { key: "hrv", label: "HRV", unit: "ms", goodDir: "up" },
  { key: "sleepHours", label: "Sleep", unit: "h", goodDir: "up" },
  { key: "respiratoryRate", label: "Respiratory rate", unit: "rpm", goodDir: "down" },
];

// Percent-change thresholds per metric (fraction).
const PCT_THRESHOLD = {
  restingHeartRate: 0.08,
  hrv: 0.15,
  sleepHours: 0.15,
  respiratoryRate: 0.05,
};

const RECENT_WINDOW = 6; // last N records = "recent"
const Z_FLAG = 1.5;
const Z_RED = 2.0;

function mean(xs) {
  const v = xs.filter((x) => x != null);
  if (!v.length) return null;
  return v.reduce((a, b) => a + b, 0) / v.length;
}

function stddev(xs, m) {
  const v = xs.filter((x) => x != null);
  if (v.length < 2) return 0;
  const variance = v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1);
  return Math.sqrt(variance);
}

export function analyze(records) {
  const n = records.length;
  const recentCount = Math.min(RECENT_WINDOW, Math.floor(n / 3));
  const baselineRecords = records.slice(0, n - recentCount);
  const recentRecords = records.slice(n - recentCount);

  const findings = [];
  const baseline = {};

  for (const metric of METRICS) {
    const baseVals = baselineRecords.map((r) => r[metric.key]);
    const recentVals = recentRecords.map((r) => r[metric.key]);
    const baseMean = mean(baseVals);
    if (baseMean == null) continue;
    const baseSd = stddev(baseVals, baseMean);
    const recentMean = mean(recentVals);
    if (recentMean == null) continue;

    const delta = recentMean - baseMean;
    const pct = baseMean === 0 ? 0 : delta / baseMean;
    const z = baseSd === 0 ? 0 : delta / baseSd;

    baseline[metric.key] = {
      mean: baseMean,
      sd: baseSd,
      lo: baseMean - baseSd,
      hi: baseMean + baseSd,
    };

    const flagged =
      Math.abs(z) >= Z_FLAG || Math.abs(pct) >= (PCT_THRESHOLD[metric.key] ?? 0.1);

    if (flagged) {
      const direction = delta > 0 ? "up" : "down";
      const concerning = direction !== metric.goodDir;
      findings.push({
        key: metric.key,
        label: metric.label,
        unit: metric.unit,
        baseMean: +baseMean.toFixed(1),
        recentMean: +recentMean.toFixed(1),
        delta: +delta.toFixed(1),
        pct: +(pct * 100).toFixed(0),
        z: +z.toFixed(1),
        direction,
        concerning,
        severe: Math.abs(z) >= Z_RED,
      });
    }
  }

  let status = "green";
  if (findings.some((f) => f.severe && f.concerning)) status = "red";
  else if (findings.some((f) => f.concerning)) status = "yellow";

  // Urgency score for sorting (higher = more urgent).
  const urgency = findings
    .filter((f) => f.concerning)
    .reduce((a, f) => a + Math.abs(f.z), 0);

  return { baseline, findings, status, urgency, recentCount };
}
