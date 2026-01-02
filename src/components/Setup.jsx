import React, { useMemo, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { CHALLENGE_START, PREDEFINED_USERS, PINS, getCollectionPath } from "../lib/constants";
import { Scale, User, Lock, KeyRound, CheckCircle2, TrendingDown } from "lucide-react";

export default function Setup({ participants, onLogin }) {
  const [selectedName, setSelectedName] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [joinWeight, setJoinWeight] = useState("");

  const takenNames = useMemo(() => participants.map((p) => p.name), [participants]);
  const isExisting = selectedName ? takenNames.includes(selectedName) : false;

  const verifyPin = (name, pin) => String(pin || "").trim() === String(PINS[name] || "");

  const handleLoginOrCreate = async (e) => {
    e.preventDefault();
    if (!selectedName) return;

    if (!verifyPin(selectedName, pinInput)) {
      alert("Falscher PIN.");
      return;
    }

    const path = getCollectionPath();
    const docRef = doc(db, ...path, selectedName);

    try {
      if (isExisting) {
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          alert("Profil nicht gefunden. Bitte neu anlegen.");
          return;
        }
        onLogin(selectedName);
        return;
      }

      const startWeightNum = parseFloat(String(joinWeight).replace(",", "."));
      if (!Number.isFinite(startWeightNum)) {
        alert("Bitte gültiges Startgewicht eingeben.");
        return;
      }

      const newProfile = {
        name: selectedName,
        startWeight: startWeightNum,
        currentWeight: startWeightNum,
        joinedAt: new Date().toISOString(),
        entries: [{ date: CHALLENGE_START, weight: startWeightNum }]
      };

      await setDoc(docRef, newProfile, { merge: true });
      onLogin(selectedName);
    } catch (err) {
      console.error(err);
      alert("Fehler beim Login/Speichern.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-white/10">
        <div className="bg-blue-600 p-6 text-center">
          <Scale className="w-12 h-12 text-white mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">Profil auswählen</h1>
          <p className="text-blue-100">Abnehm-Challenge 2026</p>
        </div>

        <div className="p-8">
          {!selectedName ? (
            <div className="space-y-3">
              <p className="text-center text-slate-500 mb-4">Wähle dein Profil:</p>

              {PREDEFINED_USERS.map((name) => {
                const isTaken = takenNames.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => {
                      setSelectedName(name);
                      setPinInput("");
                      setJoinWeight("");
                    }}
                    className="w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all border-slate-700 bg-slate-800 hover:border-blue-500 hover:bg-slate-700 text-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-900/20 text-blue-400">
                        <User size={20} />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-lg">{name}</span>
                        <span className="text-xs text-slate-500">
                          {isTaken ? "vorhanden (PIN nötig)" : "neu anlegen (PIN nötig)"}
                        </span>
                      </div>
                    </div>
                    {isTaken ? <Lock size={18} /> : <KeyRound size={18} />}
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleLoginOrCreate} className="animate-in slide-in-from-right fade-in duration-300">
              <div
                className="mb-6 flex items-center gap-2 text-blue-400 bg-blue-900/20 border border-blue-900/50 p-3 rounded-lg cursor-pointer"
                onClick={() => {
                  setSelectedName("");
                  setPinInput("");
                  setJoinWeight("");
                }}
              >
                <CheckCircle2 size={20} />
                <span className="font-bold">{selectedName}</span>
                <span className="text-xs ml-auto underline">Zurück</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">PIN</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-500" size={20} />
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg text-white placeholder-slate-600"
                      placeholder="z.B. 1234"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {isExisting ? "Login: PIN eingeben" : "Neues Profil: PIN eingeben + Startgewicht"}
                  </div>
                </div>

                {!isExisting && (
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">
                      Startgewicht (für 01.01.2026)
                    </label>
                    <div className="relative">
                      <Scale className="absolute left-3 top-3 text-slate-500" size={20} />
                      <input
                        type="number"
                        step="0.1"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg text-white placeholder-slate-600"
                        placeholder="z.B. 85.5"
                        value={joinWeight}
                        onChange={(e) => setJoinWeight(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  {isExisting ? "Einloggen" : "Profil anlegen"} <TrendingDown size={18} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


