"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  IconFolder, 
  IconMicrophone, 
  IconCalendar, 
  IconFileText, 
  IconUpload, 
  IconDownload, 
  IconClock, 
  IconLock,
  IconCheck,
  IconPlus,
  IconArrowUpRight
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraModal } from "@/components/ahnara/AhnaraModal";

export default function SeniorsLegacyVault() {
  const [audioStories, setAudioStories] = useState([
    { id: 1, title: "Grandma's Childhood Stories", duration: "12m 40s", date: "Jul 01, 2026", locked: false },
    { id: 2, title: "Wedding Day Memories", duration: "8m 15s", date: "Jun 24, 2026", locked: false }
  ]);

  const [documents, setDocuments] = useState([
    { id: 1, title: "Birth Certificate.pdf", size: "1.2 MB", category: "Legal" },
    { id: 2, title: "Property Deed.pdf", size: "4.8 MB", category: "Property" },
    { id: 3, title: "Health Declaration.pdf", size: "850 KB", category: "Medical" }
  ]);

  const [letters, setLetters] = useState([
    { id: 1, recipient: "Sarah (Granddaughter)", trigger: "Graduation Day (2028)", status: "Scheduled", date: "2028-06-15" }
  ]);

  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("");
  const [letterContent, setLetterContent] = useState("");
  const [triggerDate, setTriggerDate] = useState("");

  const handleAddLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !triggerEvent || !triggerDate) return;
    
    setLetters(prev => [
      ...prev,
      {
        id: prev.length + 1,
        recipient,
        trigger: triggerEvent,
        status: "Scheduled",
        date: triggerDate
      }
    ]);
    
    setRecipient("");
    setTriggerEvent("");
    setLetterContent("");
    setTriggerDate("");
    setIsLetterModalOpen(false);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Left side: Stories & Letters (8 cols) */}
      <main className="lg:col-span-8 flex flex-col gap-3">
        
        {/* Audio stories card */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center gap-2">
              <IconMicrophone className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Life Story Recordings</h3>
            </div>
            <AhnaraButton
              variant="outline"
              className="!rounded-xl text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1.5"
            >
              <IconPlus className="w-4 h-4" />
              Record New
            </AhnaraButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {audioStories.map((story) => (
              <div key={story.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-3 text-xs text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{story.date}</span>
                  <IconLock className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm leading-tight">{story.title}</h4>
                  <span className="text-[10px] text-slate-500 font-semibold block mt-1">Duration: {story.duration}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <AhnaraButton
                    variant="outline"
                    className="flex-1 !rounded-lg text-xs py-1.5 border-slate-200 hover:bg-slate-100 text-slate-600 font-bold"
                  >
                    Play Story
                  </AhnaraButton>
                  <AhnaraButton
                    variant="outline"
                    className="!rounded-lg text-xs p-1.5 border-slate-200 hover:bg-slate-100 text-slate-500 font-bold"
                  >
                    <IconDownload className="w-4 h-4" />
                  </AhnaraButton>
                </div>
              </div>
            ))}
          </div>
        </AhnaraCard>

        {/* Future dated letters */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center gap-2">
              <IconClock className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Future-Dated Letters</h3>
            </div>
            <AhnaraButton
              variant="outline"
              onClick={() => setIsLetterModalOpen(true)}
              className="!rounded-xl text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1.5"
            >
              <IconPlus className="w-4 h-4" />
              Schedule Letter
            </AhnaraButton>
          </div>

          <div className="flex flex-col gap-2.5">
            {letters.map((letter) => (
              <div key={letter.id} className="p-4 bg-indigo-50/20 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs text-left">
                <div>
                  <h4 className="font-black text-slate-800">To: {letter.recipient}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">Trigger: {letter.trigger}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg font-black uppercase flex items-center gap-1">
                    <IconCalendar className="w-3.5 h-3.5" />
                    Send: {letter.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AhnaraCard>

      </main>

      {/* Right side: Locker & sync details (4 cols) */}
      <aside className="lg:col-span-4 flex flex-col gap-3">
        
        {/* Document Locker */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <div className="flex items-center gap-1.5">
              <IconFolder className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Document Locker</h4>
            </div>
            <button className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-50">
              <IconUpload className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {documents.map((doc) => (
              <div key={doc.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-left">
                <div className="flex items-center gap-3">
                  <IconFileText className="w-8 h-8 text-slate-400 flex-shrink-0" />
                  <div>
                    <h5 className="font-black text-slate-800 leading-tight">{doc.title}</h5>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase mt-0.5">{doc.category} • {doc.size}</span>
                  </div>
                </div>
                <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100">
                  <IconDownload className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </AhnaraCard>

        {/* Access Rights Control details */}
        <AhnaraCard variant="flat" padding="none" className="bg-emerald-50/50 border-none p-5 flex flex-col gap-3 shadow-xs text-left">
          <span className="text-[9px] text-emerald-800 font-black uppercase tracking-wider block">Security Settings</span>
          <h4 className="text-sm font-black text-slate-800">Trusted Access Privileges</h4>
          <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
            By default, members of your Trusted Circle (next of kin) can view these documents in case of emergency. Edit permissions directly in Trusted Circle parameters.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-bold mt-1">
            <IconCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted with biometric passkeys</span>
          </div>
        </AhnaraCard>

      </aside>

      {/* SCHEDULE LETTER MODAL */}
      <AhnaraModal
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        title="Schedule Future-Dated Letter"
      >
        <form onSubmit={handleAddLetter} className="flex flex-col gap-4 p-4 text-left">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recipient Name</label>
            <input
              type="text"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Sarah (Granddaughter)"
              className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:bg-white focus:border-slate-350 font-semibold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Release Event Trigger</label>
              <input
                type="text"
                required
                value={triggerEvent}
                onChange={(e) => setTriggerEvent(e.target.value)}
                placeholder="e.g. 18th Birthday, Graduation"
                className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:bg-white focus:border-slate-350 font-semibold text-slate-800"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated Release Date</label>
              <input
                type="date"
                required
                value={triggerDate}
                onChange={(e) => setTriggerDate(e.target.value)}
                className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:bg-white focus:border-slate-350 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Letter Content</label>
            <textarea
              rows={4}
              required
              value={letterContent}
              onChange={(e) => setLetterContent(e.target.value)}
              placeholder="Write your loving memories or advice..."
              className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm outline-none focus:bg-white focus:border-slate-350 font-semibold text-slate-800 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <AhnaraButton
              variant="outline"
              type="button"
              onClick={() => setIsLetterModalOpen(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </AhnaraButton>
            <AhnaraButton
              variant="primary"
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 border-none text-white rounded-xl"
            >
              Schedule Letter
            </AhnaraButton>
          </div>
        </form>
      </AhnaraModal>

    </div>
  );
}
