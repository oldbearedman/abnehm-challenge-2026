import {
  getMonthRange,
  daysInMonthRange,
  startWeightMonth,
  endWeightMonth,
  fairScoreMonth,
  performanceFactorMonth,
  finalScoreMonth,
} from "../src/utils/monthChallenge.js";

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

function logOptionA(name, entries, monthKey) {
  const { startISO, endISO } = getMonthRange(monthKey);
  const days = daysInMonthRange(monthKey);

  const sw = startWeightMonth(entries, monthKey);
  const ew = endWeightMonth(entries, monthKey);
  const loss = (sw != null && ew != null) ? (sw - ew) : null;

  const fair = fairScoreMonth(entries, monthKey);
  const perf = performanceFactorMonth(entries, monthKey);
  const final = finalScoreMonth(entries, monthKey);

  const weighDays = new Set(entries.filter(e=>e.date>=startISO && e.date<=endISO).map(e=>e.date)).size;

  console.log("\n=======================================");
  console.log(`${name} | Monat ${monthKey}`);
  console.log(`Zeitraum: ${startISO} -> ${endISO} (Ende inkl.)`);
  console.log(`Wiege-Tage: ${weighDays} | daysInMonthRange: ${days}`);
  console.log(`StartWeightMonth: ${sw ?? "—"} kg`);
  console.log(`EndWeightMonth:   ${ew ?? "—"} kg`);
  console.log(`Monatsverlust:    ${loss == null ? "—" : loss.toFixed(2)} kg`);
  console.log(`FairScore (%):    ${fair == null ? "—" : fair.toFixed(2)} %`);
  console.log(`Perf-Faktor:      ${perf == null ? "—" : perf.toFixed(4)}`);
  console.log(`FinalScore (%):   ${final == null ? "—" : final.toFixed(2)} %`);
}

const monthKey = "2026-01";
const { startISO } = getMonthRange(monthKey);

// 32 Tage generieren, damit 01.02 auch drin ist (weil Ende inkl.)
const brandonDaily = genDaily(startISO, 32, 158.00, 0.12);
const oliviaDaily  = genDaily(startISO, 32, 56.45, 0.05);

logOptionA("Brandon DAILY", brandonDaily, monthKey);
logOptionA("Olivia  DAILY", oliviaDaily,  monthKey);

console.log("\n✅ Erwartung: Monatsverlust wird sauber angezeigt. (FairScore/FinalScore kommen aus eurem aktuellen Code.)");
