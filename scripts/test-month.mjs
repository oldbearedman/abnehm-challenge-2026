import {
  getMonthRange,
  daysInMonthRange,
  startWeightMonth,
  endWeightMonth,
  trendKgMonth,
  fairScoreMonth,
  performanceFactorMonth,
  finalScoreMonth,
} from "../src/utils/monthChallenge.js";

function logMonth(name, entries, monthKey) {
  const { startISO, endISO } = getMonthRange(monthKey);
  const days = daysInMonthRange(monthKey);

  const sw = startWeightMonth(entries, monthKey);
  const ew = endWeightMonth(entries, monthKey);
  const trendKg = trendKgMonth(entries, monthKey);

  const fair = fairScoreMonth(entries, monthKey);
  const perf = performanceFactorMonth(entries, monthKey);
  const final = finalScoreMonth(entries, monthKey);

  console.log("\n=======================================");
  console.log(`${name} | Monat ${monthKey}`);
  console.log(`Zeitraum: ${startISO} -> ${endISO} (Ende INKLUSIVE) | ${days} Tage`);
  console.log(`StartWeightMonth: ${sw ?? "—"} kg`);
  console.log(`EndWeightMonth:   ${ew ?? "—"} kg`);
  console.log(`Trend (Monat) (kg):   ${trendKg ?? "—"} kg`);
  console.log(`FairScore (%):    ${fair == null ? "—" : fair.toFixed(2)} %`);
  console.log(`Perf-Faktor:      ${perf == null ? "—" : perf.toFixed(4)} (0..1)`);
  console.log(`FinalScore (%):   ${final == null ? "—" : final.toFixed(2)} %`);
}

// ===============================
// TESTDATEN
// ===============================

// Brandon: Januar 2026, Ende zählt Eintrag am 01.02 noch zu Januar
const brandon = [
  { date: "2026-01-01", weight: 158.0 },
  { date: "2026-01-10", weight: 156.0 },
  { date: "2026-01-15", weight: 155.4 },
  { date: "2026-01-20", weight: 154.9 },
  { date: "2026-01-25", weight: 154.2 },
  { date: "2026-01-28", weight: 153.6 },
  { date: "2026-01-31", weight: 153.1 },
  { date: "2026-02-01", weight: 152.8 }, // <- zählt als Endwert für Januar
  { date: "2026-02-02", weight: 152.9 }, // <- darf Januar NICHT mehr beeinflussen
];

// Olivia: Februar 2026
const olivia = [
  { date: "2026-02-01", weight: 58.0 },
  { date: "2026-02-05", weight: 57.6 },
  { date: "2026-02-10", weight: 57.2 },
  { date: "2026-02-15", weight: 56.7 },
  { date: "2026-02-20", weight: 56.4 },
  { date: "2026-02-25", weight: 56.0 },
  { date: "2026-02-28", weight: 55.8 },
  { date: "2026-03-01", weight: 55.6 }, // <- zählt als Endwert für Februar
];

// Taylor
const taylor = [
  { date: "2026-01-01", weight: 60.0 },
  { date: "2026-01-12", weight: 59.7 },
  { date: "2026-01-25", weight: 59.3 },
];

logMonth("Brandon", brandon, "2026-01");
logMonth("Brandon", brandon, "2026-02");
logMonth("Olivia",  olivia,  "2026-02");
logMonth("Taylor",  taylor,  "2026-01");

console.log("\n✅ Check: FinalScore = FairScore * Perf-Faktor");


