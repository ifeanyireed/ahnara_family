"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  IconCalendar, 
  IconCheck, 
  IconQrcode,
  IconLock,
  IconAlertCircle,
  IconMoodSmile,
  IconDeviceMobile,
  IconArrowRight
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function GirlieDashboardPage() {
  // Onboarding Guide states
  const [age, setAge] = useState<number>(14);
  const [firstPeriod, setFirstPeriod] = useState<boolean>(true);
  const [heightGrowth, setHeightGrowth] = useState<boolean>(true);
  const [skinChanges, setSkinChanges] = useState<boolean>(false);
  const [pinEnabled, setPinEnabled] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>("****");
  const [isSynced, setIsSynced] = useState<boolean>(false);

  // Cycle states
  const [flowToday, setFlowToday] = useState<string>("Medium");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleLogFlow = (flow: string) => {
    setFlowToday(flow);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Onboarding Puberty Guide (6 cols) */}
      <main className="lg:col-span-6 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <IconMoodSmile className="w-6 h-6 text-pink-500" />
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Puberty Onboarding Guide</h3>
          </div>

          <div className="flex flex-col gap-4 mt-1">
            {/* Age slider */}
            <div className="flex flex-col gap-1 bg-pink-50/20 border border-pink-100 p-4 rounded-2xl">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black text-pink-600 uppercase tracking-wider">Age Verification</span>
                <span className="text-sm font-black text-pink-600 uppercase">{age} Years Old</span>
              </div>
              <input
                type="range"
                min="10"
                max="20"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-1 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500 my-2"
              />
              <p className="text-[10px] text-slate-450 font-bold leading-normal">
                Verifying age ensures all content is clinically tailored and adolescent-appropriate.
              </p>
            </div>

            {/* Milestones */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">My Puberty Milestones</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { state: firstPeriod, setter: setFirstPeriod, label: "First Period" },
                  { state: heightGrowth, setter: setHeightGrowth, label: "Height Spike" },
                  { state: skinChanges, setter: setSkinChanges, label: "Skin Changes" }
                ].map((milestone, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => milestone.setter(!milestone.state)}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      milestone.state 
                        ? "bg-pink-50 border-pink-200 text-pink-800" 
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100/50 text-slate-500"
                    }`}
                  >
                    {milestone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Parent circle sync */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex-1">
                <span className="text-[9px] font-black text-pink-500 uppercase tracking-wider block">Parent-Child Circle</span>
                <p className="text-xs font-black text-slate-800 mt-0.5">Parent Sync Link</p>
                <span className="text-[10px] text-slate-450 font-semibold block mt-1 leading-normal">
                  Connect your profile to a parent account to request care supplies easily.
                </span>
              </div>
              <button 
                onClick={() => setIsSynced(!isSynced)}
                className={`p-2.5 rounded-xl border transition-all ${
                  isSynced ? "bg-emerald-50 border-emerald-250 text-emerald-600" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-650"
                }`}
              >
                <IconQrcode className="w-5 h-5" />
              </button>
            </div>

            {/* Discreet PIN Lock */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex-1">
                <span className="text-[9px] font-black text-pink-500 uppercase tracking-wider block">Privacy Locks</span>
                <p className="text-xs font-black text-slate-800 mt-0.5">Discreet PIN &amp; Icon Lock</p>
                <span className="text-[10px] text-slate-450 font-semibold block mt-1 leading-normal">
                  Mask application icon and secure logs with local PIN screen lock.
                </span>
              </div>
              <button 
                onClick={() => {
                  setPinEnabled(!pinEnabled);
                  setPinCode(pinEnabled ? "****" : "4892");
                }}
                className={`p-2.5 rounded-xl border transition-all ${
                  pinEnabled ? "bg-pink-500 text-white border-pink-500" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-650"
                }`}
              >
                <IconLock className="w-5 h-5" />
              </button>
            </div>

          </div>
        </AhnaraCard>
      </main>

      {/* Cycle & Prediction Alert (6 cols) */}
      <aside className="lg:col-span-6 flex flex-col gap-3">
        
        {/* Simple Menstrual Tracker */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconCalendar className="w-6 h-6 text-pink-500" />
              <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Cycle Tracker</h3>
            </div>
            <span className="text-[10px] bg-pink-50 text-pink-700 px-2 py-0.5 rounded font-black uppercase">Simple Log</span>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">How heavy is your flow today?</label>
            <div className="grid grid-cols-3 gap-2">
              {["Light", "Medium", "Heavy"].map((flow) => (
                <button
                  key={flow}
                  onClick={() => handleLogFlow(flow)}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all text-center ${
                    flowToday === flow
                      ? "bg-pink-50 border-pink-350 text-pink-700 ring-1 ring-pink-500"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {flow}
                </button>
              ))}
            </div>
            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[10px] font-bold mt-1 text-center">
                ✓ Period flow logged successfully!
              </div>
            )}
          </div>
        </AhnaraCard>

        {/* Prediction Alert Card */}
        <AhnaraCard variant="flat" className="bg-amber-50 border border-amber-250 p-5 flex items-start gap-3 text-amber-950">
          <IconAlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wide text-amber-700">School Bag Checklist</h4>
            <p className="text-xs font-semibold mt-1 leading-normal text-amber-800">
              Your period is predicted to start in 3 days. Remember to pack pads/liners and spare clothes in your school bag!
            </p>
          </div>
        </AhnaraCard>

        {/* Irregularity reminder banner */}
        <AhnaraCard variant="flat" className="bg-pink-50/20 border border-pink-100 p-5 flex items-start gap-2.5 text-pink-950">
          <IconAlertCircle className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold leading-normal text-pink-850">
            <strong>Irregular Cycle Note:</strong> Irregular menstrual cycles are extremely common in the first few years after your first period. Your body is still adjusting to new hormone baselines! We help you track trends without stress.
          </p>
        </AhnaraCard>

      </aside>

    </div>
  );
}
