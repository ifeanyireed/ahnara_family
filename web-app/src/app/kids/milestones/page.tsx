"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconCheck,
  IconPhoneCall,
  IconShieldCheck,
  IconBabyCarriage,
  IconAlertCircle,
  IconCamera,
  IconFileText,
  IconQrcode,
  IconInfoCircle,
  IconLock
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

interface MilestoneItem {
  id: string;
  category: "Physical" | "Social" | "Language" | "Cognitive";
  ageCohort: string;
  prompt: string;
  checked: boolean;
  mediaAttached: boolean;
}

interface WalletDoc {
  id: string;
  category: "Labs" | "Consults" | "Prescriptions" | "School Clearances";
  name: string;
  date: string;
  verifiedBy: string;
  fileType: string;
}

export default function MilestonesAndWalletPage() {
  const [childName, setChildName] = useState("Aria");
  const [activeTab, setActiveTab] = useState<"milestones" | "wallet">("milestones");
  const [selectedAgeFilter, setSelectedAgeFilter] = useState("2m");
  
  // Milestones State (K.06)
  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    { id: "1", category: "Physical", ageCohort: "2m", prompt: "Lifts head when lying on tummy", checked: true, mediaAttached: false },
    { id: "2", category: "Social", ageCohort: "2m", prompt: "Smiles at you when you talk to them", checked: true, mediaAttached: true },
    { id: "3", category: "Language", ageCohort: "2m", prompt: "Makes cooing sounds when spoken to", checked: true, mediaAttached: false },
    
    { id: "4", category: "Physical", ageCohort: "6m", prompt: "Rolls over from tummy to back", checked: false, mediaAttached: false },
    { id: "5", category: "Social", ageCohort: "6m", prompt: "Recognizes familiar faces and laughs out loud", checked: false, mediaAttached: false },
    { id: "6", category: "Language", ageCohort: "6m", prompt: "Responds to name and makes babbling noises", checked: false, mediaAttached: false },
    
    { id: "7", category: "Physical", ageCohort: "12m", prompt: "Pulls up to stand and walks holding onto furniture", checked: false, mediaAttached: false },
    { id: "8", category: "Cognitive", ageCohort: "12m", prompt: "Finds hidden objects easily", checked: false, mediaAttached: false }
  ]);

  // Wallet State (K.07)
  const [walletDocs, setWalletDocs] = useState<WalletDoc[]>([
    { id: "doc1", category: "Labs", name: "Genotype Screen: Sickle Cell", date: "April 3, 2026", verifiedBy: "Lab Tech Musa K.", fileType: "PDF" },
    { id: "doc2", category: "Prescriptions", name: "Vitamin D3 Supplements", date: "May 14, 2026", verifiedBy: "Dr. Kenechi O.", fileType: "PDF" },
    { id: "doc3", category: "School Clearances", name: "Standard Infant Physical Record", date: "June 30, 2026", verifiedBy: "Pediatric Center A", fileType: "PDF" }
  ]);

  // Load child profile data
  useEffect(() => {
    const dataStr = localStorage.getItem("kids_profile_data");
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        setChildName(data.childName || "Aria");
      } catch (e) {}
    }
  }, []);

  const handleToggleMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, checked: !m.checked } : m));
  };

  const handleAttachMedia = (id: string) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, mediaAttached: true } : m));
    alert("Simulated camera scanner launch. Media file attached successfully.");
  };

  // Delayed Checkups Count
  const currentCohortMilestones = milestones.filter(m => m.ageCohort === selectedAgeFilter);
  const uncheckedCount = currentCohortMilestones.filter(m => !m.checked).length;
  
  // Encrypted wallet summary export
  const handleExportWallet = () => {
    alert("Generating encrypted FHIR-compliant JSON export token...");
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* LEFT/CENTER PANELS (9 COLS) */}
      <main className="lg:col-span-9 flex flex-col gap-3">
        
        {/* Title row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight text-display">Milestones &amp; Wallet</h2>
            <p className="text-slate-500 font-medium mt-1">
              Track developmental checkups and store portable medical files for <span className="font-bold text-[#0089C1]">{childName}</span>.
            </p>
          </div>

          <span className="bg-[#E8F3CE] border border-[#CDE0A4] text-[#608216] px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1.5 self-start md:self-auto">
            <IconShieldCheck className="w-4.5 h-4.5 text-[#608216]" />
            Locker Encrypted
          </span>
        </motion.div>

        {/* Tab switcher */}
        <div className="bg-white border border-slate-200/60 p-1.5 rounded-2xl shadow-xs flex items-center gap-1 my-1">
          <button
            onClick={() => setActiveTab("milestones")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "milestones" 
                ? "bg-[#1E293B] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Milestones &amp; Development
          </button>
          <button
            onClick={() => setActiveTab("wallet")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "wallet" 
                ? "bg-[#1E293B] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Digital Health Wallet
          </button>
        </div>

        {/* ACTIVE TAB WORKSPACE */}
        <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
          
          <AnimatePresence mode="wait">
            
            {/* TAB 1: MILESTONES LOGGER */}
            {activeTab === "milestones" && (
              <motion.div
                key="milestones"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {/* Age Filters */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <IconBabyCarriage className="w-5 h-5 text-[#0089C1]" />
                    <h3 className="text-base font-black text-slate-855 text-display">Developmental Checklists</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">Select age cohort checks:</p>
                  
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { id: "2m", label: "2 Months Old" },
                      { id: "6m", label: "6 Months Old" },
                      { id: "12m", label: "1 Year Old" }
                    ].map((cohort) => {
                      const isSelected = selectedAgeFilter === cohort.id;
                      return (
                        <button
                          key={cohort.id}
                          onClick={() => setSelectedAgeFilter(cohort.id)}
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                            isSelected
                              ? "bg-[#1E293B] border-slate-900 text-white shadow-xs"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          {cohort.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Milestone Checklist Items */}
                <div className="flex flex-col gap-2.5">
                  {currentCohortMilestones.map((m) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-2xl border text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all ${
                        m.checked
                          ? "bg-[#E8F3CE]/45 border-[#CDE0A4] text-[#608216]"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleMilestone(m.id)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all mt-0.5 flex-shrink-0 bg-white ${
                            m.checked ? "border-[#8BB436] text-[#608216]" : "border-slate-300"
                          } border`}
                        >
                          {m.checked && <IconCheck className="w-3.5 h-3.5" />}
                        </button>

                        <div className="flex flex-col">
                          <span className="text-xs font-black leading-none text-slate-800">{m.prompt}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                            Category: {m.category}
                          </span>
                        </div>
                      </div>

                      {/* Attach Video/Photo */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleAttachMedia(m.id)}
                          className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${
                            m.mediaAttached
                              ? "bg-emerald-50 border-emerald-250 text-emerald-700"
                              : "bg-white border-slate-200 hover:bg-slate-100 text-slate-500"
                          }`}
                        >
                          <IconCamera className="w-3.5 h-3.5" />
                          {m.mediaAttached ? "Media Attached ✓" : "Attach Media Proof"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delay warnings indicator */}
                {uncheckedCount > 0 && selectedAgeFilter !== "12m" && (
                  <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-4 flex items-start gap-3 text-left">
                    <IconAlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-orange-850 uppercase tracking-wide">Milestone Delay Warning Flag</span>
                      <p className="text-[10px] text-orange-700 font-semibold mt-1 leading-normal">
                        Recommendation: Mention these unchecked behavior indicators to your pediatrician during your next wellness clinic visit to verify development.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 2: HEALTH WALLET */}
            {activeTab === "wallet" && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <IconFileText className="w-5 h-5 text-[#0089C1]" />
                  <h3 className="text-base font-black text-slate-800 text-display">Secure Storage Locker</h3>
                </div>

                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  Portable offline-first digital wallet storing prescriptions, diagnostic lab results, and school physical clearance documents.
                </p>

                {/* Scanner Widget Trigger */}
                <div className="bg-slate-50 border border-dashed border-slate-350 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-slate-100/50 transition-all">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200">
                    <IconCamera className="w-5 h-5 text-[#0089C1]" />
                  </div>
                  <span className="text-xs font-black text-[#0089C1]">Document Camera Scanner</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Scan medical forms, lab printouts, or cards</span>
                </div>

                {/* Data folder structure list */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Wallet Documents Ledger</span>
                  {walletDocs.map((doc) => (
                    <div 
                      key={doc.id}
                      className="bg-white border border-slate-200/50 p-4 rounded-xl flex items-center justify-between shadow-xs hover:border-[#0089C1]/25 transition-all"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-9 h-9 rounded-lg bg-[#E6F5FA] flex items-center justify-center text-[#0089C1]">
                          <IconFileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 leading-snug">{doc.name}</h4>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight block mt-1">
                            {doc.category} • Logged: {doc.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-black">
                          Verified by {doc.verifiedBy}
                        </span>
                        <button 
                          onClick={() => alert("Launching PDF Document Viewer...")}
                          className="bg-[#0089C1] hover:bg-[#009EDA] text-white font-bold text-[9px] uppercase tracking-wider px-3.5 py-2 rounded-lg border-none"
                        >
                          View File
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Encrypted Export */}
                <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl">
                  <div className="flex items-start gap-2.5 text-left">
                    <IconLock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-slate-800">Encrypted Export utility</h4>
                      <p className="text-[9px] text-slate-400 leading-normal mt-0.5">
                        Compile verified immunizations and clinical growth percentiles to email/transmit directly to school registrar portals.
                      </p>
                    </div>
                  </div>

                  <AhnaraButton
                    variant="primary"
                    onClick={handleExportWallet}
                    className="bg-[#1E293B] hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl border-none shadow-sm whitespace-nowrap self-end sm:self-auto"
                  >
                    Encrypted Record Export
                  </AhnaraButton>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="lg:col-span-3 flex flex-col gap-3">
        
        {/* Desktop-only spacer */}
        <div className="hidden lg:block h-[68px]" />

        {/* Milestone feedback/Expert review coordination */}
        {activeTab === "milestones" ? (
          <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm text-left text-[#608216]">
            <div className="flex items-center justify-between border-b border-[#CDE0A4] pb-3">
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider">Expert Review</span>
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Clinical Feedback</h3>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-xs font-semibold">
              <p className="text-xs text-[#608216]/85 leading-relaxed">
                Attach video clips of Aria rolling or cooing to request a remote developmental audit from pediatric clinicians at Health Center A.
              </p>

              <button
                onClick={() => alert("Launching Pediatric Care Coordinator referral link...")}
                className="w-full bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md border-none"
              >
                <IconPhoneCall className="w-4 h-4" />
                Pediatric Expert Feedback
              </button>
            </div>
          </AhnaraCard>
        ) : (
          /* Offline QR Medical summary widget */
          <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm text-left text-[#608216]">
            <div className="flex items-center justify-between border-b border-[#CDE0A4] pb-3">
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider">Offline access</span>
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">QR Medical Passport</h3>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 text-xs font-semibold">
              <p className="text-xs text-[#608216]/85 leading-relaxed">
                Present this offline QR code to verify immunization logs at borders, travel stations, and school registration centers.
              </p>

              <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#CDE0A4]/15 flex items-center justify-center">
                <IconQrcode className="w-24 h-24 text-[#0089C1]" />
              </div>
            </div>
          </AhnaraCard>
        )}

        {/* Warning guidelines */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-200/50 p-5 flex flex-col gap-3 shadow-xs text-left">
          <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <IconInfoCircle className="w-4.5 h-4.5 text-amber-500 flex-shrink-0" />
            Clinical Notice
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
            Developmental windows vary by child. If a child doesn't meet exact cohort milestones, do not panic. Utilize expert review to receive direct clinician guidance.
          </p>
        </AhnaraCard>

      </aside>

    </div>
  );
}
