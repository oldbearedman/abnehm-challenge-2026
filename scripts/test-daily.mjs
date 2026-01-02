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

function genDaily(startISO, days, startW, deltaPerDay) {
  const out = [];
  const d0 = new Date(startISO + "T00:00:00");
  for (let i = 0; i < days; i++) {
    const d = new Date(d0);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0,10);
    const w = +(startW - (i * deltaPerDay)).toFixed(2);
    out.push({ date: iso, weight: w });
  }
  return out;
}

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
  console.log(`Wiege-Tage im Monat: ${new Set(entries.filter(e=>e.date>=startISO && e.date<=endISO).map(e=>e.date)).size}`);
  console.log(`StartWeightMonth: ${sw ?? "—"} kg`);
  console.log(`EndWeightMonth:   ${ew ?? "—"} kg`);
  console.log(`Trend (Monat) (kg):   ${trendKg ?? "—"} kg`);
  console.log(`FairScore (%):    ${fair == null ? "—" : fair.toFixed(2)} %`);
  console.log(`Perf-Faktor:      ${perf == null ? "—" : perf.toFixed(4)} (0..1)`);
  console.log(`FinalScore (%):   ${final == null ? "—" : final.toFixed(2)} %`);
}

const monthKey = "2026-01";
const { startISO } = getMonthRange(monthKey);
const days = daysInMonthRange(monthKey);

// Daily wiegen: 31/31 => Perf ~ 1.0
const brandonDaily = genDaily(startISO, days, 158.00, 0.12); // -3.72 kg im Monat
const oliviaDaily  = genDaily(startISO, days, 56.45, 0.05); // -1.55 kg im Monat

logMonth("Brandon DAILY", brandonDaily, monthKey);
logMonth("Olivia  DAILY", oliviaDaily,  monthKey);

console.log("\n✅ Erwartung: Perf-Faktor ~ 1.0000 bei DAILY.");


