"use client";

import React, { useState } from "react";
import { 
  IconMoodSmile, 
  IconScale, 
  IconApple, 
  IconShield,
  IconChevronRight
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function GirlieBodyImagePage() {
  const [height, setHeight] = useState<string>("158");
  const [weight, setWeight] = useState<string>("52");
  const [moodToday, setMoodToday] = useState<string>("Confident");

  // Meal logs (no calories)
  const [meals, setMeals] = useState({
    breakfast: true,
    lunch: true,
    dinner: false,
    snacks: true
  });

  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "Confident": return "✨";
      case "Normal": return "🌸";
      case "Struggling": return "❤️";
      default: return "";
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Inputs (7 cols) */}
      <main className="lg:col-span-7 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <IconScale className="w-6 h-6 text-pink-500" />
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Growth &amp; Body Check-in</h3>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            
            {/* Height/Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-slate-800"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-slate-800"
                />
              </div>
            </div>

            {/* Body Image mood selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">How do you feel about your body today?</label>
              <div className="grid grid-cols-3 gap-2">
                {["Confident", "Normal", "Struggling"].map((mood) => {
                  const selected = moodToday === mood;
                  return (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setMoodToday(mood)}
                      className={`p-3.5 rounded-xl border text-xs font-bold text-center flex flex-col items-center gap-1 transition-all ${
                        selected 
                          ? "bg-pink-50 border-pink-200 text-pink-850" 
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100/50 text-slate-500"
                      }`}
                    >
                      <span className="text-lg">{getMoodEmoji(mood)}</span>
                      <span>{mood}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Meal tracker without calorie limits */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Intuitive Meal Checkmarks (No Calories)</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "breakfast", label: "Morning Breakfast" },
                  { key: "lunch", label: "Midday Lunch" },
                  { key: "dinner", label: "Healthy Dinner" },
                  { key: "snacks", label: "Energy Snacks" }
                ].map((meal) => {
                  const active = meals[meal.key as keyof typeof meals];
                  return (
                    <button
                      key={meal.key}
                      type="button"
                      onClick={() => setMeals(prev => ({ ...prev, [meal.key]: !active }))}
                      className={`p-3.5 border rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all ${
                        active 
                          ? "bg-pink-50 border-pink-200 text-pink-850" 
                          : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}
                    >
                      <span>{meal.label}</span>
                      <IconApple className={`w-4 h-4 ${active ? "text-pink-500" : "text-slate-350"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <AhnaraButton
              variant="primary"
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white font-black py-4 border-none rounded-xl"
            >
              Log Body Check-in
            </AhnaraButton>
          </form>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[10px] font-bold text-center">
              ✓ Growth &amp; meals logged! Growth velocity calculations synced.
            </div>
          )}
        </AhnaraCard>
      </main>

      {/* Wellness & Screener (5 cols) */}
      <aside className="lg:col-span-5 flex flex-col gap-3">
        
        {/* Restrictive Screener Warn banner */}
        <AhnaraCard variant="flat" className="bg-pink-50/20 border border-pink-100 p-5 flex items-start gap-3">
          <IconShield className="w-6 h-6 text-pink-500 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <h4 className="font-extrabold text-xs uppercase tracking-wide text-pink-650">Ahnara Safe Space Screener</h4>
            <p className="text-[11px] font-bold leading-relaxed text-pink-800 mt-1">
              Our AI Growth Velocity monitors look for healthy height and weight ratios without strict calorie counters. We help identify dangerous restriction trends to protect your long-term bone development and puberty health!
            </p>
          </div>
        </AhnaraCard>

        {/* Academy self-esteem redirect */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Self-Esteem Academy</h3>
          
          <div className="flex flex-col gap-2.5">
            {[
              "Intuitive Eating & Nutrition",
              "Handling Body Image Social Pressure",
              "Growth Milestones Demystified"
            ].map((course, idx) => (
              <div 
                key={idx} 
                className="p-3.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-150 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
              >
                <div>
                  <span className="text-[9px] font-black text-pink-500 uppercase tracking-wider block">Course {idx + 1}</span>
                  <span className="text-xs font-black text-slate-800">{course}</span>
                </div>
                <IconChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </AhnaraCard>

      </aside>

    </div>
  );
}
