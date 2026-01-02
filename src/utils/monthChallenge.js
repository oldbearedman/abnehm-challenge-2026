const pad2 = (n) => String(n).padStart(2, "0");

export function toISODate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// monthKey: "2026-01"
export function monthKeyFromDate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

export function dateFromMonthKey(key) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1);
}

// Start = 01.MM.YYYY
// End = 01.(MM+1).YYYY  (INKLUSIVE! -> "01.02" gehört noch zu Januar)
export function getMonthRange(monthKey) {
  const start = dateFromMonthKey(monthKey);
  const endExclusive = new Date(start.getFullYear(), start.getMonth() + 1, 1);
  const endInclusive = new Date(endExclusive.getFullYear(), endExclusive.getMonth(), endExclusive.getDate()); // same day object (we use ISO string)
  return {
    startISO: toISODate(start),
    endISO: toISODate(endExclusive), // important: we use this as INCLUSIVE boundary by comparing <=
  };
}

// Tage im Monat = Differenz (Start->EndExclusive)
export function daysInMonthRange(monthKey) {
  const start = dateFromMonthKey(monthKey);
  const endExclusive = new Date(start.getFullYear(), start.getMonth() + 1, 1);
  const ms = endExclusive - start;
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// Entries sortieren
export function sortEntries(entries = []) {
  return [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Gewicht am Datum ODER zuletzt davor (<= dateISO)
export function weightAtOrBefore(entries, dateISO) {
  const sorted = sortEntries(entries);
  let last = null;
  for (const e of sorted) {
    if (e?.date && e?.weight != null && e.date <= dateISO) last = e;
  }
  return last ? last.weight : null;
}

// Entries im Monatsfenster: startISO <= date <= endISO (endISO = 01 nächster Monat, zählt noch rein!)
export function entriesInMonth(entries, monthKey) {
  const { startISO, endISO } = getMonthRange(monthKey);
  return sortEntries(entries).filter((e) => e.date >= startISO && e.date <= endISO);
}

// Trend kg: aus den letzten N Einträgen innerhalb des Monatsfensters bis max endISO
export function trendKgMonth(entries, monthKey) {
  const sw = startWeightMonth(entries, monthKey);
  const ew = endWeightMonth(entries, monthKey);
  if (sw == null || ew == null) return null;
  return sw - ew;
}

// Startgewicht für den Monat:
// = Gewicht am Startdatum (01.MM) ODER zuletzt davor.
// (Damit wird Februar automatisch mit dem 01.02 Wert gestartet, wenn er existiert.)
export function startWeightMonth(entries, monthKey) {
  const { startISO } = getMonthRange(monthKey);
  return weightAtOrBefore(entries, startISO);
}

// Endgewicht für den Monat:
// = Gewicht am Enddatum (01.(MM+1)) ODER zuletzt davor.
export function endWeightMonth(entries, monthKey) {
  const { endISO } = getMonthRange(monthKey);
  return weightAtOrBefore(entries, endISO);
}

// Fair-Score für den Monat:
// expected = startWeightMonth * 0.01 * (daysInMonth/7)
export function fairScoreMonth(entries, monthKey) {
  const sw = startWeightMonth(entries, monthKey);
  const ew = endWeightMonth(entries, monthKey);
  if (sw == null || ew == null) return null;

  const delta = sw - ew;

  // Toleranz: +/- 0,2 kg = neutral
  if (Math.abs(delta) < 0.2) return 0;

  const days = daysInMonthRange(monthKey);
  if (!days) return null;

  // Erwartung: 1 % pro Woche
  const expected = sw * 0.01 * (days / 7);
  if (expected <= 0) return null;

  return (delta / expected) * 100;
}


/**
 * Leistungs-Konsistenz-Faktor (0..1)
 * Zählt pro Kalendertag im Monat: wenn Gewicht < Gewicht vom Vortag => "Abnahme-Tag"
 * fehlende Tage zählen NICHT als Abnahme-Tag (da ihr täglich eintragt ist das ok)
 */
export function performanceFactorMonth(entries, monthKey) {
  if (!entries || entries.length === 0) return 0;

  const { startISO } = getMonthRange(monthKey);
  const days = daysInMonthRange(monthKey);
  if (!days || days <= 1) return 0;

  const startW = startWeightMonth(entries, monthKey);
  if (startW == null) return 0;

  // Fair für 60–158 kg:
  // Down-Day: max(0.05 kg, 0.05% vom Startgewicht)
  // Up-Day:   +0.25 kg
  const tolDown = Math.max(0.05, startW * 0.0005);
  const tolUp   = 0.25;

  const addDaysISO = (iso, n) => {
    const d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  let downDays = 0;
  let upDays = 0;

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
} /**
 * FinalScore (%) = FairScore (%) * Leistungsfaktor (0..1)
 * -> belohnt konstantes Abnehmen über den Monat, verhindert "Endspurt-only"
 */
export function finalScoreMonth(entries, monthKey) {
  const base = fairScoreMonth(entries, monthKey);
  if (base == null) return null;
  const perf = performanceFactorMonth(entries, monthKey);
  return base * perf;
}
