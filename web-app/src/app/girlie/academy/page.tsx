"use client";

import React, { useState } from "react";
import { 
  IconSchool, 
  IconPlayerPlay, 
  IconPlayerPause,
  IconAward,
  IconInfoCircle,
  IconHeart
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function GirlieAcademyPage() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(35);

  const courses = [
    { title: "What happens during a period?", length: "6 mins", topic: "Biology" },
    { title: "Building positive friendships", length: "8 mins", topic: "Emotional Wellness" },
    { title: "Balanced nutrition for teens", length: "5 mins", topic: "Nutrition" }
  ];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Course listings (7 cols) */}
      <main className="lg:col-span-7 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <IconSchool className="w-6 h-6 text-pink-500" />
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Teen Academy</h3>
          </div>

          <div className="flex flex-col gap-3">
            {courses.map((course, idx) => (
              <div 
                key={idx} 
                className="p-4 bg-slate-50 hover:bg-slate-100/50 border border-slate-150 rounded-2xl flex items-center justify-between transition-all"
              >
                <div className="flex-1">
                  <span className="text-[9px] font-black text-pink-550 uppercase tracking-wider block">{course.topic}</span>
                  <h4 className="font-black text-xs text-slate-800 leading-normal mt-0.5">{course.title}</h4>
                  <span className="text-[10px] text-slate-450 font-bold block mt-1.5">{course.length} Audio Session</span>
                </div>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 bg-pink-500 hover:bg-pink-650 text-white rounded-xl border-none transition-all active:scale-95 shadow-sm"
                >
                  {isPlaying ? <IconPlayerPause className="w-4 h-4" /> : <IconPlayerPlay className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </AhnaraCard>

        {/* Audio read-aloud widget */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-3.5 shadow-xs">
          <h4 className="font-extrabold text-xs uppercase tracking-wide text-slate-500">Currently Playing</h4>
          
          <div className="p-4 bg-[#FDF8FA] border border-pink-100 rounded-2xl flex flex-col gap-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-black text-slate-800">What happens during a period?</span>
              <span className="text-[10px] text-pink-600 font-bold">35% Complete</span>
            </div>

            {/* progress bar */}
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
              <div className="bg-pink-500 h-full" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Transcript snippet */}
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed border-t border-slate-200/50 pt-2">
              &quot;...during your cycle, your hormones signal the lining of your uterus to build up and prepare. When pregnancy doesn&apos;t happen, this lining sheds, which is what we call a period...&quot;
            </p>
          </div>
        </AhnaraCard>
      </main>

      {/* Completion Badges (5 cols) */}
      <aside className="lg:col-span-5 flex flex-col gap-3">
        
        {/* Badges container */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <IconAward className="w-5 h-5 text-pink-500" />
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight text-display">My Achievements</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Body Literate Lvl 1", desc: "First 3 cycle logs", active: true },
              { title: "Self-Image Champion", desc: "Completed body course", active: false }
            ].map((badge, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                  badge.active 
                    ? "bg-pink-50/20 border-pink-200 text-slate-800" 
                    : "bg-slate-50 border-slate-200 text-slate-400 opacity-60"
                }`}
              >
                <div className={`p-3 rounded-full ${badge.active ? "bg-pink-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                  <IconAward className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-[11px] leading-tight">{badge.title}</h4>
                  <p className="text-[9px] font-semibold text-slate-450 mt-1">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AhnaraCard>

        {/* Info card */}
        <AhnaraCard variant="flat" className="bg-pink-50/20 border border-pink-100 p-5 flex items-start gap-2.5">
          <IconInfoCircle className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold leading-normal text-pink-800">
            Earn badge markers by listening to audio sessions, completing self-image guides, and building a regular cycle tracking habit!
          </p>
        </AhnaraCard>

      </aside>

    </div>
  );
}
