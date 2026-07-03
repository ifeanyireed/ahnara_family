"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconScale,
  IconActivity,
  IconBabyCarriage,
  IconPill,
  IconChevronRight,
  IconPlus,
  IconCheck,
  IconAlertTriangle,
  IconCalendarEvent,
  IconSparkles,
  IconDeviceHeartMonitor,
  IconDroplets,
  IconQrcode,
  IconHeart,
  IconUpload,
  IconUser,
  IconClock,
  IconInfoCircle,
  IconArrowUpRight
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraModal } from "@/components/ahnara/AhnaraModal";

// Fruit size helper
const getFruitMilestone = (week: number) => {
  const milestones: Record<number, { name: string; icon: string; size: string; weight: string; desc: string }> = {
    4: { name: "Poppy Seed", icon: "🌱", size: "2 mm", weight: "Under 1g", desc: "Your baby is an embryo composed of two layers of cells from which all organs will develop." },
    8: { name: "Raspberry", icon: "🍒", size: "1.6 cm", weight: "1 g", desc: "Baby's heart is beating at 150 BPM. Hands, feet, and face features are shaping up rapidly." },
    12: { name: "Lime", icon: "🍋", size: "5.4 cm", weight: "14 g", desc: "Organ systems are in place. Baby can now curl their tiny toes and open/close their mouth." },
    16: { name: "Avocado", icon: "🥑", size: "11.6 cm", weight: "100 g", desc: "Baby's eyes are moving side to side, and they can grasp their umbilical cord." },
    20: { name: "Banana", icon: "🍌", size: "25.6 cm", weight: "300 g", desc: "Halfway mark! Your baby's skin is covered with a protective vernix coating. Quickening starts." },
    24: { name: "Cantaloupe", icon: "🍈", size: "30 cm", weight: "600 g", desc: "Your baby is acquiring fat deposits. Real hair is starting to grow on their scalp." },
    28: { name: "Eggplant", icon: "🍆", size: "37.6 cm", weight: "1 kg", desc: "Lungs can now breathe air, and baby's eyes can open and blink. Sleep cycles are regular." },
    32: { name: "Squash", icon: "🍍", size: "42.4 cm", weight: "1.7 kg", desc: "The baby occupies most of the womb space. Kick counts are strong and frequent." },
    36: { name: "Papaya", icon: "🥭", size: "47.4 cm", weight: "2.6 kg", desc: "Fully formed organs. Baby is dropping into the pelvic cavity to prepare for labor." },
    40: { name: "Watermelon", icon: "🍉", size: "51.2 cm", weight: "3.4 kg", desc: "Full term! Your baby is ready to meet the world. Deliveries can happen any day now." },
  };

  const keys = Object.keys(milestones).map(Number).sort((a, b) => a - b);
  let matchedKey = keys[0];
  for (const k of keys) {
    if (week >= k) matchedKey = k;
  }
  return { week: matchedKey, ...milestones[matchedKey] };
};

export default function MamaDashboard() {
  const [gestationWeeks, setGestationWeeks] = useState(12);
  const [gestationDays, setGestationDays] = useState(3);
  const [riskLevel, setRiskLevel] = useState("low");
  const [selectedTimelineWeek, setSelectedTimelineWeek] = useState(12);
  const [partnerCode, setPartnerCode] = useState("NARA-401-290");
  const [partnerSynced, setPartnerSynced] = useState(false);

  // Vitals State & Modal
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [weight, setWeight] = useState("68.4");
  const [bpSystolic, setBpSystolic] = useState("120");
  const [bpDiastolic, setBpDiastolic] = useState("80");
  const [kicks, setKicks] = useState("12");
  const [vitalsLoggedToday, setVitalsLoggedToday] = useState(false);

  // Medications State
  const [meds, setMeds] = useState([
    { id: "iron", name: "Iron (60mg)", taken: false, time: "Morning" },
    { id: "folic", name: "Folic Acid (400mcg)", taken: true, time: "Morning" },
    { id: "calcium", name: "Calcium (500mg)", taken: false, time: "Evening" },
  ]);

  // Load from local storage
  useEffect(() => {
    const dataStr = localStorage.getItem("mama_gestation_data");
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        setGestationWeeks(data.gestationWeeks || 12);
        setGestationDays(data.gestationDays || 0);
        setSelectedTimelineWeek(data.gestationWeeks || 12);
        setRiskLevel(data.riskLevel || "low");
        setPartnerCode(data.partnerCode || "NARA-401-290");
        setPartnerSynced(data.partnerSynced || false);
      } catch (e) {
        console.error("Error loading gestation data");
      }
    }
  }, []);

  const handleMedToggle = (id: string) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const handleVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVitalsLoggedToday(true);
    setIsVitalsModalOpen(false);

    // Caching in local storage
    const logs = JSON.parse(localStorage.getItem("mama_vitals_logs") || "[]");
    logs.push({
      date: new Date().toLocaleDateString(),
      weight,
      bp: `${bpSystolic}/${bpDiastolic}`,
      kicks: gestationWeeks >= 24 ? kicks : null,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("mama_vitals_logs", JSON.stringify(logs));
  };

  const activeMilestone = getFruitMilestone(selectedTimelineWeek);
  const isCurrentWeek = selectedTimelineWeek === gestationWeeks;

  // Adherence calculation
  const takenMedsCount = meds.filter(m => m.taken).length;
  const adherencePercent = Math.round((takenMedsCount / meds.length) * 100);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* LEFT/CENTER PANELS (9 COLS) */}
      <main className="lg:col-span-9 flex flex-col gap-3">
        
        {/* GREETING ROW (Matches Provider Dashboard layout) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-display">Hello, Tyra</h2>
            <p className="text-slate-500 font-medium mt-1">
              You are in Week {gestationWeeks} ({gestationDays} days) of your pregnancy timeline.
            </p>
          </div>

          {/* Quick Stats Action */}
          <div className="flex items-center gap-2">
            {riskLevel === "high" && (
              <span className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-700 px-3.5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xs">
                <IconAlertTriangle className="w-3.5 h-3.5" />
                High Risk Alerts
              </span>
            )}
            <span className="bg-[#E8F3CE] border border-[#CDE0A4] text-[#608216] px-3.5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xs">
              Trimester {gestationWeeks < 13 ? "1" : gestationWeeks < 27 ? "2" : "3"}
            </span>
          </div>
        </motion.div>

        {/* SWIPEABLE PREGNANCY TIMELINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pregnancy Timeline Explorer</span>
            <span className="text-xs text-[#608216] font-bold">Current: Week {gestationWeeks}</span>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto py-3.5 scrollbar-none snap-x">
            {Array.from({ length: 40 }, (_, i) => i + 1).map((w) => {
              const isWeekActive = selectedTimelineWeek === w;
              const isCompleted = w < gestationWeeks;
              const isCurrent = w === gestationWeeks;
              
              return (
                <button
                  key={w}
                  onClick={() => setSelectedTimelineWeek(w)}
                  className={`snap-center flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
                    isWeekActive 
                      ? "bg-[#1E293B] text-white font-extrabold shadow-md scale-105"
                      : isCurrent
                      ? "bg-[#D4F475] text-[#608216] border border-[#CDE0A4] font-black"
                      : isCompleted
                      ? "bg-[#E8F3CE]/60 text-[#608216]/80 font-bold"
                      : "bg-slate-50 border border-slate-200/50 text-slate-400 font-semibold"
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-tighter opacity-60 leading-none">Wk</span>
                  <span className="text-sm leading-none mt-0.5">{w}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* VITALS CARDS GRID (Matches Provider Dashboard Cards 1-to-1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Card 1: Fetal Heart Rate (Like Heart Rate Card) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Fetal Heart Rate</span>
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-[0_2px_8px_rgba(59,130,246,0.1)]">
                  <IconHeart className="w-4 h-4 fill-current" />
                </div>
              </div>
              
              {/* Wave Graph SVG (Matching provider dashboard) */}
              <div className="h-16 w-full flex items-center mb-2">
                <svg className="w-full h-full" viewBox="0 0 160 50">
                  <defs>
                    <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,25 C10,25 15,10 20,10 C25,10 30,35 35,35 C40,35 45,5 50,5 C55,5 60,40 65,40 C70,40 75,20 80,20 C85,20 90,30 95,30 C100,30 105,15 110,15 C115,15 120,28 125,28 C130,28 135,25 140,25 C150,25 155,25 160,25"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0,25 C10,25 15,10 20,10 C25,10 30,35 35,35 C40,35 45,5 50,5 C55,5 60,40 65,40 C70,40 75,20 80,20 C85,20 90,30 95,30 C100,30 105,15 110,15 C115,15 120,28 125,28 C130,28 135,25 140,25 C150,25 155,25 160,25 L160,50 L0,50 Z"
                    fill="url(#heartGradient)"
                  />
                </svg>
              </div>
              
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-extrabold text-slate-800 text-display">145</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">BPM</span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 2: Maternal Weight (Like Blood Cell Card) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.23 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Weight</span>
                <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shadow-[0_2px_8px_rgba(20,184,166,0.1)]">
                  <IconScale className="w-4 h-4" />
                </div>
              </div>

              {/* Vertical Bar Chart SVG (Matching provider dashboard) */}
              <div className="h-16 w-full flex items-end justify-between px-2 gap-1 mb-2">
                {[45, 48, 50, 52, 53, 56, 59, 61, 65, 68].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="flex-1 bg-[#70A4A2] rounded-full"
                  />
                ))}
              </div>

              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-extrabold text-slate-800 text-display">{weight}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">KG</span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 3: Adherence (Like Water Card) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pill Adherence</span>
                <div className="w-9 h-9 rounded-full bg-[#F5F8EB] flex items-center justify-center text-[#9CC031] shadow-[0_2px_8px_rgba(156,192,49,0.1)]">
                  <IconPill className="w-4 h-4" />
                </div>
              </div>

              {/* Horizontal progress bar (Matching provider dashboard) */}
              <div className="h-16 w-full flex flex-col justify-center gap-2 mb-2">
                <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${adherencePercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[#C5EC59] rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-1.5 mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-800 text-display">{adherencePercent}%</span>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  {takenMedsCount}/{meds.length} Taken
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 4: Log Vitals dashed action card (Like Add Widget Card) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.33 }}
            className="h-full"
          >
            <AhnaraCard
              variant="interactive"
              padding="none"
              onClick={() => setIsVitalsModalOpen(true)}
              className="h-full bg-slate-50/50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-5 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all duration-300 cursor-pointer min-h-[148px]"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 mb-2">
                <IconPlus className="w-5 h-5 text-[#0089C1]" />
              </div>
              <span className="text-sm font-bold tracking-tight text-[#0089C1]">Log Vitals</span>
              <span className="text-[10px] text-slate-400 font-semibold mt-0.5">BP, Weight & Kicks</span>
            </AhnaraCard>
          </motion.div>

        </div>

        {/* BOTTOM ROW: Supplements & Fruit illustration (Similar to provider's Appointments card split layout) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Left Side: Meds checklist inside a green-yellow accent card (5 COLS - like provider appointments card) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-5 flex flex-col"
          >
            <AhnaraCard variant="flat" padding="none" className="w-full h-full bg-[#E8F3CE] border-none p-6 flex flex-col gap-4 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between border-b border-[#C7DB9C] pb-3">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider">Medication Compliance</span>
                  <h3 className="font-extrabold text-[#0D090C] text-lg tracking-tight text-display">Supplements</h3>
                </div>
                <IconPill className="w-5 h-5 text-[#608216]" />
              </div>

              <div className="flex flex-col gap-2 mt-1">
                {meds.map((med) => (
                  <button
                    key={med.id}
                    onClick={() => handleMedToggle(med.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      med.taken
                        ? "bg-white border-[#CDE0A4] text-[#608216] shadow-xs"
                        : "bg-[#E8F3CE]/45 border-[#C7DB9C]/40 hover:bg-white/20 text-[#608216]/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center transition-all ${
                        med.taken
                          ? "bg-[#8BB436] text-white"
                          : "border border-[#C7DB9C] bg-white/50"
                      }`}>
                        {med.taken && <IconCheck className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-black leading-none">{med.name}</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">{med.time}</span>
                  </button>
                ))}
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Right Side: Growth Milestone Fruit (7 COLS - Two-Tone Card) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="md:col-span-7 flex flex-col"
          >
            <AhnaraCard variant="flat" padding="none" className="w-full h-full bg-white border border-slate-100 flex flex-col overflow-hidden shadow-xs">
              
              {/* Split layout: Top half light green */}
              <div className="p-5 flex items-center gap-5 bg-[#E8F3CE]/30 border-b border-[#C7DB9C]/20">
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#C7DB9C]/40 flex items-center justify-center text-4xl shadow-xs">
                  {activeMilestone.icon}
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-[#608216] uppercase tracking-wider">
                      Gestation Week {selectedTimelineWeek} {isCurrentWeek && "(Active)"}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-[#0D090C] text-display leading-snug mt-0.5">
                    Size of a <span className="text-[#608216]">{activeMilestone.name}</span>
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-bold mt-1">
                    <span>Length: {activeMilestone.size}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>Weight: {activeMilestone.weight}</span>
                  </div>
                </div>
              </div>

              {/* Bottom half description */}
              <div className="p-5 flex-1 bg-white text-left flex flex-col justify-center">
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  {activeMilestone.desc}
                </p>
              </div>

            </AhnaraCard>
          </motion.div>

        </div>

      </main>

      {/* RIGHT SIDEBAR (3 COLS) - Matches Provider Sidebar */}
      <aside className="lg:col-span-3 flex flex-col gap-3">
        
        {/* Desktop-only spacer to align with the greeting filters row */}
        <div className="hidden lg:block h-[68px]" />

        {/* Clinic Appointments Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IconCalendarEvent className="w-5 h-5 text-[#009EDA]" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Clinic Schedule</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="flex flex-col gap-3">
              {/* Event card */}
              <div className="flex items-start gap-3 bg-slate-50/50 border border-slate-200/60 p-3.5 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#E8F3CE] border border-[#CDE0A4] flex flex-col items-center justify-center text-[#608216] font-black flex-shrink-0">
                  <span className="text-[9px] uppercase font-bold leading-none">Jul</span>
                  <span className="text-xs leading-none mt-0.5">12</span>
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[9px] text-[#009EDA] font-black uppercase tracking-wider block">WHO Visit 3</span>
                  <h4 className="text-xs font-black text-slate-800 mt-0.5">Urine Protein &amp; Growth</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Midwife Tyra • Health Center A</p>
                </div>
              </div>

              {/* Sync Status Info */}
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl text-[10px] text-emerald-800 font-bold">
                <IconCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Synced to Hospital FHIR spine</span>
              </div>
            </div>
          </AhnaraCard>
        </motion.div>

        {/* NARA Link Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IconQrcode className="w-5 h-5 text-[#0089C1]" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">NARA Partner Sync</h3>
              </div>
              <span className={`w-2 h-2 rounded-full ${partnerSynced ? "bg-emerald-500" : "bg-orange-400 animate-pulse"}`} />
            </div>

            <div className="flex flex-col gap-3 text-center">
              <div className="font-mono font-black text-base text-slate-800 bg-slate-50 border border-slate-200/80 rounded-xl py-2 shadow-xs">
                {partnerCode}
              </div>
              
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed text-left">
                {partnerSynced 
                  ? "✓ Partner active. Vitals updates and Emergency SOS alerts are shared with your partner companion."
                  : "⚠ Unlinked. Partner won't receive emergency GPS dispatch or vitals updates automatically."
                }
              </p>
            </div>
          </AhnaraCard>
        </motion.div>

      </aside>

      {/* VITALS LOG MODAL (Interactive dashed card modal) */}
      <AhnaraModal
        isOpen={isVitalsModalOpen}
        onClose={() => setIsVitalsModalOpen(false)}
        title="Log Maternal Vitals"
      >
        <form onSubmit={handleVitalsSubmit} className="flex flex-col gap-4 p-4 text-left">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="e.g. 68.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:bg-white focus:border-slate-300 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Systolic BP (mmHg)</label>
              <input
                type="number"
                required
                placeholder="e.g. 120"
                value={bpSystolic}
                onChange={(e) => setBpSystolic(e.target.value)}
                className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-center outline-none focus:bg-white focus:border-slate-300 font-semibold"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Diastolic BP (mmHg)</label>
              <input
                type="number"
                required
                placeholder="e.g. 80"
                value={bpDiastolic}
                onChange={(e) => setBpDiastolic(e.target.value)}
                className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-center outline-none focus:bg-white focus:border-slate-300 font-semibold"
              />
            </div>
          </div>

          {gestationWeeks >= 24 && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Fetal Kick Count (Kicks / 2 Hours)
              </label>
              <input
                type="number"
                required
                placeholder="WHO recommends 10+ kicks"
                value={kicks}
                onChange={(e) => setKicks(e.target.value)}
                className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:bg-white focus:border-slate-300 font-semibold"
              />
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <AhnaraButton
              variant="outline"
              type="button"
              onClick={() => setIsVitalsModalOpen(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </AhnaraButton>
            <AhnaraButton
              variant="primary"
              type="submit"
              className="flex-1 bg-[#0089C1] hover:bg-[#0089C1]/90 border-none text-white rounded-xl"
            >
              Submit Logs
            </AhnaraButton>
          </div>
        </form>
      </AhnaraModal>

    </div>
  );
}
