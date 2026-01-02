import { getMonthRange, daysInMonthRange, weightAtOrBefore, startWeightMonth } from "../src/utils/monthChallenge.js";

function addDaysISO(iso, n){
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0,10);
}

// exakt wie im Code:
function calcTolDown(entries, monthKey){
  const startW = startWeightMonth(entries, monthKey);
  if (startW == null) return null;
  return Math.max(0.05, startW * 0.0005);
}
const tolUp = 0.25;

function debugPerf(name, entries, monthKey){
  const { startISO, endISO } = getMonthRange(monthKey);
  const days = daysInMonthRange(monthKey);

  const tolDown = calcTolDown(entries, monthKey);
  if (tolDown == null){
    console.log("tolDown konnte nicht berechnet werden (startWeightMonth null).");
    return;
  }

  let down=0, up=0, neutral=0, skipped=0;

  for(let i=1;i<days;i++){
    const today = addDaysISO(startISO, i);
    const yest  = addDaysISO(startISO, i-1);

    const wt = weightAtOrBefore(entries, today);
    const wy = weightAtOrBefore(entries, yest);
    if(wt==null || wy==null){ skipped++; continue; }

    if(wt <= wy - tolDown) down++;
    else if(wt >= wy + tolUp) up++;
    else neutral++;
  }

  const comparisons = days - 1;
  const raw = (down - up) / comparisons;
  const perf = Math.max(0, Math.min(1, raw));

  console.log("\n=======================================");
  console.log(`${name} | ${monthKey}`);
  console.log(`Range: ${startISO} -> ${endISO} | days=${days} comparisons=${comparisons}`);
  console.log(`tolDown=${tolDown.toFixed(3)} | tolUp=${tolUp.toFixed(2)}`);
  console.log(`DownDays: ${down} | UpDays: ${up} | NeutralDays: ${neutral} | Skipped: ${skipped}`);
  console.log(`raw=(down-up)/comparisons = ${raw.toFixed(4)}`);
  console.log(`PerfFactor (clamped 0..1) = ${perf.toFixed(4)}`);
}

// Testdaten wie bisher:
const brandonJan = [
  { date:"2026-01-01", weight:158 },
  { date:"2026-01-10", weight:156 },
  { date:"2026-01-15", weight:155.4 },
  { date:"2026-01-20", weight:154.9 },
  { date:"2026-01-25", weight:154.2 },
  { date:"2026-01-28", weight:153.6 },
  { date:"2026-01-31", weight:153.1 },
  { date:"2026-02-01", weight:152.8 },
];

debugPerf("Brandon", brandonJan, "2026-01");
