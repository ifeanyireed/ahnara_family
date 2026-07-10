"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  IconPlayerPlay, 
  IconPlayerPause, 
  IconRefresh, 
  IconHeart, 
  IconShield, 
  IconActivity,
  IconCheck,
  IconAlertCircle
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function LadyCoachPage() {
  // Kegel Exercise Timer State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(5); // 5s cycles
  const [cycleType, setCycleType] = useState<"contract" | "relax">("contract");
  const [totalCompleted, setTotalCompleted] = useState<number>(0);

  // Comfort Logs state
  const [dryness, setDryness] = useState<boolean>(false);
  const [irritation, setIrritation] = useState<boolean>(false);
  const [bleeding, setBleeding] = useState<boolean>(false);
  const [clinicalAlert, setClinicalAlert] = useState<boolean>(false);
  const [loggedSuccess, setLoggedSuccess] = useState<boolean>(false);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Toggle cycle
            const nextType = cycleType === "contract" ? "relax" : "contract";
            setCycleType(nextType);
            if (nextType === "contract") {
              setTotalCompleted(t => t + 1);
            }
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, cycleType]);

  const handleReset = () => {
    setIsPlaying(false);
    setTimeLeft(5);
    setCycleType("contract");
    setTotalCompleted(0);
  };

  const handleSaveComfort = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggedSuccess(true);
    if (bleeding) {
      setClinicalAlert(true);
    } else {
      setClinicalAlert(false);
    }
    setTimeout(() => {
      setLoggedSuccess(false);
    }, 4500);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Kegel Timer Widget (6 cols) */}
      <main className="lg:col-span-6 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs items-center justify-center text-center">
          <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block">Pelvic Floor Coach</span>
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display mt-0.5">Kegel Countdown Timer</h3>

          {/* Circular countdown widget */}
          <div className="relative my-8 flex items-center justify-center">
            {/* Outer ring */}
            <div className="w-48 h-48 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
              
              {/* Pulsing colored center */}
              <motion.div
                animate={{ scale: isPlaying && cycleType === "contract" ? [1, 1.06, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-40 h-40 rounded-full flex flex-col items-center justify-center ${
                  cycleType === "contract" ? "bg-rose-50 text-rose-700" : "bg-slate-50 text-slate-600"
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider">{cycleType}</span>
                <p className="text-5xl font-black text-display my-1">{timeLeft}s</p>
                <span className="text-[10px] font-bold text-slate-400">Reps: {totalCompleted}</span>
              </motion.div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2.5 w-full">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 border-none"
            >
              {isPlaying ? <IconPlayerPause className="w-4.5 h-4.5" /> : <IconPlayerPlay className="w-4.5 h-4.5" />}
              {isPlaying ? "Pause Session" : "Start Session"}
            </button>
            
            <button
              onClick={handleReset}
              className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all border-none"
            >
              <IconRefresh className="w-4.5 h-4.5" />
            </button>
          </div>
        </AhnaraCard>
      </main>

      {/* Comfort logs and therapy guides (6 cols) */}
      <aside className="lg:col-span-6 flex flex-col gap-3">
        
        {/* Comfort Log Card */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Vaginal Comfort Checklist</h3>

          <form onSubmit={handleSaveComfort} className="flex flex-col gap-3">
            {[
              { state: dryness, setter: setDryness, label: "Dryness or friction discomfort" },
              { state: irritation, setter: setIrritation, label: "Itching / localized irritation" },
              { state: bleeding, setter: setBleeding, label: "Post-coital spotting or bleeding" }
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => item.setter(!item.state)}
                className={`p-3.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all ${
                  item.state 
                    ? "bg-rose-50 border-rose-200 text-rose-800" 
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100/50 text-slate-500"
                }`}
              >
                <span>{item.label}</span>
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                  item.state ? "bg-rose-500 text-white" : "border border-slate-350 bg-white"
                }`}>
                  {item.state && <IconCheck className="w-3.5 h-3.5" />}
                </div>
              </button>
            ))}

            <AhnaraButton
              variant="primary"
              type="submit"
              className="bg-rose-500 hover:bg-rose-600 text-white font-black py-4 border-none rounded-xl mt-2 w-full"
            >
              Submit Comfort Record
            </AhnaraButton>
          </form>

          {loggedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[10px] font-bold mt-1">
              ✓ Comfort logs uploaded successfully. Thank you for reporting.
            </div>
          )}

          {clinicalAlert && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-xl text-xs font-bold flex items-start gap-3 mt-1">
              <IconAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold uppercase text-[9px] tracking-wide text-red-700">Clinical Attention Recommended</p>
                <p className="mt-0.5 leading-normal">
                  Post-coital bleeding has been logged. While often benign, it is recommended to discuss this with your GP or book a quick nurse check-in.
                </p>
              </div>
            </div>
          )}
        </AhnaraCard>

        {/* Estrogen-free therapy list */}
        <AhnaraCard variant="flat" className="bg-rose-50/30 border border-rose-100 p-5 flex flex-col gap-2.5 text-rose-950">
          <div className="flex items-center gap-1.5">
            <IconShield className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <h4 className="text-xs font-black uppercase tracking-wider">Estrogen-Free Comfort Guides</h4>
          </div>
          <p className="text-[11px] font-bold leading-normal text-rose-800">
            Hormonal fluctuations during cycles or perimenopause can decrease natural lubrication. Hydrating vaginal moisturizers containing hyaluronic acid or water-based gels help manage localized dryness without systemic hormone exposure.
          </p>
        </AhnaraCard>

      </aside>

    </div>
  );
}
