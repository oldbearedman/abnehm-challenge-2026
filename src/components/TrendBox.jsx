import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function TrendBox({ currentUser }) {
  if (!currentUser) {
    return (
      <div className="h-full flex gap-3">
        <div className="flex-1 bg-slate-900/50 rounded-xl border border-white/5 animate-pulse" />
        <div className="flex-1 bg-slate-900/50 rounded-xl border border-white/5 animate-pulse" />
      </div>
    );
  }

  const start = currentUser.monthStartWeight || 0;
  const current = currentUser.monthEndWeight || currentUser.currentWeight || start;
  const diff = start - current;
  const score = currentUser.fairScore || 0;

  let trendColor = "text-slate-400";
  let TrendIcon = Minus;
  
  if (diff > 0.05) { 
    trendColor = "text-emerald-400"; 
    TrendIcon = TrendingDown;
  } else if (diff < -0.05) { 
    trendColor = "text-rose-400"; 
    TrendIcon = TrendingUp;
  }

  // WICHTIG: grid-cols-2 sorgt für NEBENEINANDER
  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      
      {/* LINKE BOX: Gewichts-Trend */}
      <div className="bg-slate-900 rounded-xl border border-white/10 p-3 flex flex-col justify-center relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
            Trend
          </div>
          <div className={`text-2xl font-black flex items-center gap-2 ${trendColor}`}>
            <TrendIcon size={24} strokeWidth={3} />
            {Math.abs(diff).toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 font-medium truncate">
             Start: {start.toFixed(1)} kg
          </div>
        </div>
      </div>

      {/* RECHTE BOX: Score */}
      <div className="bg-slate-900 rounded-xl border border-white/10 p-3 flex flex-col justify-center relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            Score
          </div>
          <div className="text-2xl font-black text-yellow-500">
            {score.toFixed(2)}%
          </div>
          <div className="text-[10px] text-slate-500 font-medium truncate">
             Final Score
          </div>
        </div>
      </div>

    </div>
  );
}