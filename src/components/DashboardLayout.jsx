import React from "react";
import Podium from "./Podium";
import TrendBox from "./TrendBox";
import ProgressChart from "./ProgressChart";
import LeaderboardTable from "./LeaderboardTable";
import MonthlyWinners from "./MonthlyWinners"; 
import { Trophy } from "lucide-react";

export default function DashboardLayout({
  participants,
  leaderboard,
  activeName,
  activeId,
  monthKey,
  chartData
}) {
  const safeLeaderboard = leaderboard || [];
  const currentUser = safeLeaderboard.find(p => p.id === activeId);

  // WICHTIG: 'overflow-hidden' entfernt -> 'overflow-y-auto' erlaubt Rundungen
  // h-[calc(100vh-80px)] sorgt weiterhin für Fullscreen-Feeling
  return (
    <main className="p-4 w-full h-[calc(100vh-80px)] flex flex-col gap-4 overflow-y-auto overflow-x-hidden">
      
      {/* OBERER BEREICH (ca. 45% Höhe) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0 shrink-0">
        
        {/* Podium (2/3) */}
        <div className="lg:col-span-2 h-full">
           <Podium participants={safeLeaderboard} />
        </div>
        
        {/* Details Tabelle (1/3) */}
        <div className="lg:col-span-1 h-full overflow-hidden">
          <div className="bg-slate-900 rounded-xl border border-white/10 shadow-sm flex flex-col h-full">
            <div className="p-3 border-b border-white/10 shrink-0">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" /> Details
              </h2>
            </div>
            
            <div className="flex-1 overflow-x-auto p-2">
              <div className="min-w-[300px]"> 
                <LeaderboardTable 
                  leaderboard={safeLeaderboard} 
                  activeId={activeId} 
                  compact={true} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UNTERER BEREICH (ca. 55% Höhe) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0 shrink-0 pb-1">
        
        {/* Chart (2/3) */}
        <div className="lg:col-span-2 h-full min-h-[200px]">
          <ProgressChart 
            chartData={chartData} 
            participants={participants} 
          />
        </div>

        {/* Trend & Winner (1/3) */}
        <div className="lg:col-span-1 flex flex-col gap-4 h-full">
          
          <div className="flex-1 min-h-0">
            <TrendBox 
              currentUser={currentUser} 
              participants={safeLeaderboard} 
              monthKey={monthKey}
            />
          </div>

          <div className="flex-1 min-h-0">
            <MonthlyWinners />
          </div>

        </div>
      </div>
    </main>
  );
}