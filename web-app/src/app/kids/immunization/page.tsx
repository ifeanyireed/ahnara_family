"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconCalendarEvent,
  IconCheck,
  IconChevronRight,
  IconChevronDown,
  IconDownload,
  IconFileText,
  IconMapPin,
  IconClock,
  IconNurse,
  IconAward,
  IconQrcode,
  IconScale,
  IconDroplet,
  IconFlask,
  IconAlertOctagon
} from "@tabler/icons-react";
import { useAuth } from "@/components/ahnara/AuthContext";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

interface VaccineDose {
  id: number;
  name: string;
  ageCohort: string;
  status: "administered" | "scheduled" | "overdue";
  dateGiven?: string;
  nurseName?: string;
  batchNumber?: string;
  clinicName?: string;
  details: string[];
}

export default function VaccineSchedulerPage() {
  const { user } = useAuth();
  const [childName, setChildName] = useState("Aria");
  const [activeTab, setActiveTab] = useState<"timeline" | "wallet">("timeline");
  const [expandedCohortId, setExpandedCohortId] = useState<number | null>(2); // Expand 6 weeks by default
  const [smsScheduled, setSmsScheduled] = useState(true);

  const initialDoses: VaccineDose[] = [
    {
      id: 1,
      name: "Birth Vouchers",
      ageCohort: "At Birth",
      status: "administered",
      dateGiven: "April 2, 2026",
      nurseName: "Nurse Priscilla O.",
      batchNumber: "BCG-2026-X84",
      clinicName: "Health Center A",
      details: ["BCG (Tuberculosis)", "OPV 0 (Oral Polio Vaccine)", "HepB 0 (Hepatitis B)"]
    },
    {
      id: 2,
      name: "6-Week Cohort",
      ageCohort: "6 Weeks Old",
      status: "administered",
      dateGiven: "May 14, 2026",
      nurseName: "Nurse Priscilla O.",
      batchNumber: "PENTA1-99A0",
      clinicName: "Health Center A",
      details: ["Pentavalent 1 (Diphtheria, Pertussis, Tetanus, HepB, Hib)", "OPV 1 (Polio)", "Rotavirus 1", "PCV 1 (Pneumococcal)"]
    },
    {
      id: 3,
      name: "10-Week Cohort",
      ageCohort: "10 Weeks Old",
      status: "scheduled",
      details: ["Pentavalent 2", "OPV 2", "Rotavirus 2", "PCV 2"]
    },
    {
      id: 4,
      name: "14-Week Cohort",
      ageCohort: "14 Weeks Old",
      status: "scheduled",
      details: ["Pentavalent 3", "OPV 3", "IPV 1 (Inactivated Polio)", "PCV 3", "Rotavirus 3"]
    },
    {
      id: 5,
      name: "9-Month Cohort",
      ageCohort: "9 Months Old",
      status: "scheduled",
      details: ["Measles 1", "Yellow Fever", "IPV 2"]
    },
    {
      id: 6,
      name: "12-Month Cohort",
      ageCohort: "12 Months Old",
      status: "scheduled",
      details: ["Meningitis A", "Measles 2", "PCV Booster"]
    }
  ];

  const [doses, setDoses] = useState<VaccineDose[]>(initialDoses);

  // Load child profile data
  useEffect(() => {
    if (!user || user.id.startsWith("mock-")) {
      const dataStr = localStorage.getItem("kids_profile_data");
      if (dataStr) {
        try {
          const data = JSON.parse(dataStr);
          setChildName(data.childName || "Aria");
        } catch (e) {}
      }
      return;
    }

    const fetchChildVaccines = async () => {
      try {
        const { api } = await import("@/lib/api");
        
        // Fetch household members to locate child
        const members = await api.get("/households/hh-family-001/members");
        const childMember = members.find((m: any) => m.relationType === "child");
        
        const childId = childMember ? childMember.userId : "usr-child-001";
        
        // Set name dynamically from split email or default
        if (childMember && childMember.user) {
          setChildName(childMember.user.email.split("@")[0].replace(".", " "));
        } else {
          setChildName("Aria");
        }

        const vaccineData = await api.get(`/ehr/vaccines/patient/${childId}`);
        if (vaccineData && vaccineData.length > 0) {
          const updatedDoses = initialDoses.map(cohort => {
            const matchedDbVaccines = vaccineData.filter((v: any) => {
              return cohort.details.some(dName => 
                v.vaccineName.toLowerCase().includes(dName.toLowerCase()) || 
                dName.toLowerCase().includes(v.vaccineName.toLowerCase())
              );
            });

            if (matchedDbVaccines.length > 0) {
              const allAdministered = matchedDbVaccines.every((v: any) => v.status === "administered");
              const anyAdministered = matchedDbVaccines.some((v: any) => v.status === "administered");
              const administeredDate = matchedDbVaccines.find((v: any) => v.administeredDate)?.administeredDate;
              
              return {
                ...cohort,
                status: allAdministered ? "administered" as const : anyAdministered ? "administered" as const : "scheduled" as const,
                dateGiven: administeredDate ? new Date(administeredDate).toLocaleDateString() : cohort.dateGiven,
                nurseName: "Nurse Priscilla O.",
                batchNumber: "BATCH-" + matchedDbVaccines[0].id.substring(0, 5).toUpperCase(),
                clinicName: "Health Center A",
              };
            }
            return cohort;
          });
          setDoses(updatedDoses);
        }
      } catch (err) {
        console.error("Failed to load child vaccine schedule from microservices:", err);
      }
    };

    fetchChildVaccines();
  }, [user]);

  const toggleExpand = (id: number) => {
    setExpandedCohortId(prev => prev === id ? null : id);
  };

  const handleLogVaccine = async (id: number, nurse: string, batch: string, clinic: string) => {
    setDoses(prev => prev.map(d => d.id === id ? {
      ...d,
      status: "administered",
      dateGiven: new Date().toLocaleDateString(),
      nurseName: nurse,
      batchNumber: batch,
      clinicName: clinic
    } : d));

    if (!user || user.id.startsWith("mock-")) return;

    try {
      const { api } = await import("@/lib/api");
      const cohort = doses.find(d => d.id === id);
      if (!cohort) return;

      const members = await api.get("/households/hh-family-001/members");
      const childMember = members.find((m: any) => m.relationType === "child");
      const childId = childMember ? childMember.userId : "usr-child-001";

      for (const name of cohort.details) {
        await api.post("/ehr/vaccines", {
          patient_id: childId,
          vaccine_name: name,
          due_date: new Date().toISOString(),
          status: "administered",
          administered_date: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Failed to sync vaccine log to microservices:", err);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* LEFT/CENTER PANELS (9 COLS) */}
      <main className="lg:col-span-9 flex flex-col gap-3">
        
        {/* Title greeting row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight text-display">Immunization &amp; Vaccines</h2>
            <p className="text-slate-500 font-medium mt-1">
              EPI-compliant vaccination timeline for <span className="font-bold text-[#0089C1]">{childName}</span>. Update logs and export certificates.
            </p>
          </div>
          <span className="bg-[#E8F3CE] border border-[#CDE0A4] text-[#608216] px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1.5 self-start md:self-auto">
            <IconAward className="w-4.5 h-4.5 text-[#608216]" />
            EPI Vaccine Standards Active
          </span>
        </motion.div>

        {/* Tab switcher */}
        <div className="bg-white border border-slate-200/60 p-1.5 rounded-2xl shadow-xs flex items-center gap-1 my-1">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "timeline" 
                ? "bg-[#1E293B] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Vaccination Timeline
          </button>
          <button
            onClick={() => setActiveTab("wallet")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "wallet" 
                ? "bg-[#1E293B] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Certificate Wallet
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "timeline" ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-3"
            >
              {/* PEDIATRIC LAB METRICS WIDGET (MUAC, Hb, Genotype) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-1">
                
                {/* MUAC (Mid-Upper Arm Circumference) */}
                <AhnaraCard variant="flat" padding="none" className="bg-white p-5 border border-slate-200/40 shadow-xs hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">MUAC (Nutrition)</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <IconScale className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="h-10 w-full flex items-center">
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "85%" }} />
                      <div className="absolute right-[15%] -top-1 w-4 h-4 bg-white border-2 border-emerald-500 rounded-full shadow-xs" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-800 text-display">13.5</span>
                      <span className="text-[10px] font-bold text-slate-400">cm</span>
                    </div>
                    <span className="text-[9px] font-black uppercase text-[#608216] bg-[#E8F3CE] px-2 py-0.5 rounded-md border border-[#CDE0A4]">
                      Normal Growth
                    </span>
                  </div>
                </AhnaraCard>

                {/* Hemoglobin (Hb) */}
                <AhnaraCard variant="flat" padding="none" className="bg-white p-5 border border-slate-200/40 shadow-xs hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hemoglobin (Hb)</span>
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                      <IconDroplet className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                  <div className="h-10 w-full flex items-center">
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: "74%" }} />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-800 text-display">11.2</span>
                      <span className="text-[10px] font-bold text-slate-400">g/dL</span>
                    </div>
                    <span className="text-[9px] font-black uppercase text-[#608216] bg-[#E8F3CE] px-2 py-0.5 rounded-md border border-[#CDE0A4]">
                      Optimal
                    </span>
                  </div>
                </AhnaraCard>

                {/* Sickle Cell Genotype */}
                <AhnaraCard variant="flat" padding="none" className="bg-white p-5 border border-slate-200/40 shadow-xs hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Genotype Status</span>
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <IconFlask className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="h-10 w-full flex flex-col justify-center">
                    <span className="text-sm font-semibold text-slate-500">Sickle Cell Pre-Screen</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-800 text-display">Hb AA</span>
                    </div>
                    <span className="text-[9px] font-black uppercase text-[#608216] bg-[#E8F3CE] px-2 py-0.5 rounded-md border border-[#CDE0A4]">
                      Cleared
                    </span>
                  </div>
                </AhnaraCard>

              </div>

              {/* CHRONOLOGICAL COHORT LIST */}
              <div className="flex flex-col gap-2">
                {doses.map((d) => {
                  const isExpanded = expandedCohortId === d.id;
                  const isCompleted = d.status === "administered";
                  const isScheduled = d.status === "scheduled";
                  const isOverdue = d.status === "overdue";

                  return (
                    <div
                      key={d.id}
                      className={`border rounded-2xl overflow-hidden transition-all duration-300 bg-white ${
                        isCompleted 
                          ? "border-slate-200/65 shadow-xs opacity-95" 
                          : "border-slate-200/40"
                      }`}
                    >
                      {/* Header Row */}
                      <button
                        onClick={() => toggleExpand(d.id)}
                        className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                          isCompleted ? "bg-slate-50/40 hover:bg-slate-50/80" : "bg-white hover:bg-slate-50/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Status Circle */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? "bg-[#E8F3CE] text-[#608216] border border-[#CDE0A4]"
                              : isOverdue
                              ? "bg-red-50 text-red-700 animate-pulse border border-red-200"
                              : "bg-slate-100 text-slate-400 border border-slate-200"
                          }`}>
                            {isCompleted ? (
                              <IconCheck className="w-4.5 h-4.5" />
                            ) : isOverdue ? (
                              <IconAlertOctagon className="w-4 h-4" />
                            ) : (
                              <IconClock className="w-4.5 h-4.5" />
                            )}
                          </div>

                          <div>
                            <h4 className={`text-sm font-black text-display leading-tight ${
                              isCompleted ? "text-slate-800" : "text-slate-700"
                            }`}>
                              {d.name}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                              {d.ageCohort} {isCompleted && `• Administered ${d.dateGiven}`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded ${
                            isCompleted ? "bg-[#E8F3CE] text-[#608216]" : "bg-amber-50 text-amber-700"
                          }`}>
                            {d.status}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                            {isExpanded ? <IconChevronDown className="w-4.5 h-4.5" /> : <IconChevronRight className="w-4.5 h-4.5" />}
                          </div>
                        </div>
                      </button>

                      {/* Expanded Details */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden bg-white border-t border-slate-100"
                          >
                            <div className="p-5 flex flex-col gap-4 text-left">
                              
                              {/* Vaccines details in cohort */}
                              <div className="flex flex-col gap-2">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Antigens Administered</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                  {d.details.map((v, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50/50 border border-slate-200/40 p-2.5 rounded-xl">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#0089C1]" />
                                      <span>{v}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Logging Info & Interactive Form */}
                              {isCompleted ? (
                                <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div className="flex items-center gap-2.5 text-left border-r border-slate-100 pr-2">
                                    <div className="w-9 h-9 rounded-full bg-[#E8F3CE] flex items-center justify-center text-[#608216] flex-shrink-0">
                                      <IconNurse className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider block">Administering Nurse</span>
                                      <span className="text-xs font-black text-slate-800">{d.nurseName}</span>
                                    </div>
                                  </div>
                                  <div className="text-left border-r border-slate-100 pr-2">
                                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Vaccine Batch / Lot</span>
                                    <span className="text-xs font-mono font-bold text-slate-700 mt-1 block">{d.batchNumber}</span>
                                  </div>
                                  <div className="text-left">
                                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Clinic Center</span>
                                    <span className="text-xs font-bold text-slate-700 mt-1 block">{d.clinicName}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="border-t border-slate-100 pt-4">
                                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-2">Log Clinic Administration</span>
                                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                                    <input 
                                      type="text" 
                                      placeholder="Nurse Name" 
                                      id={`nurse-${d.id}`}
                                      defaultValue="Nurse Priscilla O."
                                      className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold outline-none text-slate-800"
                                    />
                                    <input 
                                      type="text" 
                                      placeholder="Batch (e.g. B-993)" 
                                      id={`batch-${d.id}`}
                                      defaultValue={`ROT2-B${Math.floor(100+Math.random()*900)}`}
                                      className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold outline-none text-slate-800"
                                    />
                                    <input 
                                      type="text" 
                                      placeholder="Clinic Site" 
                                      id={`clinic-${d.id}`}
                                      defaultValue="Health Center A"
                                      className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold outline-none text-slate-800"
                                    />
                                    <AhnaraButton
                                      variant="primary"
                                      onClick={() => {
                                        const n = (document.getElementById(`nurse-${d.id}`) as HTMLInputElement)?.value;
                                        const b = (document.getElementById(`batch-${d.id}`) as HTMLInputElement)?.value;
                                        const c = (document.getElementById(`clinic-${d.id}`) as HTMLInputElement)?.value;
                                        handleLogVaccine(d.id, n, b, c);
                                      }}
                                      className="bg-[#1E293B] hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg border-none"
                                    >
                                      Log Administration
                                    </AhnaraButton>
                                  </div>
                                </div>
                              )}

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* CERTIFICATE WALLET */
            <motion.div
              key="wallet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200/50 rounded-3xl shadow-xs"
            >
              {/* Certificate Card */}
              <div className="w-full max-w-md bg-[#E8F3CE] border-2 border-[#CDE0A4] rounded-3xl p-6 flex flex-col gap-6 relative shadow-md overflow-hidden text-left text-[#608216]">
                
                {/* Shiny badge background */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#8BB436]/10 rounded-bl-full pointer-events-none" />
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#CDE0A4] pb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#608216]">EPI Digital Passport</h3>
                    <span className="text-[10px] text-[#608216]/80 font-semibold block mt-0.5">Ahnara Med Suite</span>
                  </div>
                  <IconFileText className="w-6 h-6 text-[#608216]" />
                </div>

                {/* Identity Summary */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <div>
                    <span className="text-[9px] text-[#608216]/70 font-bold uppercase tracking-wider">Child Registered Name</span>
                    <p className="font-extrabold text-base text-slate-800 leading-tight">{childName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div>
                      <span className="text-[9px] text-[#608216]/70 font-bold uppercase tracking-wider">Doses Completed</span>
                      <p className="font-black text-sm text-slate-800">
                        {doses.filter(d => d.status === "administered").length} / {doses.length} Cohorts
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#608216]/70 font-bold uppercase tracking-wider">Status Verification</span>
                      <p className="font-black text-xs text-emerald-700 uppercase">Verified Stamp</p>
                    </div>
                  </div>
                </div>

                {/* Encryption QR Code */}
                <div className="border-t border-[#CDE0A4] pt-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-[9px] text-[#608216]/70 font-bold uppercase tracking-wider block">Security QR Code Verification</span>
                    <p className="text-[10px] text-slate-650 font-semibold leading-normal mt-1">
                      Contains encrypted, offline-accessible vaccine signatures for travel check-ins and school physical clearances.
                    </p>
                  </div>
                  
                  <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex-shrink-0">
                    <IconQrcode className="w-16 h-16 text-[#0089C1]" />
                  </div>
                </div>

                <div className="bg-[#1E293B] text-white py-2 px-4 rounded-xl text-[10px] font-black text-center uppercase tracking-wider shadow-sm border-none">
                  OFFLINE COMPLIANCE ACTIVE
                </div>

              </div>

              <div className="flex gap-3 w-full max-w-md mt-6">
                <AhnaraButton
                  variant="outline"
                  leftIcon={<IconDownload className="w-4.5 h-4.5" />}
                  onClick={() => alert("Downloading verified PDF certificate...")}
                  className="flex-1 text-xs font-bold border-slate-200 text-slate-700 py-3 rounded-xl shadow-xs"
                >
                  Download Certificate PDF
                </AhnaraButton>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* RIGHT SIDEBAR (3 COLS) */}
      <aside className="lg:col-span-3 flex flex-col gap-3">
        
        {/* Desktop-only spacer */}
        <div className="hidden lg:block h-[68px]" />

        {/* Catch-up and Next Schedule Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm text-left text-[#608216]">
            <div className="flex items-center justify-between border-b border-[#CDE0A4] pb-3">
              <div className="flex items-center gap-2">
                <IconCalendarEvent className="w-5 h-5 text-[#608216]" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Next Clinic Visit</h3>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-xs font-semibold">
              <div>
                <span className="text-[10px] text-[#608216]/75 font-bold uppercase tracking-wider block">Due: Week 10</span>
                <h4 className="text-xl font-black text-slate-900 mt-1 leading-none text-display">Rotavirus 2</h4>
                <p className="text-xs text-[#608216]/80 mt-1.5 leading-relaxed">
                  Scheduled at Health Center A. Make sure you sync logs to receive SMS/voice reminders.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-black bg-white/50 border border-[#CDE0A4] p-2.5 rounded-xl mt-1.5">
                <IconMapPin className="w-4 h-4 text-[#608216]" />
                <span>Pediatric Wing • Center A</span>
              </div>
            </div>
          </AhnaraCard>
        </motion.div>

        {/* SMS Auto-Scheduler Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-200/50 p-5 flex flex-col gap-4 shadow-xs text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IconClock className="w-5 h-5 text-[#C88A3A]" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">SMS Reminders</h3>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <p className="text-slate-500 font-semibold leading-relaxed">
                Automatically schedule voice and SMS reminder calls 48 hours before the child's immunization window opens.
              </p>

              <button
                onClick={() => setSmsScheduled(prev => !prev)}
                className={`w-full py-2.5 rounded-xl border text-center font-bold transition-all ${
                  smsScheduled
                    ? "bg-[#E8F6FA] border-[#0089C1]/20 text-[#0089C1]"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {smsScheduled ? "✓ SMS Reminders Scheduled" : "Schedule SMS Reminders"}
              </button>
            </div>
          </AhnaraCard>
        </motion.div>

      </aside>

    </div>
  );
}
