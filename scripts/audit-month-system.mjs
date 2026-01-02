import {
  getMonthRange,
  daysInMonthRange,
  startWeightMonth,
  endWeightMonth,
  fairScoreMonth,
  performanceFactorMonth,
  finalScoreMonth,
} from "../src/utils/monthChallenge.js";

function logAll(name, entries, monthKey) {
  const { startISO, endISO } = getMonthRange(monthKey);
  const days = daysInMonthRange(monthKey);

  const sw = startWeightMonth(entries, monthKey);
  const ew = endWeightMonth(entries, monthKey);
  const delta = (sw != null && ew != null) ? (sw - ew) : null;

  const fair = fairScoreMonth(entries, monthKey);
  const perf = performanceFactorMonth(entries, monthKey);
  const final = finalScoreMonth(entries, monthKey);

  console.log("\n=======================================");
  console.log(`${name} | Monat ${monthKey}`);
  console.log(`Zeitraum: ${startISO} -> ${endISO} | ${days} Tage`);
  console.log(`StartWeightMonth: ${sw ?? "—"} kg`);
  console.log(`EndWeightMonth:   ${ew ?? "—"} kg`);
  console.log(`Delta (Monat):    ${delta == null ? "—" : delta.toFixed(2)} kg`);
  console.log(`FairScore (%):    ${fair == null ? "—" : fair.toFixed(2)} %`);
  console.log(`Perf-Faktor:      ${perf == null ? "—" : perf.toFixed(4)}`);
  console.log(`FinalScore (%):   ${final == null ? "—" : final.toFixed(2)} %`);

  const check = (fair == null || perf == null || final == null) ? null : (fair * perf);
  if (check == null) console.log("Check base*perf:  —");
  else console.log(`Check base*perf:  ${check.toFixed(2)} %`);
}

const monthKey = "2026-01";

// A) Toleranz-Test: |delta| < 0.2 => FairScore 0 => FinalScore 0
const tolMinus = [
  { date: "2026-01-01", weight: 100.00 },
  { date: "2026-02-01", weight: 99.85 }, // delta = 0.15
];

const tolPlus = [
  { date: "2026-01-01", weight: 100.00 },
  { date: "2026-02-01", weight: 100.10 }, // delta = -0.10 (Zunahme, aber in Toleranz)
];

// B) Monats-Basis statt 7 Tage: nur Start/Ende bestimmen den Delta
const monthLoss = [
  { date: "2026-01-01", weight: 120.00 },
  { date: "2026-01-20", weight: 118.00 },
  { date: "2026-02-01", weight: 117.00 }, // delta = 3.00
];

// C) Wenn Ende höher (Zunahme) und nicht in Toleranz => FairScore negativ / Final entsprechend
const gain = [
  { date: "2026-01-01", weight: 80.00 },
  { date: "2026-02-01", weight: 80.50 }, // delta = -0.50
];

// D) Daily vs missing days: Perf-Faktor = Wiegetage/days
function genDaily(startISO, daysToGen, startW, deltaPerDay) {
  const out = [];
  const d0 = new Date(startISO + "T00:00:00");
  for (let i = 0; i < daysToGen; i++) {
    const d = new Date(d0);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0,10);
    const w = +(startW - (i * deltaPerDay)).toFixed(2);
    out.push({ date: iso, weight: w });
  }
  return out;
}

const { startISO } = getMonthRange(monthKey);
const daily32 = genDaily(startISO, 32, 100.00, 0.10); // enthält 01.02 -> Perf ~ 1.0
const missing = [
  { date: "2026-01-01", weight: 100.00 },
  { date: "2026-01-10", weight: 99.00 },
  { date: "2026-02-01", weight: 95.00 },
];

logAll("A) TOLERANZ (Abnahme 0.15kg)", tolMinus, monthKey);
logAll("A) TOLERANZ (Zunahme 0.10kg)", tolPlus, monthKey);
logAll("B) MONAT-DELTA 3.00kg", monthLoss, monthKey);
logAll("C) ZUNAHME 0.50kg", gain, monthKey);
logAll("D) DAILY (Perf ~ 1.0)", daily32, monthKey);
logAll("D) FEHLTAGE (Perf < 1.0)", missing, monthKey);

console.log("\n✅ Erwartung:");
console.log("- Toleranzfälle: FairScore 0.00, FinalScore 0.00");
console.log("- Monats-Delta: FairScore basiert auf (Start-Ende), nicht 'letzte 7 Tage'");
console.log("- FinalScore = FairScore * Perf-Faktor (Check base*perf muss passen)");
