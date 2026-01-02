import React from "react";
import { TrendingUp, TrendingDown, Minus, Target, Activity } from "lucide-react";

export default function TrendBox({ currentUser }) {
  if (!currentUser) {
    return (
      <div className="h-full bg-slate-900/50 rounded-xl border border-white/5 animate-pulse" />
    );
  }

  const start = currentUser.monthStartWeight || 0;
  const current = currentUser.monthEndWeight || currentUser.currentWeight || start;
  const diff = start - current;
  
  const finalScore = currentUser.fairScore || 0;
  const rawFair = currentUser.rawFairScore || 0;
  const perf = currentUser.perfScore || 0;

  // Trend Farbe & Icon
  let trendColor = "text-slate-400";
  let TrendIcon = Minus;
  if (diff > 0.05) { 
    trendColor = "text-emerald-400"; 
    TrendIcon = TrendingDown;
  } else if (diff < -0.05) { 
    trendColor = "text-rose-400"; 
    TrendIcon = TrendingUp;
  }

  // Perf Farbe
  let perfColor = "text-rose-400"; // Schlecht
  if (perf >= 0.5) perfColor = "text-yellow-400"; // Mittel
  if (perf >= 0.8) perfColor = "text-emerald-400"; // Gut

  // WICHTIG: Grid 2x2
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
      
      {/* 1. OBEN LINKS: Trend (Gewicht) */}
      <div className="bg-slate-900 rounded-xl border border-white/10 p-3 flex flex-col justify-center relative shadow-sm">
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
          Trend
        </div>
        <div className={`text-xl font-black flex items-center gap-1 ${trendColor}`}>
          <TrendIcon size={20} strokeWidth={3} />
          {Math.abs(diff).toFixed(1)}
        </div>
        <div className="text-[9px] text-slate-500 truncate">
           Start: {start.toFixed(1)}
        </div>
      </div>

      {/* 2. OBEN RECHTS: Final Score (Das Wichtigste) */}
      <div className="bg-slate-900 rounded-xl border border-yellow-500/20 p-3 flex flex-col justify-center relative shadow-sm bg-yellow-500/5">
        <div className="text-yellow-600 text-[10px] font-bold uppercase tracking-wider mb-1">
          Final Score
        </div>
        <div className="text-xl font-black text-yellow-500">
          {finalScore.toFixed(2)}%
        </div>
        <div className="text-[9px] text-yellow-600/70 truncate">
           Fair × Perf
        </div>
      </div>

      {/* 3. UNTEN LINKS: Raw Fair Score */}
      <div className="bg-slate-900 rounded-xl border border-white/10 p-3 flex flex-col justify-center relative shadow-sm">
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
          <Target size={12} /> Ziel-Score
        </div>
        <div className="text-lg font-bold text-blue-400">
          {rawFair.toFixed(0)}%
        </div>
        <div className="text-[9px] text-slate-500 truncate">
           (Ist / Soll)
        </div>
      </div>

      {/* 4. UNTEN RECHTS: Perf Faktor */}
      <div className="bg-slate-900 rounded-xl border border-white/10 p-3 flex flex-col justify-center relative shadow-sm">
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
          <Activity size={12} /> Disziplin
        </div>
        <div className={`text-lg font-bold ${perfColor}`}>
          {perf.toFixed(2)}
        </div>
        <div className="text-[9px] text-slate-500 truncate">
           Faktor (0-1)
        </div>
      </div>

    </div>
  );
}