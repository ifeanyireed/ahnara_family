"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  IconBook, 
  IconBallBasketball, 
  IconBrain, 
  IconActivity, 
  IconCheck, 
  IconPlayerPlay,
  IconFlame,
  IconChevronRight,
  IconAward
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function SeniorsAcademy() {
  const [courses, setCourses] = useState([
    { id: 1, title: "Improving Balance & Gait", type: "Mobility Video", progress: 65, duration: "6 modules", icon: IconBallBasketball },
    { id: 2, title: "Cognitive Memory Drills", type: "Brain Exercise", progress: 40, duration: "10 drills", icon: IconBrain },
    { id: 3, title: "Healthy Eating for Longevity", type: "Nutrition Guide", progress: 100, duration: "Completed", icon: IconBook }
  ]);

  // Mini Sudoku State (2x2 grid for simplicity, or 3x3 placeholder with working clicks)
  const [sudokuGrid, setSudokuGrid] = useState([
    [1, 0, 3],
    [3, 1, 2],
    [2, 3, 0]
  ]);
  const [sudokuComplete, setSudokuComplete] = useState(false);

  const handleSudokuClick = (row: number, col: number) => {
    if (sudokuComplete) return;
    
    // Toggle values in blank slots (0 -> 1 -> 2 -> 3 -> 0)
    setSudokuGrid(prev => {
      const grid = prev.map(r => [...r]);
      if (row === 0 && col === 1) {
        grid[row][col] = grid[row][col] === 2 ? 0 : 2; // correct is 2
      } else if (row === 2 && col === 2) {
        grid[row][col] = grid[row][col] === 1 ? 0 : 1; // correct is 1
      }
      
      // Check completeness
      if (grid[0][1] === 2 && grid[2][2] === 1) {
        setSudokuComplete(true);
      }
      return grid;
    });
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Course List (8 cols) */}
      <main className="lg:col-span-8 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">education &amp; longevity</span>
              <h3 className="font-extrabold text-xl text-slate-800 tracking-tight text-display">Academy Courses</h3>
            </div>
            
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
              <IconFlame className="w-4 h-4 text-amber-600" />
              <span>7 Day Streak!</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {courses.map((course) => {
              const Icon = course.icon;
              return (
                <div 
                  key={course.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 leading-none">{course.title}</span>
                      <span className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase">
                        {course.type} • {course.duration}
                      </span>
                      
                      {/* progress bar */}
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${course.progress}%` }} />
                        </div>
                        <span className="text-[9px] font-black text-slate-500 uppercase">{course.progress}% done</span>
                      </div>
                    </div>
                  </div>

                  <AhnaraButton
                    variant="outline"
                    className="!rounded-xl text-indigo-600 border-indigo-200 hover:bg-indigo-50 font-bold flex items-center justify-center gap-1.5 self-start sm:self-auto"
                  >
                    <IconPlayerPlay className="w-4 h-4 text-indigo-600" />
                    {course.progress === 100 ? "Review" : "Continue"}
                  </AhnaraButton>
                </div>
              );
            })}
          </div>

        </AhnaraCard>
      </main>

      {/* Brain games & streakers (4 cols) */}
      <aside className="lg:col-span-4 flex flex-col gap-3">
        
        {/* Interactive mini-sudoku */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs text-left">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <div className="flex items-center gap-1.5">
              <IconBrain className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Brain Game (Sudoku)</h4>
            </div>
            {sudokuComplete && (
              <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-black uppercase flex items-center gap-0.5">
                <IconCheck className="w-3 h-3" />
                Done
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[10px] text-slate-400 font-bold leading-normal">
              Keep your memory sharp! Click on the empty boxes to solve the grid:
            </p>

            {/* Grid display */}
            <div className="grid grid-cols-3 gap-1.5 max-w-[150px] mx-auto bg-slate-100 p-2 rounded-xl">
              {sudokuGrid.map((row, rIdx) => 
                row.map((cell, cIdx) => {
                  const isInteractive = (rIdx === 0 && cIdx === 1) || (rIdx === 2 && cIdx === 2);
                  return (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => isInteractive && handleSudokuClick(rIdx, cIdx)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm border transition-all ${
                        isInteractive 
                          ? cell > 0 
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                            : "bg-white border-dashed border-slate-350 hover:bg-slate-50 text-slate-400"
                          : "bg-slate-200 border-slate-300 text-slate-600"
                      }`}
                    >
                      {cell > 0 ? cell : "?"}
                    </button>
                  );
                })
              )}
            </div>

            {sudokuComplete && (
              <div className="bg-emerald-50 border border-emerald-150 p-2.5 rounded-xl text-[10px] text-emerald-800 font-bold leading-normal flex items-start gap-1.5 mt-1.5">
                <IconAward className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
                <div>
                  <span>Daily Brain Check Completed!</span>
                  <p className="font-semibold text-slate-500 mt-0.5">Cognitive assessment score synced to caregiver dashboard.</p>
                </div>
              </div>
            )}
          </div>
        </AhnaraCard>

        {/* Caregiver Respite Guide */}
        <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE]/45 border-none p-5 flex flex-col gap-3 shadow-xs text-left">
          <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider block">Caregiver Support</span>
          <h4 className="text-sm font-black text-slate-800">Respite Care Guides</h4>
          <p className="text-[10px] text-slate-500 font-bold leading-normal">
            Guides and courses to help family members prevent carer burnout and coordinate respite care shifts.
          </p>
          <AhnaraButton
            variant="outline"
            className="w-full mt-1.5 bg-white text-[#608216] border-[#CDE0A4] hover:bg-[#CDE0A4]/15 !rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs"
          >
            Access Respite Guides
            <IconChevronRight className="w-4 h-4" />
          </AhnaraButton>
        </AhnaraCard>

      </aside>

    </div>
  );
}
