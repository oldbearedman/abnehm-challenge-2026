import React, { useMemo } from "react";
import { Trophy, Clock, AlertCircle } from "lucide-react";
import { getDaysDifference, getTimeAgoString } from "../utils/date";
import TrendBox from "./TrendBox";

export default function LeaderboardTable({ leaderboard, activeId, scrollable = false, monthKey }) {
  const myProfile = useMemo(() => {
    return leaderboard?.find((p) => p.id === activeId) || null;
  }, [leaderboard, activeId]);

  return (
    <div className={`bg-slate-900 rounded-xl border border-white/10 shadow-sm overflow-hidden ${scrollable ? "h-full" : ""} flex flex-col`}>
      <div className="p-4 border-b border-white/10 shrink-0">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Trophy size={18} className="text-amber-500" /> Details
        </h2>
      </div>

      <div className={scrollable ? "flex-1 min-h-0 overflow-auto" : "overflow-x-auto"}>
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-500 text-xs uppercase font-semibold sticky top-0">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Monat-Start</th>
              <th className="px-4 py-3">Monat-Ende</th>
              <th className="px-4 py-3 text-right">Fair-Score</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {(leaderboard || []).map((p, idx) => {
              const daysAgo = getDaysDifference(p.lastUpdateDate);
              const isStale = daysAgo > 7;

              return (
                <tr key={p.id} className={`hover:bg-slate-800/50 transition-colors ${p.id === activeId ? "bg-blue-900/30" : ""}`}>
                  <td className="px-4 py-4 font-medium text-slate-500">{idx + 1}.</td>

                  <td className="px-4 py-4 font-bold text-slate-200">
                    {p.name}
                    {p.id === activeId && (
                      <span className="ml-2 text-xs font-normal text-blue-400 bg-blue-900/30 border border-blue-800 px-2 py-0.5 rounded-full">
                        Du
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-slate-500">{p.monthStartWeight ?? "—"} kg</td>

                  <td className="px-4 py-4">
                    <div className="text-white font-medium">{p.monthEndWeight ?? "—"} kg</div>
                    <div className={`text-xs flex items-center gap-1 mt-0.5 ${isStale ? "text-red-400 font-semibold" : "text-slate-500"}`}>
                      {isStale ? <AlertCircle size={10} /> : <Clock size={10} />}
                      {getTimeAgoString(p.lastUpdateDate)}
                    </div>
                  </td>

		<td className="px-4 py-4 text-right">
			<span className="text-xs bg-green-900/30 border border-green-900/40 px-2 py-1 rounded font-bold text-green-300">
    {/* Prüfen ob null ODER NaN */}
    {(p.fairScore == null || isNaN(p.fairScore)) ? "—" : `${Math.round(p.fairScore)}%`}
		</span>
			</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="shrink-0 p-3 border-t border-white/10 bg-slate-950/20">
        <TrendBox 
          entries={myProfile?.entries || []} 
          monthKey={monthKey} 
        />
      </div>
    </div>
  );
}