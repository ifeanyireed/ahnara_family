"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  IconFlame, 
  IconCheck, 
  IconActivity, 
  IconTrendingUp,
  IconAlertTriangle,
  IconPlus,
  IconScale
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function LadyHotFlushPage() {
  const [flushesToday, setFlushesToday] = useState<number>(2);
  const [jointStiffness, setJointStiffness] = useState<number>(3);
  const [hasEstrogenPatch, setHasEstrogenPatch] = useState<boolean>(true);
  const [hasProgesteronePill, setHasProgesteronePill] = useState<boolean>(false);
  const [hasTestosteroneGel, setHasTestosteroneGel] = useState<boolean>(false);
  const [logSuccess, setLogSuccess] = useState<boolean>(false);

  const handleAddFlush = () => {
    setFlushesToday(prev => prev + 1);
  };

  const handleSaveLogs = (e: React.FormEvent) => {
    e.preventDefault();
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 3000);

    const logs = JSON.parse(localStorage.getItem("lady_hot_flush_logs") || "[]");
    logs.push({
      date: new Date().toLocaleDateString(),
      flushes: flushesToday,
      stiffness: jointStiffness,
      patch: hasEstrogenPatch,
      pill: hasProgesteronePill,
      gel: hasTestosteroneGel,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("lady_hot_flush_logs", JSON.stringify(logs));
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Rapid Hot Flush & HRT logs (6 cols) */}
      <main className="lg:col-span-6 flex flex-col gap-3">
        
        {/* Hot Flush Counter Card */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconFlame className="w-6 h-6 text-rose-500" />
              <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Hot Flush Tracker</h3>
            </div>
            <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-black uppercase">Rapid Counter</span>
          </div>

          <div className="text-center py-6 bg-rose-50/20 border border-rose-100 rounded-2xl my-1 flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Events Today</span>
            <p className="text-5xl font-black text-rose-700 text-display my-1">{flushesToday}</p>
            
            <button
              onClick={handleAddFlush}
              className="mt-3 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1 border-none"
            >
              <IconPlus className="w-4 h-4" />
              Log Hot Flush Event
            </button>
          </div>
        </AhnaraCard>

        {/* HRT compliance dose list */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">HRT Compliance Checklist</h3>

          <div className="flex flex-col gap-2.5">
            {[
              { state: hasEstrogenPatch, setter: setHasEstrogenPatch, label: "Estrogen Patch Compliance (Twice Weekly)" },
              { state: hasProgesteronePill, setter: setHasProgesteronePill, label: "Progesterone Pill (Oral Daily)" },
              { state: hasTestosteroneGel, setter: setHasTestosteroneGel, label: "Testosterone Gel (Transdermal Daily)" }
            ].map((hrt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => hrt.setter(!hrt.state)}
                className={`p-3.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all ${
                  hrt.state 
                    ? "bg-rose-50 border-rose-200 text-rose-800" 
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100/50 text-slate-500"
                }`}
              >
                <span>{hrt.label}</span>
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                  hrt.state ? "bg-rose-500 text-white" : "border border-slate-350 bg-white"
                }`}>
                  {hrt.state && <IconCheck className="w-3.5 h-3.5" />}
                </div>
              </button>
            ))}
          </div>
        </AhnaraCard>

      </main>

      {/* Joint stiffness & Cycle shift alerts (6 cols) */}
      <aside className="lg:col-span-6 flex flex-col gap-3">
        
        {/* Joint stiffness selector */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Joint Pain / Arthralgia Log</h3>

          <form onSubmit={handleSaveLogs} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 bg-slate-50 border border-slate-150 p-4 rounded-2xl">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black text-slate-400 uppercase">Morning Stiffness</span>
                <span className="text-sm font-black text-rose-600 uppercase">Level {jointStiffness}/10</span>
              </div>
              
              <input
                type="range"
                min="1"
                max="10"
                value={jointStiffness}
                onChange={(e) => setJointStiffness(Number(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            <AhnaraButton
              variant="primary"
              type="submit"
              className="bg-rose-500 hover:bg-rose-600 text-white font-black py-4 border-none rounded-xl w-full"
            >
              Save Wellness Parameters
            </AhnaraButton>
          </form>

          {logSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[10px] font-bold mt-1">
              ✓ Logged! Joint stiffness level {jointStiffness} and HRT status saved.
            </div>
          )}
        </AhnaraCard>

        {/* Cycle Length Variance Alert Card */}
        <AhnaraCard variant="flat" className="bg-red-50 border border-red-200 p-5 flex items-start gap-3 text-red-950">
          <IconAlertTriangle className="w-6 h-6 text-red-650 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wide text-red-700">Cycle Length Shift Detected</h4>
            <p className="text-xs font-semibold mt-1 leading-normal text-red-800">
              Your cycle length varied by 8 days compared to your historical average. A shift of &gt;7 days indicates the onset of perimenopause.
            </p>
          </div>
        </AhnaraCard>

      </aside>

    </div>
  );
}
