import React, { useState } from "react";
import { User, Scale } from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import { db } from "../lib/firebase";

const PROFILES = [
  { name: "Olivia" },
  { name: "Taylor" },
  { name: "Brandon" },
];

// Hilfsfunktion: Um bei Neuanlage sicherzustellen, wohin gespeichert wird
function getParticipantsCollectionRef() {
  if (typeof __app_id !== "undefined" && __app_id) {
    return collection(db, "artifacts", __app_id, "public", "data", "challenge_participants");
  }
  return collection(db, "participants");
}

export default function ProfileSelect({ participants, onLogin }) {
  const [picked, setPicked] = useState(null);
  const [needsWeight, setNeedsWeight] = useState(false);
  const [weight, setWeight] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const goBack = () => {
    setPicked(null);
    setNeedsWeight(false);
    setWeight("");
    setErr("");
  };

  const loginNow = (id, name) => {
    localStorage.setItem("challenge_active_id", id);
    localStorage.setItem("challenge_active_name", name);
    onLogin(id, name);
  };

  const pickProfile = async (p) => {
    setBusy(true);
    setErr("");
    
    // --- FIX ANFANG ---
    // Wir schauen in die Liste, die App.jsx schon geladen hat.
    // Wir vergleichen die Namen kleingeschrieben, um "Olivia" == "olivia" zu erkennen.
    const existingUser = participants.find(
      (part) => part.name.toLowerCase() === p.name.toLowerCase()
    );

    if (existingUser) {
      // Gefunden! Wir nehmen die ID, die wirklich in der DB steht (egal ob groß/klein)
      loginNow(existingUser.id, existingUser.name);
      return; 
    }
    // --- FIX ENDE ---

    // Falls wirklich nicht gefunden -> Neues Profil anlegen
    setPicked(p);
    setNeedsWeight(true);
    setBusy(false);
  };

  const submitWeight = async (e) => {
    e.preventDefault();
    if (!picked) return;

    const w = parseFloat(String(weight).replace(",", "."));
    if (!isFinite(w) || w <= 0) {
      setErr("Bitte gültiges Gewicht eingeben.");
      return;
    }

    setBusy(true);
    setErr("");

    // Wir nehmen den Namen als ID (z.B. "Olivia")
    const id = picked.name; 
    
    // WICHTIG: Wir nutzen die korrekte Collection Reference
    const colRef = getParticipantsCollectionRef();
    const ref = doc(colRef, id);

    try {
      // Startdatum 01.01.2026 festlegen
      const startDate = "2026-01-01";
      await setDoc(ref, {
        name: picked.name,
        startWeight: w, 
        currentWeight: w,
        entries: [{ date: startDate, weight: w }],
        createdAt: serverTimestamp(),
        joinedAt: new Date().toISOString(),
      });

      loginNow(id, picked.name);
    } catch (e2) {
      console.error(e2);
      setErr("Fehler beim Speichern in Firestore.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 text-center">
          <div className="text-xl font-black text-white">Challenge Login</div>
          <div className="text-sm text-slate-400 mt-1">Profil auswählen</div>
        </div>

        <div className="p-6">
          {!picked && (
            <div className="space-y-3">
              {PROFILES.map((p) => (
                <button
                  key={p.name}
                  onClick={() => pickProfile(p)}
                  disabled={busy}
                  className="w-full flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/30 hover:bg-slate-800/40 transition disabled:opacity-60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <User size={18} className="text-slate-300" />
                    </div>
                    <div className="font-bold text-slate-100 truncate">{p.name}</div>
                  </div>
                  {busy ? <span className="text-xs text-slate-400">…</span> : null}
                </button>
              ))}
              {err && <div className="text-sm text-red-400 font-semibold mt-2">{err}</div>}
            </div>
          )}

          {picked && needsWeight && (
            <form onSubmit={submitWeight} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-bold text-white">Startgewicht ({picked.name})</div>
                <button type="button" onClick={goBack} className="text-xs text-slate-400 underline">
                  Zurück
                </button>
              </div>

              <div className="relative">
                <Scale size={18} className="absolute left-3 top-3 text-slate-500" />
                <input
                  autoFocus
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  value={weight}
                  onChange={(e) => { setWeight(e.target.value); setErr(""); }}
                  placeholder="z.B. 85.0"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>

              {err && <div className="text-sm text-red-400 font-semibold">{err}</div>}

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition"
              >
                {busy ? "Speichere…" : "Starten"}
              </button>

              <div className="text-[10px] text-slate-500 text-center">
                Wird als Startgewicht für den 01.01.2026 gesetzt.
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}