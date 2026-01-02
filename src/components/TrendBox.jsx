import React, { useMemo } from "react";
import {
  startWeightMonth,
  endWeightMonth,
  finalScoreMonth,
} from "../utils/monthChallenge.js";

export default function TrendBox(props) {
  const entries = props.entries || [];
  const monthKey = props.monthKey || props.month || props.activeMonthKey || props.selectedMonthKey;

  const data = useMemo(() => {
    if (!monthKey) return { trend: null, score: null };

    const sw = startWeightMonth(entries, monthKey);
    const ew = endWeightMonth(entries, monthKey);
    const trend = (sw == null || ew == null) ? null : +(sw - ew).toFixed(2);

    const score = finalScoreMonth(entries, monthKey); // % oder null
    return { trend, score };
  }, [entries, monthKey]);

  const trendText = data.trend == null ? "—" : `${data.trend.toFixed(2)} kg`;
  const scoreText = (data.score == null || isNaN(data.score)) ? "—" : `${data.score.toFixed(2)} %`;

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2">
        <div className="text-xs text-slate-400">Trend (Monat)</div>
        <div className="text-lg font-extrabold text-slate-100">{trendText}</div>
        <div className="text-[11px] text-slate-500">Start (01.) → Ende (01. Folgemonat inkl.)</div>
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2">
        <div className="text-xs text-slate-400">Score</div>
        <div className="text-lg font-extrabold text-amber-300">{scoreText}</div>
        <div className="text-[11px] text-slate-500">FinalScore = FairScore × Perf</div>
      </div>
    </div>
  );
}


