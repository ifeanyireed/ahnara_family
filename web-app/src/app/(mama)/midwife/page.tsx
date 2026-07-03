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
  IconUser,
  IconX,
  IconEar,
  IconArrowRight,
  IconChevronRight
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

interface Message {
  id: string;
  sender: "user" | "midwife";
  text: string;
  timestamp: string;
  isAudio?: boolean;
  audioDuration?: string;
  isWarning?: boolean;
}

export default function AiMidwifePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "midwife",
      text: "Hello Tyra. I am your Ahnara AI Midwife. How are you feeling today? You can type your symptoms below, click any quick-chips, or record a voice note in your local language (English, Yoruba, Hausa, or Igbo) to begin triage.",
      timestamp: "12:00 PM"
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activeWarning, setActiveWarning] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const addMessage = (sender: "user" | "midwife", text: string, isAudio = false, isWarning = false) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: Math.random().toString(),
      sender,
      text,
      timestamp: time,
      isAudio,
      audioDuration: isAudio ? "0:04" : undefined,
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
      
      // Clinical Danger Signs triage checks
      if (lowerText.includes("bleed") || lowerText.includes("blood") || lowerText.includes("spotting")) {
        setActiveWarning("Vaginal Bleeding");
        addMessage(
          "midwife", 
          "⚠ CRITICAL ALERT: Any vaginal bleeding during pregnancy requires immediate medical examination. Please do not wait. Use the red button on the sidebar to connect with our emergency triage coordinator or visit Health Center A immediately.",
          false,
          true
        );
      } else if (lowerText.includes("headache") || lowerText.includes("migraine") || lowerText.includes("blurry") || lowerText.includes("vision")) {
        setActiveWarning("Severe Headache / Vision Flags");
        addMessage(
          "midwife", 
          "⚠ CLINICAL NOTICE: Severe headaches accompanied by blurry vision can indicate blood pressure issues (pre-eclampsia). Please rest in a quiet room, avoid bright screens, and log your blood pressure using the vitals modal. If symptoms persist or BP systolic exceeds 140, click the Escalation button to call a nurse.",
          false,
          true
        );
      } else if (lowerText.includes("swell") || lowerText.includes("feet") || lowerText.includes("edema")) {
        setActiveWarning("Mild Edema / Swelling");
        addMessage(
          "midwife", 
          "Pregnancy swelling in the feet is common due to fluid retention. However, if you notice sudden swelling in your face or hands, please let your midwife know, as this requires a blood pressure check. Try elevating your legs above your heart for 20 minutes.",
          false,
          false
        );
      } else if (lowerText.includes("kick") || lowerText.includes("movement") || lowerText.includes("baby move")) {
        addMessage(
          "midwife", 
          "Fetal movement tracking is important! From Week 24, WHO recommends recording kick cycles. You should feel at least 10 kicks or movements within a 2-hour window when resting. If you notice a sudden decrease in movements, please visit the clinic immediately.",
          false,
          false
        );
      } else {
        addMessage(
          "midwife", 
          "Thank you for sharing. I have recorded these symptoms in your daily wellness logs. To verify any potential maternal risks, please continue describing how you feel, or press the call button to consult a nurse.",
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
      "I am having a very severe headache and my eyes are blurry.",
      "I noticed some light bleeding when I woke up this morning.",
      "My feet are very swollen and I feel dizzy.",
      "I haven't felt the baby kick as much today."
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
      <main className="lg:col-span-9 flex flex-col h-[calc(100vh-140px)] bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs relative">
        
        {/* Chat Panel Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#DDEEF3] flex items-center justify-center text-[#0089C1]">
              <IconMessageChatbot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#0D090C] text-display">Ahnara AI Midwife</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Online Triage Support</span>
              </div>
            </div>
          </div>

          <div className="bg-[#E8F3CE] border border-[#CDE0A4] text-[#608216] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-xl shadow-xs">
            Multilingual Voice AI
          </div>
        </div>

        {/* MESSAGES VIEW SCRIP */}
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
                      ? "bg-[#1E293B] text-white rounded-br-none"
                      : msg.isWarning
                      ? "bg-red-50 border border-red-200 text-red-700 rounded-bl-none shadow-xs shadow-red-500/5"
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
                  {msg.sender === "midwife" ? "Midwife AI" : "You"} • {msg.timestamp}
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
                Midwife AI is triaging...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* BOTTOM PROMPT BAR & CHIPS */}
        <div className="p-4 border-t border-slate-100 bg-white flex flex-col gap-3">
          
          {/* Quick chips - symptom selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider pr-1 flex-shrink-0">Triage Chips:</span>
            {[
              { label: "Vaginal Bleeding ⚠", value: "I am having vaginal bleeding" },
              { label: "Severe Headache ⚠", value: "I have a very severe headache and blurry vision" },
              { label: "Swollen Feet", value: "My feet are very swollen and puffy" },
              { label: "Reduced Kicks", value: "I haven't felt the baby kick as much today" },
              { label: "Mild Dizziness", value: "I am feeling dizzy and tired" }
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
                placeholder="Type details about how you are feeling..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 text-xs outline-none focus:bg-white focus:border-slate-300 font-semibold"
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
              className="absolute inset-0 bg-[#0D090C]/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6"
            >
              <div className="flex flex-col items-center text-center gap-6 max-w-sm w-full bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                <div className="w-16 h-16 rounded-full bg-red-50 border-4 border-red-500/30 flex items-center justify-center text-red-500 animate-pulse">
                  <IconMicrophone className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="font-extrabold text-[#0D090C] text-sm text-display">Recording Voice Note...</h4>
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
                    className="flex-1 rounded-xl h-10 text-xs font-bold bg-[#8BB436] hover:bg-[#7aa02e] border-none text-white"
                  >
                    Submit Note
                  </AhnaraButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* RIGHT SIDEBAR (3 COLS) - Matches Provider Sidebar */}
      <aside className="lg:col-span-3 flex flex-col gap-3">
        
        {/* Desktop-only spacer to align with chat header */}
        <div className="hidden lg:block h-[68px]" />

        {/* Triage Warning Board Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <IconAlertOctagon className="w-5 h-5 text-orange-500" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Active Warning Flags</h3>
              </div>
              <span className={`w-2 h-2 rounded-full ${activeWarning ? "bg-red-500 animate-ping" : "bg-slate-300"}`} />
            </div>

            <div className="flex flex-col gap-2.5">
              {activeWarning ? (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex flex-col gap-2 text-left">
                  <div className="flex items-center gap-1.5 text-red-700">
                    <IconAlertOctagon className="w-4.5 h-4.5 flex-shrink-0" />
                    <span className="text-xs font-black uppercase tracking-wider">{activeWarning}</span>
                  </div>
                  <p className="text-[10px] text-red-600 font-semibold leading-relaxed">
                    A clinical risk alert has been registered. Triage suggests speaking with a clinician immediately.
                  </p>
                  <button 
                    onClick={() => setActiveWarning(null)} 
                    className="text-[9px] font-black text-red-500 hover:underline uppercase tracking-wider text-left mt-1"
                  >
                    Clear Alert Flag
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center text-slate-400 py-6">
                  <IconCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold">No Danger Sign Flags Detected</p>
                </div>
              )}
            </div>
          </AhnaraCard>
        </motion.div>

        {/* Escalation Clinician CTA Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm text-left">
            <div className="flex items-center justify-between border-b border-[#C7DB9C] pb-3">
              <div className="flex items-center gap-2">
                <IconPhoneCall className="w-5 h-5 text-[#608216]" />
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Escalation Center</h3>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs text-[#608216] font-semibold leading-relaxed">
                Connect directly with a live registered midwife or obstetrician on call at Health Center A.
              </p>
              
              <a
                href="tel:+234800AHNARAMIDWIFE"
                className="w-full bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <IconPhoneCall className="w-4 h-4" />
                Call Live Clinician Now
              </a>

              <span className="text-[9px] text-[#608216]/70 font-bold block text-center uppercase tracking-wider mt-1">
                EHR SPINE TRIAGE CONNECTED
              </span>
            </div>
          </AhnaraCard>
        </motion.div>

      </aside>

    </div>
  );
}
