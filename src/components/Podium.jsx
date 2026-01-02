import React from "react";
import { Trophy, Medal, Crown } from "lucide-react";

export default function Podium({ participants }) {
  const safeList = participants || [];
  const topThree = safeList.slice(0, 3);

  const filledPodium = [
    topThree[0] || null, 
    topThree[1] || null, 
    topThree[2] || null  
  ];

  // Etwas kompaktere Höhen für "No Scroll" Feeling
  const getHeight = (rank) => {
    if (rank === 0) return "h-36 sm:h-44"; // War 48/56
    if (rank === 1) return "h-28 sm:h-32"; // War 36/40
    return "h-20 sm:h-24";          // War 28/32
  };

  const getStyles = (rank) => {
    if (rank === 0) return {
      container: "bg-gradient-to-b from-yellow-500/20 via-yellow-500/5 to-transparent border-yellow-500/50 border-t-4 shadow-[0_0_30px_rgba(234,179,8,0.2)]",
      text: "text-yellow-400",
    };
    if (rank === 1) return {
      container: "bg-gradient-to-b from-slate-300/20 via-slate-400/5 to-transparent border-slate-400/30 border-t-2 shadow-[0_0_20px_rgba(148,163,184,0.1)]",
      text: "text-slate-300",
    };
    return {
      container: "bg-gradient-to-b from-orange-700/20 via-orange-800/5 to-transparent border-orange-700/40 border-t-2 shadow-[0_0_20px_rgba(194,65,12,0.1)]",
      text: "text-orange-400",
    };
  };

  const displayOrder = [1, 0, 2];

  return (
    <div className="bg-slate-900 rounded-xl border border-white/10 shadow-xl p-4 relative overflow-hidden h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between relative z-10 mb-2 shrink-0">
        <h2 className="font-bold text-white flex items-center gap-2 text-lg">
          <Crown size={20} className="text-yellow-500 fill-yellow-500/20" />
          Leaderboard
        </h2>
      </div>

      {/* Podium Container */}
      <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end content-end mt-2">
        {displayOrder.map((positionIndex) => {
          const player = filledPodium[positionIndex];
          const isWinner = positionIndex === 0;
          const styles = getStyles(positionIndex);
          
          return (
            <div 
              key={positionIndex} 
              className={`relative flex flex-col items-center justify-end ${isWinner ? "order-first sm:order-none z-10" : "z-0"}`}
            >
              {player ? (
                <>
                  {/* Platzierung Zahl */}
                  <div className={`
                    mb-2 font-black text-2xl drop-shadow-lg transition-transform duration-500
                    ${styles.text} ${isWinner ? "scale-125 -translate-y-1" : "opacity-80"}
                  `}>
                    #{positionIndex + 1}
                  </div>

                  {/* Die Säule */}
                  <div className={`
                    w-full rounded-t-2xl border-x backdrop-blur-md relative group
                    flex flex-col items-center justify-start pt-3 pb-2 px-1 text-center transition-all duration-500
                    ${styles.container} ${getHeight(positionIndex)}
                    hover:brightness-125
                  `}>
                    
                    {/* Icon */}
                    <div className="mb-2">
                      {isWinner ? (
                        <Trophy 
                          size={24} 
                          className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-[bounce_3s_infinite]" 
                        />
                      ) : (
                        <Medal size={20} className={`${styles.text} opacity-80`} />
                      )}
                    </div>

                    {/* Name */}
                    <div className="font-bold text-white w-full truncate px-1 text-sm tracking-wide">
                      {player.name}
                    </div>

                    {/* Score */}
                    <div className="mt-auto text-xs font-mono opacity-90 text-slate-300 pb-1">
                      <span className={`font-bold ${styles.text}`}>
                        {player.fairScore != null ? player.fairScore.toFixed(2) : "—"}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                /* Leerer Platzhalter */
                <div className={`w-full ${getHeight(positionIndex)} border-t border-x border-white/5 rounded-t-2xl bg-white/5 opacity-20`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Hintergrund */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
    </div>
  );
}