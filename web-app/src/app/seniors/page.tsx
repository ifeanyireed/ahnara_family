"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconCheck, 
  IconAlertTriangle, 
  IconHeart, 
  IconActivity, 
  IconPill, 
  IconPhoneCall, 
  IconMessageCircle, 
  IconShieldExclamation, 
  IconClock, 
  IconUser,
  IconScale,
  IconDeviceHeartMonitor,
  IconExclamationCircle
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraModal } from "@/components/ahnara/AhnaraModal";

export default function SeniorsSafeDayDashboard() {
  const [seniorsData, setSeniorsData] = useState<any>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  
  // Vitals State
  const [heartRate, setHeartRate] = useState(72);
  const [bloodPressure, setBloodPressure] = useState("128/82");
  const [steps, setSteps] = useState(3420);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [weight, setWeight] = useState("71.5");
  const [bpSystolic, setBpSystolic] = useState("128");
  const [bpDiastolic, setBpDiastolic] = useState("82");
  const [newHeartRate, setNewHeartRate] = useState("72");

  // Medication Doses
  const [medDoses, setMedDoses] = useState([
    { id: 1, name: "Atorvastatin (10mg)", time: "08:00 AM", taken: true, color: "Blue pill", type: "cholesterol" },
    { id: 2, name: "Amlodipine (5mg)", time: "08:00 AM", taken: true, color: "White pill", type: "blood pressure" },
    { id: 3, name: "Metformin (500mg)", time: "08:00 PM", taken: false, color: "Yellow pill", type: "diabetes" }
  ]);

  // Scam Alert Logs
  const [scamAlerts, setScamAlerts] = useState([
    { id: 1, text: "Suspicious message from unknown sender flagged.", time: "11:32 AM", risk: "high", details: "SMS claiming pension updates need bank code verification. Blocked and caregiver notified." },
    { id: 2, text: "Suspicious voice call patterns detected.", time: "Yesterday", risk: "medium", details: "Incoming call from high-fraud block. Warned elder user." }
  ]);

  // Load Profile from Local Storage
  useEffect(() => {
    const dataStr = localStorage.getItem("seniors_profile_data");
    if (dataStr) {
      try {
        setSeniorsData(JSON.parse(dataStr));
      } catch (e) {
        console.error("Error loading seniors data", e);
      }
    }
  }, []);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setCheckInTime(now);

    // Save logs to LocalStorage
    const logs = JSON.parse(localStorage.getItem("seniors_checkin_logs") || "[]");
    logs.push({
      date: new Date().toLocaleDateString(),
      time: now,
      status: "Safe"
    });
    localStorage.setItem("seniors_checkin_logs", JSON.stringify(logs));
  };

  const handleMedToggle = (id: number) => {
    setMedDoses(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const handleVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBloodPressure(`${bpSystolic}/${bpDiastolic}`);
    setHeartRate(Number(newHeartRate));
    setIsVitalsModalOpen(false);

    // Save vitals log
    const logs = JSON.parse(localStorage.getItem("seniors_vitals_logs") || "[]");
    logs.push({
      date: new Date().toLocaleDateString(),
      bp: `${bpSystolic}/${bpDiastolic}`,
      heartRate: newHeartRate,
      weight,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("seniors_vitals_logs", JSON.stringify(logs));
  };

  if (!seniorsData) {
    return null;
  }

  // Active checks ratio
  const takenMedsCount = medDoses.filter(m => m.taken).length;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* LEFT/CENTER PANELS (9 COLS) */}
      <main className="lg:col-span-9 flex flex-col gap-3">
        
        {/* SafeDay Banner Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isCheckedIn 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-75">Wellbeing Status</span>
            <h2 className="text-2xl font-black tracking-tight text-display mt-0.5">
              {isCheckedIn ? "Checked in as OK today!" : "Pending Daily Check-In"}
            </h2>
            <p className="text-xs font-semibold mt-1 opacity-80">
              {isCheckedIn 
                ? `Log entry registered at ${checkInTime}. Trusted Circle has been notified.`
                : "Confirm you are safe today to notify your caregiver network."
              }
            </p>
          </div>
          {!isCheckedIn && (
            <button
              onClick={handleCheckIn}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black text-sm uppercase rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap self-start md:self-auto"
            >
              <IconCheck className="w-5 h-5" />
              I'm OK Today
            </button>
          )}
        </motion.div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Card 1: Heart Rate */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <AhnaraCard variant="flat" padding="none" className="bg-white p-5 border border-slate-105 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Heart Rate</span>
                <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                  <IconHeart className="w-4.5 h-4.5 fill-current" />
                </div>
              </div>
              
              <div className="h-16 w-full flex items-center mb-2">
                <svg className="w-full h-full" viewBox="0 0 160 50">
                  <path
                    d="M0,25 C15,25 20,10 25,10 C30,10 35,38 40,38 C45,38 50,5 55,5 C60,5 65,42 70,42 C75,42 80,20 85,20 C90,20 95,30 100,30 C105,30 110,18 115,18 C120,18 125,25 130,25 L160,25"
                    fill="none"
                    stroke="#F43F5E"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-extrabold text-slate-800 text-display">{heartRate}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">BPM</span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 2: Blood Pressure */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <AhnaraCard variant="flat" padding="none" className="bg-white p-5 border border-slate-105 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Pressure</span>
                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <IconDeviceHeartMonitor className="w-4.5 h-4.5" />
                </div>
              </div>
              
              <div className="h-16 w-full flex items-end justify-between px-2 gap-1 mb-2">
                {[30, 42, 50, 48, 55, 60, 52, 58, 62, 65].map((height, i) => (
                  <div key={i} className="flex-1 bg-indigo-200 rounded-full" style={{ height: `${height}%` }} />
                ))}
              </div>

              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-extrabold text-slate-800 text-display">{bloodPressure}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">mmHg</span>
              </div>
            </AhnaraCard>
          </motion.div>

          {/* Card 3: Log Vitals dashed trigger */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AhnaraCard
              variant="interactive"
              padding="none"
              onClick={() => setIsVitalsModalOpen(true)}
              className="h-full bg-slate-50/50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-5 text-slate-400 hover:text-slate-700 hover:border-slate-350 transition-all duration-300 cursor-pointer min-h-[148px]"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm mb-2">
                <IconActivity className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-bold text-indigo-600">Log Vitals</span>
              <span className="text-[10px] text-slate-400 font-bold mt-0.5">Heart rate, Blood Pressure</span>
            </AhnaraCard>
          </motion.div>

        </div>

        {/* Medication Schedule Timeline Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IconPill className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Medication Timeline</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">{takenMedsCount} of {medDoses.length} Taken</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {medDoses.map((med) => (
                <button
                  key={med.id}
                  onClick={() => handleMedToggle(med.id)}
                  className={`w-full p-4 rounded-2xl border text-left flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                    med.taken
                      ? "bg-indigo-50/50 border-indigo-150 text-indigo-900 shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100/50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                      med.taken
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-350 bg-white"
                    }`}>
                      {med.taken && <IconCheck className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-black leading-none">{med.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{med.color} • {med.type}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-70 bg-white border border-slate-100 px-2.5 py-1 rounded-lg self-start md:self-auto flex items-center gap-1">
                    <IconClock className="w-3.5 h-3.5 text-indigo-600" />
                    Dose: {med.time}
                  </span>
                </button>
              ))}
            </div>
          </AhnaraCard>
        </motion.div>

      </main>

      {/* RIGHT SIDEBAR (3 COLS) */}
      <aside className="lg:col-span-3 flex flex-col gap-3">
        
        {/* Trusted Circle Coordinator box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#C7DB9C] pb-3">
              <div className="flex items-center gap-2">
                <IconUser className="w-5 h-5 text-[#608216]" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Trusted Circle</h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-[#CDE0A4] text-left">
                <div className="w-10 h-10 rounded-full bg-[#E8F3CE] border border-[#CDE0A4] flex items-center justify-center font-black text-sm text-[#608216] flex-shrink-0">
                  JD
                </div>
                <div className="flex-1">
                  <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider block">Caregiver Visit</span>
                  <h4 className="text-xs font-black text-slate-800 mt-0.5">Jane Doe (Daughter)</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">ETA: 3 Hours (Daily check)</p>
                </div>
              </div>

              <AhnaraButton
                variant="outline"
                className="w-full !rounded-xl bg-white text-[#608216] border-[#CDE0A4] hover:bg-[#CDE0A4]/10 font-bold flex items-center justify-center gap-1.5"
              >
                <IconPhoneCall className="w-4 h-4" />
                Video Call Circle
              </AhnaraButton>
            </div>
          </AhnaraCard>
        </motion.div>

        {/* Scam Shield Alerts feed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IconShieldExclamation className="w-5 h-5 text-rose-500" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Scam Shield</h3>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-black uppercase">Active</span>
            </div>

            <div className="flex flex-col gap-3">
              {scamAlerts.map((alert) => (
                <div key={alert.id} className="flex gap-2.5 text-left border-b border-slate-50 pb-2.5 last:border-b-0 last:pb-0">
                  <IconExclamationCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${alert.risk === "high" ? "text-rose-500 animate-bounce" : "text-amber-500"}`} />
                  <div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight">{alert.text}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-normal">{alert.details}</p>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </AhnaraCard>
        </motion.div>

      </aside>

      {/* VITALS LOG MODAL */}
      <AhnaraModal
        isOpen={isVitalsModalOpen}
        onClose={() => setIsVitalsModalOpen(false)}
        title="Log Elder Vitals"
      >
        <form onSubmit={handleVitalsSubmit} className="flex flex-col gap-4 p-4 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Systolic BP (mmHg)</label>
              <input
                type="number"
                required
                value={bpSystolic}
                onChange={(e) => setBpSystolic(e.target.value)}
                className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-center outline-none focus:bg-white focus:border-slate-350 font-semibold"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Diastolic BP (mmHg)</label>
              <input
                type="number"
                required
                value={bpDiastolic}
                onChange={(e) => setBpDiastolic(e.target.value)}
                className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm text-center outline-none focus:bg-white focus:border-slate-350 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Heart Rate (BPM)</label>
              <input
                type="number"
                required
                value={newHeartRate}
                onChange={(e) => setNewHeartRate(e.target.value)}
                className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:bg-white focus:border-slate-350 font-semibold"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:bg-white focus:border-slate-350 font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <AhnaraButton
              variant="outline"
              type="button"
              onClick={() => setIsVitalsModalOpen(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </AhnaraButton>
            <AhnaraButton
              variant="primary"
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 border-none text-white rounded-xl"
            >
              Save Vitals
            </AhnaraButton>
          </div>
        </form>
      </AhnaraModal>

    </div>
  );
}
