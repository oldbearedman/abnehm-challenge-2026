import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function TrendBox({ currentUser }) {
  // 1. Sicherheits-Check: Falls Daten noch laden
  if (!currentUser) {
    return (
      <div className="h-full flex flex-col gap-4">
        {/* Platzhalter-Boxen während des Ladens */}
        <div className="bg-slate-900/50 rounded-xl border border-white/5 h-full animate-pulse" />
        <div className="bg-slate-900/50 rounded-xl border border-white/5 h-full animate-pulse" />
      </div>
    );
  }

  // 2. Daten berechnen (Exakt wie in der Tabelle)
  // Wir nutzen monthStartWeight und monthEndWeight für Konsistenz
  const start = currentUser.monthStartWeight || 0;
  const current = currentUser.monthEndWeight || currentUser.currentWeight || start;
  
  // Positiv = Abgenommen (Gut), Negativ = Zugenommen
  const diff = start - current;
  
  // Score direkt holen
  const score = currentUser.fairScore || 0;

  // 3. Farben & Icons bestimmen
  let trendColor = "text-slate-400";
  let TrendIcon = Minus;
  
  // Wir nutzen eine kleine Toleranz (0.05), damit bei 0.00 nicht grün/rot angezeigt wird
  if (diff > 0.05) { 
    trendColor = "text-emerald-400"; // Grün (Abgenommen)
    TrendIcon = TrendingDown;
  } else if (diff < -0.05) { 
    trendColor = "text-rose-400"; // Rot (Zugenommen)
    TrendIcon = TrendingUp;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 h-full">
      
      {/* OBERE BOX: Gewichts-Trend */}
      <div className="bg-slate-900 rounded-xl border border-white/10 p-5 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-colors shadow-sm">
        <div className="relative z-10">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
            Trend (Monat)
          </div>
          
          <div className={`text-3xl font-black flex items-center gap-2 mt-2 ${trendColor}`}>
            <TrendIcon size={28} strokeWidth={3} />
            {/* Hier wird jetzt immer eine Zahl stehen, z.B. "3.65" */}
            {Math.abs(diff).toFixed(2)} kg
          </div>
          
          <div className="text-[10px] text-slate-500 mt-2 font-medium">
            Seit 1. Jan ({start.toFixed(1)} kg)
          </div>
        </div>
        
        {/* Glow-Effekt Hintergrund */}
        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-current opacity-5 blur-2xl rounded-full pointer-events-none ${trendColor}`} />
      </div>

      {/* UNTERE BOX: Score */}
      <div className="bg-slate-900 rounded-xl border border-white/10 p-5 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-colors shadow-sm">
        <div className="relative z-10">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            Fair-Score
          </div>
          
          <div className="text-3xl font-black text-yellow-500 mt-2">
            {/* Hier erzwingen wir 2 Nachkommastellen -> "1.74 %" */}
            {score.toFixed(2)} %
          </div>
          
          <div className="text-[10px] text-slate-500 mt-2 font-medium">
             Berechnet aus %-Verlust
          </div>
        </div>
        
        {/* Glow-Effekt Gelb */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-500 opacity-5 blur-2xl rounded-full pointer-events-none" />
      </div>

    </div>
  );
}