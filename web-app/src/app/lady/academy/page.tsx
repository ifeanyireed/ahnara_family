"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconBook, 
  IconPlayerPlay, 
  IconPlayerPause, 
  IconVolume,
  IconVolume2,
  IconClock,
  IconAward,
  IconArrowLeft,
  IconArrowRight
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function LadyAcademyPage() {
  const [activeTab, setActiveTab] = useState<"workouts" | "nutrition">("workouts");
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [activeCourseIndex, setActiveCourseIndex] = useState<number>(0);

  const workouts = [
    { title: "Follicular Phase Strength", desc: "Maximize your estrogen spike with high-intensity strength training and compound lifts.", duration: "25 min", level: "Intermediate" },
    { title: "Luteal Phase Yoga", desc: "Gentle flow and deep stretching to calm the nervous system during progesterone peaks.", duration: "18 min", level: "Beginner" },
    { title: "Menstrual Restorative Stretching", desc: "Alleviate lower back tightness and uterine cramping with restorative posture exercises.", duration: "12 min", level: "All levels" }
  ];

  const lectures = [
    { title: "Foods That Alleviate Cramps", desc: "Learn how magnesium, zinc, and omega-3 fatty acids reduce uterine prostaglandin secretion.", duration: "6 min audio", speaker: "Dr. Alanna Patel" },
    { title: "Menopause Bone Density Loss", desc: "Estrogen declines trigger bone resorption. Understand the clinical roles of Calcium and Vitamin D3.", duration: "9 min audio", speaker: "Prof. Chloe Vance" }
  ];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Academy Catalog (8 cols) */}
      <main className="lg:col-span-8 flex flex-col gap-3">
        
        {/* Tab Selector Header */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <IconBook className="w-6 h-6 text-rose-500" />
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Lady Academy</h3>
          </div>

          <div className="flex items-center gap-1 bg-[#DDEEF3] p-1 rounded-xl border border-slate-350/20">
            {[
              { id: "workouts", label: "Cycle Workouts" },
              { id: "nutrition", label: "Hormonal Nutrition" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-colors border-none ${
                  activeTab === tab.id
                    ? "bg-rose-500 text-white"
                    : "text-slate-600 hover:text-slate-900 bg-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </AhnaraCard>

        {/* Tab content switcher */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeTab === "workouts" ? (
            workouts.map((w, idx) => (
              <AhnaraCard key={idx} variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs relative">
                <div>
                  <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">{w.level}</span>
                  <h4 className="font-extrabold text-base text-slate-800 tracking-tight text-display mt-0.5">{w.title}</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-2 leading-normal">{w.desc}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <IconClock className="w-3.5 h-3.5" />
                    {w.duration}
                  </span>
                  
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] uppercase rounded-lg transition-all flex items-center gap-1 border-none">
                    <IconPlayerPlay className="w-3 h-3" />
                    Watch Workout
                  </button>
                </div>
              </AhnaraCard>
            ))
          ) : (
            lectures.map((lec, idx) => (
              <AhnaraCard key={idx} variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs relative">
                <div>
                  <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">{lec.speaker}</span>
                  <h4 className="font-extrabold text-base text-slate-800 tracking-tight text-display mt-0.5">{lec.title}</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-2 leading-normal">{lec.desc}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <IconVolume className="w-3.5 h-3.5" />
                    {lec.duration}
                  </span>
                  
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] uppercase rounded-lg transition-all flex items-center gap-1 border-none">
                    <IconPlayerPlay className="w-3 h-3" />
                    Play Lecture
                  </button>
                </div>
              </AhnaraCard>
            ))
          )}
        </div>

      </main>

      {/* Featured Audio Player (4 cols) */}
      <aside className="lg:col-span-4 flex flex-col gap-3">
        
        {/* Audio Lecture Player */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Featured Audio Lecture</span>

          <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col gap-2 min-h-36 justify-between">
            <div>
              <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Active Lecture</span>
              <h4 className="font-extrabold text-sm text-slate-800 tracking-tight text-display mt-0.5">
                {lectures[activeCourseIndex].title}
              </h4>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Speaker: {lectures[activeCourseIndex].speaker}</p>
            </div>

            {/* Audio controls */}
            <div className="flex items-center justify-between border-t border-slate-200/50 pt-3 mt-4">
              <button
                type="button"
                disabled={activeCourseIndex === 0}
                onClick={() => {
                  setActiveCourseIndex(prev => prev - 1);
                  setAudioPlaying(false);
                }}
                className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg disabled:opacity-40 transition-colors"
              >
                <IconArrowLeft className="w-4 h-4 text-slate-600" />
              </button>

              <button
                type="button"
                onClick={() => setAudioPlaying(!audioPlaying)}
                className="p-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-all border-none"
              >
                {audioPlaying ? <IconPlayerPause className="w-5 h-5" /> : <IconPlayerPlay className="w-5 h-5" />}
              </button>

              <button
                type="button"
                disabled={activeCourseIndex === lectures.length - 1}
                onClick={() => {
                  setActiveCourseIndex(prev => prev + 1);
                  setAudioPlaying(false);
                }}
                className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg disabled:opacity-40 transition-colors"
              >
                <IconArrowRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          {audioPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-rose-50/50 border border-rose-100 text-rose-800 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5"
            >
              <IconVolume2 className="w-4.5 h-4.5 text-rose-500 animate-bounce" />
              <span>Playing audio stream...</span>
            </motion.div>
          )}
        </AhnaraCard>

        {/* Metabolic insights */}
        <AhnaraCard variant="flat" className="bg-rose-50/30 border border-rose-100 p-5 flex flex-col gap-2.5 text-rose-950">
          <div className="flex items-center gap-1.5">
            <IconAward className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <h4 className="text-xs font-black uppercase tracking-wider">Metabolic Coaching</h4>
          </div>
          <p className="text-[11px] font-bold leading-normal text-rose-800">
            Hormonal balances drive metabolic health. Decreases in estrogen during menopause slow down base metabolic rates and affect bone mineralization. Follow cycle-synced nutrition lessons to align calcium, healthy fats, and proteins with estrogen surges.
          </p>
        </AhnaraCard>

      </aside>

    </div>
  );
}
