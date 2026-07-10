"use client";

import React, { useState } from "react";
import { 
  IconUser, 
  IconCheck, 
  IconInfoCircle,
  IconShield
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function GirlieSkinHygienePage() {
  const [selectedZones, setSelectedZones] = useState<Record<string, boolean>>({
    forehead: true,
    cheeks: false,
    chin: true,
    nose: false
  });

  const [routine, setRoutine] = useState({
    cleanserMorning: true,
    sunscreenDay: false,
    moisturizerNight: false
  });

  const [scanResult, setScanResult] = useState<string | null>(null);

  const toggleZone = (zone: string) => {
    setSelectedZones(prev => ({ ...prev, [zone]: !prev[zone] }));
  };

  const handleScan = () => {
    setScanResult("Warning: toothpaste contains calcium carbonate and sodium bicarbonate which dry the skin but severely disrupt your skin's acid mantle, causing micro-tears and increased post-inflammatory hyperpigmentation. Use a hydrocolloid patch instead.");
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Skincare inputs (6 cols) */}
      <main className="lg:col-span-6 flex flex-col gap-3">
        
        {/* Face zones tracker */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <IconUser className="w-6 h-6 text-pink-500" />
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Hormonal Acne Map</h3>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tap where you have acne breakouts</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "forehead", label: "Forehead" },
                { id: "cheeks", label: "Cheeks" },
                { id: "chin", label: "Chin" },
                { id: "nose", label: "Nose" }
              ].map((zone) => {
                const active = selectedZones[zone.id];
                return (
                  <button
                    key={zone.id}
                    onClick={() => toggleZone(zone.id)}
                    className={`p-4 rounded-xl border text-xs font-bold text-center transition-all ${
                      active 
                        ? "bg-pink-50 border-pink-200 text-pink-855" 
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100/50 text-slate-500"
                    }`}
                  >
                    {zone.label} {active ? "🔴" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        </AhnaraCard>

        {/* Daily routine */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Daily Hygiene Checklist</h3>

          <div className="flex flex-col gap-2">
            {[
              { id: "cleanserMorning", label: "Gentle Cleanser (Morning)", desc: "Cleanses perspiration without stripping natural oils." },
              { id: "sunscreenDay", label: "Sunscreen (Daytime)", desc: "Protects healing acne marks from darkening in the sun." },
              { id: "moisturizerNight", label: "Gentle Moisturizer (Night)", desc: "Supports natural skin barrier repair while sleeping." }
            ].map((step) => {
              const active = routine[step.id as keyof typeof routine];
              return (
                <button
                  key={step.id}
                  onClick={() => setRoutine(prev => ({ ...prev, [step.id]: !active }))}
                  className={`p-4 border rounded-xl text-xs text-left flex items-start justify-between transition-all ${
                    active 
                      ? "bg-pink-50 border-pink-200 text-pink-850" 
                      : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-black">{step.label}</span>
                    <span className="text-[10px] text-slate-450 font-bold">{step.desc}</span>
                  </div>
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                    active ? "bg-pink-500 text-white" : "border border-slate-350 bg-white"
                  }`}>
                    {active && <IconCheck className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </AhnaraCard>

      </main>

      {/* Ingredient checker (6 cols) */}
      <aside className="lg:col-span-6 flex flex-col gap-3">
        
        {/* Ingredient warnings */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <IconShield className="w-6 h-6 text-pink-500" />
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Ingredient Safety Checker</h3>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-slate-450 font-bold leading-normal block">
              Verify if cosmetic ingredients or DIY home remedies are safe for young sensitive skin.
            </span>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Toothpaste on pimples, Salicylic acid..."
                defaultValue="Toothpaste on pimples"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-xs font-bold outline-none text-slate-700"
              />
              <button 
                onClick={handleScan}
                className="bg-pink-500 hover:bg-pink-650 text-white font-black text-xs px-4 rounded-xl border-none shadow-sm active:scale-95 transition-all"
              >
                Check
              </button>
            </div>

            {scanResult && (
              <div className="p-4 bg-amber-50 border border-amber-250 text-amber-950 rounded-2xl text-[11px] font-bold leading-relaxed">
                {scanResult}
              </div>
            )}
          </div>
        </AhnaraCard>

        {/* Clinical Tip */}
        <AhnaraCard variant="flat" className="bg-pink-50/20 border border-pink-100 p-5 flex items-start gap-2.5 text-pink-950">
          <IconInfoCircle className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold leading-normal text-pink-800">
            Adolescent skin is highly sensitive. Avoid scrubs or washing your face more than twice a day. Over-washing strips oils, tricking your skin into producing even more sebum!
          </p>
        </AhnaraCard>

      </aside>

    </div>
  );
}
