// Map brand-specific columns to one standard model.
// Standard record: { date, restingHeartRate, hrv, sleepHours, respiratoryRate }

const MAP = {
  WHOOP: {
    date: "Cycle start date",
    restingHeartRate: "Resting heart rate bpm",
    hrv: "Heart rate variability ms",
    sleepMinutes: "Asleep duration min",
    respiratoryRate: "Respiratory rate rpm",
  },
  Oura: {
    date: "date",
    restingHeartRate: "Lowest Resting Heart Rate",
    hrv: "Average HRV",
    sleepSeconds: "Total Sleep Duration",
    respiratoryRate: "Respiratory Rate",
  },
  "Apple Watch": {
    date: "startDate",
    restingHeartRate: "RestingHeartRate",
    hrv: "HeartRateVariability",
    sleepHours: "SleepHours",
    respiratoryRate: "RespiratoryRate",
  },
};

function num(v) {
  if (v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function normalize(brand, rows) {
  const m = MAP[brand];
  if (!m) return [];
  return rows
    .map((r) => {
      let sleepHours = null;
      if (m.sleepHours) sleepHours = num(r[m.sleepHours]);
      else if (m.sleepMinutes) {
        const min = num(r[m.sleepMinutes]);
        sleepHours = min == null ? null : +(min / 60).toFixed(2);
      } else if (m.sleepSeconds) {
        const s = num(r[m.sleepSeconds]);
        sleepHours = s == null ? null : +(s / 3600).toFixed(2);
      }
      return {
        date: r[m.date],
        restingHeartRate: num(r[m.restingHeartRate]),
        hrv: num(r[m.hrv]),
        sleepHours,
        respiratoryRate: num(r[m.respiratoryRate]),
      };
    })
    .filter((rec) => rec.date)
    .sort((a, b) => a.date.localeCompare(b.date));
}
