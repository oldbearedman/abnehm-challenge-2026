import React, { useEffect, useMemo, useState } from "react";
import { collection, doc, setDoc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase";

// Components
import Header from "./components/Header";
import ProfileSelect from "./components/ProfileSelect";
import DashboardLayout from "./components/DashboardLayout";
import WeightModal from "./components/WeightModal";

// Utils
import {
  monthKeyFromDate,
  dateFromMonthKey,
  monthKeyFromDate as mk,
  daysInMonthRange,
  getMonthRange,
  sortEntries,
  startWeightMonth,
  endWeightMonth,
  finalScoreMonth,
  toISODate
} from "./utils/monthChallenge";

export default function App() {
  const appId = (typeof __app_id !== "undefined" && __app_id) ? __app_id : "abnehm-challange-default";

  // --- State ---
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Auth Status
  const [activeId, setActiveId] = useState(null);
  
  // Datum / Monat
  const [monthKey, setMonthKey] = useState(monthKeyFromDate(new Date()));

  // Modal State
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [entryDate, setEntryDate] = useState(toISODate(new Date()));
  const [newWeight, setNewWeight] = useState("");

  // --- Authentifizierung ---
  
  function handleLogin(id, name) {
    localStorage.setItem("challenge_active_id", id);
    localStorage.setItem("challenge_active_name", name);
    setActiveId(id);
  }

  function handleLogout() {
    localStorage.setItem("challenge_active_id", "");
    localStorage.setItem("challenge_active_name", "");
    setActiveId(null);
  }

  // Sitzung wiederherstellen
  useEffect(() => {
    const storedId = localStorage.getItem("challenge_active_id");
    if (storedId) {
      setActiveId(storedId);
    }
  }, []);

  // --- Daten laden ---

  function getParticipantsCollectionRef() {
    if (typeof __app_id !== "undefined") {
      return collection(db, "artifacts", appId, "public", "data", "challenge_participants");
    }
    return collection(db, "participants");
  }

  useEffect(() => {
    const unsub = onSnapshot(getParticipantsCollectionRef(), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setParticipants(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // --- Berechnungen ---

  const leaderboard = useMemo(() => {
    const key = monthKey;
    const list = (participants || []).map((p) => {
      const entries = sortEntries(p.entries || []);

      // Startgewicht & Aktuelles Gewicht robust ermitteln (Global)
      const firstEntry = entries[0];
      const globalStartWeight = p.startWeight ?? (firstEntry ? firstEntry.weight : null);
      
      const lastEntry = entries[entries.length - 1];
      const currentWeight = lastEntry ? lastEntry.weight : (p.currentWeight ?? globalStartWeight);

      // Monatswerte
      const msw = startWeightMonth(entries, key);
      const mew = endWeightMonth(entries, key);
      const fair = finalScoreMonth(entries, key);
      const loss = (msw != null && mew != null) ? msw - mew : 0;

      let lastUpdateDate = p.joinedAt;
      if (entries.length) lastUpdateDate = entries[entries.length - 1].date;

      return {
        ...p,
        // Globale Werte für Header
        startWeight: globalStartWeight, 
        currentWeight: currentWeight,
        
        // Monatswerte für Tabelle & Logic
        monthStartWeight: msw,
        monthEndWeight: mew,
        fairScore: fair,
        loss: loss,
        lastUpdateDate
      };
    });

    return list.sort((a, b) => (b.fairScore ?? -999) - (a.fairScore ?? -999));
  }, [participants, monthKey]);

  const chartData = useMemo(() => {
    if (!participants.length) return [];
    
    const dateSet = new Set();
    participants.forEach(p => {
      (p.entries || []).forEach(e => dateSet.add(e.date));
    });

    const sortedDates = Array.from(dateSet).sort((a, b) => new Date(a) - new Date(b));

    return sortedDates.map(d => {
      const point = { date: d };
      participants.forEach(p => {
        const entry = p.entries?.find(e => e.date === d);
        if (entry) point[p.name] = entry.weight;
      });
      return point;
    });
  }, [participants]);

  // Gewinner speichern
  useEffect(() => {
    const run = async () => {
      const key = monthKey;
      const { endISO } = getMonthRange(key);

const allHaveEnd = leaderboard.length > 0 && leaderboard.every((p) => 
  (p.entries || []).some((e) => e.date === endISO)
);

// Wenn noch nicht alle gewogen haben -> abbrechen
if (!allHaveEnd) return;

      const winner = leaderboard.find((p) => p.fairScore != null);
      if (!winner) return;

      const resRef = doc(db, "monthly_results", key);
      const existing = await getDoc(resRef);
      if (existing.exists()) return;

      await setDoc(resRef, {
        monthKey: key,
        winnerName: winner.name,
        winnerId: winner.id,
        winnerScore: winner.fairScore,
        days: daysInMonthRange(key),
        prize: '1 "Ja-zu-allem"-Wochenende'
      });
    };

    if (!loading && leaderboard.length) run().catch(console.error);
  }, [loading, leaderboard, monthKey]);

  // --- Aktionen ---

  const handleSaveWeight = async (e) => {
    e.preventDefault();
    if (!activeId || !newWeight || !entryDate) return;

    const w = parseFloat(newWeight.replace(",", "."));
    if (!isFinite(w) || w <= 0) return;

    const currentUser = participants.find(p => p.id === activeId);
    if (!currentUser) return;

    const oldEntries = currentUser.entries || [];
    const otherEntries = oldEntries.filter(ent => ent.date !== entryDate);
    const updatedEntries = [...otherEntries, { date: entryDate, weight: w }];

    updatedEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

    const ref = doc(getParticipantsCollectionRef(), activeId);
    try {
      await updateDoc(ref, { 
        entries: updatedEntries,
        currentWeight: w
      });
      setIsWeightModalOpen(false);
      setNewWeight("");
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      alert("Fehler beim Speichern");
    }
  };

  const prevMonth = () => {
    const d = dateFromMonthKey(monthKey);
    const p = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    setMonthKey(mk(p));
  };
  
  const nextMonth = () => {
    const d = dateFromMonthKey(monthKey);
    const n = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    setMonthKey(mk(n));
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 text-slate-500 flex items-center justify-center">
      Lade…
    </div>
  );

  if (!activeId) {
    return <ProfileSelect participants={participants} onLogin={handleLogin} />;
  }

const activeName = leaderboard.find((p) => p.id === activeId)?.name || activeId;
  
  // NEU: Wir berechnen BEIDES: Aktuelles Gesamtgewicht & Gesamtabnahme
  const groupStats = leaderboard.reduce(
    (acc, p) => {
      // Nur zählen, wenn User ein aktuelles Gewicht hat
      if (p.currentWeight > 0) {
        acc.totalCurrent += p.currentWeight;
        
        // Abnahme berechnen (Start - Aktuell)
        if (p.startWeight > 0) {
          const diff = p.startWeight - p.currentWeight;
          acc.totalLoss += Math.max(0, diff);
        }
      }
      return acc;
    },
    { totalCurrent: 0, totalLoss: 0 }
  );

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <Header
          activeName={activeName}
          // NEU: Wir übergeben beide Werte einzeln
          totalWeight={groupStats.totalCurrent}
          totalLossKg={groupStats.totalLoss}
          myProfile={leaderboard.find((p) => p.id === activeId) || null}
          onOpenWeigh={() => {
            setEntryDate(toISODate(new Date()));
            setIsWeightModalOpen(true);
          }}
          onLogout={handleLogout}
          monthKey={monthKey}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
        />
        
        <DashboardLayout
          participants={participants}
          leaderboard={leaderboard}
          activeName={activeName}
          activeId={activeId}
          monthKey={monthKey}
          chartData={chartData}
        />
      </div>

      <WeightModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        onSubmit={handleSaveWeight}
        entryDate={entryDate}
        setEntryDate={setEntryDate}
        newWeight={newWeight}
        setNewWeight={setNewWeight}
        activeName={activeName}
      />
    </>
  );
}