import React from "react";
import { Trophy, Plus, LogOut, Users } from "lucide-react";

export default function Header({ 
  monthKey, 
  onPrevMonth, 
  onNextMonth, 
  activeName, 
  onOpenWeigh, 
  onLogout, 
  totalLossKg = 0, 
  totalWeight = 0, 
  myProfile 
}) {

  return (
    <header className="bg-slate-900 shadow-sm border-b border-white/10 sticky top-0 z-10">
      <div className="w-full max-w-none mx-0 px-4 py-3 flex justify-between items-center gap-3">
        
        {/* Links: Logo & Name */}
        <div className="flex items-center gap-2 min-w-[140px]">
          <Trophy className="text-amber-500" />
          <div className="flex flex-col leading-tight">
            <h1 className="text-lg font-bold text-white hidden sm:block">Challenge 2026</h1>
            <h1 className="text-lg font-bold text-white sm:hidden">2026</h1>
            <span className="text-[11px] text-slate-500">
              Hi, <span className="text-slate-200 font-semibold">{activeName}</span>
            </span>
          </div>
        </div>

        {/* Mitte: NUR Team Stats (Gesamtgewicht + Gesamtabnahme) */}
        <div className="flex items-center justify-center flex-1">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-slate-950/50 shadow-inner">
            <Users size={18} className="text-indigo-400" />
            
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 leading-none">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Team</span>
              
              <div className="flex items-center gap-2">
                {/* 1. Aktuelles Gesamtgewicht */}
                <span className="text-lg font-bold text-white tracking-tight">
                  {Number(totalWeight).toFixed(1)} kg
                </span>
                
                {/* 2. Gesamtabnahme (Immer anzeigen) */}
                <span className={`text-sm font-semibold px-1.5 py-0.5 rounded border ${
                  totalLossKg > 0 
                    ? "text-green-400 bg-green-900/20 border-green-900/30" // Grün wenn Abnahme da ist
                    : "text-slate-500 bg-slate-800/50 border-slate-700"    // Grau bei 0.0
                }`}>
                  {totalLossKg > 0 ? "-" : ""}{Number(totalLossKg).toFixed(1)} kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rechts: Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWeigh}
            className="bg-blue-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center gap-2 text-xs font-semibold"
          >
            <Plus size={14} /> <span className="hidden sm:inline">Wiegen</span>
          </button>

          <button
            onClick={onLogout}
            className="bg-slate-800 text-slate-200 px-3 py-2 rounded-full border border-slate-700 hover:bg-slate-700 transition flex items-center gap-2 text-xs font-semibold"
            title="Logout"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}