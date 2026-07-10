"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconMicrophone, 
  IconVolume, 
  IconVolume3, 
  IconRefresh, 
  IconAlertTriangle,
  IconShield,
  IconClock,
  IconActivity
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function SeniorsAICompanion() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechIndex, setActiveSpeechIndex] = useState(0);
  const [speechTranscript, setSpeechTranscript] = useState<string[]>([]);
  const [cognitiveScore, setCognitiveScore] = useState(98);
  const [speechVelocity, setSpeechVelocity] = useState("Normal (142 WPM)");

  const conversationScript = [
    {
      prompt: "Hello Margaret! How are you doing today? Can you tell me what you had for breakfast?",
      reply: "I am doing well! For breakfast I had some oatmeal with strawberries and a cup of black tea.",
      metric: "Memory Recall: Verified (Fast response, high accuracy)"
    },
    {
      prompt: "Wonderful! Oatmeal is very healthy. By the way, do you remember who is visiting you this afternoon?",
      reply: "Yes, my daughter Jane is coming to check on me around 4 PM.",
      metric: "Memory Recall: Verified (Correct family graph mapping)"
    },
    {
      prompt: "That's correct! Jane will be there. Let's do a quick word puzzle: What is the opposite of the word 'Generous'?",
      reply: "Let me think... is it 'Stingy' or 'Selfish'?",
      metric: "Synonym Match: Verified (Mild delay, correct cognitive result)"
    }
  ];

  const triggerNextStep = () => {
    if (activeSpeechIndex >= conversationScript.length) {
      setActiveSpeechIndex(0);
      setSpeechTranscript([]);
      return;
    }
    
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setIsSpeaking(true);
      const current = conversationScript[activeSpeechIndex];
      setSpeechTranscript(prev => [...prev, `Margaret: "${current.reply}"`, `Metric: ${current.metric}`]);
      
      setTimeout(() => {
        setIsSpeaking(false);
        setActiveSpeechIndex(prev => prev + 1);
      }, 3500);
    }, 3000);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Voice Sphere and controls (8 cols) */}
      <main className="lg:col-span-8 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-8 flex flex-col items-center justify-center min-h-[460px] shadow-xs">
          
          {/* Animated AI Sphere */}
          <div className="relative w-48 h-48 flex items-center justify-center mb-8">
            <AnimatePresence>
              {(isListening || isSpeaking) && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: isListening ? [1, 1.3, 1] : [1, 1.15, 0.95, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{
                    duration: isListening ? 2 : 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`absolute inset-0 rounded-full blur-2xl ${isListening ? "bg-indigo-400" : "bg-emerald-300"}`}
                />
              )}
            </AnimatePresence>

            <motion.div
              animate={{
                scale: isListening ? [1, 1.08, 1] : isSpeaking ? [1, 1.05, 0.98, 1.02, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center z-10 transition-colors duration-500 shadow-xl ${
                isListening 
                  ? "bg-indigo-600 text-white" 
                  : isSpeaking 
                  ? "bg-emerald-600 text-white" 
                  : "bg-slate-100 text-slate-500 border border-slate-200"
              }`}
            >
              {isListening ? (
                <IconMicrophone className="w-14 h-14 animate-pulse" />
              ) : isSpeaking ? (
                <IconVolume className="w-14 h-14" />
              ) : (
                <IconVolume3 className="w-14 h-14 opacity-50" />
              )}
            </motion.div>
          </div>

          {/* Voice Prompt Label */}
          <div className="text-center max-w-md flex flex-col gap-2">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              {isListening 
                ? "Listening..." 
                : isSpeaking 
                ? "Speaking..." 
                : activeSpeechIndex === 0 
                ? "Start daily voice check-in" 
                : "Check-in in progress"}
            </h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              {isListening 
                ? "Please speak clearly. Speak into your microphone." 
                : isSpeaking 
                ? conversationScript[activeSpeechIndex].prompt 
                : activeSpeechIndex === 0 
                ? "Click the button below to start the conversational AI check. Ahnara checks cognitive parameters during chat."
                : "Click below to trigger the next conversation prompt."}
            </p>
          </div>

          {/* Action Trigger */}
          <div className="mt-8 flex items-center gap-3">
            <AhnaraButton
              variant="primary"
              onClick={triggerNextStep}
              disabled={isListening || isSpeaking}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 !rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
            >
              {activeSpeechIndex === 0 
                ? "Start Voice Companion" 
                : activeSpeechIndex >= conversationScript.length 
                ? "Restart check-in" 
                : "Respond to Assistant"}
            </AhnaraButton>
          </div>

        </AhnaraCard>
      </main>

      {/* Cognitive Logs & Speech Velocity (4 cols) */}
      <aside className="lg:col-span-4 flex flex-col gap-3">
        
        {/* Cognitive Index Metrics */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center gap-1.5">
              <IconActivity className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Cognitive Check Status</h4>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Stable</span>
          </div>

          <div className="flex flex-col gap-3 text-left">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cognitive Index</span>
              <p className="text-2xl font-black text-slate-800 mt-0.5">{cognitiveScore}%</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Speech Velocity</span>
              <p className="text-xs font-bold text-slate-700 mt-0.5">{speechVelocity}</p>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] text-emerald-800 font-semibold leading-normal">
              No signs of memory latency, repetitive speech patterns, or semantic recall deficits detected during today's session.
            </div>
          </div>
        </AhnaraCard>

        {/* Live speech transcription */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex-1 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <div className="flex items-center gap-1.5">
              <IconClock className="w-5 h-5 text-slate-400" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Speech Log Transcript</h4>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[220px] text-left text-xs font-semibold text-slate-600 pr-1.5">
            {speechTranscript.length === 0 ? (
              <span className="text-slate-400 italic">No logs registered yet. Start check-in.</span>
            ) : (
              speechTranscript.map((log, i) => {
                const isMetric = log.startsWith("Metric:");
                return (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border ${
                      isMetric 
                        ? "bg-slate-50 border-slate-150 text-[10px] text-indigo-700 font-bold ml-4" 
                        : "bg-indigo-50/20 border-indigo-100 text-slate-800"
                    }`}
                  >
                    {log}
                  </div>
                );
              })
            )}
          </div>
        </AhnaraCard>

      </aside>

    </div>
  );
}
