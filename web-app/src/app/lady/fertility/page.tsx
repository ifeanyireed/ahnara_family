"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  IconCheck, 
  IconInfoCircle, 
  IconTemperature,
  IconDroplet,
  IconGridPattern,
  IconTrendingUp,
  IconQrcode
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function LadyFertilityPage() {
  const [bbtTemp, setBbtTemp] = useState<string>("36.65");
  const [mucusQuality, setMucusQuality] = useState<string>("creamy");
  const [lhStatus, setLhStatus] = useState<string>("negative");
  const [showSyncSuccess, setShowSyncSuccess] = useState<boolean>(false);

  // Calendar dates mock representing days of the month
  const fertilityCalendar = [
    { day: 1, type: "menstruation" },
    { day: 2, type: "menstruation" },
    { day: 3, type: "menstruation" },
    { day: 4, type: "menstruation" },
    { day: 5, type: "low" },
    { day: 6, type: "low" },
    { day: 7, type: "low" },
    { day: 8, type: "low" },
    { day: 9, type: "low" },
    { day: 10, type: "high" },
    { day: 11, type: "high" },
    { day: 12, type: "peak" },
    { day: 13, type: "peak" },
    { day: 14, type: "peak" }, // Ovulation
    { day: 15, type: "high" },
    { day: 16, type: "low" },
    { day: 17, type: "low" },
    { day: 18, type: "low" },
    { day: 19, type: "low" },
    { day: 20, type: "low" },
    { day: 21, type: "low" },
    { day: 22, type: "low", active: true }, // Today
    { day: 23, type: "low" },
    { day: 24, type: "low" },
    { day: 25, type: "low" },
    { day: 26, type: "low" },
    { day: 27, type: "low" },
    { day: 28, type: "low" }
  ];

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSyncSuccess(true);
    setTimeout(() => {
      setShowSyncSuccess(false);
    }, 4000);

    // Save state locally
    const history = JSON.parse(localStorage.getItem("lady_fertility_history") || "[]");
    history.push({
      date: new Date().toLocaleDateString(),
      bbt: parseFloat(bbtTemp),
      mucus: mucusQuality,
      lh: lhStatus,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("lady_fertility_history", JSON.stringify(history));
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Calendar and Trends (8 cols) */}
      <main className="lg:col-span-8 flex flex-col gap-3">
        
        {/* Fertile window calendar */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Fertile Window Map</h3>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-black uppercase">Standard Cycle Model</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Days header */}
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} className="text-center text-[10px] font-black text-slate-400 py-1 uppercase">{d}</div>
            ))}
            
            {/* Calendar Days */}
            {fertilityCalendar.map((item, idx) => {
              let bg = "bg-slate-50 text-slate-600 border-slate-200";
              if (item.type === "menstruation") bg = "bg-red-50 text-red-600 border-red-200";
              if (item.type === "high") bg = "bg-rose-50 text-rose-600 border-rose-200";
              if (item.type === "peak") bg = "bg-purple-100 text-purple-700 border-purple-250 ring-1 ring-purple-500/20";
              
              return (
                <div
                  key={idx}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative p-1.5 ${bg} ${
                    item.active ? "ring-2 ring-rose-500 font-extrabold scale-102 bg-white" : ""
                  }`}
                >
                  <span className="text-xs font-bold">{item.day}</span>
                  {item.type === "peak" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 absolute bottom-1.5" />
                  )}
                  {item.active && (
                    <span className="text-[8px] font-black text-rose-600 uppercase absolute top-1">TODAY</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Color Key */}
          <div className="flex items-center flex-wrap gap-4 mt-2 border-t border-slate-50 pt-3">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500">
              <span className="w-3 h-3 bg-red-100 rounded-sm border border-red-250 inline-block" />
              Menstruation
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500">
              <span className="w-3 h-3 bg-rose-50 rounded-sm border border-rose-200 inline-block" />
              High Fertility
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500">
              <span className="w-3 h-3 bg-purple-100 rounded-sm border border-purple-250 inline-block" />
              Peak Window
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500">
              <span className="w-3 h-3 bg-slate-50 rounded-sm border border-slate-200 inline-block" />
              Low Fertility
            </div>
          </div>
        </AhnaraCard>

        {/* Temperature chart visualization */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-3 shadow-xs">
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Basal Body Temperature Curve</h3>
          
          <div className="h-44 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
            {/* Visual plot curve placeholder representing BBT shifts */}
            <div className="absolute inset-0 flex items-end justify-between px-10 pb-8">
              {[36.4, 36.42, 36.45, 36.38, 36.72, 36.75, 36.7].map((val, i) => {
                const height = ((val - 36.3) / 0.5) * 100;
                return (
                  <div key={i} className="flex flex-col items-center gap-2 w-8">
                    <span className="text-[9px] font-black text-rose-500">{val}°C</span>
                    <div 
                      style={{ height: `${Math.min(100, Math.max(10, height))}px` }} 
                      className="w-2.5 bg-rose-400 rounded-full transition-all"
                    />
                    <span className="text-[9px] font-bold text-slate-400">Day {i * 3 + 7}</span>
                  </div>
                );
              })}
            </div>
            <div className="absolute top-4 left-4 bg-white border border-slate-150 px-2.5 py-1 rounded-lg text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
              <IconTrendingUp className="w-3.5 h-3.5 text-rose-500" />
              Luteal Thermal Shift Detected (+0.32°C)
            </div>
          </div>
        </AhnaraCard>

      </main>

      {/* Input controls (4 cols) */}
      <aside className="lg:col-span-4 flex flex-col gap-3">
        
        {/* Daily log input */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Log Fertility Vitals</h3>
          
          <form onSubmit={handleSaveVitals} className="flex flex-col gap-4">
            
            {/* BBT Temp Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <IconTemperature className="w-4 h-4 text-rose-500" />
                Basal Body Temp (°C)
              </label>
              <input
                type="number"
                step="0.01"
                min="35.00"
                max="39.00"
                value={bbtTemp}
                onChange={(e) => setBbtTemp(e.target.value)}
                className="w-full p-3.5 border border-slate-200 rounded-xl text-sm font-black focus:outline-none focus:border-rose-400"
                placeholder="e.g. 36.65"
                required
              />
            </div>

            {/* Cervical Mucus dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <IconDroplet className="w-4 h-4 text-rose-500" />
                Cervical Mucus Quality
              </label>
              <select
                value={mucusQuality}
                onChange={(e) => setMucusQuality(e.target.value)}
                className="w-full p-3.5 border border-slate-200 rounded-xl text-sm font-bold bg-white focus:outline-none focus:border-rose-400"
              >
                <option value="dry">Dry / Absent</option>
                <option value="sticky">Sticky / Clumpy</option>
                <option value="creamy">Creamy / Lotion-like</option>
                <option value="wet">Wet / Slippery</option>
                <option value="egg-white">Egg-White / Stretchy</option>
              </select>
            </div>

            {/* LH Ovulation strip scanner simulator */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <IconGridPattern className="w-4 h-4 text-rose-500" />
                LH Strip scanner
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "negative", label: "Negative" },
                  { value: "positive", label: "Positive (Surge)" }
                ].map((lh) => (
                  <button
                    key={lh.value}
                    type="button"
                    onClick={() => setLhStatus(lh.value)}
                    className={`py-3.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      lhStatus === lh.value
                        ? "bg-rose-50 border-rose-350 text-rose-700 ring-1 ring-rose-500"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {lh.label}
                  </button>
                ))}
              </div>
            </div>

            <AhnaraButton
              variant="primary"
              type="submit"
              className="bg-rose-500 hover:bg-rose-600 text-white font-black py-4 border-none rounded-xl mt-2 w-full"
            >
              Log Readings
            </AhnaraButton>
          </form>

          {showSyncSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[10px] font-bold mt-2">
              ✓ Logged! Basal body temp registered at {bbtTemp}°C with {mucusQuality} mucus status.
            </div>
          )}
        </AhnaraCard>

        {/* Clinical insight box */}
        <AhnaraCard variant="flat" className="bg-rose-50/30 border border-rose-100 p-5 flex flex-col gap-2.5 text-rose-950">
          <div className="flex items-center gap-1.5">
            <IconInfoCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <h4 className="text-xs font-black uppercase tracking-wider">Ovulation Mechanics</h4>
          </div>
          <p className="text-[11px] font-bold leading-normal text-rose-800">
            A rise in basal body temperature of 0.2°C to 0.5°C that remains elevated for 10+ days confirms ovulation. Egg-white cervical mucus is peak fertility, indicating the body is preparing for the ovulatory surge.
          </p>
        </AhnaraCard>

      </aside>

    </div>
  );
}
