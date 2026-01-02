/**
 * TEST-SKRIPT FÜR ABNEHM-CHALLENGE LOGIK
 * * Enthält die 1:1 Logik aus monthChallenge.js, um sie isoliert zu testen.
 * Führe dies mit 'node test_logic.js' aus.
 */

// ==========================================
// 1. LOGIK (Kopie aus monthChallenge.js)
// ==========================================

const pad2 = (n) => String(n).padStart(2, "0");

function toISODate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function dateFromMonthKey(key) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1);
}

function getMonthRange(monthKey) {
  const start = dateFromMonthKey(monthKey);
  const endExclusive = new Date(start.getFullYear(), start.getMonth() + 1, 1);
  return {
    startISO: toISODate(start),
    endISO: toISODate(endExclusive), 
  };
}

function daysInMonthRange(monthKey) {
  const start = dateFromMonthKey(monthKey);
  const endExclusive = new Date(start.getFullYear(), start.getMonth() + 1, 1);
  const ms = endExclusive - start;
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function sortEntries(entries = []) {
  return [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
}

function weightAtOrBefore(entries, dateISO) {
  const sorted = sortEntries(entries);
  let last = null;
  for (const e of sorted) {
    if (e?.date && e?.weight != null && e.date <= dateISO) last = e;
  }
  return last ? last.weight : null;
}

function startWeightMonth(entries, monthKey) {
  const { startISO } = getMonthRange(monthKey);
  return weightAtOrBefore(entries, startISO);
}

function endWeightMonth(entries, monthKey) {
  const { endISO } = getMonthRange(monthKey);
  return weightAtOrBefore(entries, endISO);
}

function fairScoreMonth(entries, monthKey) {
  const sw = startWeightMonth(entries, monthKey);
  const ew = endWeightMonth(entries, monthKey);
  if (sw == null || ew == null) return null;

  const delta = sw - ew;
  if (Math.abs(delta) < 0.2) return 0;

  const days = daysInMonthRange(monthKey);
  if (!days) return null;

  const expected = sw * 0.01 * (days / 7);
  if (expected <= 0) return null;

  return (delta / expected) * 100;
}

function performanceFactorMonth(entries, monthKey) {
  if (!entries || entries.length === 0) return 0;

  const { startISO } = getMonthRange(monthKey);
  const days = daysInMonthRange(monthKey);
  if (!days || days <= 1) return 0;

  const startW = startWeightMonth(entries, monthKey);
  if (startW == null) return 0;

  const tolDown = Math.max(0.05, startW * 0.0005);
  const tolUp   = 0.25;

  const addDaysISO = (iso, n) => {
    const d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  let downDays = 0;
  let upDays = 0;

  // HIER IST DIE LOGIK, DIE WIR TESTEN (Loop bis < days)
  for (let i = 1; i < days; i++) {
    const today = addDaysISO(startISO, i);
    const yesterday = addDaysISO(startISO, i - 1);

    const wt = weightAtOrBefore(entries, today);
    const wy = weightAtOrBefore(entries, yesterday);
    if (wt == null || wy == null) continue;

    if (wt <= wy - tolDown) downDays++;
    else if (wt >= wy + tolUp) upDays++;
  }

  const comparisons = days - 1;
  const raw = (downDays - upDays) / comparisons;

  return Math.max(0, Math.min(1, raw));
}

function finalScoreMonth(entries, monthKey) {
  const base = fairScoreMonth(entries, monthKey);
  if (base == null) return null;
  const perf = performanceFactorMonth(entries, monthKey);
  return base * perf;
}

// ==========================================
// 2. SZENARIEN & HELPER
// ==========================================

// Hilfsfunktion zum Generieren von Entries
function generateEntries(startWeight, changesArray, startDateISO = "2026-01-01") {
  let currentW = startWeight;
  const entries = [{ date: startDateISO, weight: currentW }];
  
  const d = new Date(startDateISO);
  
  changesArray.forEach((change) => {
    d.setDate(d.getDate() + 1);
    currentW += change;
    entries.push({ date: toISODate(d), weight: parseFloat(currentW.toFixed(2)) });
  });
  
  return entries;
}

// ==========================================
// 3. TEST DURCHFÜHRUNG
// ==========================================

console.log("\n🧪 STARTING LOGIC TEST (Month: 2026-01)\n");
const MONTH_KEY = "2026-01";
const DAYS_IN_MONTH = 31; // Jan

// Szenario A: Der perfekte Abnehmer (jeden Tag -0.05kg)
// -----------------------------------------------------
// 31 Tage lang kleine Abnahmen.
const changesA = new Array(31).fill(-0.05); 
const userA = {
  name: "✅ Mr. Consistent",
  startWeight: 100,
  entries: generateEntries(100, changesA)
};

// Szenario B: Der Crash-Diäter (Schummler)
// -----------------------------------------------------
// 25 Tage Fressen (+0.1kg), dann 6 Tage Hungern (-1.5kg)
// Ergebnis: Fast gleicher Gewichtsverlust wie A, aber ungesund.
const changesB = [
  ...new Array(25).fill(0.1),  // Zunehmen
  ...new Array(6).fill(-1.5)   // Crash
];
const userB = {
  name: "❌ The Crasher",
  startWeight: 100,
  entries: generateEntries(100, changesB)
};

// Szenario C: Der Lückenhafte (Vergisst Wiegen)
// -----------------------------------------------------
// Nimmt gut ab, wiegt sich aber nur alle 5 Tage.
// Wir simulieren das, indem wir Einträge aus User A entfernen.
const entriesC = userA.entries.filter((_, i) => i % 5 === 0 || i === 31);
const userC = {
  name: "📅 Lazy Logger",
  startWeight: 100,
  entries: entriesC
};

// Szenario D: Der Yo-Yo Effekt
// -----------------------------------------------------
// Mal rauf, mal runter. Am Ende gleiches Gewicht.
const changesD = new Array(15).fill(-0.2).concat(new Array(16).fill(0.2));
const userD = {
  name: "🎢 Yo-Yo Mayer",
  startWeight: 100,
  entries: generateEntries(100, changesD)
};


const participants = [userA, userB, userC, userD];

console.table([
    { Label: "Start Date", Value: getMonthRange(MONTH_KEY).startISO },
    { Label: "End Date (Target)", Value: getMonthRange(MONTH_KEY).endISO },
    { Label: "Days in Calculation", Value: daysInMonthRange(MONTH_KEY) }
]);

console.log("\n--- ERGEBNISSE ---\n");

participants.forEach(p => {
  const startW = startWeightMonth(p.entries, MONTH_KEY);
  const endW = endWeightMonth(p.entries, MONTH_KEY);
  const loss = startW - endW;
  
  const fair = fairScoreMonth(p.entries, MONTH_KEY);
  const perf = performanceFactorMonth(p.entries, MONTH_KEY);
  const final = finalScoreMonth(p.entries, MONTH_KEY);

  console.log(`👤 ${p.name}`);
  console.log(`   Start: ${startW} kg -> Ende: ${endW} kg (Diff: ${loss.toFixed(2)} kg)`);
  console.log(`   Fair Score (Menge):    ${fair?.toFixed(2)} %`);
  console.log(`   Perf Factor (Qualität): ${perf?.toFixed(2)}  <-- HIER DRAUF ACHTEN`);
  console.log(`   🏆 FINAL SCORE:         ${final?.toFixed(2)} %\n`);
});

console.log("--- FAZIT ---");
console.log("1. Mr. Consistent sollte ~100% Fair und ~1.0 Perf haben.");
console.log("2. The Crasher hat vielleicht guten Fair Score, aber niedrigen Perf Factor.");
console.log("3. Lazy Logger wird massiv bestraft durch niedrigen Perf Factor (fehlende Tage).");