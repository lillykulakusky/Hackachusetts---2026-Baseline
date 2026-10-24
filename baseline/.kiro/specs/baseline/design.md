# Baseline — Design

## Overview

Baseline is a static, client-side web app (no build step) so it runs anywhere
with zero install. It ingests brand-specific CSVs, normalizes them to one model,
computes personal baselines and anomalies in plain JavaScript, and renders a
clinician dashboard with a computed 30-second brief and trend charts.

Stack: single-page HTML + vanilla ES modules + Chart.js (CDN). No framework,
no bundler. Upgradeable to Next.js + Recharts later without changing the core
logic in `src/`.

## Architecture

```
index.html            UI shell + dashboard layout
src/parse.js          CSV parsing + brand detection
src/normalize.js      brand columns -> standard model
src/analyze.js        baseline math + anomaly detection + status
src/brief.js          turns computed findings into text + questions
src/app.js            wiring: load data, render list, render detail, charts
data/*.csv            synthetic WHOOP / Oura / Apple exports
styles.css            styling
```

## Data model

```js
// Normalized daily record
{ date: "2026-10-01", restingHeartRate: 58, hrv: 52, sleepHours: 7.4,
  respiratoryRate: 14.5 }

// Patient
{ id, name, device, records: [NormalizedRecord], baseline, findings, status }
```

## Brand mapping (normalize.js)

| Standard        | WHOOP column           | Oura column        | Apple column            |
|-----------------|------------------------|--------------------|-------------------------|
| date            | Cycle start date       | date               | startDate               |
| restingHeartRate| Resting heart rate bpm | Lowest Resting HR  | RestingHeartRate        |
| hrv             | Heart rate variability | Average HRV        | HeartRateVariability    |
| sleepHours      | Asleep duration (min)/60| Total Sleep (s)/3600| SleepAnalysis (hours)  |
| respiratoryRate | Respiratory rate       | Respiratory Rate   | RespiratoryRate         |

Brand is detected by header signature, so the same code path handles any file.

## Baseline + anomaly math (analyze.js)

- Split each patient's series into a trailing baseline window (first N days) and
  a recent window (last M days).
- Baseline = mean and standard deviation over the baseline window per metric.
- For each metric, compare the recent mean to baseline. Compute delta, percent
  change, and z-score (delta / baseline stddev).
- Flag an anomaly WHEN |z| >= 1.5 OR percent change crosses a per-metric
  threshold (e.g. RHR +/-8%, sleep +/-15%, HRV +/-15%).
- Status: red if any |z| >= 2, yellow if any flag, else green.

The AI/brief layer receives ONLY these computed findings. This is the guardrail:
numbers come from code, prose is the only thing generated.

## Brief generation (brief.js)

Deterministic templating from findings (works offline, no API key needed for the
demo). Each finding becomes one sentence citing its computed number and links to
that metric's chart. Suggested questions are derived from the flagged metrics.
Optional: swap in an LLM call that receives the findings JSON and is instructed
to rephrase without adding numbers. The guardrail holds either way.

## UI flow

1. Patient list (left), sorted most-urgent-first, color dot per status.
2. Select a patient -> brief + up to 3 questions + "copy to note".
3. Trend charts per metric with a shaded baseline band; flagged metrics marked.
