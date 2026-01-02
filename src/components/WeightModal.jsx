import React from "react";
import { Calendar, Scale } from "lucide-react";

export default function WeightModal({
  isOpen,
  onClose,
  onSubmit,
  entryDate,
  setEntryDate,
  newWeight,
  setNewWeight,
  activeName
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
        <h3 className="text-lg font-bold text-white mb-4">Gewicht eintragen</h3>

        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            {/* Datum Eingabe */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Datum</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-slate-500" size={18} />
                <input
                  type="date"
                  required
                  max={new Date().toISOString().split("T")[0]} // <--- NEU: Verhindert Zukunft
					value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Gewicht Eingabe (Handy-optimiert) */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Neues Gewicht (kg)</label>
              <div className="relative">
                <Scale className="absolute left-3 top-2.5 text-slate-500" size={18} />
                <input
                  type="text"                  // Erlaubt Komma und Punkt
                  inputMode="decimal"          // Öffnet Zahlen-Tastatur am Handy
                  pattern="[0-9]*[.,]?[0-9]*"  // Validierungshilfe
                  required
                  placeholder="0.0"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-600"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-800 rounded-lg transition"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Speichern
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4 text-xs text-slate-500">
          Aktives Profil: <span className="text-slate-300 font-semibold">{activeName || "-"}</span>
        </div>
      </div>
    </div>
  );
}