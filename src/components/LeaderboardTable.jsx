import React from "react";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function LeaderboardTable({ leaderboard, activeId, compact = false }) {
  
  return (
    <div className="w-full text-left border-collapse">
      {/* Tabellen-Header */}
      <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2 whitespace-nowrap">
        <div className="col-span-1 text-center">#</div>
        {/* Name etwas schmaler (3), dafür Ende breiter (3) */}
        <div className="col-span-3">Name</div>
        <div className="col-span-3 text-right hidden sm:block">Monat-Start</div>
        <div className="col-span-3 text-right">Monat-Ende</div>
        <div className="col-span-2 text-right">Fair-Score</div>
      </div>

      <div className="space-y-1">
        {leaderboard.map((player, index) => {
          const isMe = player.id === activeId;
          const score = player.fairScore || 0;
          
          let scoreClass = "bg-slate-800 text-slate-400";
          if (score > 0) scoreClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
          if (score < 0) scoreClass = "bg-rose-500/10 text-rose-400 border border-rose-500/20";

          const lastDate = player.lastUpdateDate 
            ? new Date(player.lastUpdateDate).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })
            : "-";
            
          const isToday = player.lastUpdateDate === new Date().toISOString().split("T")[0];

          return (
            <div
              key={player.id}
              className={`grid grid-cols-12 gap-2 items-center p-3 rounded-lg border transition-all ${
                isMe
                  ? "bg-blue-500/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                  : "bg-slate-800/30 border-white/5 hover:bg-slate-800/50"
              }`}
            >
              {/* PLATZIERUNG */}
              <div className="col-span-1 text-center font-bold text-slate-400">
                {index + 1}.
              </div>

              {/* NAME */}
              <div className="col-span-3 flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-bold truncate ${isMe ? "text-white" : "text-slate-200"}`}>
                    {player.name}
                  </span>
                  {isMe && (
                    <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-bold hidden xl:inline-block">
                      Du
                    </span>
                  )}
                </div>
              </div>

              {/* STARTGEWICHT */}
              <div className="col-span-3 text-right hidden sm:block">
                <div className="text-slate-400 text-sm font-medium">
                  {player.monthStartWeight ? player.monthStartWeight.toFixed(2) : "-"} <span className="text-xs text-slate-600">kg</span>
                </div>
              </div>

              {/* ENDGEWICHT (Jetzt breiter: col-span-3) */}
              <div className="col-span-3 text-right">
                <div className="text-white font-bold text-sm">
                  {player.monthEndWeight ? player.monthEndWeight.toFixed(2) : "-"} <span className="text-xs text-slate-500">kg</span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                  {isToday && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                  {isToday ? "Heute" : lastDate}
                </div>
              </div>

              {/* SCORE */}
              <div className="col-span-2 flex justify-end">
                <div className={`px-2 py-1 rounded-md text-xs font-bold tabular-nums min-w-[50px] text-center ${scoreClass}`}>
                  {score.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}