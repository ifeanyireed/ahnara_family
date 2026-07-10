"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconFileText,
  IconUser,
  IconCheck,
  IconLock,
  IconLockOpen,
  IconHeart,
  IconMapPin,
  IconAmbulance,
  IconDroplet,
  IconFileCertificate,
  IconDownload,
  IconPencil,
  IconInfoCircle,
  IconClock,
  IconCircleCheck
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

interface BirthPlanState {
  painManagement: string[];
  companionName: string;
  companionRole: string;
  environment: string[];
  backupHospital: string;
  transportType: string;
  bloodType: string;
  donorName: string;
  donorPhone: string;
  isLocked: boolean;
  verificationStatus: "draft" | "pending" | "verified";
  verifiedBy?: string;
  verifiedDate?: string;
}

export default function BirthPlanPage() {
  const [activeTab, setActiveTab] = useState<"preferences" | "backups" | "verification">("preferences");
  
  // Birth plan state loaded from localStorage or initialized
  const [plan, setPlan] = useState<BirthPlanState>({
    painManagement: ["Natural Breathing"],
    companionName: "Nathaniel Dhillon",
    companionRole: "Husband / Partner",
    environment: ["Low Lighting", "Quiet Room"],
    backupHospital: "Health Center A",
    transportType: "Personal Car",
    bloodType: "O-positive (O+)",
    donorName: "Musa Ibrahim",
    donorPhone: "+234 809 111 2222",
    isLocked: false,
    verificationStatus: "draft"
  });

  // Load plan state on mount
  useEffect(() => {
    const saved = localStorage.getItem("mama_birth_plan");
    if (saved) {
      try {
        setPlan(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading birth plan", e);
      }
    }
  }, []);

  const savePlan = (updated: BirthPlanState) => {
    setPlan(updated);
    localStorage.setItem("mama_birth_plan", JSON.stringify(updated));
  };

  const togglePainChoice = (choice: string) => {
    if (plan.isLocked) return;
    const current = [...plan.painManagement];
    const idx = current.indexOf(choice);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(choice);
    }
    savePlan({ ...plan, painManagement: current });
  };

  const toggleEnvChoice = (choice: string) => {
    if (plan.isLocked) return;
    const current = [...plan.environment];
    const idx = current.indexOf(choice);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(choice);
    }
    savePlan({ ...plan, environment: current });
  };

  const handleTextChange = (field: keyof BirthPlanState, val: string) => {
    if (plan.isLocked) return;
    savePlan({ ...plan, [field]: val });
  };

  const handleLockAndSubmit = () => {
    if (plan.isLocked) return;
    savePlan({
      ...plan,
      isLocked: true,
      verificationStatus: "pending"
    });
  };

  const handleUnlockPlan = () => {
    savePlan({
      ...plan,
      isLocked: false,
      verificationStatus: "draft"
    });
  };

  // Mock Midwife verification trigger (adds premium feel)
  const simulateMidwifeVerification = () => {
    savePlan({
      ...plan,
      isLocked: true,
      verificationStatus: "verified",
      verifiedBy: "Midwife Priscilla O.",
      verifiedDate: new Date().toLocaleDateString()
    });
  };

  const planStatusLabel = plan.verificationStatus === "verified" 
    ? "Verified" 
    : plan.verificationStatus === "pending" 
      ? "Pending" 
      : "Draft";

  const planStatusPercent = plan.verificationStatus === "verified" 
    ? 100 
    : plan.verificationStatus === "pending" 
      ? 66 
      : 33;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* LEFT/CENTER PLANNER PANELS (9 COLS) */}
      <main className="lg:col-span-9 flex flex-col gap-3">
        
        {/* Header greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-display">Digital Birth Plan</h2>
            <p className="text-slate-500 font-medium mt-1">
              Document your labor preferences and emergency clinical backups.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {plan.isLocked ? (
              <span className="flex items-center gap-1.5 bg-[#1E293B] border border-slate-700 text-white px-3.5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xs">
                <IconLock className="w-3.5 h-3.5 text-emerald-400" />
                Plan Locked
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xs">
                <IconLockOpen className="w-3.5 h-3.5 text-orange-400" />
                Draft Mode
              </span>
            )}
          </div>
        </motion.div>

        {/* TOP CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2 mb-3">
          
          {/* Card 1: Plan Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Plan Status</span>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                  plan.verificationStatus === "verified"
                    ? "bg-[#F5F8EB] text-[#9CC031]"
                    : plan.verificationStatus === "pending"
                      ? "bg-amber-50 text-amber-500"
                      : "bg-slate-100 text-slate-500"
                }`}>
                  <IconFileText className="w-4.5 h-4.5" />
                </div>
              </div>
              
              {/* Progress bar matching dashboard */}
              <div className="h-16 w-full flex flex-col justify-center gap-2 mb-2">
                <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${planStatusPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      plan.verificationStatus === "verified"
                        ? "bg-[#C5EC59]"
                        : plan.verificationStatus === "pending"
                          ? "bg-amber-400"
                          : "bg-slate-400"
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-1.5 mt-2">
                <span className={`text-3xl font-extrabold text-display ${
                  plan.verificationStatus === "verified"
                    ? "text-[#608216]"
                    : plan.verificationStatus === "pending"
                      ? "text-amber-600"
                      : "text-slate-700"
                }`}>{planStatusLabel}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  {plan.verificationStatus === "verified" ? "Verified" : "In Progress"}
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 2: Primary Companion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[174px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Birth Companion</span>
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shadow-[0_2px_8px_rgba(59,130,246,0.1)]">
                    <IconUser className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="h-16 w-full flex flex-col justify-center mb-2">
                  <span className="text-sm font-black text-slate-700 truncate leading-snug">
                    {plan.companionName || "None Assigned"}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold mt-1">
                    {plan.companionRole || "Labor Support"}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Primary Companion Logged
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 3: Pain Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[174px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pain Preferences</span>
                  <div className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center shadow-[0_2px_8px_rgba(239,68,68,0.1)]">
                    <IconHeart className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="h-16 w-full flex flex-col justify-center mb-2">
                  <span className="text-3xl font-extrabold text-slate-800 tracking-tight text-display">
                    {plan.painManagement.length} Items
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide truncate w-full">
                  Primary: {plan.painManagement[0] || "None Selected"}
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 4: Backup Hospital */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-full"
          >
            <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[174px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Backup Facility</span>
                  <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shadow-[0_2px_8px_rgba(20,184,166,0.1)]">
                    <IconMapPin className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="h-16 w-full flex flex-col justify-center mb-2">
                  <span className="text-sm font-black text-slate-700 truncate leading-snug">
                    {plan.backupHospital || "Not Selected"}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold mt-1">
                    {plan.transportType || "No Transport Logged"}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Emergency clinical backup
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

        </div>

        {/* Tab switcher inside Left Panel */}
        <div className="bg-white border border-slate-100 p-1.5 rounded-2xl shadow-xs flex items-center gap-1">
          {[
            { id: "preferences", label: "1. Preferences" },
            { id: "backups", label: "2. Emergency Backups" },
            { id: "verification", label: "3. Verification" }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? "bg-[#1E293B] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB WORKSPACE */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
          
          <AnimatePresence mode="wait">
            
            {activeTab === "preferences" && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {/* Section 1: Pain Management choices */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <IconHeart className="w-5 h-5 text-red-500" />
                    <h3 className="text-base font-black text-slate-800 text-display">Labor &amp; Pain Management</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">Select your preferred pain management techniques during labor (Select all that apply):</p>
                  
                  <div className="flex flex-wrap gap-2 mt-1">
                    {[
                      "Natural Breathing Techniques",
                      "Warm Water Tub / Bath",
                      "Epidural Block",
                      "Massage & Acupressure",
                      "Gas & Air (Entonox)",
                      "Birthing Ball Support"
                    ].map((choice) => {
                      const isSelected = plan.painManagement.includes(choice);
                      return (
                        <button
                          key={choice}
                          onClick={() => togglePainChoice(choice)}
                          disabled={plan.isLocked}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? "bg-[#E8F3CE] border-[#8BB436] text-[#608216]"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Companion & Partner details */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <IconUser className="w-5 h-5 text-[#0089C1]" />
                    <h3 className="text-base font-black text-slate-800 text-display">Companion Presence</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Companion Full Name</label>
                      <input
                        type="text"
                        disabled={plan.isLocked}
                        value={plan.companionName}
                        onChange={(e) => handleTextChange("companionName", e.target.value)}
                        placeholder="e.g. Nathaniel Dhillon"
                        className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:bg-white focus:border-slate-300 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Relationship / Role</label>
                      <input
                        type="text"
                        disabled={plan.isLocked}
                        value={plan.companionRole}
                        onChange={(e) => handleTextChange("companionRole", e.target.value)}
                        placeholder="e.g. Husband / Partner"
                        className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:bg-white focus:border-slate-300 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Room Environment */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <IconFileText className="w-5 h-5 text-[#FF904C]" />
                    <h3 className="text-base font-black text-slate-800 text-display">Delivery Environment</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">Select choices that make you feel comfortable and secure in the delivery room:</p>
                  
                  <div className="flex flex-wrap gap-2 mt-1">
                    {[
                      "Low Lighting (Dimmed / Warm)",
                      "Quiet Room (No non-essential staff)",
                      "Background Music Playlist",
                      "Partner cuts umbilical cord",
                      "Immediate Skin-to-Skin contact",
                      "Breastfeeding support immediately"
                    ].map((choice) => {
                      const isSelected = plan.environment.includes(choice);
                      return (
                        <button
                          key={choice}
                          onClick={() => toggleEnvChoice(choice)}
                          disabled={plan.isLocked}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? "bg-[#E8F3CE] border-[#8BB436] text-[#608216]"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === "backups" && (
              <motion.div
                key="backups"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {/* EMERGENCY CLINICAL BACKUP FORM */}
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <IconAmbulance className="w-5 h-5 text-red-500 animate-pulse" />
                  <h3 className="text-base font-black text-slate-800 text-display">Emergency Clinical Backups</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Backup Referral Facility</label>
                    <div className="relative">
                      <input
                        type="text"
                        disabled={plan.isLocked}
                        value={plan.backupHospital}
                        onChange={(e) => handleTextChange("backupHospital", e.target.value)}
                        placeholder="e.g. Health Center A / General Hospital"
                        className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 pl-3 pr-8 text-xs outline-none focus:bg-white focus:border-slate-300 font-semibold"
                      />
                      <IconMapPin className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Emergency Transportation Plan</label>
                    <input
                      type="text"
                      disabled={plan.isLocked}
                      value={plan.transportType}
                      onChange={(e) => handleTextChange("transportType", e.target.value)}
                      placeholder="e.g. Personal car / Hospital Ambulance"
                      className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:bg-white focus:border-slate-300 font-semibold"
                    />
                  </div>
                </div>

                {/* BLOOD TRANSFUSION & DONOR DETAILS */}
                <div className="bg-slate-50/50 border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <IconDroplet className="w-5 h-5 text-red-500 fill-current" />
                    <h4 className="text-sm font-black text-slate-800">Maternal Blood &amp; Donor Details</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maternal Blood Type</label>
                      <input
                        type="text"
                        disabled={plan.isLocked}
                        value={plan.bloodType}
                        onChange={(e) => handleTextChange("bloodType", e.target.value)}
                        placeholder="e.g. O-positive (O+)"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-slate-300 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Backup Blood Donor Name</label>
                      <input
                        type="text"
                        disabled={plan.isLocked}
                        value={plan.donorName}
                        onChange={(e) => handleTextChange("donorName", e.target.value)}
                        placeholder="e.g. Musa Ibrahim"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-slate-300 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Donor Phone Number</label>
                      <input
                        type="text"
                        disabled={plan.isLocked}
                        value={plan.donorPhone}
                        onChange={(e) => handleTextChange("donorPhone", e.target.value)}
                        placeholder="e.g. +234 809 111 2222"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-slate-300 font-semibold"
                      />
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === "verification" && (
              <motion.div
                key="verification"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-5 text-center items-center py-6"
              >
                {plan.verificationStatus === "verified" ? (
                  /* VERIFIED STATE */
                  <div className="flex flex-col items-center gap-4 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-[#E8F3CE] text-[#8BB436] flex items-center justify-center shadow-sm">
                      <IconFileCertificate className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 text-display">Ahnara Clinically Verified</h3>
                      <p className="text-xs text-[#608216] font-bold uppercase tracking-wider mt-0.5">
                        Verified by {plan.verifiedBy} on {plan.verifiedDate}
                      </p>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2.5">
                        Your birth plan has been reviewed and approved by your healthcare provider. It is locked and synchronized to the hospital&apos;s EHR spine.
                      </p>
                    </div>

                    <div className="flex gap-2 w-full mt-3">
                      <AhnaraButton
                        variant="outline"
                        onClick={handleUnlockPlan}
                        className="flex-1 rounded-xl h-10 text-xs font-bold border-slate-200 text-slate-600"
                      >
                        Unlock Draft
                      </AhnaraButton>
                      <AhnaraButton
                        variant="outline"
                        leftIcon={<IconDownload className="w-4 h-4" />}
                        className="flex-1 border-[#CDE0A4] bg-[#E8F3CE]/45 text-[#608216] rounded-xl h-10 text-xs font-bold"
                      >
                        PDF Export
                      </AhnaraButton>
                    </div>
                  </div>
                ) : plan.verificationStatus === "pending" ? (
                  /* PENDING REVIEW STATE */
                  <div className="flex flex-col items-center gap-4 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center animate-pulse">
                      <IconClock className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 text-display">Pending Midwife Signoff</h3>
                      <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mt-0.5">
                        Locked &amp; Transmitted
                      </p>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2.5">
                        Your clinical backups and environment choices have been locked. A midwife at Health Center A will review your plan during your next visit.
                      </p>
                    </div>

                    <div className="flex gap-2 w-full mt-3">
                      <AhnaraButton
                        variant="outline"
                        onClick={handleUnlockPlan}
                        className="flex-1 rounded-xl h-10 text-xs font-bold border-slate-200 text-slate-600"
                      >
                        Unlock &amp; Edit
                      </AhnaraButton>
                      <AhnaraButton
                        variant="primary"
                        onClick={simulateMidwifeVerification}
                        className="flex-1 bg-[#8BB436] hover:bg-[#7ba22c] border-none text-white rounded-xl h-10 text-xs font-bold"
                      >
                        Mock Midwife Verify
                      </AhnaraButton>
                    </div>
                  </div>
                ) : (
                  /* DRAFT SUBMISSION STATE */
                  <div className="flex flex-col items-center gap-4 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center">
                      <IconLockOpen className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 text-display">Submit Birth Plan</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        Current Status: Draft Plan
                      </p>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2.5">
                        Review all pain management, companions, and emergency transport details before submitting. Once submitted, your choices will lock.
                      </p>
                    </div>

                    <AhnaraButton
                      variant="primary"
                      onClick={handleLockAndSubmit}
                      className="w-full bg-[#0089C1] hover:bg-[#0089C1]/90 border-none text-white rounded-xl h-11 text-xs font-black mt-2 shadow-xs"
                    >
                      Lock &amp; Request Clinician Review
                    </AhnaraButton>
                  </div>
                )}

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </main>

      {/* RIGHT SIDEBAR (3 COLS) */}
      <aside className="lg:col-span-3 flex flex-col gap-3">
        
        {/* Desktop-only spacer */}
        <div className="hidden lg:block h-[68px]" />

        {/* Live Birth Plan Summary Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm text-left relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#C7DB9C] pb-3">
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider">Real-time preview</span>
                <h3 className="font-extrabold text-lg text-[#0D090C] text-display">Birth Passport</h3>
              </div>
              <IconFileCertificate className="w-5 h-5 text-[#608216]" />
            </div>

            <div className="flex flex-col gap-3.5 text-xs text-[#608216] font-semibold">
              
              {/* Pain preferences */}
              <div>
                <span className="text-[9px] text-[#608216]/60 font-black uppercase tracking-wider block">Pain Management</span>
                <p className="font-black text-slate-800 text-xs mt-0.5 truncate">
                  {plan.painManagement.join(", ") || "No selection"}
                </p>
              </div>

              {/* Companion */}
              <div>
                <span className="text-[9px] text-[#608216]/60 font-black uppercase tracking-wider block">Companion presence</span>
                <p className="font-black text-slate-800 text-xs mt-0.5">
                  {plan.companionName ? `${plan.companionName} (${plan.companionRole})` : "None"}
                </p>
              </div>

              {/* Backups */}
              <div className="border-t border-[#C7DB9C] pt-2.5 flex flex-col gap-2">
                <div>
                  <span className="text-[9px] text-[#608216]/60 font-black uppercase tracking-wider block">Blood Type</span>
                  <span className="font-black text-red-600 text-xs mt-0.5 block">{plan.bloodType || "O-positive"}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#608216]/60 font-black uppercase tracking-wider block">Backup Facility</span>
                  <span className="font-black text-slate-800 text-xs mt-0.5 block truncate">{plan.backupHospital}</span>
                </div>
              </div>

              {/* Verification Status Badge */}
              <div className="mt-1">
                {plan.verificationStatus === "verified" ? (
                  <div className="bg-[#8BB436] text-white px-3 py-1.5 rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-wider shadow-xs">
                    <IconCircleCheck className="w-4 h-4" />
                    Verified Birth Plan
                  </div>
                ) : plan.verificationStatus === "pending" ? (
                  <div className="bg-orange-500 text-white px-3 py-1.5 rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-wider shadow-xs">
                    <IconClock className="w-4 h-4 animate-spin" />
                    Pending Midwife Review
                  </div>
                ) : (
                  <div className="bg-[#1E293B] text-white px-3 py-1.5 rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-wider">
                    <IconInfoCircle className="w-4 h-4" />
                    Draft Birth Plan
                  </div>
                )}
              </div>

            </div>
          </AhnaraCard>
        </motion.div>

        {/* Informational help card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-3 shadow-xs text-left">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
              <IconInfoCircle className="w-4 h-4 text-[#0089C1]" />
              Why lock backups?
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Separating environments from emergency backups ensures clinical staff can instantly locate your blood type, backup facility, and donor data during labor.
            </p>
          </AhnaraCard>
        </motion.div>

      </aside>

    </div>
  );
}
