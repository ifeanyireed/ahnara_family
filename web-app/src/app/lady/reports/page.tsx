"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  IconFileText, 
  IconCheck, 
  IconQrcode,
  IconDownload,
  IconClock,
  IconShieldCheck
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function LadyReportsPage() {
  const [reportRange, setReportRange] = useState<string>("3");
  const [includePainMap, setIncludePainMap] = useState<boolean>(true);
  const [includeVitals, setIncludeVitals] = useState<boolean>(true);
  const [includeMeds, setIncludeMeds] = useState<boolean>(true);
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false);
  const [pdfReady, setPdfReady] = useState<boolean>(false);

  const handleGenerateReport = () => {
    setPdfGenerating(true);
    setPdfReady(false);
    setTimeout(() => {
      setPdfGenerating(false);
      setPdfReady(true);
    }, 2000);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Parameters & Selectors (6 cols) */}
      <main className="lg:col-span-6 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <IconFileText className="w-6 h-6 text-rose-500" />
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Report Compiler</h3>
          </div>

          <div className="flex flex-col gap-3 mt-1">
            {/* Timeline range */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Historical Range</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "3", label: "Past 3 Months" },
                  { value: "6", label: "Past 6 Months" },
                  { value: "12", label: "Past Year" }
                ].map((range) => (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() => setReportRange(range.value)}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      reportRange === range.value
                        ? "bg-rose-50 border-rose-350 text-rose-700 ring-1 ring-rose-500"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist options */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Include Data Sections</label>
              
              {[
                { state: includePainMap, setter: setIncludePainMap, label: "Interactive Pelvic Pain Map Logs" },
                { state: includeVitals, setter: setIncludeVitals, label: "Basal Body Temp & Mucus Curve Tables" },
                { state: includeMeds, setter: setIncludeMeds, label: "HRT Compliance & Contraceptive Logs" }
              ].map((sec, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sec.setter(!sec.state)}
                  className={`p-3.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all ${
                    sec.state 
                      ? "bg-rose-50 border-rose-200 text-rose-800" 
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100/50 text-slate-500"
                  }`}
                >
                  <span>{sec.label}</span>
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                    sec.state ? "bg-rose-500 text-white" : "border border-slate-350 bg-white"
                  }`}>
                    {sec.state && <IconCheck className="w-3.5 h-3.5" />}
                  </div>
                </button>
              ))}
            </div>

            <AhnaraButton
              variant="primary"
              onClick={handleGenerateReport}
              disabled={pdfGenerating}
              className="bg-rose-500 hover:bg-rose-600 text-white font-black py-4 border-none rounded-xl mt-3 w-full flex items-center justify-center gap-1.5"
            >
              {pdfGenerating ? (
                <>
                  <IconClock className="w-5 h-5 animate-spin" />
                  Compiling Vault Logs...
                </>
              ) : (
                <>
                  <IconFileText className="w-5 h-5" />
                  Generate Gynecologist Report
                </>
              )}
            </AhnaraButton>
          </div>
        </AhnaraCard>
      </main>

      {/* Previews and QR Code (6 cols) */}
      <aside className="lg:col-span-6 flex flex-col gap-3">
        
        {/* Report Preview */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Clinical Summary Preview</h3>
          
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 text-xs font-semibold text-slate-600 flex flex-col gap-3">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="font-black uppercase text-[9px] text-slate-400">Parameter</span>
              <span className="font-black uppercase text-[9px] text-slate-400">Value</span>
            </div>
            
            <div className="flex justify-between">
              <span>Avg Menstrual Cycle Length</span>
              <span className="font-black text-slate-800">28.2 days</span>
            </div>
            
            <div className="flex justify-between">
              <span>Estimated Monthly Blood Loss</span>
              <span className="font-black text-slate-800">35 ml (Normal)</span>
            </div>
            
            <div className="flex justify-between">
              <span>Max Pelvic Pain Index</span>
              <span className="font-black text-rose-600">Level 6 (Day 2)</span>
            </div>

            <div className="flex justify-between">
              <span>HRT Dose Adherence</span>
              <span className="font-black text-emerald-600">92%</span>
            </div>
          </div>

          {pdfReady && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3 border-t border-slate-100 pt-4"
            >
              {/* Secure QR Code Scanner box */}
              <div className="p-4 bg-rose-50/40 border border-rose-100 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex-1 text-left">
                  <span className="text-[9px] font-black text-rose-600 uppercase tracking-wider block">Clinic Portal Sync</span>
                  <p className="text-xs font-black text-slate-800 mt-0.5">Secure QR Sync Enabled</p>
                  <span className="text-[10px] text-slate-450 font-bold block mt-1 leading-normal">
                    Let your gynecologist scan this code to import these structured metrics directly into their clinical dashboard.
                  </span>
                </div>
                <div className="p-2 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <IconQrcode className="w-16 h-16 text-slate-800" />
                </div>
              </div>

              <AhnaraButton
                variant="outline"
                className="w-full py-4 rounded-xl flex items-center justify-center gap-1.5"
              >
                <IconDownload className="w-5 h-5 text-rose-500" />
                Download PDF Document
              </AhnaraButton>
            </motion.div>
          )}
        </AhnaraCard>

        {/* Data consent disclaimer */}
        <AhnaraCard variant="flat" className="bg-rose-50/20 border border-rose-100 p-5 flex items-start gap-2.5 text-rose-950">
          <IconShieldCheck className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold leading-normal text-rose-800">
            Ahnara uses end-to-end zero-knowledge clinical vault encryption. Your cycle logs, pain maps, and fertility details are fully locked. Generating this report compiles a temporary document. Only sharing the QR code grants access to authorized medical clinicians.
          </p>
        </AhnaraCard>

      </aside>

    </div>
  );
}
