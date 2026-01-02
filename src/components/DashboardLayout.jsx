import React from "react";
import Podium from "./Podium";
import ProgressChart from "./ProgressChart";
import LeaderboardTable from "./LeaderboardTable";

export default function DashboardLayout({
  participants,
  leaderboard,
  activeId,
  activeName,
  chartData,
  monthKey
}) {
  return (
    <main className="w-full max-w-none mx-0 px-4 py-4 h-[calc(100vh-64px)] overflow-hidden">
      <div className="grid grid-cols-12 gap-4 h-full">
        <div className="col-span-12 lg:col-span-7 h-full overflow-hidden">
          <div className="grid grid-rows-2 gap-4 h-full">
            {/* FIX: h-full hinzugefügt, damit Podium die Höhe kennt */}
            <div className="overflow-hidden h-full min-h-0">
              <Podium leaderboard={leaderboard} />
            </div>
            {/* FIX: h-full hinzugefügt, damit Chart die Höhe kennt */}
            <div className="overflow-hidden h-full min-h-0">
              <ProgressChart chartData={chartData} participants={participants} compact />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 h-full overflow-hidden">
          <LeaderboardTable leaderboard={leaderboard} activeId={activeId} scrollable monthKey={monthKey} />
        </div>
      </div>
    </main>
  );
}