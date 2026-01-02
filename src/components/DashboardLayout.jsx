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

  return (
    // WICHTIG:
    // Mobile: h-auto & overflow-y-auto (Erlaubt Scrollen, zieht sich so lang wie nötig)
    // Desktop (lg): h-[calc(...)] & overflow-hidden (Fixiert die Höhe, kein Scrollen)
    <main className="p-3 w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] flex flex-col gap-3 overflow-y-auto lg:overflow-hidden">
      
      {/* OBERER BEREICH */}
      {/* Mobile: min-h-0 fällt weg, Elemente nehmen Platz wie sie brauchen. */}
      {/* Desktop: flex-[4] teilt den Platz prozentual auf. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 shrink-0 lg:flex-[4] lg:min-h-0">
        
        {/* Podium */}
        <div className="lg:col-span-2 h-[400px] lg:h-full">
           <Podium participants={safeLeaderboard} />
        </div>
        
        {/* Details Tabelle */}
        <div className="lg:col-span-1 h-[300px] lg:h-full overflow-hidden">
          <div className="bg-slate-900 rounded-xl border border-white/10 shadow-sm flex flex-col h-full">
            <div className="p-3 border-b border-white/10 shrink-0">
              <h2 className="font-bold text-white flex items-center gap-2 text-sm">
                <Trophy size={16} className="text-yellow-500" /> Details
              </h2>
            </div>
            
            <div className="flex-1 overflow-x-auto p-1">
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

      {/* UNTERER BEREICH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 shrink-0 lg:flex-[6] lg:min-h-0 pb-1">
        
        {/* Chart */}
        <div className="lg:col-span-2 h-[300px] lg:h-full">
          <ProgressChart 
            chartData={chartData} 
            participants={participants} 
            compact={true} 
          />
        </div>

        {/* Trend & Winner (Rechts auf PC, Unten auf Handy) */}
        <div className="lg:col-span-1 flex flex-col gap-3 lg:h-full">
          
          {/* TrendBox */}
          <div className="h-24 shrink-0">
            <TrendBox 
              currentUser={currentUser} 
              participants={safeLeaderboard} 
              monthKey={monthKey}
            />
          </div>

          {/* Hall of Fame */}
          {/* Mobile: Feste Höhe, damit man es sieht. Desktop: Füllt Rest auf. */}
          <div className="h-[200px] lg:h-auto lg:flex-1 lg:min-h-0 overflow-hidden">
            <MonthlyWinners />
          </div>

        </div>
      </div>
    </main>
  );
}