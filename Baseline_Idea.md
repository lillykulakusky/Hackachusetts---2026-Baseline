# Clinician View

Wearable data for the doctor, not the wearer. Hackachusetts 2026, Healthcare & Biotech track.

# The one-liner

Patients share data from any wearable (WHOOP, Oura, Apple Watch, Fitbit), and their clinician gets a 30-second pre-visit brief: what changed, what is unusual for that patient, and what to ask about.

# Idea form blurb

> *Clinician View: Patients are already collecting wearable data, but doctors never see it. Clinician View lets patients share data from any wearable (WHOOP, Oura, Apple Watch, Fitbit) and turns it into a 30-second pre-visit brief for their clinician: what changed, what's unusual, and what to ask about. It's brand-agnostic, built for the care team, and makes wearable data clinically useful. Track: Healthcare & Biotech.*

# 1-minute pitch

> *"Roughly 1 in 3 Americans wears a health tracker. That's months of data on sleep, heart rate and recovery. Then they walk into a 15-minute doctor's appointment, and none of it gets used. Doctors don't have time to scroll through four different apps, and patients don't know what matters.*
>
> *We're building Clinician View. Patients connect any wearable, whether that's WHOOP, Oura, Apple Watch or Fitbit, and their doctor gets a 30-second brief before the visit: what changed since last time, what's outside the patient's own normal, and 3 questions worth asking.*
>
> *WHOOP is built for the person wearing it. We're built for the people treating them. That makes every wearable more valuable, not less."*

# The problem

- **The data exists but goes nowhere.** Patients show a doctor their phone, and the doctor has no context. Whether 52 ms HRV is good depends entirely on that person.

- **Doctors don't want raw data.** Feeding wearable streams into medical records creates noise and alert fatigue. They need a summary, not a data dump.

- **Every brand is different.** WHOOP, Oura and Apple use different metrics, scores and export formats. No clinic is going to learn four dashboards.

- **The gap:** wearable companies build for consumers, and medical record systems aren't built for continuous data. Nobody owns the layer in between. That layer is the product.

# How it is different from WHOOP

- **The user is the clinician,** not the wearer. WHOOP coaches the person; Clinician View briefs the care team.

- **Brand-agnostic.** Clinics see patients with every device, so a neutral layer is more useful to them than any single brand's app.

- **Complementary, not competing.** It makes WHOOP data more valuable, so WHOOP could be a launch partner or integration.

# How it works

## Patient side (simple)

1.  Pick your device and upload your export (a CSV for the hackathon).

2.  Choose what to share: sleep, resting heart rate, HRV, activity, and a date range.

3.  Optionally add a note, such as "Feeling more tired lately" or "Started new medication 10/1."

## Clinician side (the core product)

1.  **Patient list with status flags:** green for stable, yellow for worth a look, red for a notable change.

2.  **The 30-second brief.** Example: "Resting heart rate is up 9 bpm over 3 weeks, starting around when the patient reported a new medication. Sleep has dropped from 7.4 to 6.1 hours. HRV is 22% below their 90-day baseline."

3.  **Suggested questions.** Example: "Ask about sleep quality since the medication change."

4.  **Every claim links to a chart** showing the trend against the patient's personal baseline band. This is what builds clinician trust.

5.  **"Copy to note" button** that formats the brief as a clean paragraph for the visit note.

# What makes it technically smart

- **A standard data model.** WHOOP Recovery, Oura Readiness and Apple HRV all map to the same core vitals. That is the brand-agnostic part.

- **Code finds the anomalies; AI only writes the summary.** Changes are detected with plain math against each patient's own baseline (rolling averages, standard deviations). The AI writes the brief only from those computed findings, so it cannot invent numbers.

- **Insights, not diagnoses.** It never says "possible infection." It says "resting heart rate is elevated, worth asking about."

# Build plan for today

| Must have | Nice to have |
|---|---|
| 3 fake patients with sample data from 2–3 different brands | Patient-side upload screen |
| Converting each brand's format into the standard model | "Copy to note" export |
| Baseline and anomaly detection | Clinic sign-in |
| Clinician dashboard: patient list, brief, charts | Sorting by most urgent |
| AI-written brief with suggested questions | Mobile layout |

**Suggested tools:** Next.js, Tailwind and Recharts for the app; an LLM API for the brief (Amazon Bedrock is a good look, since AWS is a sponsor); deploy on Vercel.

## Team split (4 people)

| Role | Owns |
|---|---|
| Data           | Sample datasets, brand conversion, anomaly math  |
| Frontend       | Dashboard, patient list, charts                  |
| AI             | Brief prompt, guardrails, suggested questions    |
| Design / pitch | UI polish, README, 3-minute video, Kiro write-up |

## Timeline

| Time | Do |
|---|---|
| 11:30–12:30 | Kiro spec: requirements → design → tasks                 |
| 12:30–5:00  | Build the core flow: one demo path that works end to end |
| 5:00–6:30   | Polish the UI, deploy, clean up the README               |
| 6:30–7:30   | Record the 3-minute video                                |
| 7:30–8:00   | Buffer. Submit by 7:45.                                  |

# How to use Kiro well

- **Spec mode:** have Kiro generate requirements, design and tasks for "brand-agnostic wearable data summarization for clinicians," then build task by task.

- **Steering file:** "Never use diagnostic language. Every claim in a brief must cite a computed metric. Use synthetic data only."

- **Agent hook:** whenever the conversion or anomaly code is saved, Kiro writes and runs tests against the sample patients.

- **Commit the .kiro/ folder** to the public repo and show it in the video.

# 3-minute video outline

| Time | Segment |
|---|---|
| 0:00–0:30 | Problem: "Your doctor has never seen your WHOOP data." |
| 0:30–2:00 | Demo: dashboard → red-flag patient → 30-second brief → click a claim → chart → copy to note. Show a second patient whose data came from an Oura export. |
| 2:00–2:40 | How Kiro helped: spec, steering, hooks |
| 2:40–3:00 | Vision: "Every wearable, one view for the care team." |

# Judge questions and answers

- **"Isn't this a privacy and HIPAA problem?"** Today we use synthetic data only. In production, sharing is opt-in per metric, data is encrypted, and we would sign the standard HIPAA agreements with clinics.

- **"Why wouldn't WHOOP just build this?"** WHOOP could build it for WHOOP data, but clinics see patients with every device. A neutral layer across brands is more useful to doctors, and WHOOP could be a launch partner.

- **"How do you make money?"** Sell to clinics and health systems per clinician. Remote patient monitoring reimbursement is another possible path to explore.

- **"Won't this overload doctors?"** That is the point: it cuts months of data down to 30 seconds and only flags changes relative to the patient's own baseline.

# Submission checklist (due 8:00 PM)

- Project description

- Video, 3 minutes or less

- Public GitHub repo (including the .kiro/ folder)

- Write-up of how Kiro was used
