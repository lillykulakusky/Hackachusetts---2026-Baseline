# Baseline — Requirements

## Introduction

Baseline is a brand-agnostic layer that turns a patient's wearable data (WHOOP,
Oura, Apple Watch, Fitbit) into a 30-second pre-visit brief for their clinician:
what changed, what is outside that patient's own normal, and what to ask about.

The user of the product is the clinician, not the wearer. Baseline never
diagnoses. Every statement in a brief is backed by a value the code computed from
the patient's own history.

## Requirements

### Requirement 1 — Brand-agnostic ingestion

**User Story:** As a patient, I want to upload an export from any wearable brand,
so that my clinician can use my data regardless of which device I own.

#### Acceptance Criteria
1. WHEN a user uploads a CSV from WHOOP, Oura, or Apple Health THEN the system
   SHALL parse it into a normalized record set.
2. WHEN the CSV uses a brand-specific column name (e.g. "Recovery score %",
   "Readiness Score", "HRV") THEN the system SHALL map it to a standard metric.
3. IF a column cannot be mapped THEN the system SHALL ignore it without failing
   the rest of the import.

### Requirement 2 — Standard data model

**User Story:** As the care team, I want every brand reduced to the same core
vitals, so that I do not have to learn four dashboards.

#### Acceptance Criteria
1. The system SHALL represent every record as { date, restingHeartRate, hrv,
   sleepHours, respiratoryRate } where available.
2. WHEN a metric is missing for a brand THEN that field SHALL be null, not zero.

### Requirement 3 — Personal baseline and anomaly detection

**User Story:** As a clinician, I want changes measured against the patient's own
normal, so that the brief is meaningful for that individual.

#### Acceptance Criteria
1. The system SHALL compute a rolling baseline (mean and standard deviation) per
   metric over a trailing window.
2. WHEN a recent value deviates from baseline beyond a threshold THEN the system
   SHALL flag it as an anomaly with direction and magnitude.
3. The system SHALL classify each patient as green (stable), yellow (worth a
   look), or red (notable change) based on the flagged anomalies.

### Requirement 4 — The 30-second brief

**User Story:** As a clinician, I want a short brief with suggested questions, so
that I can use months of data in the time I have.

#### Acceptance Criteria
1. The system SHALL generate a brief composed ONLY from computed findings.
2. The system SHALL NOT use diagnostic language. It states changes, not causes.
3. Each claim in the brief SHALL correspond to a chart the clinician can open.
4. The system SHALL produce up to 3 suggested questions derived from the flags.

### Requirement 5 — Clinician dashboard

**User Story:** As a clinician, I want a patient list with status flags and the
brief, so that I can triage before visits.

#### Acceptance Criteria
1. The system SHALL show a patient list sorted with most urgent first.
2. WHEN a patient is selected THEN the system SHALL show the brief, suggested
   questions, and trend charts with the baseline band.
3. The system SHALL provide a "copy to note" action that outputs the brief as
   plain text.

### Requirement 6 — Safety

**User Story:** As a judge and future regulator, I want the tool to be safe by
construction, so that it cannot invent clinical claims.

#### Acceptance Criteria
1. The system SHALL use synthetic data only.
2. The system SHALL never output a diagnosis or a suspected condition.
3. Every numeric claim SHALL trace to a value computed by the code, not the model.
