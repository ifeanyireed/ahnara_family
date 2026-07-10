"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  IconDeviceHeartMonitor, 
  IconActivity, 
  IconShieldCheck, 
  IconAlertTriangle, 
  IconRefresh,
  IconCpu,
  IconPlus,
  IconArrowUpRight,
  IconHeart
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function SeniorsVitals() {
  const [syncedDevices, setSyncedDevices] = useState([
    { id: 1, name: "SmartWatch Pro", status: "Connected", battery: "84%", type: "Heart Rate & Steps" },
    { id: 2, name: "Fall Neck Pendant", status: "Connected", battery: "92%", type: "Fall Accelerometer" }
  ]);

  const [vitalsHistory, setVitalsHistory] = useState([
    { date: "Jul 05", bp: "124/80", hr: 68, status: "Normal" },
    { date: "Jul 06", bp: "128/82", hr: 70, status: "Normal" },
    { date: "Jul 07", bp: "135/85", hr: 75, status: "Elevated" },
    { date: "Jul 08", bp: "128/82", hr: 72, status: "Normal" },
    { date: "Today", bp: "128/82", hr: 72, status: "Normal" }
  ]);

  const [isSyncing, setIsSyncing] = useState(false);

  const handleDeviceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      // Mock refresh step count or heart rate slightly
      setVitalsHistory(prev => {
        const last = { ...prev[prev.length - 1] };
        last.hr = 70 + Math.floor(Math.random() * 5);
        return [...prev.slice(0, prev.length - 1), last];
      });
    }, 1500);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Historical charts & vitals table (8 cols) */}
      <main className="lg:col-span-8 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-6 shadow-xs">
          
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">longitudinal reports</span>
              <h3 className="font-extrabold text-xl text-slate-800 tracking-tight text-display">Vitals Trends</h3>
            </div>
            
            <AhnaraButton
              variant="outline"
              onClick={handleDeviceSync}
              disabled={isSyncing}
              className="!rounded-xl text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1.5"
            >
              <IconRefresh className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
              Sync Sensors
            </AhnaraButton>
          </div>

          {/* Plotted Vitals chart */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-2">
              <span>Blood Pressure (Systolic Trend)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-600" /> Normal BP Zone (120-130)</span>
            </div>

            <div className="h-44 w-full flex items-end justify-between px-6 pt-4 gap-2 relative">
              {/* grid lines */}
              <div className="absolute left-0 right-0 top-1/4 h-px bg-slate-200" />
              <div className="absolute left-0 right-0 top-2/4 h-px bg-slate-200" />
              <div className="absolute left-0 right-0 top-3/4 h-px bg-slate-200" />

              {/* Plotted Points SVG */}
              <svg className="absolute inset-0 w-full h-full px-6 py-4 overflow-visible" viewBox="0 0 520 120" preserveAspectRatio="none">
                <path
                  d="M10,80 L130,70 L250,50 L370,68 L490,68"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="80" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="130" cy="70" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="250" cy="50" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" /> {/* Highlight high bp */}
                <circle cx="370" cy="68" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="490" cy="68" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
              </svg>

              {vitalsHistory.map((item, i) => (
                <div key={i} className="flex flex-col items-center z-15 mt-36">
                  <span className="text-[10px] font-black text-slate-700">{item.bp}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase mt-1">{item.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vitals History Log Table */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Recent Logs</span>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs font-semibold text-slate-600 text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black text-[9px] uppercase tracking-wider">
                    <th className="p-3.5 pl-5">Date</th>
                    <th className="p-3.5">Blood Pressure</th>
                    <th className="p-3.5">Heart Rate</th>
                    <th className="p-3.5 pr-5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vitalsHistory.map((log, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 pl-5 font-bold text-slate-800">{log.date}</td>
                      <td className="p-3.5 font-mono font-bold text-slate-700">{log.bp}</td>
                      <td className="p-3.5 text-slate-700">{log.hr} BPM</td>
                      <td className="p-3.5 pr-5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          log.status === "Normal" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </AhnaraCard>
      </main>

      {/* Side devices & Gait Panel (4 cols) */}
      <aside className="lg:col-span-4 flex flex-col gap-3">
        
        {/* Connected Wearables */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <div className="flex items-center gap-1.5">
              <IconCpu className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Wearable Sensors</h4>
            </div>
            <button className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-50">
              <IconPlus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {syncedDevices.map((device) => (
              <div key={device.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-left">
                <div>
                  <h5 className="font-black text-slate-800">{device.name}</h5>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase mt-0.5">{device.type}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded uppercase">Active</span>
                  <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Battery: {device.battery}</span>
                </div>
              </div>
            ))}
          </div>
        </AhnaraCard>

        {/* Gait/Fall Observational Status */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs text-left">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <div className="flex items-center gap-1.5">
              <IconActivity className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Gait &amp; Motion Sync</h4>
            </div>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-[10px] text-emerald-800 font-bold leading-normal flex items-start gap-2">
              <IconShieldCheck className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
              <div>
                <span>Motion Analysis Active</span>
                <p className="font-semibold text-slate-500 mt-0.5">No gait latency, balance anomalies, or sudden velocity deviations registered in local sensors.</p>
              </div>
            </div>

            <div className="border border-slate-100 rounded-xl p-3 text-[10px] text-slate-500 font-bold flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span>Gait Cadence:</span>
                <span className="text-slate-800 font-black">98 steps/min</span>
              </div>
              <div className="flex justify-between">
                <span>Stride Length:</span>
                <span className="text-slate-800 font-black">0.65 m (Normal)</span>
              </div>
              <div className="flex justify-between">
                <span>Gait Symmetry:</span>
                <span className="text-slate-800 font-black">97% Balance</span>
              </div>
            </div>
          </div>
        </AhnaraCard>

        {/* Critical vitals tag details */}
        <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE]/45 border-none p-5 flex flex-col gap-3 shadow-xs text-left">
          <span className="text-[9px] text-[#608216] font-black uppercase tracking-wider block">Clinical Safety Tag</span>
          <h4 className="text-sm font-black text-slate-800">Critical Medical Context</h4>
          
          <div className="flex flex-col gap-1.5 text-[10px] font-bold text-slate-500 mt-1">
            <div className="flex justify-between">
              <span>Blood Group:</span>
              <span className="text-slate-800 font-black">O+ (Rh Positive)</span>
            </div>
            <div className="flex justify-between">
              <span>Critical Diagnoses:</span>
              <span className="text-slate-800 font-black text-right">Cardiovascular, Diabetes</span>
            </div>
            <div className="flex justify-between">
              <span>Primary Allergies:</span>
              <span className="text-slate-800 font-black">Penicillin</span>
            </div>
          </div>
        </AhnaraCard>

      </aside>

    </div>
  );
}
