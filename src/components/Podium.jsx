import React, { useEffect, useState } from "react";
import { Trophy, Medal } from "lucide-react";

// Hilfskomponente für einen einzelnen Podest-Platz
const PodiumStep = ({ participant, rank, theme, animate, delay }) => {
  if (!participant) return null;

  // Dynamische Klassen basierend auf dem Rang (Gold/Silber/Bronze Theme)
  const themeClasses = {
    gold: {
      container: "from-amber-500/20 to-amber-500/5 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]",
      text: "text-amber-400",
      height: "h-56", // Am höchsten
      icon: <Trophy className="w-8 h-8 text-amber-400 mb-2 drop-shadow-glow" />,
      rankSize: "text-8xl"
    },
    silver: {
      container: "from-slate-400/20 to-slate-400/5 border-slate-400/50 shadow-[0_0_30px_rgba(148,163,184,0.2)]",
      text: "text-slate-300",
      height: "h-44", // Mittel
      icon: <Medal className="w-6 h-6 text-slate-300 mb-2" />,
      rankSize: "text-7xl"
    },
    bronze: {
      container: "from-orange-700/20 to-orange-700/5 border-orange-700/50 shadow-[0_0_30px_rgba(194,65,12,0.2)]",
      text: "text-orange-400",
      height: "h-36", // Am niedrigsten
      icon: <Medal className="w-6 h-6 text-orange-400 mb-2" />,
      rankSize: "text-7xl"
    },
  };

  const t = themeClasses[theme];

  return (
    <div
      className={`relative flex flex-col justify-end rounded-t-2xl border-t border-x backdrop-blur-sm bg-gradient-to-b ${t.container} ${t.height} transition-all duration-1000 ease-out transform will-change-transform hover:brightness-110`}
      style={{
        // Die Animation: Startet unten und unsichtbar, fährt nach oben
        transform: animate ? "translateY(0)" : "translateY(100%)",
        opacity: animate ? 1 : 0,
        transitionDelay: `${delay}ms`, // Verzögerung für Domino-Effekt
      }}
    >
      {/* Große Rang-Zahl im Hintergrund */}
      <span className={`absolute -top-10 left-1/2 -translate-x-1/2 font-black opacity-10 select-none ${t.rankSize} ${t.text}`}>
        {rank}
      </span>

      <div className="p-4 flex flex-col items-center text-center relative z-10 pb-6">
        {t.icon}
        
        {/* Name */}
        <div className="font-bold text-white text-lg leading-tight truncate w-full">
          {participant.name}
        </div>

        {/* Score */}
        <div className={`text-sm font-medium mt-1 ${t.text}`}>
          Score: {participant.fairScore ? participant.fairScore.toFixed(1) : "—"}
        </div>
          
         {/* Gewichtsverlust Badge */}
         {participant.loss > 0 && (
            <div className="mt-2 text-xs bg-slate-800/80 px-2 py-1 rounded-full text-emerald-400 font-mono">
              -{participant.loss.toFixed(1)} kg
            </div>
          )}
      </div>
    </div>
  );
};


export default function Podium({ leaderboard }) {
  // State, um die Animation nach dem Laden zu triggern
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Kurze Verzögerung nach dem Mounten, damit die CSS-Transition greift
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Wir brauchen mindestens 3 Leute für das volle Podest
  const top3 = leaderboard.slice(0, 3);
  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  // Fallback, wenn noch nicht genug Daten da sind
  if (top3.length < 3) {
    return (
      <div className="bg-slate-900 rounded-xl border border-white/10 p-6 h-full flex flex-col items-center justify-center text-center opacity-70">
        <Trophy className="w-12 h-12 text-slate-600 mb-4" />
        <h3 className="text-slate-300 font-medium">Podest wird aufgebaut</h3>
        <p className="text-slate-500 text-sm mt-2">
          Warte auf mindestens 3 Teilnehmer mit Scores...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 rounded-xl border border-white/10 p-6 h-full flex flex-col">
      <h2 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
        <Trophy className="text-amber-400" size={20} /> Aktuelles Ranking
      </h2>

      {/* Container muss overflow-hidden haben, damit die Podeste 
          beim Start der Animation "unter dem Boden" versteckt sind.
      */}
      <div className="flex-1 grid grid-cols-3 gap-4 items-end overflow-hidden pb-2 -mx-2 px-2">
        {/* Platz 2 (Links) */}
        <div className="col-start-1">
          <PodiumStep 
            participant={second} 
            rank={2} 
            theme="silver" 
            animate={animate} 
            delay={200} // Fährt als zweites hoch
          />
        </div>

        {/* Platz 1 (Mitte, am höchsten) */}
        <div className="col-start-2 -mt-12 z-10"> {/* z-10 damit es leicht überlappt */}
          <PodiumStep 
            participant={first} 
            rank={1} 
            theme="gold" 
            animate={animate} 
            delay={0} // Fährt zuerst hoch
          />
        </div>

        {/* Platz 3 (Rechts) */}
        <div className="col-start-3">
          <PodiumStep 
            participant={third} 
            rank={3} 
            theme="bronze" 
            animate={animate} 
            delay={400} // Fährt als letztes hoch
          />
        </div>
      </div>
    </div>
  );
}