"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  IconPill, 
  IconCheck, 
  IconAlertTriangle, 
  IconArrowUpRight, 
  IconDeviceMobile, 
  IconShoppingBag,
  IconClock,
  IconListCheck
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function SeniorsMedication() {
  const [meds, setMeds] = useState([
    { id: 1, name: "Atorvastatin", dosage: "10mg", time: "08:00 AM", taken: true, shape: "oval", color: "Blue", purpose: "Cholesterol" },
    { id: 2, name: "Amlodipine", dosage: "5mg", time: "08:00 AM", taken: true, shape: "round", color: "White", purpose: "Blood Pressure" },
    { id: 3, name: "Metformin", dosage: "500mg", time: "08:00 PM", taken: false, shape: "capsule", color: "Yellow", purpose: "Diabetes" },
    { id: 4, name: "Lisinopril", dosage: "10mg", time: "08:00 PM", taken: false, shape: "round", color: "Pink", purpose: "Blood Pressure" }
  ]);

  const [offlineCode, setOfflineCode] = useState("");
  const [offlineLogSuccess, setOfflineLogSuccess] = useState(false);

  const handleMedToggle = (id: number) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const handleOfflineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offlineCode) return;
    
    // Parse simulated code (e.g., *401*1*3#)
    setOfflineLogSuccess(true);
    setTimeout(() => {
      setOfflineLogSuccess(false);
      setOfflineCode("");
      // Toggle Metformin (id 3) as mock effect
      setMeds(prev => prev.map(m => m.id === 3 ? { ...m, taken: true } : m));
    }, 2000);
  };

  const takenCount = meds.filter(m => m.taken).length;
  const progressPercent = Math.round((takenCount / meds.length) * 100);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Timeline (8 cols) */}
      <main className="lg:col-span-8 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-5 shadow-xs">
          
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Adherence timeline</span>
              <h3 className="font-extrabold text-xl text-slate-800 tracking-tight text-display">Today's Schedule</h3>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-xs font-black text-slate-700">{takenCount}/{meds.length} Taken</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {meds.map((med) => (
              <button
                key={med.id}
                onClick={() => handleMedToggle(med.id)}
                className={`w-full p-4 rounded-2xl border text-left flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  med.taken
                    ? "bg-indigo-50/50 border-indigo-200 text-indigo-900 shadow-xs"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100/50 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Custom checkbox */}
                  <div className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center transition-all ${
                    med.taken
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-350 bg-white"
                  }`}>
                    {med.taken && <IconCheck className="w-4 h-4" />}
                  </div>

                  <div className="flex items-center gap-3.5">
                    {/* Visual Pill Indicator */}
                    <div className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-xs font-bold shadow-xs ${
                      med.color === "Blue" ? "bg-blue-50 text-blue-600 border-blue-200" :
                      med.color === "White" ? "bg-white text-slate-400 border-slate-200" :
                      med.color === "Yellow" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                      "bg-pink-50 text-pink-600 border-pink-200"
                    }`}>
                      {med.shape === "oval" && "⬭"}
                      {med.shape === "round" && "◯"}
                      {med.shape === "capsule" && "💊"}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-black leading-none">{med.name} {med.dosage}</span>
                      <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase">
                        {med.color} Pill • {med.purpose}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto">
                  <span className="text-[10px] font-black uppercase bg-white border border-slate-150 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                    <IconClock className="w-3.5 h-3.5 text-indigo-600" />
                    Dose: {med.time}
                  </span>
                </div>
              </button>
            ))}
          </div>

        </AhnaraCard>
      </main>

      {/* Side tools (4 cols) */}
      <aside className="lg:col-span-4 flex flex-col gap-3">
        
        {/* Contraindication Checker */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <div className="flex items-center gap-1.5">
              <IconAlertTriangle className="w-5 h-5 text-amber-600" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Safety Warnings</h4>
            </div>
            <span className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-black uppercase">Alerts</span>
          </div>

          <div className="flex flex-col gap-3 text-left text-xs font-semibold text-slate-600 leading-normal">
            <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
              <span className="font-bold text-amber-900 block">Food Interactions:</span>
              Do not consume grapefruit or grapefruit juice while taking Atorvastatin.
            </div>
            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <span className="font-bold text-indigo-900 block">Dose Timing:</span>
              Take Metformin with dinner to reduce stomach discomfort.
            </div>
          </div>
        </AhnaraCard>

        {/* Offline USSD Pill Tracker Simulator */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <div className="flex items-center gap-1.5">
              <IconDeviceMobile className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Offline Adherence Simulator</h4>
            </div>
          </div>

          <form onSubmit={handleOfflineSubmit} className="flex flex-col gap-3 text-left">
            <p className="text-[10px] text-slate-400 font-bold leading-normal">
              When using basic features phones offline, elder users register doses via USSD codes. Enter simulated USSD below:
            </p>
            <input
              type="text"
              required
              value={offlineCode}
              onChange={(e) => setOfflineCode(e.target.value)}
              placeholder="e.g. *401*3*1#"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs outline-none focus:bg-white focus:border-slate-350 font-mono font-bold text-slate-800"
            />
            
            <AhnaraButton
              type="submit"
              variant="outline"
              disabled={offlineLogSuccess}
              className="w-full !rounded-xl text-indigo-600 border-indigo-200 hover:bg-indigo-50 font-bold"
            >
              {offlineLogSuccess ? "Simulating Sync..." : "Sync Offline Code"}
            </AhnaraButton>

            {offlineLogSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] p-2.5 rounded-xl font-bold">
                ✓ Offline sync received: Metformin (Dose 3) logged as TAKEN via SMS/USSD relay.
              </div>
            )}
          </form>
        </AhnaraCard>

        {/* Refill trigger */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-3 shadow-xs text-left">
          <span className="text-[9px] text-[#A03B2B] font-black uppercase tracking-wider block">Low Inventory Alert</span>
          <h4 className="text-sm font-black text-slate-800">Atorvastatin 10mg</h4>
          <p className="text-[10px] text-slate-400 font-semibold leading-normal">
            Only 4 doses remaining in your current supply. Order refill now to prevent dosage gaps.
          </p>
          <AhnaraButton
            variant="primary"
            className="w-full mt-1.5 bg-indigo-600 hover:bg-indigo-700 text-white !rounded-xl font-bold flex items-center justify-center gap-1.5"
          >
            <IconShoppingBag className="w-4 h-4" />
            Order Refill (£12.99)
            <IconArrowUpRight className="w-3.5 h-3.5" />
          </AhnaraButton>
        </AhnaraCard>

      </aside>

    </div>
  );
}
