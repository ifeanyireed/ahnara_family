"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconPill,
  IconClock,
  IconCheck,
  IconCalendar,
  IconPhoneCall,
  IconHourglassLow,
  IconHourglassEmpty,
  IconHeart,
  IconAward,
  IconShieldCheck,
  IconBabyCarriage,
  IconAlarm,
  IconAlertCircle,
  IconChartBar
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

interface Supplement {
  id: string;
  name: string;
  dose: string;
  taken: boolean;
  reminderTime: string;
  benefits: string;
}

interface SpacingMethod {
  name: string;
  efficacy: string;
  duration: string;
  type: string;
  desc: string;
  availability: string;
}

export default function MedsAndSpacingPage() {
  const [activeTab, setActiveTab] = useState<"supplements" | "spacing">("supplements");
  const [selectedGap, setSelectedGap] = useState<string>("3"); // 2, 3, or 5 years
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Supplements state
  const [supplements, setSupplements] = useState<Supplement[]>([
    {
      id: "iron",
      name: "Iron (Ferrous Fumarate)",
      dose: "60 mg",
      taken: false,
      reminderTime: "08:00",
      benefits: "Prevents maternal anemia and supports baby's oxygen supply."
    },
    {
      id: "folic",
      name: "Folic Acid",
      dose: "400 mcg",
      taken: true,
      reminderTime: "08:30",
      benefits: "Reduces risk of neural tube defects (NTDs) in early fetal development."
    },
    {
      id: "calcium",
      name: "Calcium Carbonate",
      dose: "500 mg",
      taken: false,
      reminderTime: "20:00",
      benefits: "Supports baby's skeletal development and regulates blood pressure."
    }
  ]);

  // Load alarms / taken states from local storage if available
  useEffect(() => {
    const saved = localStorage.getItem("mama_supplements_schedule");
    if (saved) {
      try {
        setSupplements(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading supplements state", e);
      }
    }
  }, []);

  const saveSupplements = (updated: Supplement[]) => {
    setSupplements(updated);
    localStorage.setItem("mama_supplements_schedule", JSON.stringify(updated));
  };

  const handleToggleTaken = (id: string) => {
    const updated = supplements.map(s => s.id === id ? { ...s, taken: !s.taken } : s);
    saveSupplements(updated);
  };

  const handleTimeChange = (id: string, newTime: string) => {
    const updated = supplements.map(s => s.id === id ? { ...s, reminderTime: newTime } : s);
    saveSupplements(updated);
  };

  // Pre-calculated stats
  const takenCount = supplements.filter(s => s.taken).length;
  const complianceRate = Math.round((takenCount / supplements.length) * 100);

  // Find next untaken supplement
  const nextUntaken = supplements.find(s => !s.taken);
  const nextDoseText = nextUntaken ? `${nextUntaken.name.split(" (")[0]} at ${nextUntaken.reminderTime}` : "All taken today! 🎉";

  const spacingTexts = {
    "2": "2 Years Gap",
    "3": "3 Years Gap",
    "5": "5+ Years Gap",
  };
  const spacingLabel = spacingTexts[selectedGap as keyof typeof spacingTexts] || `${selectedGap} Years Gap`;

  // Spacing options details
  const spacingMethods: SpacingMethod[] = [
    {
      name: "Hormonal Implant",
      efficacy: "99.9%",
      duration: "3 - 5 Years",
      type: "Reversible Progestin",
      desc: "Thin rods placed under the skin of the upper arm. Safe immediately after birth, does not affect breastfeeding.",
      availability: "Immediate at Health Center A"
    },
    {
      name: "Copper IUD",
      efficacy: "99.2%",
      duration: "5 - 10 Years",
      type: "Non-Hormonal Device",
      desc: "A small T-shaped device placed in the uterus. High efficacy, completely non-hormonal, immediate postpartum insertion possible.",
      availability: "Requires clinic appointment"
    },
    {
      name: "Oral Spacing Pills",
      efficacy: "91.0%",
      duration: "Daily / User-Controlled",
      type: "Progestin-Only (POPs)",
      desc: "Daily mini-pills designed specifically for breastfeeding mothers. Must be taken at the exact same time every day.",
      availability: "Dispensed at pharmacy counter"
    },
    {
      name: "Lactational Amenorrhea (LAM)",
      efficacy: "98.0%",
      duration: "First 6 Months",
      type: "Natural Lactation",
      desc: "Exclusive breastfeeding suppresses ovulation naturally. Valid only if baby is under 6 months and mother hasn't menstruated.",
      availability: "Supported by midwife counseling"
    }
  ];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* LEFT/CENTER WORKSPACE (9 COLS) */}
      <main className="lg:col-span-9 flex flex-col gap-3">
        
        {/* Title row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in"
        >
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-display">Supplements &amp; Spacing</h2>
            <p className="text-slate-500 font-medium mt-1">
              Adhere to daily prenatal vitamins and plan postpartum family spacing.
            </p>
          </div>

          <span className="bg-[#E8F3CE] border border-[#CDE0A4] text-[#608216] px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1.5 self-start md:self-auto">
            <IconShieldCheck className="w-4.5 h-4.5 text-[#8BB436]" />
            Adherence Confirmed
          </span>
        </motion.div>

        {/* TOP CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2 mb-3">
          
          {/* Card 1: Supplement Adherence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pill Adherence</span>
                <div className="w-9 h-9 rounded-full bg-[#F5F8EB] flex items-center justify-center text-[#9CC031] shadow-[0_2px_8px_rgba(156,192,49,0.1)]">
                  <IconPill className="w-4.5 h-4.5" />
                </div>
              </div>
              
              {/* Progress bar matching dashboard */}
              <div className="h-16 w-full flex flex-col justify-center gap-2 mb-2">
                <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${complianceRate}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[#C5EC59] rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-1.5 mt-2">
                <span className="text-3xl font-extrabold text-slate-800 text-display">{complianceRate}%</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  {takenCount}/{supplements.length} Taken
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 2: Next Dose */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[174px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Next Dose</span>
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shadow-[0_2px_8px_rgba(59,130,246,0.1)]">
                    <IconClock className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="h-16 w-full flex flex-col justify-center mb-2">
                  <span className="text-sm font-black text-slate-700 truncate leading-snug">
                    {nextDoseText}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold mt-1">
                    Prenatal Supplement
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Schedule time active
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 3: Adherence Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[174px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Adherence Streak</span>
                  <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shadow-[0_2px_8px_rgba(245,158,11,0.1)]">
                    <IconAward className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="h-16 w-full flex flex-col justify-center mb-2">
                  <span className="text-3xl font-extrabold text-[#608216] tracking-tight text-display">
                    4 Days 🔥
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Top 5% of active mothers
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 4: Postpartum Spacing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[174px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Spacing Target</span>
                  <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shadow-[0_2px_8px_rgba(20,184,166,0.1)]">
                    <IconBabyCarriage className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="h-16 w-full flex flex-col justify-center mb-2">
                  <span className="text-3xl font-extrabold text-slate-800 tracking-tight text-display">
                    {spacingLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  WHO standard is 2+ years
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

        </div>

        {/* Tab switcher */}
        <div className="bg-white border border-slate-100 p-1.5 rounded-2xl shadow-xs flex items-center gap-1">
          {[
            { id: "supplements", label: "Prenatal Supplements Tracker" },
            { id: "spacing", label: "Postpartum Family Spacing Planner" }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? "bg-[#1E293B] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ACTIVE TAB WORKSPACE */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
          
          <AnimatePresence mode="wait">
            
            {activeTab === "supplements" && (
              <motion.div
                key="supplements"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {/* DAILY SUPPLEMENTS CHECKLIST */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <IconPill className="w-5 h-5 text-[#FF904C]" />
                    <h3 className="text-base font-black text-slate-800 text-display">Daily Supplement Schedule</h3>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-1">
                    {supplements.map((s) => (
                      <div
                        key={s.id}
                        className={`p-4 rounded-2xl border text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all ${
                          s.taken
                            ? "bg-[#E8F3CE]/20 border-[#CDE0A4]/60 text-[#608216]"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <div className="flex items-start gap-3 text-left">
                          <button
                            onClick={() => handleToggleTaken(s.id)}
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all mt-0.5 flex-shrink-0 ${
                              s.taken
                                ? "bg-[#8BB436] text-white"
                                : "border border-slate-300 bg-white"
                            }`}
                          >
                            {s.taken && <IconCheck className="w-4 h-4" />}
                          </button>

                          <div className="flex flex-col">
                            <span className="text-xs font-black leading-none">{s.name} ({s.dose})</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-1 block leading-normal">
                              {s.benefits}
                            </span>
                          </div>
                        </div>

                        {/* Alarm Time configuration in-row */}
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <IconAlarm className="w-4 h-4 text-slate-400" />
                            Alarm:
                          </div>
                          <input
                            type="time"
                            value={s.reminderTime}
                            onChange={(e) => handleTimeChange(s.id, e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-semibold outline-none focus:border-slate-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WEEKLY PROGRESS STAMP LOGS */}
                <div className="bg-white border border-[#CDE0A4] p-5 rounded-2xl flex flex-col gap-4 shadow-sm relative overflow-hidden">
                  
                  {/* Subtle Background Pattern or Highlight */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8F3CE]/30 rounded-bl-full pointer-events-none -z-10" />

                  {/* Header & Overall stats */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#E8F3CE]">
                        <IconChartBar className="w-5 h-5 text-[#608216]" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-sm font-black text-slate-800 leading-none">Weekly Adherence logs</h4>
                        <span className="text-[10px] text-slate-400 font-semibold mt-1">Based on weekly supplement intake</span>
                      </div>
                    </div>
                    
                    {/* Summary stats */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Weekly Score</span>
                        <span className="text-sm font-black text-[#608216]">83% Adherence</span>
                      </div>
                      <div className="h-8 w-px bg-slate-200" />
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Streak</span>
                        <span className="text-sm font-black text-[#0089C1]">4 Days 🔥</span>
                      </div>
                    </div>
                  </div>

                  {/* The Graph Visualizer */}
                  <div className="flex justify-between items-end gap-3 py-3 px-1 relative min-h-[140px]">
                    {[
                      { day: "Mon", rate: 100, taken: 3, total: 3 },
                      { day: "Tue", rate: 66, taken: 2, total: 3 },
                      { day: "Wed", rate: 100, taken: 3, total: 3 },
                      { day: "Thu", rate: 33, taken: 1, total: 3 },
                      { day: "Fri", rate: 100, taken: 3, total: 3 },
                      { day: "Sat", rate: 0, taken: 0, total: 3 },
                      { day: "Sun", rate: 100, taken: 3, total: 3 }
                    ].map((d, i) => {
                      const isHovered = hoveredDay === i;
                      
                      // Theme-aligned gradients and outline colors based on compliance level
                      let pillColorClass = "bg-gradient-to-t from-red-500 to-rose-400 shadow-[0_4px_10px_rgba(239,68,68,0.2)]";
                      let bgTrackColor = "bg-red-50/50 border-red-100";
                      let textColor = "text-rose-600";
                      
                      if (d.rate >= 100) {
                        pillColorClass = "bg-gradient-to-t from-[#8BB436] to-[#B5D95C] shadow-[0_4px_12px_rgba(139,180,54,0.3)]";
                        bgTrackColor = "bg-[#E8F3CE]/20 border-[#CDE0A4]/30";
                        textColor = "text-[#608216]";
                      } else if (d.rate >= 50) {
                        pillColorClass = "bg-gradient-to-t from-[#FF904C] to-[#FFA775] shadow-[0_4px_10px_rgba(255,144,76,0.25)]";
                        bgTrackColor = "bg-[#FF904C]/5 border-[#FF904C]/10";
                        textColor = "text-amber-600";
                      }

                      return (
                        <div 
                          key={i} 
                          className="flex-1 flex flex-col items-center gap-3 relative group"
                          onMouseEnter={() => setHoveredDay(i)}
                          onMouseLeave={() => setHoveredDay(null)}
                        >
                          {/* Rich Floating Tooltip */}
                          <AnimatePresence>
                            {isHovered && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: -8, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                className="absolute bottom-[115px] z-30 bg-slate-900 text-white text-[10px] font-bold rounded-xl px-3 py-2 shadow-xl flex flex-col items-center gap-1 min-w-[90px] pointer-events-none"
                              >
                                <span className="text-white/80">{d.day} logs</span>
                                <span className={`text-sm font-black ${d.rate >= 100 ? "text-[#D4F475]" : d.rate >= 50 ? "text-[#FFA775]" : "text-rose-400"}`}>
                                  {d.rate}%
                                </span>
                                <span className="text-[9px] text-slate-400 font-semibold">{d.taken} of {d.total} taken</span>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Pill-shaped capsule graph track */}
                          <div className={`w-6 h-24 ${bgTrackColor} border rounded-full relative overflow-hidden flex items-end justify-center transition-all duration-300 p-0.5 group-hover:scale-105 group-hover:shadow-sm`}>
                            {/* Animated vertical capsule fill */}
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${d.rate}%` }}
                              transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.05 }}
                              className={`w-full rounded-full ${pillColorClass} relative overflow-hidden flex items-start justify-center pt-1`}
                            >
                              {/* Pill shiny sheen */}
                              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent pointer-events-none" />
                              
                              {/* Pulse dot for perfect adherence days */}
                              {d.rate >= 100 && (
                                <div className="w-1 h-1 rounded-full bg-white/60 animate-pulse" />
                              )}
                            </motion.div>
                          </div>

                          {/* Week Day label & Indicator */}
                          <div className="flex flex-col items-center gap-0.5">
                            <span className={`text-[9px] font-black uppercase tracking-wider transition-colors duration-200 ${isHovered ? textColor : "text-slate-400"}`}>
                              {d.day}
                            </span>
                            <div className={`w-1 h-1 rounded-full transition-all duration-300 ${
                              d.rate >= 100 
                                ? "bg-[#8BB436] scale-100" 
                                : d.rate >= 50 
                                  ? "bg-[#FF904C] scale-100" 
                                  : d.rate > 0 
                                    ? "bg-rose-500 scale-100" 
                                    : "bg-slate-300 scale-50"
                            }`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === "spacing" && (
              <motion.div
                key="spacing"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {/* PREGNANCY GAP TIMELINE CHOICE */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <IconBabyCarriage className="w-5 h-5 text-[#0089C1]" />
                    <h3 className="text-base font-black text-slate-800 text-display">Pregnancy Gap Selection</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Select your desired spacing interval between this birth and your next pregnancy. WHO clinical guidelines recommend at least a 24-month gap to ensure full maternal physical recovery:
                  </p>

                  <div className="grid grid-cols-3 gap-3 mt-1.5">
                    {[
                      { val: "2", label: "2 Years Gap", desc: "WHO standard recovery" },
                      { val: "3", label: "3 Years Gap", desc: "Enhanced spacing comfort" },
                      { val: "5", label: "5+ Years Gap", desc: "Long-term spacer focus" }
                    ].map((gap) => {
                      const isSelected = selectedGap === gap.val;
                      return (
                        <button
                          key={gap.val}
                          onClick={() => setSelectedGap(gap.val)}
                          className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                            isSelected
                              ? "bg-[#E8F3CE] border-[#8BB436] text-[#608216] shadow-xs"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-300"
                          }`}
                        >
                          <span className="text-sm font-black tracking-tight">{gap.label}</span>
                          <span className="text-[9px] opacity-75 mt-1 font-bold block">{gap.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FAMILY SPACING CARDS GRID */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Recommended Postpartum Spacing Choices</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    {spacingMethods.map((m, idx) => (
                      <AhnaraCard
                        key={idx}
                        variant="flat"
                        padding="none"
                        className="bg-white border border-slate-100 p-5 flex flex-col justify-between hover:shadow-md transition-all gap-4"
                      >
                        <div className="text-left flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-[#0089C1] font-black uppercase tracking-wider">{m.type}</span>
                            <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider">
                              {m.efficacy} Efficient
                            </span>
                          </div>
                          
                          <h4 className="text-sm font-black text-slate-800 mt-0.5">{m.name}</h4>
                          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5">
                            {m.desc}
                          </p>
                        </div>

                        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
                          <span>Duration: <b className="text-slate-700">{m.duration}</b></span>
                          <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-500 font-black text-[9px] uppercase tracking-wider">
                            {m.availability}
                          </span>
                        </div>
                      </AhnaraCard>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </main>

      {/* RIGHT SIDEBAR (3 COLS) */}
      <aside className="lg:col-span-3 flex flex-col gap-3">
        
        {/* Desktop-only spacer */}
        <div className="hidden lg:block h-[68px]" />

        {/* Adherence Card (For Supplements tab) */}
        {activeTab === "supplements" ? (
          <motion.div
            key="side-compliance"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm text-left">
              <div className="flex items-center justify-between border-b border-[#C7DB9C] pb-3">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider">Adherence Index</span>
                  <h3 className="font-extrabold text-lg text-[#0D090C] text-display">Pill Compliance</h3>
                </div>
                <IconAward className="w-5 h-5 text-[#608216]" />
              </div>

              <div className="flex flex-col gap-3 text-xs text-[#608216] font-semibold">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-slate-900 leading-none text-display">{complianceRate}%</span>
                  <span className="text-[10px] font-bold tracking-wider uppercase opacity-75">Daily Rate</span>
                </div>
                
                <p className="text-xs text-[#608216]/90 mt-1 leading-relaxed">
                  You took {takenCount} out of {supplements.length} vitamins today. Keep taking them regularly to maintain baby growth milestones.
                </p>

                <div className="w-full bg-[#D4F475]/60 h-2 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-[#8BB436] h-full rounded-full" style={{ width: `${complianceRate}%` }} />
                </div>
              </div>
            </AhnaraCard>
          </motion.div>
        ) : (
          /* Book Consultation Card (For Spacing tab) */
          <motion.div
            key="side-consultation"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm text-left">
              <div className="flex items-center justify-between border-b border-[#C7DB9C] pb-3">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider">Spacing consultation</span>
                  <h3 className="font-extrabold text-lg text-[#0D090C] text-display">Spacer Setup</h3>
                </div>
                <IconBabyCarriage className="w-5 h-5 text-[#608216]" />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-xs text-[#608216] font-semibold leading-relaxed">
                  Book a confidential, one-on-one consultation with Nurse Tyra to select a postpartum spacer device.
                </p>

                <AhnaraButton
                  variant="primary"
                  className="w-full bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md border-none"
                >
                  <IconPhoneCall className="w-4 h-4" />
                  Book Spacer Consult
                </AhnaraButton>
              </div>
            </AhnaraCard>
          </motion.div>
        )}

        {/* Warnings / Advisory Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-3 shadow-xs text-left">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
              <IconAlertCircle className="w-4.5 h-4.5 text-amber-500 flex-shrink-0" />
              Clinical Guideline
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              WHO suggests checking supplements daily. Postpartum spacing reduces the incidence of low birth weights and maternal complications in subsequent pregnancies.
            </p>
          </AhnaraCard>
        </motion.div>

      </aside>

    </div>
  );
}
