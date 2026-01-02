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
  if (fair != null && perf != null) {
    console.log(`Check: base*perf = ${(fair*perf).toFixed(2)} %`);
  }
}

// ===============================
// TESTDATEN
// ===============================

// 1) Konstant (soll Perf = 1.0)
const konstant = [
  { date: "2026-01-01", weight: 158.0 },
  { date: "2026-01-05", weight: 157.4 },
  { date: "2026-01-10", weight: 156.0 },
  { date: "2026-01-15", weight: 155.4 },
  { date: "2026-01-20", weight: 154.9 },
  { date: "2026-01-25", weight: 154.2 },
  { date: "2026-01-28", weight: 153.6 },
  { date: "2026-01-31", weight: 153.1 },
  { date: "2026-02-01", weight: 152.8 }, // Endwert zählt zu Januar
];

// 2) Endspurt-only (3 Wochen stagnation, dann 1 Woche runter)
//    Perf sollte deutlich < 1 sein
const endspurt = [
  { date: "2026-01-01", weight: 158.0 },
  { date: "2026-01-10", weight: 158.2 }, // hoch
  { date: "2026-01-20", weight: 158.1 }, // minimal
  { date: "2026-01-27", weight: 157.9 }, // erst spät runter
  { date: "2026-01-29", weight: 156.5 },
  { date: "2026-01-31", weight: 155.0 },
  { date: "2026-02-01", weight: 154.0 }, // Endwert Januar
];

// 3) Gemischt (hoch/runter/hoch/runter) -> Perf ~ 0.5
const gemischt = [
  { date: "2026-01-01", weight: 158.0 },
  { date: "2026-01-08", weight: 157.5 }, // down
  { date: "2026-01-12", weight: 157.9 }, // up
  { date: "2026-01-18", weight: 157.0 }, // down
  { date: "2026-01-22", weight: 157.4 }, // up
  { date: "2026-01-28", weight: 156.6 }, // down
  { date: "2026-02-01", weight: 156.8 }, // up (Endwert)
];

// 4) Zunahme-Monat (Fair negativ) -> Final sollte 0 sein, weil Perf clamped?
//    (Wenn du willst, dass negatives Final möglich ist, sag Bescheid.)
const zunahme = [
  { date: "2026-02-01", weight: 152.8 },
  { date: "2026-02-10", weight: 153.2 },
  { date: "2026-02-20", weight: 153.0 },
  { date: "2026-03-01", weight: 152.9 }, // Ende Feb
];

logMonth("Konstant", konstant, "2026-01");
logMonth("Endspurt", endspurt, "2026-01");
logMonth("Gemischt", gemischt, "2026-01");
logMonth("Zunahme",  zunahme,  "2026-02");

console.log("\n✅ Erwartung:");
console.log("- Konstant: Perf ~ 1.0");
console.log("- Endspurt-only: Perf deutlich < 1.0");
console.log("- Gemischt: Perf ~ 0.5");
console.log("- Zunahme: Fair < 0; Final je nach Regel (aktuell typischerweise 0 wenn Perf 0 ist)");


