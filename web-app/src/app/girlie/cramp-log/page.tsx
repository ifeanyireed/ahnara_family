"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  IconActivity, 
  IconCheck, 
  IconInfoCircle,
  IconFlame,
  IconBarbell,
  IconHeart
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function GirlieCrampLogPage() {
  const [painLevel, setPainLevel] = useState<number>(3);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, boolean>>({
    cramps: true,
    acne: false,
    fatigue: true,
    mood: false,
    bloating: false
  });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const toggleSymptom = (key: string) => {
    setSelectedSymptoms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);

    const logs = JSON.parse(localStorage.getItem("girlie_cramp_logs") || "[]");
    logs.push({
      date: new Date().toLocaleDateString(),
      pain: painLevel,
      symptoms: selectedSymptoms,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("girlie_cramp_logs", JSON.stringify(logs));
  };

  const getPainEmoji = (level: number) => {
    switch (level) {
      case 1: return "😀 (No Pain)";
      case 2: return "🙂 (Mild)";
      case 3: return "😐 (Moderate)";
      case 4: return "😟 (Severe)";
      case 5: return "😭 (Very Severe)";
      default: return "😐";
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Logger inputs (6 cols) */}
      <main className="lg:col-span-6 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <IconActivity className="w-6 h-6 text-pink-500" />
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Symptom &amp; Cramp Logger</h3>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            
            {/* Emoji pain slider */}
            <div className="flex flex-col gap-2 bg-pink-50/20 border border-pink-100 p-4 rounded-2xl">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black text-pink-650 uppercase tracking-widest">Pain Severity Scale</span>
                <span className="text-xs font-black text-pink-600 uppercase">{getPainEmoji(painLevel)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
                className="w-full h-1 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500 my-2"
              />
            </div>

            {/* Symptoms grid */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acne, Mood, &amp; Body Checkmarks</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: "cramps", label: "Tummy Cramps" },
                  { key: "acne", label: "Skin Acne / Spots" },
                  { key: "fatigue", label: "Low Energy / Fatigue" },
                  { key: "mood", label: "Emotional Mood Swings" },
                  { key: "bloating", label: "Stomach Bloating" }
                ].map((symptom) => {
                  const active = selectedSymptoms[symptom.key];
                  return (
                    <button
                      key={symptom.key}
                      type="button"
                      onClick={() => toggleSymptom(symptom.key)}
                      className={`p-3.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all ${
                        active 
                          ? "bg-pink-50 border-pink-200 text-pink-800" 
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100/50 text-slate-500"
                      }`}
                    >
                      <span>{symptom.label}</span>
                      <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                        active ? "bg-pink-500 text-white" : "border border-slate-350 bg-white"
                      }`}>
                        {active && <IconCheck className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <AhnaraButton
              variant="primary"
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white font-black py-4 border-none rounded-xl w-full"
            >
              Log Daily Symptoms
            </AhnaraButton>
          </form>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[10px] font-bold text-center">
              ✓ Daily symptoms logged! Pain level {painLevel}/5 saved.
            </div>
          )}
        </AhnaraCard>
      </main>

      {/* Relieve strategies (6 cols) */}
      <aside className="lg:col-span-6 flex flex-col gap-3">
        
        {/* Pain Relief Drawer Tips */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Non-Medicinal Cramp Relief</h3>

          <div className="flex flex-col gap-3">
            {[
              { icon: IconFlame, title: "Apply Localized Warmth", desc: "Place a warm water bottle or heating pad on your lower abdomen for 15-20 minutes to relax uterine contractions." },
              { icon: IconBarbell, title: "Gentle Muscle Stretching", desc: "Try child's pose, butterfly stretch, or gentle yoga flows to relieve lower back tension and improve pelvic blood flow." },
              { icon: IconHeart, title: "Magnesium & Hydration", desc: "Drink warm herbal chamomile teas and eat magnesium-rich foods (like banana slices or dark chocolate) to alleviate uterine muscle cramps." }
            ].map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex gap-3.5 items-start">
                  <div className="p-2 bg-pink-50 rounded-lg text-pink-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-slate-800 uppercase tracking-wide">{tip.title}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">{tip.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </AhnaraCard>

        {/* Clinical Disclaimer */}
        <AhnaraCard variant="flat" className="bg-pink-50/25 border border-pink-100 p-5 flex items-start gap-2.5 text-pink-950">
          <IconInfoCircle className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold leading-normal text-pink-800">
            Ahnara focuses on lifestyle and restorative comfort. If your cramp pain exceeds Level 4, prevents you from attending school, or does not respond to heating pads, please consult your school nurse or click Parent Link to coordinate pediatrician consults.
          </p>
        </AhnaraCard>

      </aside>

    </div>
  );
}
