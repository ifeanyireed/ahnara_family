"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconCheck, 
  IconShieldCheck, 
  IconCalendar, 
  IconChevronRight, 
  IconInfoCircle,
  IconArrowLeft,
  IconArrowRight,
  IconPlayerPlay,
  IconPlayerPause
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function LadyScreeningsPage() {
  const [smearResult, setSmearResult] = useState<string>("normal");
  const [hpvDose1, setHpvDose1] = useState<boolean>(true);
  const [hpvDose2, setHpvDose2] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selfExamCompleted, setSelfExamCompleted] = useState<boolean>(false);

  // Breast self-exam step-by-step instructions
  const selfExamSteps = [
    {
      title: "Step 1: Visual Inspection",
      desc: "Stand in front of a mirror with shoulders straight and arms on your hips. Look for changes in size, shape, color, or any visible distortion or swelling."
    },
    {
      title: "Step 2: Arms Raised",
      desc: "Raise your arms overhead and look for the same changes. Observe if skin draws in, or if there is any fluid discharge from either nipple."
    },
    {
      title: "Step 3: Palpation (Standing)",
      desc: "Use your right hand to feel your left breast, and your left hand for the right breast. Use a firm, smooth touch with the finger pads in a circular motion."
    },
    {
      title: "Step 4: Palpation (Lying Down)",
      desc: "Lie down with a pillow under your right shoulder. Use circular motions to examine the entire breast and armpit area from collarbone to abdomen."
    }
  ];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Screening Timeline (7 cols) */}
      <main className="lg:col-span-7 flex flex-col gap-3">
        
        {/* Cervical Smear Test Card */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconShieldCheck className="w-6 h-6 text-rose-500" />
              <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Cervical Smear Screening</h3>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-black uppercase">Up to date</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col gap-1">
              <span className="text-[9px] font-black text-slate-400 uppercase">Last Screening Date</span>
              <p className="text-sm font-black text-slate-800">September 14, 2025</p>
              <span className="text-[10px] text-slate-400 font-semibold mt-1">Result: Normal / Cleared</span>
            </div>

            <div className="p-4 bg-rose-50/40 border border-rose-100 rounded-2xl flex flex-col gap-1">
              <span className="text-[9px] font-black text-rose-600 uppercase">Next Smear Due</span>
              <p className="text-sm font-black text-rose-800">September 2028</p>
              <span className="text-[10px] text-rose-700 font-semibold mt-1">Countdown: 2 years remaining</span>
            </div>
          </div>

          {/* Quick clinic book shortcut */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-xl mt-1">
            <div className="flex items-center gap-2">
              <IconCalendar className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs font-black text-slate-800">Book GP Smear Check</p>
                <p className="text-[10px] text-slate-400 font-semibold">Available slots at Health Center A</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] uppercase rounded-lg transition-all border-none">
              Book Appointment
            </button>
          </div>
        </AhnaraCard>

        {/* HPV Vaccination Tracker */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">HPV Vaccine Dose Scheduler</h3>
          
          <div className="flex flex-col gap-3">
            {[
              { id: 1, label: "Dose 1 (Initial)", date: "Logged: Oct 12, 2025", completed: hpvDose1, action: setHpvDose1 },
              { id: 2, label: "Dose 2 (6 Months Booster)", date: "Due: July 12, 2026", completed: hpvDose2, action: setHpvDose2 }
            ].map((dose) => (
              <div 
                key={dose.id}
                onClick={() => dose.action(!dose.completed)}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  dose.completed 
                    ? "bg-rose-50/30 border-rose-200" 
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    dose.completed ? "bg-rose-500 text-white" : "bg-white border border-slate-350"
                  }`}>
                    {dose.completed && <IconCheck className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">{dose.label}</p>
                    <span className="text-[10px] text-slate-400 font-semibold">{dose.date}</span>
                  </div>
                </div>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                  dose.completed ? "bg-rose-100 text-rose-700" : "bg-slate-200 text-slate-600"
                }`}>
                  {dose.completed ? "Completed" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </AhnaraCard>

      </main>

      {/* Self-Exam Guide (5 cols) */}
      <aside className="lg:col-span-5 flex flex-col gap-3">
        
        {/* Breast self-exam interactive card */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Breast Self-Exam Guide</h3>
            <span className="text-[9px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-black uppercase">Monthly Check</span>
          </div>

          {/* Interactive Steps */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col gap-2 min-h-36 justify-between">
            <div>
              <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">{selfExamSteps[activeStep].title}</span>
              <p className="text-xs font-black text-slate-800 mt-1 leading-normal">{selfExamSteps[activeStep].desc}</p>
            </div>
            
            {/* Step navigation */}
            <div className="flex items-center justify-between border-t border-slate-200/50 pt-3 mt-4">
              <button 
                type="button"
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => prev - 1)}
                className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg disabled:opacity-40 transition-colors"
              >
                <IconArrowLeft className="w-4 h-4 text-slate-600" />
              </button>
              
              <span className="text-[10px] font-bold text-slate-400">Step {activeStep + 1} of {selfExamSteps.length}</span>
              
              {activeStep < selfExamSteps.length - 1 ? (
                <button 
                  type="button"
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <IconArrowRight className="w-4 h-4 text-slate-600" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelfExamCompleted(true)}
                  className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] uppercase rounded-lg transition-all border-none"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>

          {selfExamCompleted && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[10px] font-bold flex items-center justify-between"
            >
              <span>✓ Self-exam complete! Safe logs saved to clinical vault.</span>
              <button onClick={() => setSelfExamCompleted(false)} className="text-emerald-700 hover:text-emerald-950 font-black uppercase text-[9px] border-none bg-transparent">Undo</button>
            </motion.div>
          )}
        </AhnaraCard>

        {/* Preventative Guidelines box */}
        <AhnaraCard variant="flat" className="bg-rose-50/30 border border-rose-100 p-5 flex flex-col gap-2.5 text-rose-950">
          <div className="flex items-center gap-1.5">
            <IconInfoCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <h4 className="text-xs font-black uppercase tracking-wider">Clinical Guidelines</h4>
          </div>
          <p className="text-[11px] font-bold leading-normal text-rose-800">
            For women aged 25-64, cervical smear screening is recommended every 3 to 5 years to detect HPV and high-risk cell changes. Perform a breast self-examination monthly, 3-5 days after your period ends, as breasts are less likely to be tender or lumpy at this time.
          </p>
        </AhnaraCard>

      </aside>

    </div>
  );
}
