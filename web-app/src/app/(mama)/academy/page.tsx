"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconSearch,
  IconBookmark,
  IconBookmarkFilled,
  IconAward,
  IconCircleCheck,
  IconCircleX,
  IconPlayerPlay,
  IconVolume,
  IconHeart,
  IconCheck,
  IconAlertOctagon,
  IconClock,
  IconBook
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

interface Lesson {
  id: string;
  title: string;
  category: "Nutrition" | "Exercise" | "Danger Signs" | "Labor Prep";
  readTime: string;
  trimester: number;
  desc: string;
  isAudio?: boolean;
  isCritical?: boolean;
}

export default function AcademyPage() {
  const [gestationWeeks, setGestationWeeks] = useState(12);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [savedLessons, setSavedLessons] = useState<string[]>([]);
  
  // Quiz states
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(120);

  const lessons: Lesson[] = [
    {
      id: "1",
      title: "Managing Morning Sickness & Early Nutrition",
      category: "Nutrition",
      readTime: "3 min read",
      trimester: 1,
      desc: "Learn effective ways to manage nausea in early pregnancy and key foods rich in Folic acid and Iron.",
      isAudio: true
    },
    {
      // Critical lesson highlighted
      id: "2",
      title: "Recognizing Pre-eclampsia Warning Signs",
      category: "Danger Signs",
      readTime: "4 min read",
      trimester: 2,
      desc: "Understand what blood pressure flags mean and how to detect sudden swelling or severe headaches early.",
      isCritical: true
    },
    {
      id: "3",
      title: "Safe Aerobic Exercises for Trimester 2",
      category: "Exercise",
      readTime: "5 min read",
      trimester: 2,
      desc: "Simple, doctor-approved stretches and light workouts to maintain cardiac health and pelvic flexibility."
    },
    {
      id: "4",
      title: "Preparing Your Companion for Labor Room",
      category: "Labor Prep",
      readTime: "6 min read",
      trimester: 3,
      desc: "A practical checklist for your partner, detailing how they can support breathing cycles and monitor vitals."
    },
    {
      id: "5",
      title: "Fetal Kick Count WHO Best Practices",
      category: "Danger Signs",
      readTime: "3 min read",
      trimester: 2,
      desc: "A detailed guide on tracking fetal movements from week 24 onwards and recording logs in your Today Dashboard.",
      isAudio: true
    }
  ];

  // Load state from local storage
  useEffect(() => {
    const dataStr = localStorage.getItem("mama_gestation_data");
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        setGestationWeeks(data.gestationWeeks || 12);
      } catch (e) {
        console.error(e);
      }
    }
    const savedScore = localStorage.getItem("mama_academy_score");
    if (savedScore) {
      setQuizScore(Number(savedScore));
    }
  }, []);

  const handleToggleBookmark = (id: string) => {
    setSavedLessons(prev => {
      const current = [...prev];
      const idx = current.indexOf(id);
      if (idx > -1) {
        current.splice(idx, 1);
      } else {
        current.push(id);
      }
      return current;
    });
  };

  const handleQuizSubmit = (optIndex: number) => {
    if (quizAnswered) return;
    setSelectedQuizOption(optIndex);
    setQuizAnswered(true);
    if (optIndex === 1) {
      const newScore = quizScore + 30;
      setQuizScore(newScore);
      localStorage.setItem("mama_academy_score", newScore.toString());
    }
  };

  const filteredLessons = lessons.filter((l) => {
    const matchesSearch = l.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                          l.desc.toLowerCase().includes(searchValue.toLowerCase());
    const matchesCategory = selectedCategory === "All" || l.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Quiz Options list
  const quizOptions = [
    "Mild swelling in the ankles when resting at night.",
    "Sudden, severe headache accompanied by blurry vision.",
    "Feeling the baby move or kick 12 times in a 2-hour window."
  ];

  const currentTrimester = gestationWeeks < 13 ? 1 : gestationWeeks < 27 ? 2 : 3;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* LEFT/CENTER PANELS (9 COLS) */}
      <main className="lg:col-span-9 flex flex-col gap-3">
        
        {/* Title greeting row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-display">Ahnara Academy</h2>
            <p className="text-slate-500 font-medium mt-1">
              Bite-sized maternal health lessons curated for Trimester {currentTrimester}.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="bg-[#E8F3CE] border border-[#CDE0A4] text-[#608216] px-3.5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1.5">
              <IconAward className="w-4.5 h-4.5 text-[#8BB436]" />
              {quizScore} Academy Points
            </span>
          </div>
        </motion.div>

        {/* TOP CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2 mb-3">
          
          {/* Card 1: Academy Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Academy Points</span>
                <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shadow-[0_2px_8px_rgba(245,158,11,0.1)]">
                  <IconAward className="w-4.5 h-4.5" />
                </div>
              </div>
              
              {/* Progress bar matching dashboard */}
              <div className="h-16 w-full flex flex-col justify-center gap-2 mb-2">
                <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((quizScore / 200) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[#C5EC59] rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-1.5 mt-2">
                <span className="text-3xl font-extrabold text-[#608216] text-display">{quizScore}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Goal: 200 pts
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 2: Saved Lessons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[174px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Saved Lessons</span>
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shadow-[0_2px_8px_rgba(59,130,246,0.1)]">
                    <IconBookmark className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="h-16 w-full flex flex-col justify-center mb-2">
                  <span className="text-3xl font-extrabold text-slate-800 tracking-tight text-display">
                    {savedLessons.length} Saved
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Pinned for offline review
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 3: Trimester Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[174px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Trimester {currentTrimester}</span>
                  <div className="w-9 h-9 rounded-full bg-[#F5F8EB] text-[#9CC031] flex items-center justify-center shadow-[0_2px_8px_rgba(156,192,49,0.1)]">
                    <IconBook className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="h-16 w-full flex flex-col justify-center mb-2">
                  <span className="text-3xl font-extrabold text-slate-800 tracking-tight text-display">
                    {lessons.filter(l => l.trimester === currentTrimester).length} Active
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Curated clinical courses
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 4: Critical Warnings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[174px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Critical Alerts</span>
                  <div className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center shadow-[0_2px_8px_rgba(239,68,68,0.1)]">
                    <IconAlertOctagon className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="h-16 w-full flex flex-col justify-center mb-2">
                  <span className="text-3xl font-extrabold text-slate-800 tracking-tight text-display">
                    {lessons.filter(l => l.isCritical).length} Warning
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Must-know medical danger signs
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

        </div>

        {/* SEARCH BAR & CATEGORIES FILTER ROW */}
        <div className="flex flex-col gap-3 bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
          
          {/* Search bar */}
          <div className="relative">
            <IconSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search health topics, nutrition or danger signs..."
              className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:bg-white focus:border-slate-300 font-semibold"
            />
          </div>

          {/* Topic chips list */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["All", "Nutrition", "Exercise", "Danger Signs", "Labor Prep"].map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                    isSelected
                      ? "bg-[#1E293B] border-slate-900 text-white shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* LESSON LIST FEED */}
        <div className="flex flex-col gap-3">
          {filteredLessons.map((l, index) => {
            const isSaved = savedLessons.includes(l.id);
            const isTrimesterMatch = l.trimester === currentTrimester;

            return (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <AhnaraCard
                  variant="flat"
                  padding="none"
                  className={`bg-white border hover:shadow-md transition-all duration-300 p-5 flex flex-col gap-3 text-left relative ${
                    l.isCritical 
                      ? "border-red-200 bg-red-50/15" 
                      : "border-slate-100"
                  }`}
                >
                  {/* Lesson tag row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                        l.isCritical
                          ? "bg-red-50 border-red-200 text-red-600 animate-pulse"
                          : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}>
                        {l.category} {l.isCritical && "• Critical"}
                      </span>
                      
                      {isTrimesterMatch && (
                        <span className="bg-[#E8F3CE] border border-[#CDE0A4] text-[#608216] px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider">
                          Recommended for You
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleBookmark(l.id)}
                      className="text-slate-400 hover:text-slate-700 transition-all p-1"
                    >
                      {isSaved ? <IconBookmarkFilled className="w-5 h-5 text-[#0089C1]" /> : <IconBookmark className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Title and description */}
                  <div>
                    <h3 className="font-extrabold text-base text-slate-800 text-display tracking-tight leading-snug">
                      {l.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                      {l.desc}
                    </p>
                  </div>

                  {/* Footer control bar */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-1">
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <IconClock className="w-3.5 h-3.5" />
                        {l.readTime}
                      </span>
                      <span>•</span>
                      <span>Trimester {l.trimester}</span>
                    </div>

                    {l.isAudio ? (
                      <AhnaraButton
                        variant="outline"
                        size="sm"
                        leftIcon={<IconVolume className="w-4 h-4" />}
                        className="!rounded-xl !h-8 text-xs font-bold border-[#CDE0A4] bg-[#E8F3CE]/45 text-[#608216] hover:bg-[#E8F3CE]"
                      >
                        Listen (Audio)
                      </AhnaraButton>
                    ) : (
                      <AhnaraButton
                        variant="outline"
                        size="sm"
                        leftIcon={<IconBook className="w-4 h-4" />}
                        className="!rounded-xl !h-8 text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-600"
                      >
                        Read Article
                      </AhnaraButton>
                    )}
                  </div>
                </AhnaraCard>
              </motion.div>
            );
          })}
        </div>

      </main>

      {/* RIGHT SIDEBAR (3 COLS) */}
      <aside className="lg:col-span-3 flex flex-col gap-3">
        
        {/* Desktop spacer */}
        <div className="hidden lg:block h-[68px]" />

        {/* QUICK KNOWLEDGE QUIZ WIDGET */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm text-left">
            <div className="flex items-center justify-between border-b border-[#C7DB9C] pb-3">
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider">Maternal Knowledge</span>
                <h3 className="font-extrabold text-lg text-[#0D090C] text-display">Quick Quiz</h3>
              </div>
              <IconBook className="w-5 h-5 text-[#608216]" />
            </div>

            <div className="flex flex-col gap-3.5">
              <span className="text-xs font-black text-slate-900 leading-snug">
                Which of the following is a critical danger sign that requires immediate clinical checkup?
              </span>

              <div className="flex flex-col gap-2">
                {quizOptions.map((opt, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === 1;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizSubmit(idx)}
                      disabled={quizAnswered}
                      className={`p-3 rounded-xl border text-left text-[11px] font-semibold leading-relaxed transition-all ${
                        quizAnswered
                          ? isSelected
                            ? isCorrect
                              ? "bg-emerald-500 border-emerald-600 text-white shadow-xs"
                              : "bg-red-500 border-red-600 text-white shadow-xs"
                            : isCorrect
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-black"
                            : "bg-[#E8F3CE]/45 border-[#C7DB9C]/30 text-slate-500 opacity-60"
                          : "bg-white border-[#C7DB9C] hover:bg-[#D4F475]/30 text-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {quizAnswered && isSelected && (
                          <span className="mt-0.5">
                            {isCorrect ? <IconCircleCheck className="w-4 h-4" /> : <IconCircleX className="w-4 h-4" />}
                          </span>
                        )}
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quiz feedback notice */}
              <AnimatePresence>
                {quizAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-[10px] font-bold text-slate-600 text-left border-t border-[#C7DB9C] pt-2.5"
                  >
                    {selectedQuizOption === 1 ? (
                      <span className="text-[#608216] font-black">
                        ✓ Correct! +30 Academy Points. Severe headaches and blurry vision can indicate pre-eclampsia.
                      </span>
                    ) : (
                      <span className="text-red-700 font-black">
                        ✗ Incorrect. The correct answer is B. Severe headaches or vision blurry changes are danger sign indicators.
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AhnaraCard>
        </motion.div>

        {/* Reward milestones info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-3 shadow-xs text-left">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <IconAward className="w-4.5 h-4.5 text-[#0089C1]" />
              Learning Rewards
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Earn 200 Academy Points to unlock clinic contact transportation vouchers. Share knowledge sheets with your partner.
            </p>
          </AhnaraCard>
        </motion.div>

      </aside>

    </div>
  );
}
