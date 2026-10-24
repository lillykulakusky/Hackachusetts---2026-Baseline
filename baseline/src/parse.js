// CSV parsing + brand detection.
// Kept framework-free so it can move to Next.js untouched.

export function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = splitRow(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const cells = splitRow(line);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = cells[i];
    });
    return obj;
  });
  return { headers, rows };
}

function splitRow(line) {
  // Simple CSV split (no quoted-comma support needed for our synthetic data).
  return line.split(",").map((c) => c.trim());
}

// Detect brand from the header signature so one code path handles any file.
export function detectBrand(headers) {
  const h = headers.map((x) => x.toLowerCase());
  if (h.some((x) => x.includes("cycle start") || x.includes("asleep duration"))) {
    return "WHOOP";
  }
  if (h.some((x) => x.includes("lowest resting") || x.includes("total sleep duration"))) {
    return "Oura";
  }
  if (h.some((x) => x.includes("startdate") || x.includes("heartratevariability"))) {
    return "Apple Watch";
  }
  return "Unknown";
}
