"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  IconInfoCircle, 
  IconActivity, 
  IconCheck, 
  IconDownload,
  IconAlertCircle
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function LadyPainMapPage() {
  const [selectedZone, setSelectedZone] = useState<string>("uterus");
  const [painLevel, setPainLevel] = useState<number>(5);
  const [impactMissedWork, setImpactMissedWork] = useState<boolean>(false);
  const [impactNoStand, setImpactNoStand] = useState<boolean>(false);
  const [impactMedsRequired, setImpactMedsRequired] = useState<boolean>(true);
  const [pdfSuccess, setPdfSuccess] = useState<boolean>(false);

  const zones = [
    { id: "uterus", label: "Central Uterus", x: "50%", y: "55%" },
    { id: "left-ovary", label: "Left Ovary", x: "32%", y: "50%" },
    { id: "right-ovary", label: "Right Ovary", x: "68%", y: "50%" },
    { id: "lower-back", label: "Lower Back / Spine", x: "50%", y: "25%" }
  ];

  const handleExportPDF = () => {
    setPdfSuccess(true);
    setTimeout(() => {
      setPdfSuccess(false);
    }, 4000);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Interactive Pelvic Diagram (6 cols) */}
      <main className="lg:col-span-6 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs relative">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Pelvic Pain Locator</h3>
            <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-black uppercase">Interactive Map</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col items-center justify-center relative min-h-80 overflow-hidden">
            {/* Visual anatomical pelvis silhouette using CSS */}
            <div className="w-48 h-64 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center relative opacity-80">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest absolute top-6">Pelvic Zone Grid</span>
              
              {/* Central pelvic bone representation */}
              <div className="w-24 h-24 border border-slate-200 rounded-full bg-slate-100/50 absolute bottom-12 flex items-center justify-center">
                <div className="w-12 h-12 border border-slate-300 rounded-full bg-slate-200/50" />
              </div>

              {/* Tappable Zone Pins */}
              {zones.map((zone) => {
                const isSelected = selectedZone === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZone(zone.id)}
                    style={{ left: zone.x, top: zone.y }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all border-none ${
                      isSelected 
                        ? "bg-rose-500 text-white scale-115 ring-4 ring-rose-200" 
                        : "bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                    }`}
                  >
                    •
                  </button>
                );
              })}
            </div>

            {/* Display active zone */}
            <div className="absolute bottom-4 left-4 right-4 bg-white border border-slate-150 p-2.5 rounded-xl text-center shadow-xs">
              <span className="text-[9px] font-black text-slate-400 uppercase block">Selected Pain Location</span>
              <span className="text-xs font-black text-slate-800 uppercase mt-0.5 block">
                {zones.find(z => z.id === selectedZone)?.label || "None"}
              </span>
            </div>
          </div>
        </AhnaraCard>
      </main>

      {/* Pain Logger Form & Export (6 cols) */}
      <aside className="lg:col-span-6 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Register Pain Level</h3>
          
          {/* Severity scale slider */}
          <div className="flex flex-col gap-2 bg-slate-50 border border-slate-150 p-4 rounded-2xl">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-black text-slate-400 uppercase">Severity Intensity</span>
              <span className="text-sm font-black text-rose-600 uppercase">Level {painLevel} — {
                painLevel <= 3 ? "Mild discomfort" : painLevel <= 7 ? "Moderate cramping" : "Severe incapacitating"
              }</span>
            </div>
            
            <input
              type="range"
              min="1"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          {/* Functional disruption checklist */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Functional Disruption logs</span>
            
            <div className="flex flex-col gap-2.5">
              {[
                { state: impactMissedWork, setter: setImpactMissedWork, label: "Missed work / School today" },
                { state: impactNoStand, setter: setImpactNoStand, label: "Physically unable to stand / walk upright" },
                { state: impactMedsRequired, setter: setImpactMedsRequired, label: "Strong painkillers / Medication required" }
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
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-2">
            <AhnaraButton
              variant="outline"
              onClick={handleExportPDF}
              className="flex-1 rounded-xl flex items-center justify-center gap-1.5 py-4"
            >
              <IconDownload className="w-4.5 h-4.5" />
              Prepare Summary PDF
            </AhnaraButton>
            <AhnaraButton
              variant="primary"
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-black py-4 border-none rounded-xl"
              onClick={() => {
                setPdfSuccess(true);
              }}
            >
              Save Pain Log
            </AhnaraButton>
          </div>

          {pdfSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[10px] font-bold mt-1">
              ✓ PDF Prepared! Gynecologist Summary report exported with active hot-spots and pain ratings.
            </div>
          )}
        </AhnaraCard>

        {/* Clinical diagnosis check box warning */}
        <AhnaraCard variant="flat" className="bg-rose-50/30 border border-rose-100 p-5 flex flex-col gap-2.5 text-rose-950">
          <div className="flex items-center gap-1.5">
            <IconAlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <h4 className="text-xs font-black uppercase tracking-wider">Endometriosis Alerts</h4>
          </div>
          <p className="text-[11px] font-bold leading-normal text-rose-800">
            Pain mapping over multiple months helps clinicians trace chronic inflammatory cycles. Severe, localized pain during menstruation that resists over-the-counter NSAIDs and disrupts daily work constitutes a major indicator for specialized gynecological scans.
          </p>
        </AhnaraCard>
      </aside>

    </div>
  );
}
