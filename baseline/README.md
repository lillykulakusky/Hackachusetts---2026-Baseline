# Baseline

Wearable data for the care team. Patients share data from any wearable (WHOOP,
Oura, Apple Watch, Fitbit); their clinician gets a 30-second pre-visit brief:
what changed, what is unusual for that patient, and what to ask about.

Hackachusetts 2026 — Healthcare & Biotech track.

## What it does

- **Brand-agnostic ingestion.** WHOOP, Oura and Apple exports all map to one
  standard model (resting heart rate, HRV, sleep, respiratory rate).
- **Personal baselines.** Changes are measured against each patient's own normal
  using rolling means and standard deviations — not population norms.
- **Code finds the anomalies; prose only phrases them.** Deterministic math in
  `src/analyze.js` computes every number. `src/brief.js` turns those findings
  into text and suggested questions. The writer can never invent a number.
- **Clinician dashboard.** Patient list sorted most-urgent-first with red/yellow/
  green flags, the 30-second brief, up to 3 suggested questions, "copy to note",
  and trend charts with the patient's baseline band.
- **Safe by construction.** No diagnostic language, synthetic data only.

## Run it

### Fastest (no install)
Open `app-local.html` directly in a browser (double-click). Data and logic are
inlined so it needs no server.

### With a local server (matches the module source in `src/`)
```bash
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

## Project layout

```
index.html        dashboard (fetches CSVs, uses ES modules in src/)
app-local.html    no-server single-file build (inlined data + logic)
styles.css        styling
src/parse.js      CSV parsing + brand detection
src/normalize.js  brand columns -> standard model
src/analyze.js    baseline math + anomaly detection + status  (the guardrail)
src/brief.js      findings -> brief text + suggested questions
src/app.js        dashboard wiring + charts
data/*.csv        3 synthetic patients, 3 brand formats
.kiro/            spec (requirements, design, tasks) + steering + hook
```

## The three demo patients

| Patient | Device | Story |
|---|---|---|
| Jordan Alvarez | WHOOP | Red — RHR up, HRV down, sleep down since early October |
| Priya Menon | Oura | Yellow — mild recent drift |
| Sam Whitaker | Apple Watch | Green — stable within baseline |

## How Kiro was used

- **Spec mode** drove the build: `.kiro/specs/baseline/{requirements,design,tasks}.md`.
- **Steering** (`.kiro/steering/product.md`) enforced the safety rules: never
  diagnose, every number must be computed, synthetic data only.
- **Agent hook** (`.kiro/hooks/`) runs the logic checks when core files are saved.

## Safety

Baseline uses synthetic data only and never outputs a diagnosis. Every numeric
claim traces to a value computed by the code, not by a language model. In
production, sharing would be opt-in per metric, encrypted, and covered by the
standard HIPAA agreements with clinics.
