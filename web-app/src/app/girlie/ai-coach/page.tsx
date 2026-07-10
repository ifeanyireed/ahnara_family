"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconSparkles, 
  IconSend, 
  IconInfoCircle,
  IconLock,
  IconArrowUpRight
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function GirlieAiCoachPage() {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "coach"; text: string }>>([
    { sender: "coach", text: "Hi! I am your Ahnara Puberty Coach. Ask me any sensitive questions about puberty, skin changes, menstrual cycles, or growing up. All queries are fully anonymous, secure, and clinical." }
  ]);
  const [inputVal, setInputVal] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const forumQuestions = [
    { q: "Is vaginal discharge normal?", a: "Yes, vaginal discharge is completely normal! It is your body's natural way of cleaning the cervix and vagina. Clean, white, or clear discharge is a sign of a healthy reproductive system." },
    { q: "What is the average age for a first period?", a: "Most girls start their first period (menarche) between the ages of 11 and 14, but starting anywhere from 9 to 15 is considered healthy. It depends on genetic growth factors!" },
    { q: "How do I choose between pads and tampons?", a: "It is entirely about what feels most comfortable for you! Pads sit on your underwear and are easy for beginners. Tampons are worn internally, allowing you to swim and play sports easily." }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal;
    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply = "That is a great question. Uterine contractions caused by prostaglandins are normal during periods. Restorative warmth (like a warm bath) helps ease the muscles. If you experience severe bleeding, let's log it in the Cramp Logger!";
      if (userText.toLowerCase().includes("discharge")) {
        reply = "Vaginal discharge changes consistency throughout your cycle! Near ovulation, it becomes stretchy and clear (like egg whites). In the luteal phase, it is thicker and white. This is healthy body literacy.";
      } else if (userText.toLowerCase().includes("acne") || userText.toLowerCase().includes("pimple")) {
        reply = "Acne breakouts during puberty are triggered by rising androgen hormones stimulating sebaceous skin glands. Gentle washing morning and night with mild cleansers keeps the skin clean without breaking the barrier.";
      }
      setMessages(prev => [...prev, { sender: "coach", text: reply }]);
    }, 1200);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* AI Coach chat screen (7 cols) */}
      <main className="lg:col-span-7 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs h-[520px]">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center gap-2">
              <IconSparkles className="w-6 h-6 text-pink-500" />
              <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">AI Puberty Coach</h3>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              <IconLock className="w-3.5 h-3.5" />
              <span>Anonymized</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 text-xs leading-normal">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`max-w-[85%] p-3.5 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-pink-500 text-white self-end rounded-tr-none font-bold"
                    : "bg-slate-50 border border-slate-150 text-slate-800 self-start rounded-tl-none font-semibold"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="bg-slate-50 border border-slate-150 text-slate-400 p-3.5 rounded-2xl rounded-tl-none self-start font-semibold">
                Coach is writing...
              </div>
            )}
          </div>

          {/* Input Panel */}
          <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-50 pt-3">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask me anything about growing up..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:bg-white focus:border-pink-400 text-slate-700"
            />
            <button
              type="submit"
              className="p-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-all border-none shadow-sm active:scale-95"
            >
              <IconSend className="w-4 h-4" />
            </button>
          </form>
        </AhnaraCard>
      </main>

      {/* Moderated QA forum (5 cols) */}
      <aside className="lg:col-span-5 flex flex-col gap-3">
        
        {/* Forum directory */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Verified Q&amp;A Board</h3>
          
          <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
            {forumQuestions.map((fq, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl text-xs flex flex-col gap-1.5">
                <span className="font-black text-pink-650 uppercase text-[9px] tracking-wider">Question</span>
                <h4 className="font-black text-slate-800 leading-snug">{fq.q}</h4>
                <p className="text-[11px] font-semibold text-slate-500 leading-relaxed mt-0.5 border-t border-slate-200/50 pt-1.5">{fq.a}</p>
              </div>
            ))}
          </div>
        </AhnaraCard>

        {/* School Counselor Escalation */}
        <AhnaraCard variant="flat" className="bg-pink-50/20 border border-pink-100 p-5 flex items-start gap-3 text-pink-950">
          <IconInfoCircle className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-left">
            <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest block">Consultation Net</span>
            <p className="text-[11px] font-bold mt-0.5 leading-normal text-pink-850">
              Need to talk to a real person? Request a private video consult with a verified school counselor or pediatrician.
            </p>
            <button className="mt-2.5 px-3.5 py-1.5 bg-pink-500 hover:bg-pink-600 text-white font-black text-[9px] uppercase rounded-lg border-none flex items-center gap-1 shadow-xs transition-all active:scale-95">
              Request Consultation
              <IconArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </AhnaraCard>

      </aside>

    </div>
  );
}
