"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconCheck, 
  IconAlertTriangle, 
  IconActivity, 
  IconCalendar, 
  IconPlus, 
  IconHeart, 
  IconReportMedical,
  IconScale
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraModal } from "@/components/ahnara/AhnaraModal";

export default function LadyDashboard() {
  const [ladyData, setLadyData] = useState<any>(null);
  
  // Menstrual Log State
  const [flowType, setFlowType] = useState<string>("medium");
  const [hasClots, setHasClots] = useState<boolean>(false);
  const [cycleHistory, setCycleHistory] = useState([
    { start: "Jun 02", end: "Jun 06", duration: 5, length: 28 },
    { start: "May 05", end: "May 09", duration: 5, length: 27 },
    { start: "Apr 07", end: "Apr 12", duration: 6, length: 29 }
  ]);

  // Hormonal wellness state
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, boolean>>({
    cramps: true,
    bloating: true,
    fatigue: false,
    breakouts: false
  });
  const [stressLevel, setStressLevel] = useState<number>(4);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  useEffect(() => {
    const dataStr = localStorage.getItem("lady_profile_data");
    if (dataStr) {
      setLadyData(JSON.parse(dataStr));
    }
  }, []);

  const handleToggleSymptom = (key: string) => {
    setSelectedSymptoms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogModalOpen(false);

    // Save check-in
    const logs = JSON.parse(localStorage.getItem("lady_daily_logs") || "[]");
    logs.push({
      date: new Date().toLocaleDateString(),
      flow: flowType,
      clots: hasClots,
      symptoms: selectedSymptoms,
      stress: stressLevel,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("lady_daily_logs", JSON.stringify(logs));
  };

  if (!ladyData) return null;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Left Columns: active states and tracker (9 cols) */}
      <main className="lg:col-span-9 flex flex-col gap-3">
        
        {/* Active Phase Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-200 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-rose-950"
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">Current Phase</span>
            <h2 className="text-2xl font-black tracking-tight text-display mt-0.5">
              Luteal Phase — Day {ladyData.dayInCycle} of 28
            </h2>
            <p className="text-xs font-semibold mt-1 text-rose-800 leading-normal">
              Next period predicted in 6 days. Progesterone is peaking, which may influence energy levels and rest needs.
            </p>
          </div>
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 whitespace-nowrap self-start md:self-auto border-none"
          >
            <IconPlus className="w-4.5 h-4.5" />
            Log Flow &amp; Symptoms
          </button>
        </motion.div>

        {/* Dashboard subgrid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Calendar predictor card */}
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Cycle Predictor</span>
              <IconCalendar className="w-5 h-5 text-rose-500" />
            </div>
            
            <div className="text-center py-4 bg-rose-50/40 rounded-2xl border border-rose-100/50">
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-wide">Next Menstruation</span>
              <p className="text-3xl font-black text-rose-700 text-display mt-1">July 15</p>
              <span className="text-[10px] text-slate-400 font-bold block mt-1.5">Cycle variation: +/- 1 day</span>
            </div>
          </AhnaraCard>

          {/* Blood loss estimates card */}
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Estimated Blood Loss</span>
              <IconScale className="w-5 h-5 text-rose-500" />
            </div>

            <div className="text-left flex flex-col gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-800 text-display">35</span>
                <span className="text-xs font-bold text-slate-400">ml (Normal)</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                Monthly cumulative loss below 80ml is clinically safe. No excessive bleeding markers detected.
              </p>
            </div>
          </AhnaraCard>

          {/* Contraceptive tracker card */}
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Contraceptive Compliance</span>
              <IconCheck className="w-5 h-5 text-rose-500" />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Oral Pill Status</span>
                <p className="text-xs font-black text-slate-800 mt-0.5">Taken Today (08:00 AM)</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </AhnaraCard>

        </div>

        {/* Cycle History Logs Table */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Menstrual Cycle History</h3>
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs font-semibold text-slate-600 text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black text-[9px] uppercase tracking-wider">
                  <th className="p-3.5 pl-5">Cycle Dates</th>
                  <th className="p-3.5">Flow Duration</th>
                  <th className="p-3.5">Total Cycle Length</th>
                  <th className="p-3.5 pr-5">Regularity</th>
                </tr>
              </thead>
              <tbody>
                {cycleHistory.map((h, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 pl-5 font-bold text-slate-800">{h.start} — {h.end}</td>
                    <td className="p-3.5 text-slate-700">{h.duration} days</td>
                    <td className="p-3.5 text-slate-700">{h.length} days</td>
                    <td className="p-3.5 pr-5">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] rounded font-black uppercase">Regular</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AhnaraCard>

      </main>

      {/* Right Column: symptoms and wellness (3 cols) */}
      <aside className="lg:col-span-3 flex flex-col gap-3">
        
        {/* Symptom logs panel */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs text-left">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <div className="flex items-center gap-1.5">
              <IconActivity className="w-5 h-5 text-rose-500" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Active Luteal Symptoms</h4>
            </div>
            <span className="text-[9px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-black uppercase">Phase matches</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { key: "cramps", label: "Pelvic Cramps" },
              { key: "bloating", label: "Abdominal Bloating" },
              { key: "fatigue", label: "Physical Fatigue" },
              { key: "breakouts", label: "Skin Breakouts" }
            ].map((sym) => (
              <button
                key={sym.key}
                onClick={() => handleToggleSymptom(sym.key)}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  selectedSymptoms[sym.key] 
                    ? "bg-rose-50/50 border-rose-200 text-rose-900" 
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100/50 text-slate-600"
                }`}
              >
                <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all ${
                  selectedSymptoms[sym.key] ? "bg-rose-500 text-white" : "border border-slate-350 bg-white"
                }`}>
                  {selectedSymptoms[sym.key] && <IconCheck className="w-3 h-3" />}
                </div>
                <span className="text-xs font-bold leading-none">{sym.label}</span>
              </button>
            ))}
          </div>
        </AhnaraCard>

        {/* Stress & Cortisol analyzer */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs text-left">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cortisol / Stress Log</span>
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-500">Self-Reported Stress:</span>
              <span className="text-sm font-black text-rose-600">{stressLevel}/10</span>
            </div>
            
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          <div className="p-3 bg-rose-50/40 border border-rose-100 rounded-xl text-[10px] text-rose-800 font-bold leading-normal">
            Stress increases cortisol, which can suppress LH surges or shorten luteal phases. Keep track to monitor irregularities.
          </div>
        </AhnaraCard>

      </aside>

      {/* LOG FLOW & SYMPTOMS MODAL */}
      <AhnaraModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Cycle Parameters"
      >
        <form onSubmit={handleSaveLog} className="flex flex-col gap-4 p-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Flow Strength</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: "spotting", label: "Spotting" },
                { value: "light", label: "Light" },
                { value: "medium", label: "Medium" },
                { value: "heavy", label: "Heavy" }
              ].map((flow) => (
                <button
                  key={flow.value}
                  type="button"
                  onClick={() => setFlowType(flow.value)}
                  className={`py-3 px-1 rounded-xl border text-xs font-bold transition-all text-center ${
                    flowType === flow.value
                      ? "bg-rose-50 border-rose-300 text-rose-700 ring-1 ring-rose-500"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {flow.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHasClots(prev => !prev)}
            className={`w-full py-3.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
              hasClots
                ? "bg-rose-50 border-rose-250 text-rose-700"
                : "bg-slate-50 border-slate-200 text-slate-500"
            }`}
          >
            <span>Presence of large blood clots (&gt;2.5cm)</span>
            <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
              hasClots ? "bg-rose-500 text-white" : "border border-slate-350 bg-white"
            }`}>
              {hasClots && <IconCheck className="w-3.5 h-3.5" />}
            </div>
          </button>

          <div className="flex items-center gap-2 mt-2">
            <AhnaraButton
              variant="outline"
              type="button"
              onClick={() => setIsLogModalOpen(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </AhnaraButton>
            <AhnaraButton
              variant="primary"
              type="submit"
              className="flex-1 bg-rose-500 hover:bg-rose-600 border-none text-white rounded-xl"
            >
              Save Parameters
            </AhnaraButton>
          </div>
        </form>
      </AhnaraModal>

    </div>
  );
}
