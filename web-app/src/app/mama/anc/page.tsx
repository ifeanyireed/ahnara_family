"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconCalendarEvent,
  IconCheck,
  IconLock,
  IconHourglassLow,
  IconChevronRight,
  IconChevronDown,
  IconDownload,
  IconReportMedical,
  IconFlask,
  IconDroplet,
  IconGauge,
  IconFileText,
  IconMapPin,
  IconClock,
  IconNurse,
  IconAward
} from "@tabler/icons-react";
import { useAuth } from "@/components/ahnara/AuthContext";
import { api } from "@/lib/api";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

interface Contact {
  id: number;
  name: string;
  window: string;
  status: "completed" | "active" | "locked";
  completedDate?: string;
  midwife?: string;
  checks?: string[];
  notes?: string;
}

export default function AntenatalCarePage() {
  const { user } = useAuth();
  const [gestationWeeks, setGestationWeeks] = useState(12);
  const [expandedContactId, setExpandedContactId] = useState<number | null>(3); // Expand active by default
  const [selectedLabReport, setSelectedLabReport] = useState("all");
  const [hemoglobin, setHemoglobin] = useState("11.4");
  const [urineProtein, setUrineProtein] = useState("Negative");
  const [bloodSugar, setBloodSugar] = useState("92");

  const initialContacts: Contact[] = [
    {
      id: 1,
      name: "Contact 1 (First Booking)",
      window: "Weeks 8 - 12",
      status: "completed",
      completedDate: "June 2, 2026",
      midwife: "Midwife Priscilla O.",
      checks: ["Blood Pressure Checked (118/78)", "LMP & Gestation age validated", "First Ultrasound (Single fetus, active heartbeat)", "Blood group & Rhesus typing"],
      notes: "Healthy initial progress. Recommended daily Prenatal supplements (Folic acid + Iron). Booking scheduled for Contact 2."
    },
    {
      id: 2,
      name: "Contact 2 (Second Visit)",
      window: "Week 20",
      status: "completed",
      completedDate: "June 30, 2026",
      midwife: "Midwife Priscilla O.",
      checks: ["Blood Pressure Checked (120/80)", "Fetal quickening checked", "Maternal Weight logged", "Tetanus Toxoid booster given"],
      notes: "Quickening reported by mother. Anomaly ultrasound indicates normal fetal spine, limbs, and heart chambers. Adherence is good."
    },
    {
      id: 3,
      name: "Contact 3 (Active Session)",
      window: "Week 26",
      status: "active",
      checks: ["Fundal height measurement", "Fetal heart tone auscultation", "Maternal BP & Urine protein screen", "Oral glucose tolerance test (OGTT)"],
      notes: "Currently scheduled for July 12, 2026. Prepare to discuss kick-counting charts during this session."
    },
    {
      id: 4,
      name: "Contact 4 (Fourth Visit)",
      window: "Week 30",
      status: "locked",
      checks: ["Fetal position & movement check", "Blood pressure log review", "Symptom check for pre-eclampsia warning signs", "Hemoglobin level check"]
    },
    {
      id: 5,
      name: "Contact 5 (Fifth Visit)",
      window: "Week 34",
      status: "locked",
      checks: ["Presentation and engagement assessment", "Fetal kick counts logging review", "Maternal weight and edema screening"]
    },
    {
      id: 6,
      name: "Contact 6 (Sixth Visit)",
      window: "Week 36",
      status: "locked",
      checks: ["Fetal growth screening", "Obstetric risk classification review", "Birth Plan final review and midwife signoff"]
    },
    {
      id: 7,
      name: "Contact 7 (Seventh Visit)",
      window: "Week 38",
      status: "locked",
      checks: ["Cervical assessment, presentation check", "Labor preparation briefing", "Emergency SOS procedures recall"]
    },
    {
      id: 8,
      name: "Contact 8 (Delivery Prep)",
      window: "Week 40",
      status: "locked",
      checks: ["Biophysical profile, fetal health status", "Spontaneous labor signs review", "Postpartum planning briefing"]
    }
  ];

  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

  // Load gestation weeks to dynamically adjust contact statuses
  useEffect(() => {
    if (!user || user.id.startsWith("mock-")) {
      const dataStr = localStorage.getItem("mama_gestation_data");
      if (dataStr) {
        try {
          const data = JSON.parse(dataStr);
          const weeks = data.gestationWeeks || 12;
          setGestationWeeks(weeks);
        } catch (e) {
          console.error(e);
        }
      }
      return;
    }

    const fetchEhrData = async () => {
      try {
        const encounters = await api.get(`/ehr/encounters/patient/${user.id}`);
        const observations = await api.get(`/ehr/observations/patient/${user.id}`);

        const pregnancyVisits = encounters.filter((e: any) => e.encounterType === "pregnancy_visit");
        let weeks = 12;

        if (pregnancyVisits.length > 0) {
          try {
            const meta = JSON.parse(pregnancyVisits[0].metadata);
            if (meta.gestational_weeks) {
              weeks = meta.gestational_weeks;
              setGestationWeeks(weeks);
            }
          } catch (e) {}
        }

        const updated = initialContacts.map(c => {
          let status: "completed" | "active" | "locked" = "locked";
          let limit = 12;
          if (c.id === 1) limit = 12;
          else if (c.id === 2) limit = 20;
          else if (c.id === 3) limit = 26;
          else if (c.id === 4) limit = 30;
          else if (c.id === 5) limit = 34;
          else if (c.id === 6) limit = 36;
          else if (c.id === 7) limit = 38;
          else if (c.id === 8) limit = 40;

          if (weeks > limit) {
            status = "completed";
          } else if (weeks === limit || (weeks > (limit - 4) && weeks <= limit)) {
            status = "active";
          }

          const matchingVisit = pregnancyVisits.find((v: any) => {
            try {
              const meta = JSON.parse(v.metadata);
              return meta.gestational_weeks === limit || (limit === 12 && meta.gestational_weeks <= 12) || (limit === 26 && meta.gestational_weeks === 24);
            } catch (e) {
              return false;
            }
          });

          if (matchingVisit) {
            try {
              const meta = JSON.parse(matchingVisit.metadata);
              return {
                ...c,
                status: "completed" as const,
                notes: meta.notes || c.notes,
                completedDate: new Date(matchingVisit.createdAt || Date.now()).toLocaleDateString(),
                midwife: matchingVisit.providerId === "usr-carer-001" ? "Midwife Priscilla O." : "Midwife / Clinician",
              };
            } catch (e) {}
          }

          return { ...c, status };
        });

        const hasActive = updated.some(c => c.status === "active");
        if (!hasActive) {
          const firstLocked = updated.findIndex(c => c.status === "locked");
          if (firstLocked > -1) {
            updated[firstLocked].status = "active";
          }
        }

        setContacts(updated);

        // Extract specific observations if available
        const hbObs = observations.find((o: any) => o.code === "hb" || o.category === "blood" || o.code === "hemoglobin");
        if (hbObs) {
          try {
            const val = JSON.parse(hbObs.valueJson || hbObs.valueJSON);
            if (val.value) setHemoglobin(String(val.value));
          } catch(e) {}
        }

        const proteinObs = observations.find((o: any) => o.code === "urine_protein" || o.category === "urine");
        if (proteinObs) {
          try {
            const val = JSON.parse(proteinObs.valueJson || proteinObs.valueJSON);
            if (val.value) setUrineProtein(String(val.value));
          } catch(e) {}
        }

        const sugarObs = observations.find((o: any) => o.code === "blood_sugar" || o.code === "fasting_sugar" || o.code === "8867-4");
        if (sugarObs) {
          try {
            const val = JSON.parse(sugarObs.valueJson || sugarObs.valueJSON);
            if (val.value) setBloodSugar(String(val.value));
          } catch(e) {}
        }
      } catch (err) {
        console.error("Failed to load clinical data from microservices", err);
      }
    };

    fetchEhrData();
  }, [user]);

  const toggleExpand = (id: number) => {
    setExpandedContactId(prev => prev === id ? null : id);
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
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-display">Antenatal Care (ANC)</h2>
            <p className="text-slate-500 font-medium mt-1">
              Active WHO 8-Contact Timeline. Tap checkpoints to inspect lab tests and notes.
            </p>
          </div>
          <span className="bg-[#E8F3CE] border border-[#CDE0A4] text-[#608216] px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1.5 self-start md:self-auto">
            <IconAward className="w-4.5 h-4.5 text-[#8BB436]" />
            WHO 8-Contact Model Adherence
          </span>
        </motion.div>

        {/* LAB RESULTS WIDGET (3 columns matching provider dashboard cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-1">
          
          {/* Card 1: Hemoglobin Level */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <AhnaraCard variant="flat" padding="none" className="bg-white p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hemoglobin (Hb)</span>
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <IconDroplet className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="h-10 w-full flex items-center">
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "76%" }} />
                  <div className="absolute right-[24%] -top-1 w-4 h-4 bg-white border-2 border-red-500 rounded-full shadow-xs" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800 text-display">{hemoglobin}</span>
                  <span className="text-[10px] font-bold text-slate-400">g/dL</span>
                </div>
                <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  Normal
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 2: Urine Protein */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.23 }}
          >
            <AhnaraCard variant="flat" padding="none" className="bg-white p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Urine Protein</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0089C1]">
                  <IconFlask className="w-4 h-4" />
                </div>
              </div>
              <div className="h-10 w-full flex items-end justify-between gap-1 pb-1">
                {[20, 20, 20, 20, 20, 20, 20, 20].map((h, i) => (
                  <span key={i} className={`flex-1 h-3 rounded-full ${i === 0 ? "bg-[#8BB436]" : "bg-slate-100"}`} />
                ))}
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800 text-display">{urineProtein}</span>
                </div>
                <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  Cleared
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 3: Blood Sugar */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
          >
            <AhnaraCard variant="flat" padding="none" className="bg-white p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Sugar (Fasting)</span>
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                  <IconGauge className="w-4 h-4" />
                </div>
              </div>
              <div className="h-10 w-full flex flex-col justify-center gap-1.5">
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "62%" }} />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800 text-display">{bloodSugar}</span>
                  <span className="text-[10px] font-bold text-slate-400">mg/dL</span>
                </div>
                <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  Normal
                </span>
              </div>
            </AhnaraCard>
          </motion.div>

        </div>

        {/* WHO 8-CONTACT TIMELINE CHECKLIST */}
        <div className="flex flex-col gap-2">
          {contacts.map((c, index) => {
            const isExpanded = expandedContactId === c.id;
            const isCompleted = c.status === "completed";
            const isActive = c.status === "active";
            const isLocked = c.status === "locked";

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 bg-white ${
                  isActive 
                    ? "border-[#8BB436] shadow-sm"
                    : isCompleted 
                    ? "border-slate-200/60 shadow-xs opacity-90"
                    : "border-slate-200/40 opacity-70"
                }`}
              >
                {/* Header Row */}
                <button
                  onClick={() => !isLocked && toggleExpand(c.id)}
                  disabled={isLocked}
                  className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                    isActive ? "bg-[#E8F3CE]/30" : isCompleted ? "bg-slate-50/40 hover:bg-slate-50/80" : "bg-slate-50/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Status Circle Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-[#E8F3CE] text-[#608216] border border-[#CDE0A4]"
                        : isActive
                        ? "bg-[#1E293B] text-white animate-pulse"
                        : "bg-slate-100 text-slate-400 border border-slate-200/50"
                    }`}>
                      {isCompleted ? (
                        <IconCheck className="w-4.5 h-4.5" />
                      ) : isLocked ? (
                        <IconLock className="w-4 h-4" />
                      ) : (
                        <IconHourglassLow className="w-4.5 h-4.5" />
                      )}
                    </div>

                    <div>
                      <h4 className={`text-sm font-black text-display leading-tight ${
                        isActive ? "text-slate-900" : isCompleted ? "text-slate-800" : "text-slate-400 font-semibold"
                      }`}>
                        {c.name}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                        {c.window} {isCompleted && `• Completed ${c.completedDate}`}
                      </span>
                    </div>
                  </div>

                  {!isLocked && (
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-500">
                      {isExpanded ? <IconChevronDown className="w-4.5 h-4.5" /> : <IconChevronRight className="w-4.5 h-4.5" />}
                    </div>
                  )}
                </button>

                {/* Expanded Details */}
                <AnimatePresence initial={false}>
                  {isExpanded && !isLocked && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden bg-white border-t border-slate-100"
                    >
                      <div className="p-5 flex flex-col gap-4 text-left">
                        
                        {/* Clinical Checks list */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Clinical Parameters Checked</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                            {c.checks?.map((chk, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50/50 border border-slate-200/40 p-2.5 rounded-xl">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#8BB436]" />
                                <span>{chk}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Midwife details & clinician notes */}
                        {c.notes && (
                          <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2.5 text-left sm:col-span-1 border-r border-slate-100 pr-2">
                              <div className="w-9 h-9 rounded-full bg-[#E8F3CE] flex items-center justify-center text-[#608216] flex-shrink-0">
                                <IconNurse className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider block">Assigned Clinician</span>
                                <span className="text-xs font-black text-slate-800">{c.midwife}</span>
                              </div>
                            </div>
                            <div className="sm:col-span-2 text-left">
                              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Consult &amp; Midwife Notes</span>
                              <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-0.5">
                                &ldquo;{c.notes}&rdquo;
                              </p>
                            </div>
                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </main>

      {/* RIGHT SIDEBAR (3 COLS) */}
      <aside className="lg:col-span-3 flex flex-col gap-3">
        
        {/* Desktop-only spacer */}
        <div className="hidden lg:block h-[68px]" />

        {/* Next Checkpoint Agenda / Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm text-left">
            <div className="flex items-center justify-between border-b border-[#C7DB9C] pb-3">
              <div className="flex items-center gap-2">
                <IconCalendarEvent className="w-5 h-5 text-[#608216]" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Next Checkpoint</h3>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="text-left">
                <span className="text-[10px] text-[#608216] font-black uppercase tracking-wider">Due in 9 Days</span>
                <h4 className="text-2xl font-black text-slate-900 mt-1 leading-none text-display">Contact 3</h4>
                <p className="text-xs text-[#608216] font-semibold mt-1.5 leading-relaxed">
                  Scheduled for July 12, 2026 at Health Center A. Ensure you complete your fasting Blood Sugar test before this visit.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#608216] font-black bg-[#D4F475]/45 border border-[#CDE0A4] p-2.5 rounded-xl">
                <IconMapPin className="w-4 h-4 text-[#8BB436]" />
                <span>Obstetric Room 3 • Triage</span>
              </div>
            </div>
          </AhnaraCard>
        </motion.div>

        {/* Digital Clinical Passport PDF downloader */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IconFileText className="w-5 h-5 text-[#0089C1]" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Clinical Passport</h3>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                Download your official verified antenatal clinical passport showing completed contact vouchers and lab results.
              </p>

              <AhnaraButton
                variant="outline"
                leftIcon={<IconDownload className="w-4.5 h-4.5" />}
                className="w-full text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl shadow-xs"
              >
                Download Passport PDF
              </AhnaraButton>
            </div>
          </AhnaraCard>
        </motion.div>

      </aside>

    </div>
  );
}
