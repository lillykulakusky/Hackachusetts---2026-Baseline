# Baseline

Wearable data for the care team. Patients share data from their wearable (WHOOP,
Oura, or Apple Watch today; the standard model is built to extend to others);
their clinician gets a 30-second pre-visit brief: what changed, what is unusual
for that patient, and what to ask about.

Hackachusetts 2026 — Healthcare & Biotech track.

> The application lives in [`baseline/`](baseline/). See
> [`baseline/README.md`](baseline/README.md) for full project details.

## What it does

- **Brand-agnostic ingestion.** WHOOP, Oura and Apple Watch exports are detected
  from their header signature and mapped to one standard model (resting heart
  rate, HRV, sleep hours, respiratory rate). Units are normalized along the way —
  WHOOP sleep minutes and Oura sleep seconds both become hours.
- **Personal baselines.** Each patient's earlier history is the baseline (mean and
  standard deviation per metric); the most recent window is compared against it.
  Everything is measured against that patient's own normal, never population norms.
- **Code finds the changes; prose only phrases them.** Deterministic math in
  `baseline/src/analyze.js` flags a metric when the recent mean moves past a z-score
  or percent-change threshold, and sets an overall status. `baseline/src/brief.js`
  turns those findings into sentences and suggested questions using only the numbers
  analyze.js produced — the text layer can never invent a value.
- **Clinician dashboard.** Patients are listed most-urgent-first (urgency = sum of
  concerning z-scores) with a status dot: Notable change, Worth a look, or Stable.
  Each patient view shows the 30-second brief, up to 3 suggested questions, a
  "Copy to note" button that exports a plain-text brief, and per-metric trend charts
  that shade the patient's baseline band and highlight flagged metrics in red.
- **Safe by construction.** Non-diagnostic language only (it states what changed,
  not why), a persistent "Not a diagnosis" disclaimer, and synthetic data only.

## Run it

### Fastest (no install)
Open `baseline/app-local.html` directly in a browser (double-click). Data and
logic are inlined so it needs no server.

### With a local server (matches the module source in `baseline/src/`)
```bash
cd baseline
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

## Project layout

```
baseline/
  index.html        dashboard (fetches CSVs, uses ES modules in src/)
  app-local.html    no-server single-file build (inlined data + logic)
  styles.css        styling
  src/parse.js      CSV parsing + brand detection
  src/normalize.js  brand columns -> standard model
  src/analyze.js    baseline math + anomaly detection + status  (the guardrail)
  src/brief.js      findings -> brief text + suggested questions
  src/app.js        dashboard wiring + charts
  data/*.csv        3 synthetic patients, 3 brand formats
  .kiro/            spec (requirements, design, tasks) + steering
.kiro/hooks/        agent hook that runs logic checks on save
```

## The three demo patients

| Patient | Device | Status | Story |
|---|---|---|---|
| Jordan Alvarez | WHOOP | Notable change | Resting HR climbs (~56 → 67 bpm), HRV falls and sleep drops from late September onward |
| Priya Menon | Oura | Worth a look | Mild recent drift from baseline |
| Sam Whitaker | Apple Watch | Stable | Readings stay within the personal baseline band |

## How Kiro was used

- **Spec mode** drove the build: `baseline/.kiro/specs/baseline/{requirements,design,tasks}.md`.
- **Steering** (`baseline/.kiro/steering/product.md`) enforced the safety rules: never
  diagnose, every number must be computed, synthetic data only.
- **Agent hook** (`.kiro/hooks/baseline-logic-check.json`) runs the logic checks when
  core files are saved.

## Safety

Baseline uses synthetic data only and never outputs a diagnosis. Every numeric
claim traces to a value computed by the code, not by a language model. In
production, sharing would be opt-in per metric, encrypted, and covered by the
standard HIPAA agreements with clinics.
