import React from "react";
import { Users, TrendingDown } from "lucide-react";

export default function StatsCards({ participantsCount, totalLossKg, myProfile }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-slate-900 p-4 rounded-xl border border-white/10 shadow-sm">
        <div className="text-xs text-slate-500 uppercase font-semibold">Teilnehmer</div>
        <div className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="text-blue-500" size={24} />
          {participantsCount}/3
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-white/10 shadow-sm">
        <div className="text-xs text-slate-500 uppercase font-semibold">Gesamt Abnahme</div>
        <div className="text-2xl font-bold text-green-500 flex items-center gap-2">
          <TrendingDown size={24} />
          {totalLossKg.toFixed(1)} kg
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-white/10 shadow-sm col-span-2 md:col-span-1">
        <div className="text-xs text-slate-500 uppercase font-semibold">Dein Stand</div>
        <div className="text-2xl font-bold text-white">
          {myProfile ? `${myProfile.currentWeight} kg` : "-"}
          {myProfile && myProfile.currentWeight < myProfile.startWeight && (
            <span className="text-green-500 text-sm ml-2">
              (-{(myProfile.startWeight - myProfile.currentWeight).toFixed(1)} kg)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


