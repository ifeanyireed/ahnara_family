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
  IconPlayerPause,
  IconVolume,
  IconCheck,
  IconClock,
  IconBook,
  IconAlertOctagon
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

interface Lesson {
  id: string;
  title: string;
  category: "Nutrition" | "First Aid" | "Danger Signs" | "Parenting";
  readTime: string;
  desc: string;
  isAudio?: boolean;
  isCritical?: boolean;
}

export default function KidsAcademyPage() {
  const [childName, setChildName] = useState("Aria");
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [savedLessons, setSavedLessons] = useState<string[]>([]);
  
  // Audio Player states
  const [activeAudioTrack, setActiveAudioTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(25);

  // Quiz states
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(120);

  const lessons: Lesson[] = [
    {
      id: "1",
      title: "Infant Nutrition & Introducing Solids",
      category: "Nutrition",
      readTime: "3 min read",
      desc: "Learn safe ways to introduce complementary foods, iron-rich meals, and manage the transition from milk to solids starting at month 6.",
      isAudio: true
    },
    {
      id: "2",
      title: "Pediatric First Aid: Infant Choking Protocol",
      category: "First Aid",
      readTime: "4 min read",
      desc: "High-contrast, step-by-step instructions on performing back blows and chest thrusts for infants under 1 year of age.",
      isCritical: true,
      isAudio: true
    },
    {
      id: "3",
      title: "Managing Childhood Fevers & Dehydration",
      category: "Danger Signs",
      readTime: "5 min read",
      desc: "Identify high temperature parameters, use ORS (Oral Rehydration Salts) correctly, and know when an emergency hospital visit is required."
    },
    {
      id: "4",
      title: "Exclusive Breastfeeding WHO Guidelines",
      category: "Nutrition",
      readTime: "3 min read",
      desc: "Understand breastfeed-on-demand techniques and how exclusive feeding supports child growth curves."
    },
    {
      id: "5",
      title: "Dehydration & ORS Solution Preparation",
      category: "First Aid",
      readTime: "4 min read",
      desc: "Clear guidelines on preparing Oral Rehydration Solutions with safe drinking water, salt, and sugar at home.",
      isAudio: true
    }
  ];

  // Load state from local storage
  useEffect(() => {
    const dataStr = localStorage.getItem("kids_profile_data");
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        setChildName(data.childName || "Aria");
      } catch (e) {}
    }
    const savedScore = localStorage.getItem("kids_academy_score");
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

  const handlePlayAudio = (title: string) => {
    if (activeAudioTrack === title) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveAudioTrack(title);
      setIsPlaying(true);
      setAudioProgress(10);
    }
  };

  const handleQuizSubmit = (optIndex: number) => {
    if (quizAnswered) return;
    setSelectedQuizOption(optIndex);
    setQuizAnswered(true);
    if (optIndex === 1) {
      const newScore = quizScore + 30;
      setQuizScore(newScore);
      localStorage.setItem("kids_academy_score", newScore.toString());
    }
  };

  const filteredLessons = lessons.filter((l) => {
    const matchesSearch = l.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                          l.desc.toLowerCase().includes(searchValue.toLowerCase());
    const matchesCategory = selectedCategory === "All" || l.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Quiz options on Choking (K.09)
  const quizOptions = [
    "Give the infant a glass of water and shake them gently.",
    "Perform 5 back blows followed by 5 chest thrusts.",
    "Place the child flat on their back and wait for it to clear."
  ];

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
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight text-display">Ahnara Kids Academy</h2>
            <p className="text-slate-500 font-medium mt-1">
              Actionable child wellness guidance and pediatric safety checks.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="bg-[#E8F3CE] border border-[#CDE0A4] text-[#608216] px-3.5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1.5">
              <IconAward className="w-4.5 h-4.5 text-[#608216]" />
              {quizScore} Academy Points
            </span>
          </div>
        </motion.div>

        {/* HANDS-FREE AUDIO PLAYER HEADBAR (K.09) */}
        {activeAudioTrack && (
          <div className="bg-[#1E293B] text-slate-200 rounded-3xl p-5 shadow-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-white text-[#1E293B] flex items-center justify-center shadow"
              >
                {isPlaying ? <IconPlayerPause className="w-5 h-5 fill-current" /> : <IconPlayerPlay className="w-5 h-5 fill-current" />}
              </button>
              <div className="text-left leading-none">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Hands-free Parenting Audio player</span>
                <h4 className="text-xs font-black text-white mt-1.5 truncate max-w-[200px] sm:max-w-sm">{activeAudioTrack}</h4>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-1 justify-end max-w-xs">
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white h-full" style={{ width: `${audioProgress}%` }} />
              </div>
              <span className="text-[9px] font-mono font-bold">1:04 / 4:30</span>
            </div>
          </div>
        )}

        {/* EMERGENCY FIRST-AID BOARD (K.09) */}
        <div className="bg-orange-50 border border-orange-200 text-orange-850 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-orange-200/50 pb-3">
            <IconAlertOctagon className="w-6 h-6 text-red-650" />
            <h3 className="text-lg font-black text-slate-800 text-display">Emergency First-Aid Board</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 border border-orange-200/30 p-4 rounded-2xl">
              <span className="text-[9px] font-bold uppercase tracking-wider block text-red-700">1. Infant Choking (Under 1 Year)</span>
              <ul className="text-xs font-semibold mt-2 flex flex-col gap-2 list-decimal list-inside text-slate-700">
                <li>Lay infant face down along your forearm, supporting head with hand.</li>
                <li>Deliver <b>5 firm back blows</b> between shoulder blades using heel of hand.</li>
                <li>If not cleared, turn infant face up along thigh, support head.</li>
                <li>Deliver <b>5 quick chest thrusts</b> on breastbone using 2 fingers.</li>
              </ul>
            </div>
            <div className="bg-white/50 border border-orange-200/30 p-4 rounded-2xl">
              <span className="text-[9px] font-bold uppercase tracking-wider block text-red-700">2. Burn treatment (Pediatric)</span>
              <ul className="text-xs font-semibold mt-2 flex flex-col gap-2 list-decimal list-inside text-slate-700">
                <li>Immediately place burn area under <b>cool running water</b> for 10-20 mins.</li>
                <li>Do not apply ice, toothpaste, butter, or native oils.</li>
                <li>Cover burn loosely with a clean, dry, sterile cloth.</li>
                <li>Seek clinical care if blisters form or face/extremities are burned.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEARCH BAR & CATEGORIES FILTER ROW */}
        <div className="flex flex-col gap-3 bg-white border border-slate-200/50 rounded-3xl p-5 shadow-xs">
          <div className="relative">
            <IconSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search parenting guides, feeding steps or choking aid..."
              className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:bg-white focus:border-slate-350 font-semibold text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["All", "Nutrition", "First Aid", "Danger Signs", "Parenting"].map((cat) => {
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
                      : "border-slate-200/50"
                  }`}
                >
                  {/* Lesson tag row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                        l.isCritical
                          ? "bg-red-50 border-red-200 text-red-650 animate-pulse"
                          : "bg-[#E6F5FA] border-sky-100 text-[#0089C1]"
                      }`}>
                        {l.category} {l.isCritical && "• Critical"}
                      </span>
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
                    </div>

                    {l.isAudio ? (
                      <AhnaraButton
                        variant="outline"
                        size="sm"
                        onClick={() => handlePlayAudio(l.title)}
                        leftIcon={<IconVolume className="w-4 h-4" />}
                        className="!rounded-xl !h-8 text-xs font-bold border-[#0089C1]/20 bg-[#E6F5FA] text-[#0089C1] hover:bg-[#c9e8f4]"
                      >
                        {activeAudioTrack === l.title && isPlaying ? "Pause Audio" : "Listen (Audio)"}
                      </AhnaraButton>
                    ) : (
                      <AhnaraButton
                        variant="outline"
                        size="sm"
                        onClick={() => alert("Launching full parenting guide document...")}
                        leftIcon={<IconBook className="w-4 h-4" />}
                        className="!rounded-xl !h-8 text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-650"
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

      {/* RIGHT SIDEBAR */}
      <aside className="lg:col-span-3 flex flex-col gap-3">
        
        {/* Desktop spacer */}
        <div className="hidden lg:block h-[68px]" />

        {/* SAFETY CHECKPOINT QUIZ WIDGET */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm text-left text-[#608216]">
            <div className="flex items-center justify-between border-b border-[#CDE0A4] pb-3">
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider">Safety Checkpoint</span>
                <h3 className="font-extrabold text-lg text-slate-905 text-display">Quick Quiz</h3>
              </div>
              <IconBook className="w-5 h-5 text-[#608216]" />
            </div>

            <div className="flex flex-col gap-3.5">
              <span className="text-xs font-black text-slate-900 leading-snug">
                What is the correct clinical first action if a baby under 1 year of age is choking and unable to breathe?
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
                            ? "bg-emerald-50 border-emerald-200 text-emerald-750 font-black"
                            : "bg-[#E8F3CE]/45 border-[#CDE0A4]/30 text-slate-500 opacity-60"
                          : "bg-white border-[#CDE0A4] hover:bg-[#E8F3CE]/30 text-slate-700"
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
                    className="text-[10px] font-bold text-slate-600 text-left border-t border-[#CDE0A4] pt-2.5"
                  >
                    {selectedQuizOption === 1 ? (
                      <span className="text-[#608216] font-black">
                        ✓ Correct! +30 Academy Points. WHO IMCI first action is 5 back blows, then 5 chest thrusts.
                      </span>
                    ) : (
                      <span className="text-red-700 font-black">
                        ✗ Incorrect. The correct answer is B. Perform 5 back blows followed by 5 chest thrusts. Never give water to a choking infant.
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
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-200/50 p-5 flex flex-col gap-3 shadow-xs text-left">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <IconAward className="w-4.5 h-4.5 text-[#8BB436]" />
              Learning Rewards
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Complete lessons to earn Academy Points and unlock transport vouchers for your child's vaccination clinic visits.
            </p>
          </AhnaraCard>
        </motion.div>

      </aside>

    </div>
  );
}
