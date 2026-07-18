"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconCalendar, 
  IconUser, 
  IconCheck, 
  IconPhoneCall, 
  IconClock, 
  IconBuildingHospital,
  IconMapPin,
  IconPlus,
  IconChecks,
  IconVideo,
  IconVideoOff,
  IconMicrophone,
  IconMicrophoneOff,
  IconPhoneOff,
  IconActivity,
  IconHeart
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function SeniorsTrustedCircle() {
  const [appointments, setAppointments] = useState([
    { id: 1, title: "Nurse Home Visit", time: "10:00 AM", provider: "Nurse Jevinro K.", type: "Medical Checkup", checkedIn: true, stamp: "Checked in at 10:02 AM (GPS Verified)" },
    { id: 2, title: "Podiatry Appointment", time: "02:30 PM", provider: "Dr. Sarah Miller", type: "Clinic Consult", checkedIn: false },
    { id: 3, title: "Grocery Assistance", time: "05:00 PM", provider: "Jane Doe (Daughter)", type: "Family Check", checkedIn: false }
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, text: "Check morning vitals logged", done: true },
    { id: 2, text: "Verify lunch & hydration", done: true },
    { id: 3, text: "Refill pill organizer box", done: false },
    { id: 4, text: "Take short walk in the garden", done: false }
  ]);

  const handleTaskToggle = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Telehealth safety net call states
  const [activeCall, setActiveCall] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [callMuted, setCallMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let timer: any;
    if (callConnected) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callConnected]);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleLaunchCall = () => {
    setActiveCall(true);
    setCallConnected(false);
    // Simulate connection delay
    setTimeout(() => {
      setCallConnected(true);
    }, 1500);
  };

  const handleEndCall = () => {
    setCallConnected(false);
    setActiveCall(false);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left relative">
      
      {/* Calendar Timeline (8 cols) */}
      <main className="lg:col-span-8 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">visit coordinator</span>
              <h3 className="font-extrabold text-xl text-slate-800 tracking-tight text-display">Care Calendar</h3>
            </div>
            <AhnaraButton
              variant="outline"
              className="!rounded-xl text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1.5"
            >
              <IconPlus className="w-4 h-4" />
              Add Event
            </AhnaraButton>
          </div>

          <div className="flex flex-col gap-3">
            {appointments.map((evt) => (
              <div 
                key={evt.id} 
                className={`p-4 rounded-2xl border text-left flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  evt.checkedIn 
                    ? "bg-emerald-50/40 border-emerald-150" 
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    evt.type === "Medical Checkup" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                    evt.type === "Clinic Consult" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                    "bg-[#E8F3CE] text-[#608216] border border-[#CDE0A4]"
                  }`}>
                    {evt.type === "Medical Checkup" ? <IconUser className="w-5 h-5" /> : 
                     evt.type === "Clinic Consult" ? <IconBuildingHospital className="w-5 h-5" /> : 
                     <IconChecks className="w-5 h-5" />}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-800 leading-none">{evt.title}</span>
                    <span className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase">
                      {evt.provider} • {evt.type}
                    </span>
                    {evt.checkedIn && (
                      <span className="text-[9px] text-emerald-700 font-bold mt-2 flex items-center gap-1">
                        <IconMapPin className="w-3.5 h-3.5" />
                        {evt.stamp}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto">
                  <span className="text-[10px] font-black uppercase bg-white border border-slate-150 rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-xs">
                    <IconClock className="w-3.5 h-3.5 text-indigo-600" />
                    {evt.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </AhnaraCard>
      </main>

      {/* Task checklists & Telehealth launcher (4 cols) */}
      <aside className="lg:col-span-4 flex flex-col gap-3">
        
        {/* Visit checklists */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <div className="flex items-center gap-1.5">
              <IconChecks className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Visit Care Checklist</h4>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Tasks</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => handleTaskToggle(task.id)}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  task.done 
                    ? "bg-slate-50 border-slate-150 text-slate-400 line-through" 
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all ${
                  task.done ? "bg-indigo-600 text-white" : "border border-slate-350 bg-white"
                }`}>
                  {task.done && <IconCheck className="w-3 h-3" />}
                </div>
                <span className="text-xs font-bold leading-none">{task.text}</span>
              </button>
            ))}
          </div>
        </AhnaraCard>

        {/* Telehealth bridge launcher */}
        <AhnaraCard variant="flat" padding="none" className="bg-indigo-600 border-none p-5 flex flex-col gap-3 text-white shadow-md text-left">
          <span className="text-[9px] text-indigo-200 font-black uppercase tracking-wider block">Clinical Portal</span>
          <h4 className="text-sm font-black text-white">Need Clinical Advice?</h4>
          <p className="text-[10px] text-indigo-100 font-semibold leading-normal">
            Bypass coordinates and launch a direct video consult with on-duty telemedicine doctors immediately.
          </p>
          <AhnaraButton
            variant="primary"
            onClick={handleLaunchCall}
            className="w-full mt-1.5 bg-white text-indigo-700 hover:bg-slate-100 !rounded-xl font-bold flex items-center justify-center gap-1.5"
          >
            <IconPhoneCall className="w-4 h-4 text-indigo-600" />
            Launch Consult
          </AhnaraButton>
        </AhnaraCard>

      </aside>

      {/* ACTIVE CALL MODAL OVERLAY */}
      <AnimatePresence>
        {activeCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#E8EFF4]/95 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[32px] p-6 shadow-2xl overflow-hidden flex flex-col gap-4 text-white"
            >
              {/* Call Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  Geriatric Safety consult
                </span>
                <span className="text-xs font-mono font-bold bg-slate-800/80 px-2 py-0.5 rounded text-[#D4F475]">
                  {callConnected ? formatDuration(callDuration) : "Connecting..."}
                </span>
              </div>

              {/* Call Video Screen Panel */}
              <div className="w-full h-80 bg-slate-850 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-800">
                {!callConnected ? (
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400 text-center p-6">
                    <div className="w-12 h-12 rounded-full border-4 border-[#0089C1] border-t-transparent animate-spin mb-2" />
                    <h4 className="text-sm font-black text-white">Contacting Telemedicine Spine</h4>
                    <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                      Securing WebRTC encryption channel. Matching on-duty obstetric/geriatric practitioners...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Doctor Video Feed (Background) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 to-slate-900 flex flex-col items-center justify-center text-center p-6">
                      <div className="w-20 h-20 rounded-full bg-[#D4F475] flex items-center justify-center shadow-lg mb-3">
                        <span className="text-slate-900 font-black text-xl">SM</span>
                      </div>
                      <h4 className="text-base font-black text-white">Dr. Sarah Miller</h4>
                      <span className="text-xs text-slate-400 font-semibold mt-0.5">Geriatric Practice Lead • Grace Clinic</span>
                      
                      <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-xs p-2 rounded-xl border border-white/5 flex items-center justify-center gap-6 text-[10px] font-mono text-[#D4F475]">
                        <span className="flex items-center gap-1"><IconHeart className="w-3.5 h-3.5 text-red-500 fill-current" /> HR: 72 BPM</span>
                        <span className="flex items-center gap-1"><IconActivity className="w-3.5 h-3.5 text-orange-400" /> Steps: 8,402</span>
                        <span>Spine Secure ✅</span>
                      </div>
                    </div>

                    {/* Patient Video PIP Overlay */}
                    <div className="absolute bottom-4 right-4 w-28 h-20 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl z-20 flex flex-col items-center justify-center text-[9px] font-bold text-slate-400 bg-slate-900/90">
                      {videoMuted ? (
                        <IconVideoOff className="w-5 h-5 text-slate-600" />
                      ) : (
                        <>
                          <span className="text-[10px] text-[#0089C1] font-black">Margaret</span>
                          <span className="text-[8px] opacity-75 mt-0.5">Mock Selfie Feed</span>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Call Controls Deck */}
              <div className="flex items-center justify-center gap-4 py-2">
                <button 
                  onClick={() => setCallMuted(!callMuted)}
                  disabled={!callConnected}
                  className={`p-3 rounded-full border text-white transition-all cursor-pointer ${
                    callMuted ? "bg-red-500 border-red-500 hover:bg-red-650" : "bg-slate-800 border-slate-750 hover:bg-slate-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={callMuted ? "Unmute Mic" : "Mute Mic"}
                >
                  {callMuted ? <IconMicrophoneOff className="w-5 h-5" /> : <IconMicrophone className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setVideoMuted(!videoMuted)}
                  disabled={!callConnected}
                  className={`p-3 rounded-full border text-white transition-all cursor-pointer ${
                    videoMuted ? "bg-red-500 border-red-500 hover:bg-red-650" : "bg-slate-800 border-slate-750 hover:bg-slate-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={videoMuted ? "Start Video" : "Stop Video"}
                >
                  {videoMuted ? <IconVideoOff className="w-5 h-5" /> : <IconVideo className="w-5 h-5" />}
                </button>
                <button 
                  onClick={handleEndCall}
                  className="p-3.5 bg-red-600 hover:bg-red-700 border-none text-white rounded-full transition-all cursor-pointer shadow-lg"
                  title="End Consult Call"
                >
                  <IconPhoneOff className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
