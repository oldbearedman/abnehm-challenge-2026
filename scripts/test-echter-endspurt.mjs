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
  console.log(`Zeitraum: ${startISO} -> ${endISO} | ${days} Tage`);
  console.log(`StartWeightMonth: ${sw ?? "—"} kg`);
  console.log(`EndWeightMonth:   ${ew ?? "—"} kg`);
  console.log(`Trend (Monat) (kg):   ${trendKg ?? "—"} kg`);
  console.log(`FairScore (%):    ${fair == null ? "—" : fair.toFixed(2)} %`);
  console.log(`Perf-Faktor:      ${perf == null ? "—" : perf.toFixed(4)} (0..1)`);
  console.log(`FinalScore (%):   ${final == null ? "—" : final.toFixed(2)} %`);
}

// =====================================
// Echter Endspurt: 3 Wochen Stillstand
// =====================================
const echterEndspurt = [
  { date: "2026-01-01", weight: 158.0 },
  { date: "2026-01-08", weight: 158.0 },
  { date: "2026-01-15", weight: 158.0 },
  { date: "2026-01-22", weight: 158.0 },
  // letzte Woche Diät
  { date: "2026-01-25", weight: 156.5 },
  { date: "2026-01-27", weight: 155.5 },
  { date: "2026-01-29", weight: 154.5 },
  { date: "2026-01-31", weight: 153.5 },
  { date: "2026-02-01", weight: 153.0 }
];

logMonth("ECHTER ENDSPURT", echterEndspurt, "2026-01");

console.log("\n✅ Erwartung:");
console.log("- FairScore hoch (starker Endverlust)");
console.log("- Perf-Faktor deutlich < 0.5");
console.log("- FinalScore massiv gedrückt");


