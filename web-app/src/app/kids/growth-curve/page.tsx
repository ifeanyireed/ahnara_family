"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconScale,
  IconPlus,
  IconTrash,
  IconAlertCircle,
  IconInfoCircle
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraModal } from "@/components/ahnara/AhnaraModal";

interface GrowthLog {
  id: string;
  date: string;
  ageMonths: number;
  weightKg: number;
  heightCm: number;
  bmi: number;
  status: "Normal" | "Monitor" | "Action Required";
}

export default function GrowthCurvePage() {
  const [childName, setChildName] = useState("Aria");
  
  // Growth logs state
  const [logs, setLogs] = useState<GrowthLog[]>([
    { id: "1", date: "April 2, 2026", ageMonths: 0, weightKg: 3.2, heightCm: 50.0, bmi: 12.8, status: "Normal" },
    { id: "2", date: "May 14, 2026", ageMonths: 1.5, weightKg: 4.8, heightCm: 55.4, bmi: 15.6, status: "Normal" },
    { id: "3", date: "June 30, 2026", ageMonths: 3.0, weightKg: 6.2, heightCm: 61.2, bmi: 16.6, status: "Normal" }
  ]);

  // Modal / Inputs state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [inputAge, setInputAge] = useState("4.5");
  const [inputWeight, setInputWeight] = useState("7.1");
  const [inputHeight, setInputHeight] = useState("64.5");

  // Load child profile data
  useEffect(() => {
    const dataStr = localStorage.getItem("kids_profile_data");
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        setChildName(data.childName || "Aria");
        
        // Add initial log matching birth weight if exists
        if (data.birthWeight) {
          setLogs([
            { 
              id: "birth", 
              date: new Date(data.dob).toLocaleDateString(), 
              ageMonths: 0, 
              weightKg: data.birthWeight / 1000, 
              heightCm: data.birthLength || 50.0, 
              bmi: Number(((data.birthWeight / 1000) / Math.pow((data.birthLength || 50.0) / 100, 2)).toFixed(1)),
              status: "Normal" 
            },
            { id: "2", date: "May 14, 2026", ageMonths: 1.5, weightKg: 4.8, heightCm: 55.4, bmi: 15.6, status: "Normal" },
            { id: "3", date: "June 30, 2026", ageMonths: 3.0, weightKg: 6.2, heightCm: 61.2, bmi: 16.6, status: "Normal" }
          ]);
        }
      } catch (e) {}
    }
  }, []);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const age = Number(inputAge);
    const w = Number(inputWeight);
    const h = Number(inputHeight);
    
    // BMI = weight(kg) / height(m)^2
    const bmiVal = Number((w / Math.pow(h / 100, 2)).toFixed(1));
    
    // Status check
    let status: "Normal" | "Monitor" | "Action Required" = "Normal";
    if (w < 2.5 || w > 14) status = "Monitor";

    const newLog: GrowthLog = {
      id: Math.random().toString(),
      date: new Date().toLocaleDateString(),
      ageMonths: age,
      weightKg: w,
      heightCm: h,
      bmi: bmiVal,
      status
    };

    const updated = [...logs, newLog].sort((a, b) => a.ageMonths - b.ageMonths);
    setLogs(updated);
    setIsLogModalOpen(false);
  };

  const handleDeleteLog = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  // Nutritional advice based on active age
  const getNutritionAdvice = () => {
    const latestLog = logs[logs.length - 1];
    const age = latestLog ? latestLog.ageMonths : 3;
    
    if (age < 6) {
      return {
        stage: "Exclusive Breastfeeding (0-6 months)",
        guidelines: [
          "Ensure breastfeeds on demand, at least 8 to 12 times in 24 hours.",
          "No water, formula, or complementary solids are required yet.",
          "Provide daily Vitamin D supplementation drops (400 IU).",
          "Ensure correct latch to support maternal comfort and feed volumes."
        ]
      };
    } else if (age < 12) {
      return {
        stage: "Complementary Feeding (6-12 months)",
        guidelines: [
          "Introduce thick pureed solid foods alongside breast milk.",
          "Ensure iron-rich meals (pureed beef, fish, fortified beans or cereal).",
          "Introduce water in a clean open cup (avoid bottles).",
          "Feed 2 to 3 times daily, building to small cup portions."
        ]
      };
    } else {
      return {
        stage: "Toddler Transition (12+ months)",
        guidelines: [
          "Introduce chopped family foods, ensuring nutritious balanced portions.",
          "Offer three healthy meals and two small nutritious snacks daily.",
          "Maintain breastfeeding on demand for up to 2 years or beyond.",
          "Avoid added salt, refined sugars, and caffeinated/carbonated teas."
        ]
      };
    }
  };

  // Computed growth trend indicator
  const getGrowthTrend = () => {
    if (logs.length < 2) return { text: "Monitoring baseline", color: "text-slate-500 bg-slate-50" };
    const latest = logs[logs.length - 1];
    const prev = logs[logs.length - 2];
    const diff = latest.weightKg - prev.weightKg;
    const timeDiff = latest.ageMonths - prev.ageMonths;

    if (diff <= 0 && timeDiff > 0.5) {
      return { text: "Flat Growth Curve Warning", color: "text-orange-800 bg-orange-50 border-orange-200" };
    }
    if (latest.weightKg < 3.0 && latest.ageMonths > 1) {
      return { text: "Below 5th Percentile Alert", color: "text-red-700 bg-red-50 border-red-200" };
    }
    return { text: "Normal Growth Trend", color: "text-[#608216] bg-[#E8F3CE] border-[#CDE0A4]" };
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* LEFT PANEL: Plotted WHO Growth Centile Graph (7 COLS) */}
      <main className="lg:col-span-7 flex flex-col gap-3">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight text-display">WHO Growth Chart</h2>
            <p className="text-slate-500 font-medium mt-1">
              Plotted weight-for-age percentiles for <span className="font-bold text-[#0089C1]">{childName}</span>.
            </p>
          </div>
        </div>

        {/* INTERACTIVE CENTILE CHART ENGINE */}
        <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">WHO Percentile Graph</span>
            <div className="flex gap-2">
              <span className="text-[9px] font-bold text-red-600 flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-red-650 inline-block" /> 5th %
              </span>
              <span className="text-[9px] font-bold text-[#608216] flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-[#8BB436] inline-block" /> 50th %
              </span>
              <span className="text-[9px] font-bold text-amber-600 flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-amber-500 inline-block" /> 95th %
              </span>
            </div>
          </div>

          {/* SVG line graph engine */}
          <div className="h-72 w-full relative border-l border-b border-slate-200 mt-2 px-1">
            <svg className="w-full h-full" viewBox="0 0 500 250" preserveAspectRatio="none">
              
              {/* Y Axis Gridlines (Weight in kg: 0 to 15kg) */}
              {[3, 6, 9, 12, 15].map((kg, i) => {
                const y = 250 - (kg / 15) * 230;
                return (
                  <g key={i}>
                    <line x1="0" y1={y} x2="500" y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4" />
                    <text x="5" y={y - 4} fill="#94A3B8" fontSize="9" fontWeight="bold">{kg} kg</text>
                  </g>
                );
              })}

              {/* X Axis Gridlines (Age in months: 0 to 24 months) */}
              {[0, 3, 6, 9, 12, 18, 24].map((m, i) => {
                const x = (m / 24) * 480 + 10;
                return (
                  <g key={i}>
                    <line x1={x} y1="0" x2={x} y2="250" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4" />
                    <text x={x + 2} y="245" fill="#94A3B8" fontSize="9" fontWeight="bold">{m}m</text>
                  </g>
                );
              })}

              {/* 5th Percentile Curve (Low Weight) */}
              <path
                d="M 10,210 Q 130,170 250,150 T 490,130"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                strokeDasharray="2 3"
                opacity="0.8"
              />

              {/* 50th Percentile Curve (Median Weight - Light green) */}
              <path
                d="M 10,195 Q 130,140 250,110 T 490,75"
                fill="none"
                stroke="#8BB436"
                strokeWidth="3.5"
                opacity="0.9"
              />

              {/* 95th Percentile Curve (High Weight) */}
              <path
                d="M 10,180 Q 130,105 250,70 T 490,25"
                fill="none"
                stroke="#C88A3A"
                strokeWidth="2.5"
                strokeDasharray="2 3"
                opacity="0.8"
              />

              {/* PLOTTED COORDINATES FOR CHILD */}
              {logs.map((log, i) => {
                // map log age (0 to 24) to x (10 to 490)
                const x = (log.ageMonths / 24) * 480 + 10;
                // map log weight (0 to 15) to y (250 to 20)
                const y = 250 - (log.weightKg / 15) * 230;
                
                return (
                  <g key={log.id}>
                    {/* Connecting dotted lines */}
                    {i > 0 && (() => {
                      const prevLog = logs[i - 1];
                      const prevX = (prevLog.ageMonths / 24) * 480 + 10;
                      const prevY = 250 - (prevLog.weightKg / 15) * 230;
                      return (
                        <line x1={prevX} y1={prevY} x2={x} y2={y} stroke="#0089C1" strokeWidth="2.5" strokeDasharray="3 3" />
                      );
                    })()}
                    <circle
                      cx={x}
                      cy={y}
                      r="6.5"
                      fill="#0089C1"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-8 transition-all"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
          
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 px-1">
            <span>WHO Standard Weight-for-Age curves plotted (Female percentile grids)</span>
          </div>
        </div>

        {/* DATA LOGS TABLE */}
        <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Growth Log Ledger</span>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="bg-[#1E293B] text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              <IconPlus className="w-4 h-4" /> Log Metric
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                  <th className="py-2.5">Age</th>
                  <th>Log Date</th>
                  <th>Weight (kg)</th>
                  <th>Height (cm)</th>
                  <th>Computed BMI</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-bold text-slate-900">{log.ageMonths} Months</td>
                    <td>{log.date}</td>
                    <td className="font-mono text-[#0089C1]">{log.weightKg} kg</td>
                    <td className="font-mono text-slate-700">{log.heightCm} cm</td>
                    <td className="font-mono text-slate-500">{log.bmi}</td>
                    <td>
                      <button 
                        onClick={() => handleDeleteLog(log.id)}
                        className="text-slate-400 hover:text-red-650 transition-colors p-1"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="lg:col-span-5 flex flex-col gap-3">
        
        {/* Desktop-only spacer */}
        <div className="hidden lg:block h-[68px]" />

        {/* Growth status indicator card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-200/50 p-5 flex flex-col gap-4 shadow-xs text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IconScale className="w-5 h-5 text-[#0089C1]" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Growth Trend</h3>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className={`p-4 rounded-2xl flex items-center justify-center text-xs font-black uppercase tracking-wider ${getGrowthTrend().color} border`}>
                {getGrowthTrend().text}
              </div>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                Percentile plotting measures the velocity of development. Contact a pediatrician immediately if the curve flattens.
              </p>
            </div>
          </AhnaraCard>
        </motion.div>

        {/* Nutritional Advice Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm text-left text-[#608216]">
            <div className="flex items-center justify-between border-b border-[#CDE0A4] pb-3">
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider">{getNutritionAdvice().stage}</span>
                <h3 className="font-extrabold text-lg text-slate-900 text-display">Nutrition Guidelines</h3>
              </div>
            </div>

            <ul className="flex flex-col gap-3 text-xs text-[#608216]/90 font-semibold">
              {getNutritionAdvice().guidelines.map((g, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#608216] flex-shrink-0 mt-1.5" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </AhnaraCard>
        </motion.div>

        {/* Warning Indicator board */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-200/50 p-5 flex flex-col gap-3 shadow-xs text-left">
          <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <IconAlertCircle className="w-4.5 h-4.5 text-[#0089C1]" />
            Malnutrition Warn Flags
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
            Check Mid-Upper Arm Circumference (MUAC) monthly. Yellow (under 12.5cm) suggests moderate acute malnutrition; Red (under 11.5cm) suggests severe acute malnutrition. Seek immediate clinical assessment.
          </p>
        </AhnaraCard>

      </aside>

      {/* LOG METRIC MODAL */}
      <AhnaraModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Growth Metrics"
      >
        <form onSubmit={handleAddLog} className="flex flex-col gap-4 p-4 text-left">
          
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Age (Months)</label>
            <input
              type="number"
              step="0.5"
              required
              placeholder="e.g. 4.5"
              value={inputAge}
              onChange={(e) => setInputAge(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:bg-white font-semibold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="e.g. 7.1"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:bg-white font-semibold text-slate-800"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="e.g. 64.5"
                value={inputHeight}
                onChange={(e) => setInputHeight(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:bg-white font-semibold text-slate-800"
              />
            </div>
          </div>

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
              className="flex-1 bg-[#1E293B] hover:bg-slate-800 border-none text-white rounded-xl"
            >
              Add Coordinates
            </AhnaraButton>
          </div>
        </form>
      </AhnaraModal>

    </div>
  );
}
