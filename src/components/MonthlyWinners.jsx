import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Trophy } from "lucide-react";

export default function MonthlyWinners() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const qy = query(collection(db, "monthly_results"), orderBy("monthKey", "desc"));
    const unsub = onSnapshot(qy, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRows(data);
    });
    return () => unsub();
  }, []);

  return (
    <div className="mt-3 bg-slate-900 border border-white/10 rounded-xl p-3">
      <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2">
        <Trophy size={14} className="text-amber-500" />
        Gewinnerliste
      </div>

      {rows.length === 0 ? (
        <div className="text-xs text-slate-500">Noch keine Monate abgeschlossen.</div>
      ) : (
        <div className="space-y-2">
          {rows.slice(0, 6).map((r) => (
            <div key={r.id} className="flex items-center justify-between bg-slate-950/30 border border-white/10 rounded-lg px-2 py-2">
              <div className="text-xs text-slate-300 font-bold">{r.monthKey}</div>
              <div className="text-xs text-slate-200">
                <span className="text-slate-500 mr-1">Sieger:</span>
                <span className="font-bold text-amber-300">{r.winnerName}</span>
              </div>
              <div className="text-xs font-bold text-green-400">{Math.round(r.winnerScore)}%</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 text-[10px] text-slate-500 text-center">
        Gewinn: 1 „Ja-zu-allem“-Wochenende (pro Monat)
      </div>
    </div>
  );
}


