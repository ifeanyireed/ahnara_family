"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  IconActivity,
  IconCheck,
  IconClock,
  IconMapPin,
  IconPhoneCall,
  IconShield,
  IconDeviceHeartMonitor,
  IconUser,
  IconExclamationCircle,
  IconCircleCheck,
  IconAlertCircle
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function FamilyDashboard() {
  const [wellbeingStatus, setWellbeingStatus] = useState<"green" | "amber" | "red">("green");
  const [scamAlertActive, setScamAlertActive] = useState(true);
  const [heartRate, setHeartRate] = useState(72);
  const [steps, setSteps] = useState(8402);

  // 7x4 Medication matrix
  const medsMatrix = [
    [true, true, true, false],  // Mon
    [true, true, true, true],   // Tue
    [true, true, false, false], // Wed
    [true, true, true, true],   // Thu
    [true, true, true, false],  // Fri
    [true, false, false, false],// Sat
    [true, true, true, true]    // Sun
  ];

  const getStatusColor = (s: string) => {
    if (s === "green") return "text-emerald-500 border-emerald-500 bg-emerald-50/20";
    if (s === "amber") return "text-amber-500 border-amber-500 bg-amber-50/20";
    return "text-red-500 border-red-500 bg-red-50/20";
  };

  const getStatusBg = (s: string) => {
    if (s === "green") return "bg-emerald-500";
    if (s === "amber") return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pt-24 pb-16 px-4 md:px-8 text-left">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex flex-col border-b border-slate-200 pb-4">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Family monitoring Hub</span>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight text-display mt-1">
            Caregiver Dashboard
          </h1>
        </div>

        {/* 1. Wellbeing Status Summary */}
        <AhnaraCard variant="flat" className="bg-white p-6 border border-slate-100 shadow-xs flex flex-col gap-4">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Wellbeing Status Summary</span>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-6">
              {/* Dynamic status ring */}
              <button 
                onClick={() => {
                  setWellbeingStatus(prev => {
                    if (prev === "green") return "amber";
                    if (prev === "amber") return "red";
                    return "green";
                  });
                }}
                className={`w-20 h-20 rounded-full border-4 flex items-center justify-center flex-shrink-0 transition-all active:scale-95 cursor-pointer ${getStatusColor(wellbeingStatus)}`}
              >
                {wellbeingStatus === "green" ? <IconCircleCheck className="w-10 h-10" /> :
                 wellbeingStatus === "amber" ? <IconAlertCircle className="w-10 h-10" /> :
                 <IconExclamationCircle className="w-10 h-10" />}
              </button>

              <div className="flex flex-col text-left">
                <h2 className="text-lg font-black text-slate-800">
                  {wellbeingStatus === "green" ? "Margaret Dhillon is Safe" :
                   wellbeingStatus === "amber" ? "Daily Check-in Pending" :
                   "Emergency Alert Triggered"}
                </h2>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                  {wellbeingStatus === "green" ? "All health indices within standard limits. Medication schedule adheres." :
                   wellbeingStatus === "amber" ? "Evening check-in delayed by 15 minutes. Trusted circle notified." :
                   "SOS Active! Coordinates: 22 Medical Center Drive. Clinicians dispatched."}
                </p>
              </div>
            </div>

            <span className={`text-[10px] text-white font-black uppercase px-3 py-1.5 rounded-lg shadow-sm ${getStatusBg(wellbeingStatus)}`}>
              {wellbeingStatus} status
            </span>

          </div>
        </AhnaraCard>

        {/* 2. Scam Shield critical alert (if active) */}
        {scamAlertActive && (
          <AhnaraCard variant="flat" className="bg-red-50 border border-red-200 p-6 flex flex-col gap-4 text-left shadow-xs">
            <div className="flex items-center gap-2">
              <IconShield className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Scam Shield critical alert</span>
            </div>
            <p className="text-sm font-extrabold text-red-950 leading-relaxed">
              AI Scam Shield flagged a suspicious SMS received by Margaret: "URGENT: Your bank security code will expire in 2 hours. Click here to verify."
            </p>
            <div className="flex items-center gap-3 justify-end border-t border-red-100 pt-3">
              <AhnaraButton
                variant="outline"
                className="text-xs text-red-700 border-red-200 hover:bg-red-100 font-bold py-1.5 px-4 rounded-xl"
                onClick={() => {
                  setScamAlertActive(false);
                  alert("Warning dismissed. Phishing sender blocked.");
                }}
              >
                Dismiss & Block
              </AhnaraButton>
              <AhnaraButton
                variant="primary"
                className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded-xl flex items-center gap-1.5"
                onClick={() => alert("Connecting direct WebRTC consult line...")}
              >
                <IconPhoneCall className="w-4 h-4" />
                Call Margaret
              </AhnaraButton>
            </div>
          </AhnaraCard>
        )}

        {/* Double Columns: Meds grid & Health logs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Medication compliance Heatmap (7 cols) */}
          <div className="md:col-span-8 flex flex-col gap-3">
            <AhnaraCard variant="flat" className="bg-white p-5 border border-slate-100 shadow-xs flex flex-col gap-4 text-left">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Medication Compliance Heatmap</span>
              
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayName, dayIdx) => (
                  <div key={dayIdx} className="flex flex-col items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold">{dayName}</span>
                    {medsMatrix[dayIdx].map((completed, timeIdx) => (
                      <div
                        key={timeIdx}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 transition-colors ${
                          completed 
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-xs" 
                            : "bg-slate-50 border-slate-200 text-transparent"
                        }`}
                      >
                        <IconCheck className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-slate-50 pt-3">
                <IconCircleCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-bold text-slate-500">85% adherence achieved this week</span>
              </div>
            </AhnaraCard>
          </div>

          {/* Vitals Telemetry Card (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <AhnaraCard variant="flat" className="bg-white p-5 border border-slate-100 shadow-xs flex flex-col gap-4 text-left">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Health Telemetry summaries</span>
              
              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col gap-1.5">
                  <IconDeviceHeartMonitor className="w-5 h-5 text-blue-600" />
                  <span className="text-[9px] text-blue-600 font-black uppercase mt-1">Heart rate</span>
                  <span className="text-xl font-black text-slate-800 leading-none">{heartRate} BPM</span>
                </div>
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex flex-col gap-1.5">
                  <IconActivity className="w-5 h-5 text-orange-600" />
                  <span className="text-[9px] text-orange-600 font-black uppercase mt-1">Steps today</span>
                  <span className="text-xl font-black text-slate-800 leading-none">{steps}</span>
                </div>
              </div>
            </AhnaraCard>
          </div>

        </div>

        {/* 5. Caregiver Shift Visit Logs */}
        <AhnaraCard variant="flat" className="bg-white p-6 border border-slate-100 shadow-xs flex flex-col gap-4 text-left">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">GPS-Verified carer logs</span>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-200">
              <IconUser className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800">Nurse Jevinro K.</span>
              <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
                Checked in at 10:02 AM • Checked out at 11:30 AM (GPS Geofence Verified)
              </p>
              <p className="text-xs text-slate-400 italic mt-1 font-semibold">
                Care note: "Refilled morning pill boxes. Margaret completed light exercise and remains in high spirits."
              </p>
            </div>
          </div>
        </AhnaraCard>

      </div>
    </div>
  );
}
