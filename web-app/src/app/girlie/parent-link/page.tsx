"use client";

import React, { useState } from "react";
import { 
  IconClock, 
  IconCheck, 
  IconMessage, 
  IconCalendarEvent,
  IconArrowUpRight
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function GirlieParentLinkPage() {
  const [requestSent, setRequestSent] = useState<string | null>(null);

  const supplyTemplates = [
    { text: "Please buy sanitary pads (regular size)", type: "Pads" },
    { text: "I need pain relief medicine (ibuprofen/paracetamol)", type: "Pain Medicine" },
    { text: "Let's schedule a dentist checkup this weekend", type: "Dentist" }
  ];

  const handleSend = (text: string) => {
    setRequestSent(text);
    setTimeout(() => setRequestSent(null), 2500);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Supply requests (7 cols) */}
      <main className="lg:col-span-7 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <IconMessage className="w-6 h-6 text-pink-500" />
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">One-Click Supply Requests</h3>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-slate-450 font-bold leading-normal block">
              Send discreet requests to your linked parent account without any awkward conversations.
            </span>

            <div className="flex flex-col gap-2.5">
              {supplyTemplates.map((template, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <span className="text-[9px] font-black text-pink-550 uppercase tracking-wider block">{template.type}</span>
                    <p className="text-xs font-bold text-slate-800 leading-normal mt-0.5">{template.text}</p>
                  </div>
                  <button 
                    onClick={() => handleSend(template.text)}
                    className="px-4 py-2 bg-pink-500 hover:bg-pink-650 text-white font-black text-[10px] uppercase rounded-xl border-none flex items-center gap-1 active:scale-95 transition-all shadow-xs"
                  >
                    Send Request
                    <IconArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {requestSent && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[10px] font-bold text-center mt-2">
                ✓ Request Sent: &quot;{requestSent}&quot; forwarded to parent phone!
              </div>
            )}
          </div>
        </AhnaraCard>
      </main>

      {/* Shared Calendars (5 cols) */}
      <aside className="lg:col-span-5 flex flex-col gap-3">
        
        {/* Calendar Card */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <IconCalendarEvent className="w-5 h-5 text-pink-500" />
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight text-display">Shared Doctor Dates</h3>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { title: "Routine Pediatric Checkup", date: "July 24, 2026", time: "10:00 AM", status: "Confirmed" },
              { title: "HPV Booster Vaccine", date: "August 12, 2026", time: "02:30 PM", status: "Pending Sync" }
            ].map((evt, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-black text-xs text-slate-850 leading-none">{evt.title}</h4>
                  <span className="text-[10px] text-slate-450 font-bold block mt-1.5">{evt.date} • {evt.time}</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                  evt.status === "Confirmed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}>
                  {evt.status}
                </span>
              </div>
            ))}
          </div>
        </AhnaraCard>

        {/* Sync details */}
        <AhnaraCard variant="flat" className="bg-slate-50 border border-slate-200 p-5 flex items-start gap-2.5">
          <IconClock className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold leading-normal text-slate-500">
            <strong>Last parent sync:</strong> 15 minutes ago. All sent requests are automatically forwarded via SMS/Push Notification to your primary parent guardian account.
          </p>
        </AhnaraCard>

      </aside>

    </div>
  );
}
