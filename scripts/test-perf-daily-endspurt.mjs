import {
  getMonthRange,
  daysInMonthRange,
  startWeightMonth,
  endWeightMonth,
  fairScoreMonth,
  performanceFactorMonth,
  finalScoreMonth,
} from "../src/utils/monthChallenge.js";

function genDailyFlatThenDrop(monthKey, startW, flatDays, dropPerDay) {
  const { startISO } = getMonthRange(monthKey);
  const days = daysInMonthRange(monthKey);

  const out = [];
  const d0 = new Date(startISO + "T00:00:00");

  for (let i = 0; i < days + 1; i++) { // +1 damit 01.(FolgeMonat) drin ist
    const d = new Date(d0);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0,10);

    let w = startW;
    if (i >= flatDays) {
      w = startW - ((i - flatDays) * dropPerDay);
    }
    out.push({ date: iso, weight: +w.toFixed(2) });
  }
  return out;
}

function logMonth(name, entries, monthKey) {
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
  console.log(`Delta (Monat):    ${delta == null ? "—" : delta.toFixed(2)} kg`);
  console.log(`FairScore (%):    ${fair == null ? "—" : fair.toFixed(2)} %`);
  console.log(`Perf-Faktor:      ${perf == null ? "—" : perf.toFixed(4)} (0..1)`);
  console.log(`FinalScore (%):   ${final == null ? "—" : final.toFixed(2)} %`);
}

const monthKey = "2026-01";

// 21 Tage Stillstand, dann 10 Tage runter je 0.30 kg/Tag
const endspurtDaily = genDailyFlatThenDrop(monthKey, 158.0, 21, 0.30);

// Konsequent: jeden Tag runter je 0.12 kg/Tag
const { startISO } = getMonthRange(monthKey);
const days = daysInMonthRange(monthKey);
const konstant = [];
const d0 = new Date(startISO + "T00:00:00");
for (let i = 0; i < days + 1; i++) {
  const d = new Date(d0);
  d.setDate(d.getDate() + i);
  const iso = d.toISOString().slice(0,10);
  konstant.push({ date: iso, weight: +(158.0 - i*0.12).toFixed(2) });
}

logMonth("KONSTANT DAILY", konstant, monthKey);
logMonth("ENDSPURT DAILY", endspurtDaily, monthKey);

console.log("\n✅ Erwartung:");
console.log("- KONSTANT: Perf nahe 1.0");
console.log("- ENDSPURT: Perf deutlich kleiner, weil viele Stillstandstage");
