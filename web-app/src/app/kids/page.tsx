"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  IconScale,
  IconActivity,
  IconPlus,
  IconCheck,
  IconAlertTriangle,
  IconCalendarEvent,
  IconPill,
  IconClock,
  IconMoodSmile,
  IconQrcode,
  IconInfoCircle,
  IconAlertOctagon
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraModal } from "@/components/ahnara/AhnaraModal";

// Helper to calculate age strings
const calculateAgeDetails = (dobString: string) => {
  if (!dobString) return { text: "3 months, 12 days", totalDays: 104, months: 3, days: 12 };
  const dob = new Date(dobString);
  const today = new Date();
  const diffTime = today.getTime() - dob.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { text: "Newborn", totalDays: 0, months: 0, days: 0 };
  
  const months = Math.floor(diffDays / 30.43);
  const days = Math.floor(diffDays % 30.43);
  
  return {
    text: months > 0 ? `${months} months, ${days} days` : `${diffDays} days`,
    totalDays: diffDays,
    months,
    days
  };
};

// Developmental stage helper based on month
const getDevelopmentalHighlights = (month: number) => {
  const milestones: Record<number, { title: string; icon: string; focus: string; desc: string }> = {
    0: { title: "Newborn Reflexes", icon: "👶", focus: "Sucking & Grasping", desc: "Baby responds to sights and sounds, and focuses on faces up to 12 inches away." },
    1: { title: "Visual Tracking", icon: "👀", focus: "Stretching & Cooing", desc: "Baby starts following moving objects with eyes and makes soft cooing sounds." },
    2: { title: "Social Smiles", icon: "😊", focus: "Head Control", desc: "Baby smiles socially at caregivers, lifts head briefly when lying on stomach." },
    3: { title: "Steady Head Control", icon: "🦁", focus: "Pushing Up", desc: "Baby supports head steadily, pushes up on elbows during tummy time, starts reaching." },
    4: { title: "Grasping Objects", icon: "✊", focus: "Rattle Play", desc: "Baby holds and shakes rattles, rolls from tummy to back, laughs out loud." },
    6: { title: "Sitting Upright", icon: "🧸", focus: "Complementary Feeds", desc: "Baby sits with support, transfers objects hand-to-hand, begins tasting solid foods." },
    9: { title: "Crawling & Exploring", icon: "👣", focus: "Pincer Grasp", desc: "Baby crawls, pulls to stand, understands simple words like 'no', uses thumb & finger." },
    12: { title: "First Steps", icon: "✨", focus: "First Words", desc: "Baby walks holding onto furniture, says single words, waves goodbye." },
    18: { title: "Active Walking", icon: "🏃", focus: "Vocabulary Growth", desc: "Walks independently, climbs stairs, points to show what they want, speaks 10+ words." },
    24: { title: "Sentence Building", icon: "🎨", focus: "Imitative Play", desc: "Runs smoothly, builds towers of blocks, says simple 2-word sentences, copies others." }
  };

  const keys = Object.keys(milestones).map(Number).sort((a, b) => a - b);
  let matchedKey = keys[0];
  for (const k of keys) {
    if (month >= k) matchedKey = k;
  }
  return milestones[matchedKey];
};

export default function KidsDashboard() {
  const router = useRouter();
  const [childName, setChildName] = useState("Aria");
  const [dob, setDob] = useState("");
  const [biologicalSex, setBiologicalSex] = useState("Female");
  const [riskLevel, setRiskLevel] = useState("low");
  const [partnerCode, setPartnerCode] = useState("NARA-KIDS-401-290");
  const [partnerSynced, setPartnerSynced] = useState(false);
  const [selectedAgeMonth, setSelectedAgeMonth] = useState(3);

  // Vitals State & Modal
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [temperature, setTemperature] = useState("36.8"); // in C
  const [sleepHours, setSleepHours] = useState("14.5"); // in hours
  const [feedCount, setFeedCount] = useState("6"); // feeds logged
  const [diaperCount, setDiaperCount] = useState("5"); // wet diapers
  const [vitalsLoggedToday, setVitalsLoggedToday] = useState(false);

  // Daily Care Checklist State
  const [careChecklist, setCareChecklist] = useState([
    { id: "vitd", name: "Vitamin D Drops (400 IU)", done: true, time: "Morning" },
    { id: "tummy", name: "Tummy Time (20 mins)", done: false, time: "Afternoon" },
    { id: "vacc", name: "Skin inspection & Hygiene", done: true, time: "Morning" },
  ]);

  // Profiles simulation
  const [profiles, setProfiles] = useState<any[]>([]);

  // Load from local storage
  useEffect(() => {
    const dataStr = localStorage.getItem("kids_profile_data");
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        setChildName(data.childName || "Aria");
        setDob(data.dob || "");
        setBiologicalSex(data.biologicalSex || "Female");
        setRiskLevel(data.riskLevel || "low");
        setPartnerCode(data.partnerCode || "NARA-KIDS-401-290");
        setPartnerSynced(data.partnerSynced || false);

        // Compute age in months to highlight on timeline
        const ageDetails = calculateAgeDetails(data.dob);
        setSelectedAgeMonth(Math.min(ageDetails.months, 24));
        
        setProfiles([
          { name: data.childName || "Aria", age: ageDetails.text, sex: data.biologicalSex }
        ]);
      } catch (e) {
        console.error("Error loading kids profile data");
      }
    } else {
      setProfiles([
        { name: "Aria", age: "3 months, 12 days", sex: "Female" }
      ]);
    }
  }, []);

  const handleCareToggle = (id: string) => {
    setCareChecklist(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c));
  };

  const handleVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVitalsLoggedToday(true);
    setIsVitalsModalOpen(false);

    // Caching in local storage
    const logs = JSON.parse(localStorage.getItem("kids_vitals_logs") || "[]");
    logs.push({
      date: new Date().toLocaleDateString(),
      temperature,
      sleepHours,
      feedCount,
      diaperCount,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("kids_vitals_logs", JSON.stringify(logs));
  };

  const ageDetails = calculateAgeDetails(dob);
  const activeMilestone = getDevelopmentalHighlights(selectedAgeMonth);
  const isCurrentMonth = selectedAgeMonth === ageDetails.months;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* LEFT/CENTER PANELS (9 COLS) */}
      <main className="lg:col-span-9 flex flex-col gap-3">
        
        {/* GREETING ROW & PROFILE SWITCHER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="text-left">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight text-display">
              Hello, Caregiver
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              Active profile: <span className="font-bold text-[#0089C1]">{childName}</span> (Age: {ageDetails.text})
            </p>
          </div>

          {/* Quick Stats Action & Risk Level Badge */}
          <div className="flex items-center gap-2">
            {riskLevel === "high" && (
              <span className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-700 px-3.5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xs">
                <IconAlertTriangle className="w-3.5 h-3.5" />
                Pediatric Risk Alert
              </span>
            )}
            <span className="bg-emerald-50 border border-emerald-250 text-emerald-700 px-3.5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xs">
              EPI Profile Synced
            </span>
          </div>
        </motion.div>

        {/* MULTI-CHILD PROFILE SWITCHER */}
        <div className="flex items-center gap-2 bg-white border border-slate-200/50 p-2.5 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider mr-2">Profiles:</span>
          {profiles.map((p, idx) => (
            <div 
              key={idx} 
              className="bg-slate-50 border border-[#0089C1]/20 rounded-xl px-4 py-2 flex items-center gap-2.5 shadow-xs"
            >
              <div className="w-6 h-6 rounded-full bg-[#E6F5FA] text-[#0089C1] flex items-center justify-center font-bold text-xs">
                {p.name.charAt(0)}
              </div>
              <div className="text-left text-xs leading-none">
                <span className="font-extrabold block text-slate-800">{p.name}</span>
                <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase tracking-tight">{p.age}</span>
              </div>
            </div>
          ))}
          <button
            onClick={() => router.push("/onboarding")}
            className="border-2 border-dashed border-slate-350 text-slate-400 hover:text-slate-655 hover:border-slate-400 transition-all rounded-xl py-2 px-3 text-xs font-bold flex items-center gap-1 bg-white"
          >
            <IconPlus className="w-3.5 h-3.5" /> Onboard New
          </button>
        </div>

        {/* HORIZONTAL TIMELINE TRACKER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-xs flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Developmental Age Timeline</span>
            <span className="text-xs text-[#0089C1] font-bold">Active child age: {ageDetails.months} Months</span>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto py-3.5 scrollbar-none snap-x">
            {[0, 1, 2, 3, 4, 6, 9, 12, 18, 24].map((m) => {
              const isMonthActive = selectedAgeMonth === m;
              const isCompleted = m < ageDetails.months;
              const isCurrent = m === ageDetails.months;
              
              return (
                <button
                  key={m}
                  onClick={() => setSelectedAgeMonth(m)}
                  className={`snap-center flex-shrink-0 w-16 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
                    isMonthActive 
                      ? "bg-[#1E293B] text-white font-extrabold shadow-md scale-105"
                      : isCurrent
                      ? "bg-[#E8F3CE] text-[#608216] border border-[#608216]/20 font-black"
                      : isCompleted
                      ? "bg-[#E8F3CE]/40 text-[#608216]/80 font-bold"
                      : "bg-white border border-slate-200 text-slate-400 font-semibold"
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-tighter opacity-60 leading-none">Month</span>
                  <span className="text-sm leading-none mt-0.5 font-bold">{m}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* VITALS CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Card 1: Temperature */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-200/40 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Body Temp</span>
                <div className="w-9 h-9 rounded-full bg-[#E8F6FA] flex items-center justify-center text-[#0089C1] shadow-xs">
                  <IconActivity className="w-4.5 h-4.5" />
                </div>
              </div>
              
              {/* Temperature Graph SVG */}
              <div className="h-16 w-full flex items-center mb-2">
                <svg className="w-full h-full" viewBox="0 0 160 50">
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0089C1" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#0089C1" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,25 C20,25 30,22 40,24 C50,26 60,30 70,25 C80,20 90,27 100,26 C110,25 120,24 135,24 C145,24 150,25 160,25"
                    fill="none"
                    stroke="#0089C1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0,25 C20,25 30,22 40,24 C50,26 60,30 70,25 C80,20 90,27 100,26 C110,25 120,24 135,24 C145,24 150,25 160,25 L160,50 L0,50 Z"
                    fill="url(#tempGradient)"
                  />
                </svg>
              </div>
              
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-extrabold text-slate-800 text-display">{temperature}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">°C</span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 2: Sleep Duration */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.23 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-200/40 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Sleep Duration</span>
                <div className="w-9 h-9 rounded-full bg-[#E8F6FA] flex items-center justify-center text-[#0089C1] shadow-xs">
                  <IconClock className="w-4.5 h-4.5" />
                </div>
              </div>

              {/* Sleep Bar Chart SVG */}
              <div className="h-16 w-full flex items-end justify-between px-2 gap-1 mb-2">
                {[70, 72, 68, 75, 71, 73, 76, 74, 75, 78].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="flex-1 bg-[#0089C1] rounded-full"
                  />
                ))}
              </div>

              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-extrabold text-slate-800 text-display">{sleepHours}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">HRS / DAY</span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 3: Daily Feeds */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-200/40 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Daily Feeds</span>
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-xs">
                  <IconMoodSmile className="w-4.5 h-4.5" />
                </div>
              </div>

              {/* Daily Feeds Circle progress */}
              <div className="h-16 w-full flex flex-col justify-center gap-2 mb-2">
                <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(Number(feedCount) / 8) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[#8BB436] rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-1.5 mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-800 text-display">{feedCount}</span>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Target: 8 Feeds
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 4: Daily Log Vitals */}
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
              className="h-full bg-white border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-5 text-slate-400 hover:text-slate-700 hover:border-slate-400 transition-all duration-300 cursor-pointer min-h-[148px]"
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 mb-2">
                <IconPlus className="w-5 h-5 text-[#0089C1]" />
              </div>
              <span className="text-sm font-bold tracking-tight text-[#0089C1]">Log Child Vitals</span>
              <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Temp, Sleep, Feeds &amp; Diapers</span>
            </AhnaraCard>
          </motion.div>

        </div>

        {/* BOTTOM ROW: Compliance Checklist & Milestones */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Left Side: Daily Care Checklist (5 COLS) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-5 flex flex-col"
          >
            <AhnaraCard variant="flat" padding="none" className="w-full h-full bg-[#E8F3CE] border-none p-6 flex flex-col gap-4 relative overflow-hidden shadow-sm text-[#608216]">
              <div className="flex items-center justify-between border-b border-[#CDE0A4] pb-3">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider">Compliance</span>
                  <h3 className="font-extrabold text-[#0D090C] text-lg tracking-tight text-display">Daily Care Checklist</h3>
                </div>
                <IconPill className="w-5 h-5 text-[#608216]" />
              </div>

              <div className="flex flex-col gap-2 mt-1">
                {careChecklist.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCareToggle(c.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      c.done
                        ? "bg-white border-[#8BB436]/20 text-[#608216] shadow-xs"
                        : "bg-[#E8F3CE]/45 border-[#CDE0A4]/40 hover:bg-white/20 text-[#608216]/85"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center transition-all ${
                        c.done
                          ? "bg-[#8BB436] text-white"
                          : "border border-[#608216]/40 bg-white/50"
                      }`}>
                        {c.done && <IconCheck className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-black leading-none">{c.name}</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">{c.time}</span>
                  </button>
                ))}
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Right Side: Developmental Milestone highlight (7 COLS) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="md:col-span-7 flex flex-col"
          >
            <AhnaraCard variant="flat" padding="none" className="w-full h-full bg-white border border-slate-200/50 flex flex-col overflow-hidden shadow-xs">
              
              {/* Split layout: Top half light blue */}
              <div className="p-5 flex items-center gap-5 bg-[#E8F6FA]/50 border-b border-sky-100">
                <div className="w-16 h-16 rounded-2xl bg-white border border-sky-200/20 flex items-center justify-center text-4xl shadow-xs">
                  {activeMilestone.icon}
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-[#0089C1] uppercase tracking-wider">
                      Month {selectedAgeMonth} Milestone {isCurrentMonth && "(Active)"}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-800 text-display leading-snug mt-0.5">
                    {activeMilestone.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-bold mt-1">
                    <span>Clinical Focus: <b className="text-slate-700">{activeMilestone.focus}</b></span>
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

      {/* RIGHT SIDEBAR (3 COLS) */}
      <aside className="lg:col-span-3 flex flex-col gap-3">
        
        {/* Desktop-only spacer to align with the greeting filters row */}
        <div className="hidden lg:block h-[68px]" />

        {/* Immunization Alert box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-200/50 p-5 flex flex-col gap-4 shadow-xs text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IconCalendarEvent className="w-5 h-5 text-[#C88A3A]" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Immunization Due</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </div>

            <div className="flex flex-col gap-3">
              {/* Event card */}
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-250 p-3.5 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] border border-amber-200 flex flex-col items-center justify-center text-[#C88A3A] font-black flex-shrink-0">
                  <span className="text-[9px] uppercase font-bold leading-none">Days</span>
                  <span className="text-sm leading-none mt-0.5">5</span>
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[9px] text-[#C88A3A] font-black uppercase tracking-wider block">Dose 2 (10 Wks)</span>
                  <h4 className="text-xs font-black text-slate-800 mt-0.5">Rotavirus 2 due</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Nurse Priscilla • Health Center A</p>
                </div>
              </div>

              {/* Sync Status Info */}
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl text-[10px] text-emerald-800 font-bold">
                <IconCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Synced to EHR Immunization spine</span>
              </div>
            </div>
          </AhnaraCard>
        </motion.div>

        {/* Dual Caregiver Sync QR Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-200/50 p-5 flex flex-col gap-4 shadow-xs text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IconQrcode className="w-5 h-5 text-[#0089C1]" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Caregiver Sync QR</h3>
              </div>
              <span className={`w-2 h-2 rounded-full ${partnerSynced ? "bg-emerald-500" : "bg-orange-400 animate-pulse"}`} />
            </div>

            <div className="flex flex-col gap-3 text-center">
              <div className="font-mono font-black text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl py-2 shadow-xs">
                {partnerCode}
              </div>
              
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed text-left">
                {partnerSynced 
                  ? "✓ Dual caregivers linked. Both parents sync sleep, diaper, feeding logs, and receive emergency triage notifications."
                  : "⚠ Caregiver unlinked. Share code or scan QR from mother's antenatal app to link caregiver details."
                }
              </p>
            </div>
          </AhnaraCard>
        </motion.div>

      </aside>

      {/* VITALS LOG MODAL */}
      <AhnaraModal
        isOpen={isVitalsModalOpen}
        onClose={() => setIsVitalsModalOpen(false)}
        title="Log Child Vitals"
      >
        <form onSubmit={handleVitalsSubmit} className="flex flex-col gap-4 p-4 text-left">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Body Temp (°C)</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="e.g. 36.8"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:bg-white font-semibold text-slate-800"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sleep (hrs/day)</label>
              <input
                type="number"
                step="0.5"
                required
                placeholder="e.g. 14.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:bg-white font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Feedings Logged</label>
              <input
                type="number"
                required
                placeholder="e.g. 6"
                value={feedCount}
                onChange={(e) => setFeedCount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-center outline-none focus:bg-white font-semibold text-slate-800"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Wet Diapers Today</label>
              <input
                type="number"
                required
                placeholder="e.g. 5"
                value={diaperCount}
                onChange={(e) => setDiaperCount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-center outline-none focus:bg-white font-semibold text-slate-800"
              />
            </div>
          </div>

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
              className="flex-1 bg-[#1E293B] hover:bg-slate-800 border-none text-white rounded-xl"
            >
              Submit Logs
            </AhnaraButton>
          </div>
        </form>
      </AhnaraModal>

    </div>
  );
}
