"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconMessageChatbot,
  IconMicrophone,
  IconSend,
  IconCheck,
  IconAlertOctagon,
  IconPhoneCall,
  IconX,
  IconEar,
  IconVideo,
  IconPill,
  IconVideoOff,
  IconMicrophoneOff,
  IconPhoneOff,
  IconActivity,
  IconHeart
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

interface Message {
  id: string;
  sender: "user" | "pediatrician";
  text: string;
  timestamp: string;
  isAudio?: boolean;
  audioDuration?: string;
  isWarning?: boolean;
}

export default function AiPediatricianPage() {
  const [childName, setChildName] = useState("Aria");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activeWarning, setActiveWarning] = useState<string | null>(null);
  const [videoActive, setVideoActive] = useState(false);
  
  // Telehealth Safety Net Call states
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
    setTimeout(() => {
      setCallConnected(true);
    }, 1500);
  };

  const handleEndCall = () => {
    setCallConnected(false);
    setActiveCall(false);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load child name and start message
  useEffect(() => {
    const dataStr = localStorage.getItem("kids_profile_data");
    let cName = "Aria";
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        cName = data.childName || "Aria";
        setChildName(cName);
      } catch (e) {}
    }
    
    setMessages([
      {
        id: "1",
        sender: "pediatrician",
        text: `Hello. I am your Ahnara AI Pediatrician & Triage Assistant. How can I help you with ${cName} today? You can select any quick symptom chips, type how the child is feeling, or record a voice note in your local language (English, Yoruba, Hausa, or Igbo) to begin WHO IMCI triage.`,
        timestamp: "12:00 PM"
      }
    ]);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Recording timer simulation
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const addMessage = (sender: "user" | "pediatrician", text: string, isAudio = false, isWarning = false) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: Math.random().toString(),
      sender,
      text,
      timestamp: time,
      isAudio,
      audioDuration: isAudio ? "0:05" : undefined,
      isWarning
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleSend = (text: string, isAudio = false) => {
    if (!text.trim()) return;
    
    // Add user message
    addMessage("user", text, isAudio);
    setInputValue("");
    
    // Trigger AI response
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const lowerText = text.toLowerCase();
      
      // Clinical Danger Signs triage checks (WHO IMCI)
      if (lowerText.includes("breath") || lowerText.includes("cough") || lowerText.includes("chest") || lowerText.includes("fast")) {
        setActiveWarning("Difficulty Breathing");
        addMessage(
          "pediatrician", 
          `⚠ RED FLAG: Chest indrawings, rapid breathing, or stridor in ${childName} are critical clinical danger signs. Seek immediate pediatric care at Health Center A. Do not delay.`,
          false,
          true
        );
        setVideoActive(true); // Allow video consulting
      } else if (lowerText.includes("fever") || lowerText.includes("temp") || lowerText.includes("hot")) {
        setActiveWarning("High Fever Alert");
        addMessage(
          "pediatrician", 
          `⚠ CLINICAL NOTICE: If ${childName}'s temperature exceeds 38.5°C, or is accompanied by neck stiffness or lethargy, it is an emergency. Give tepid sponge baths, ensure hydration, and click the Consult button to connect with our pediatric doctor.`,
          false,
          true
        );
        setVideoActive(true);
      } else if (lowerText.includes("diarrhea") || lowerText.includes("purge") || lowerText.includes("stool")) {
        setActiveWarning("Diarrhea & Dehydration");
        addMessage(
          "pediatrician", 
          `WHO guidelines recommend starting Oral Rehydration Salts (ORS) and Zinc dispersible tablets immediately for diarrhea. Check if ${childName} has sunken eyes, dry mouth, or is unusually thirsty. If they cannot drink or are very lethargic, visit the clinic immediately.`,
          false,
          false
        );
      } else if (lowerText.includes("vomit") || lowerText.includes("feed") || lowerText.includes("eat")) {
        setActiveWarning("Inability to Feed");
        addMessage(
          "pediatrician", 
          `⚠ RED FLAG: An inability to feed, drink, or vomiting everything is a general clinical danger sign under WHO IMCI standards. Please check for lethargy and take ${childName} to the nearest clinic immediately.`,
          false,
          true
        );
      } else if (lowerText.includes("rash") || lowerText.includes("measles")) {
        addMessage(
          "pediatrician", 
          `Inspect the rash location. If accompanied by red eyes, runny nose, or mouth sores, it may indicate Measles. Ensure vitamin A supplementation is up to date and isolate from other children.`,
          false,
          false
        );
      } else {
        addMessage(
          "pediatrician", 
          `Thank you. I have logged these symptoms in ${childName}'s health record. If you observe any general danger signs (inability to feed, lethargy, convulsions, rapid breathing), contact a pediatrician immediately using our clinic escalation links.`,
          false,
          false
        );
      }
    }, 2000);
  };

  const handleChipClick = (symptom: string) => {
    handleSend(symptom);
  };

  // Simulated Voice Note Submission
  const startRecording = () => {
    setIsRecording(true);
  };

  const stopAndSubmitRecording = () => {
    setIsRecording(false);
    
    // Pre-recorded voice text transcript mockups
    const transcriptOptions = [
      "The child is breathing very fast and drawing in their chest.",
      "Aria has a very hot fever and is not active.",
      "My child has diarrhea, vomiting everything and is very limp.",
      "Aria has developed red rashes all over her body."
    ];
    const randomTranscript = transcriptOptions[Math.floor(Math.random() * transcriptOptions.length)];
    
    // Send simulated audio message
    handleSend(randomTranscript, true);
  };

  const cancelRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* LEFT/CENTER CHAT PANEL (9 COLS) */}
      <main className="lg:col-span-9 flex flex-col h-[calc(100vh-140px)] bg-white border border-slate-200/50 rounded-3xl overflow-hidden shadow-xs relative">
        
        {/* Chat Panel Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E6F5FA] flex items-center justify-center text-[#0089C1]">
              <IconMessageChatbot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 text-display">AI Pediatrician &amp; Triage</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">IMCI Guidelines Active</span>
              </div>
            </div>
          </div>

          <div className="bg-[#E8F3CE] border border-[#CDE0A4] text-[#608216] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-xl shadow-xs">
            Multilingual Voice AI
          </div>
        </div>

        {/* MESSAGES VIEW */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-slate-50/30">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${isUser ? "self-end items-end" : "self-start items-start"}`}
              >
                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs font-semibold leading-relaxed text-left shadow-xs transition-all ${
                    isUser
                      ? "bg-[#0089C1] text-white rounded-br-none"
                      : msg.isWarning
                      ? "bg-red-50 border border-red-200 text-red-750 rounded-bl-none shadow-xs shadow-red-500/5"
                      : "bg-white border border-slate-200/50 text-slate-700 rounded-bl-none"
                  }`}
                >
                  {msg.isAudio ? (
                    <div className="flex items-center gap-3.5 pr-2">
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white">
                        <IconEar className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[10px] opacity-75">Voice Triage Note ({msg.audioDuration})</span>
                        <p className="text-xs italic font-semibold">&ldquo;{msg.text}&rdquo;</p>
                      </div>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
                
                {/* Timestamp */}
                <span className="text-[9px] text-slate-400 font-bold mt-1.5 px-1 uppercase tracking-wider">
                  {msg.sender === "pediatrician" ? "AI Pediatrician" : "You"} • {msg.timestamp}
                </span>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="self-start flex flex-col items-start max-w-[80%]">
              <div className="bg-white border border-slate-200/50 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-[9px] text-slate-400 font-bold mt-1.5 px-1 uppercase tracking-wider">
                Pediatric AI is triaging...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* BOTTOM PROMPT BAR & CHIPS */}
        <div className="p-4 border-t border-slate-100 bg-white flex flex-col gap-3">
          
          {/* Quick chips - symptom selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider pr-1 flex-shrink-0">IMCI Symptoms:</span>
            {[
              { label: "High Fever 🌡", value: "The child has a very high fever" },
              { label: "Chest Indrawing ⚠", value: "The child is breathing fast with chest indrawings" },
              { label: "Diarrhea", value: "My baby has diarrhea" },
              { label: "Rashes", value: "The child has developed rashes" },
              { label: "Lethargy ⚠", value: "The child is unusually sleepy and cannot wake up" }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(chip.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl px-3 py-1.5 text-[10px] font-black text-slate-600 transition-all flex-shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Persistent input field */}
          <div className="flex items-center gap-2">
            <button
              onClick={startRecording}
              className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all flex-shrink-0"
            >
              <IconMicrophone className="w-5 h-5 text-[#0089C1]" />
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Describe how ${childName} is feeling...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 text-xs outline-none focus:bg-white focus:border-slate-350 font-semibold text-slate-800"
              />
              <button
                onClick={() => handleSend(inputValue)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0089C1] hover:text-[#0089C1]/80 transition-all p-1"
              >
                <IconSend className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* VOICE RECORDING OVERLAY */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6"
            >
              <div className="flex flex-col items-center text-center gap-6 max-w-sm w-full bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                <div className="w-16 h-16 rounded-full bg-red-50 border-4 border-red-500/30 flex items-center justify-center text-red-500 animate-pulse">
                  <IconMicrophone className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm text-display">Recording Voice Note...</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                    Speak in English, Yoruba, Igbo, or Hausa
                  </p>
                  <span className="font-mono text-xl font-black text-red-500 mt-2 block">
                    0:{recordingSeconds.toString().padStart(2, "0")}
                  </span>
                </div>

                {/* Simulated Waveform Visualizer */}
                <div className="flex items-center gap-1.5 h-8">
                  {[...Array(9)].map((_, i) => (
                    <span
                      key={i}
                      className="bg-[#0089C1] w-1.5 rounded-full animate-[pulse_0.8s_infinite]"
                      style={{
                        height: `${Math.floor(10 + Math.random() * 30)}px`,
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full mt-2">
                  <AhnaraButton
                    variant="outline"
                    onClick={cancelRecording}
                    className="flex-1 rounded-xl h-10 text-xs font-bold"
                  >
                    Cancel
                  </AhnaraButton>
                  <AhnaraButton
                    variant="primary"
                    onClick={stopAndSubmitRecording}
                    className="flex-1 rounded-xl h-10 text-xs font-bold bg-[#1E293B] hover:bg-slate-800 border-none text-white"
                  >
                    Submit Note
                  </AhnaraButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* RIGHT SIDEBAR (3 COLS) */}
      <aside className="lg:col-span-3 flex flex-col gap-3">
        
        {/* Desktop-only spacer to align with chat header */}
        <div className="hidden lg:block h-[68px]" />

        {/* WHO IMCI Danger Signs Triage Warnings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-200/50 p-5 flex flex-col gap-4 shadow-xs text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IconAlertOctagon className="w-5 h-5 text-red-600" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">IMCI Red Flags</h3>
              </div>
              <span className={`w-2 h-2 rounded-full ${activeWarning ? "bg-red-500 animate-ping" : "bg-slate-300"}`} />
            </div>

            <div className="flex flex-col gap-2.5">
              {activeWarning ? (
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex flex-col gap-2 text-left">
                  <div className="flex items-center gap-1.5 text-red-700">
                    <IconAlertOctagon className="w-4.5 h-4.5 flex-shrink-0" />
                    <span className="text-xs font-black uppercase tracking-wider">{activeWarning}</span>
                  </div>
                  <p className="text-[10px] text-red-650 font-semibold leading-relaxed">
                    RED FLAG detected. The system has pre-notified pediatric emergency staff. Prepare transport.
                  </p>
                  <button 
                    onClick={() => {
                      setActiveWarning(null);
                      setVideoActive(false);
                    }} 
                    className="text-[9px] font-black text-red-700 hover:underline uppercase tracking-wider text-left mt-1"
                  >
                    Clear Alert Flag
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center text-slate-400 py-6">
                  <IconCheck className="w-8 h-8 text-[#8BB436] mx-auto mb-2" />
                  <p className="text-xs font-semibold">No general danger signs</p>
                </div>
              )}
            </div>
          </AhnaraCard>
        </motion.div>

        {/* Telehealth & Specialist Consult Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-[#E6F5FA] border-none p-5 flex flex-col gap-4 shadow-sm text-left">
            <div className="flex items-center justify-between border-b border-sky-200/50 pb-3">
              <div className="flex items-center gap-2">
                <IconVideo className="w-5 h-5 text-[#0089C1]" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Specialist Consult</h3>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                Connect via video conference with a live registered pediatrician on duty.
              </p>
              
              <button
                onClick={handleLaunchCall}
                className="w-full font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md border-none bg-red-650 text-white hover:bg-red-700 cursor-pointer"
              >
                <IconVideo className="w-4 h-4" />
                {videoActive ? "Enter Consultation Room" : "Initiate Video Consult"}
              </button>

              <button
                onClick={() => alert("Forwarding WHO prescription (ORS/Zinc/Amoxicillin) to AHNARA Market Pharmacy...")}
                className="w-full bg-white border border-[#0089C1]/20 hover:bg-slate-50 text-[#0089C1] font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <IconPill className="w-4 h-4" />
                Send Prescriptions to Market
              </button>

              <span className="text-[9px] text-[#0089C1]/75 font-bold block text-center uppercase tracking-wider mt-1">
                EHR TRIAGE SPINE LINKED
              </span>
            </div>
          </AhnaraCard>
        </motion.div>

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
                  Pediatric Telemedicine Triage
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
                    <h4 className="text-sm font-black text-white">Contacting Pediatrician on duty</h4>
                    <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                      Securing WebRTC encryption channel. Matching on-duty obstetric/pediatric practitioners...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Doctor Video Feed (Background) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-950 to-slate-900 flex flex-col items-center justify-center text-center p-6">
                      <div className="w-20 h-20 rounded-full bg-sky-400 flex items-center justify-center shadow-lg mb-3">
                        <span className="text-white font-black text-xl">DA</span>
                      </div>
                      <h4 className="text-base font-black text-white">Dr. Adenuga</h4>
                      <span className="text-xs text-slate-400 font-semibold mt-0.5">Pediatric Specialist • Grace Clinic</span>
                      
                      <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-xs p-2 rounded-xl border border-white/5 flex items-center justify-center gap-6 text-[10px] font-mono text-[#D4F475]">
                        <span className="flex items-center gap-1"><IconActivity className="w-3.5 h-3.5 text-orange-400" /> Patient: Baby Aria</span>
                        <span className="flex items-center gap-1"><IconAlertOctagon className="w-3.5 h-3.5 text-red-500" /> Vitals: Temp 39.1°C</span>
                        <span>Spine Secure ✅</span>
                      </div>
                    </div>

                    {/* Patient Video PIP Overlay */}
                    <div className="absolute bottom-4 right-4 w-28 h-20 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl z-20 flex flex-col items-center justify-center text-[9px] font-bold text-slate-400 bg-slate-900/90">
                      {videoMuted ? (
                        <IconVideoOff className="w-5 h-5 text-slate-600" />
                      ) : (
                        <>
                          <span className="text-[10px] text-[#0089C1] font-black">Jane &amp; Aria</span>
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
                  className="p-3.5 bg-red-650 hover:bg-red-700 border-none text-white rounded-full transition-all cursor-pointer shadow-lg"
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
