"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconLayoutDashboard,
  IconLayoutDashboardFilled,
  IconMessageChatbot,
  IconMessageChatbotFilled,
  IconCalendar,
  IconCalendarFilled,
  IconPill,
  IconPillFilled,
  IconBook,
  IconBookFilled,
  IconBell,
  IconAlertOctagon,
  IconPhoneCall,
  IconHeartFilled,
  IconCurrentLocation,
  IconX,
  IconCheck,
  IconMessageCircle,
  IconMessageCircleFilled,
  IconFileDescription,
  IconFileDescriptionFilled
} from "@tabler/icons-react";
import { AhnaraLoader } from "@/components/ahnara/AhnaraLoader";
import { cn } from "@/lib/utils";

export default function MamaWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [gestationData, setGestationData] = useState<any>(null);
  
  // SOS Modal states
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [sosStep, setSosStep] = useState(1);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [sosFeedback, setSosFeedback] = useState<string | null>(null);

  // Load gestation data and validate onboarding on mount
  useEffect(() => {
    const dataStr = localStorage.getItem("mama_gestation_data");
    if (!dataStr) {
      router.push("/onboarding");
      return;
    }
    try {
      const data = JSON.parse(dataStr);
      setGestationData(data);
    } catch (e) {
      router.push("/onboarding");
    }
  }, [pathname, router]);

  const menuItems = [
    { name: "Today", href: "/mama/dashboard", icon: IconLayoutDashboard, activeIcon: IconLayoutDashboardFilled },
    { name: "AI Midwife", href: "/mama/midwife", icon: IconMessageChatbot, activeIcon: IconMessageChatbotFilled },
    { name: "Antenatal", href: "/mama/anc", icon: IconCalendar, activeIcon: IconCalendarFilled },
    { name: "Birth Plan", href: "/mama/birth-plan", icon: IconFileDescription, activeIcon: IconFileDescriptionFilled },
    { name: "Meds", href: "/mama/meds", icon: IconPill, activeIcon: IconPillFilled },
    { name: "Consults", href: "/mama/consult", icon: IconPhoneCall, activeIcon: IconPhoneCall },
    { name: "Academy", href: "/mama/academy", icon: IconBook, activeIcon: IconBookFilled },
  ];

  // SOS double-tap trigger
  const handleSosTrigger = () => {
    const now = Date.now();
    if (now - lastClickTime < 300) {
      setIsSosOpen(true);
      setSosStep(1);
      setSosFeedback(null);
      
      setTimeout(() => {
        setSosStep(2);
      }, 3000);
    } else {
      setSosFeedback("Double-tap for Emergency SOS");
      setTimeout(() => setSosFeedback(null), 2500);
    }
    setLastClickTime(now);
  };

  if (!gestationData) {
    return <AhnaraLoader fullScreen size="lg" />;
  }

  return (
    <div className="min-h-screen bg-[#E8EFF4] text-[#0D090C] font-sans flex flex-col select-none">
      
      {/* TOP HEADER - Matches Provider Dashboard 1-to-1 (Transparent, no borders) */}
      <header className="px-8 py-5 flex items-center justify-between gap-4 bg-transparent border-none">
        
        {/* Logo and Nav Menu Group */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="w-10 h-10 rounded-full bg-[#D4F475] flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
          </div>

          {/* Navigation Tab Menu - Matches Provider Header Capsule */}
          <nav className="flex items-center gap-1 bg-[#DDEEF3] p-1 rounded-2xl border border-slate-300/30">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = isActive ? item.activeIcon : item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 z-10 ${
                    isActive ? "text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-[#1E293B] rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Notifications and Profile */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSosTrigger}
            className="px-4 h-10 rounded-full bg-red-600 border border-red-500/20 text-white font-black text-xs uppercase tracking-widest shadow-md shadow-red-600/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            SOS
          </button>
          
          <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all relative bg-white shadow-xs">
            <IconBell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="h-8 w-px bg-slate-200" />
          
          <div className="flex items-center gap-3">
            <img
              src="/character3.jpg"
              alt="Profile Avatar"
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
            />
            <div className="text-left hidden sm:block">
              <p className="font-bold text-sm text-slate-900 leading-none">Tyra Dhillon</p>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                Week {gestationData.gestationWeeks} ({gestationData.gestationDays}D)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN SCREEN WORKSPACE CONTAINER - Match layout padding */}
      <div className="flex-1 px-8 pt-6 pb-6 flex flex-col">
        {children}
      </div>

      {/* FLOAT TOOLTIP FOR SOS SINGLE-TAP */}
      <AnimatePresence>
        {sosFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#A03B2B] text-white px-5 py-2.5 rounded-2xl text-xs font-black shadow-lg uppercase tracking-wider flex items-center gap-2 border border-red-500/20"
          >
            <IconAlertOctagon className="w-4 h-4 animate-bounce" />
            {sosFeedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL M.06 SOS PANEL TAKEOVER MODAL */}
      <AnimatePresence>
        {isSosOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0D090C]/95 backdrop-blur-lg flex flex-col p-6"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-500 text-xs font-black uppercase tracking-widest">
                  Active Emergency SOS Dispatch
                </span>
              </div>
              <button
                onClick={() => setIsSosOpen(false)}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 flex flex-col justify-center max-w-xl w-full mx-auto gap-6 py-8">
              
              {sosStep === 1 ? (
                /* STEP 1: Connecting */
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-red-950/45 border-4 border-red-500/50 flex items-center justify-center animate-pulse">
                    <IconAlertOctagon className="w-12 h-12 text-red-500" />
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-black text-white text-display leading-tight">
                      Broadcasting Vitals &amp; Location
                    </h2>
                    <p className="text-slate-400 text-sm font-semibold mt-2 leading-relaxed">
                      Locking GPS coordinates and transmitting clinical risks profiles to regional dispatchers...
                    </p>
                  </div>

                  {/* Vitals Summary Card */}
                  <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left flex flex-col gap-2">
                    <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Broadcasting Context</span>
                    <div className="grid grid-cols-2 gap-3 text-xs text-white">
                      <div>
                        <span className="text-slate-400">Gestation:</span>
                        <p className="font-bold mt-0.5">Week {gestationData.gestationWeeks}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Risk Assessment:</span>
                        <p className={cn("font-bold mt-0.5 uppercase", gestationData.riskLevel === "high" ? "text-orange-400" : "text-emerald-400")}>
                          {gestationData.riskLevel} Risk
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* STEP 2: Dispatched with Map */
                <div className="flex flex-col gap-5 text-left">
                  
                  {/* Ambulance Status Banner */}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-red-600/20">
                      <IconPhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white">Ambulance Dispatched</h4>
                      <p className="text-xs text-red-400 font-bold uppercase tracking-wider mt-0.5">
                        ETA: 14 Minutes
                      </p>
                    </div>
                  </div>

                  {/* Mock Map component */}
                  <div className="h-44 w-full bg-slate-800 rounded-2xl relative overflow-hidden border border-white/5 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] bg-slate-900" />
                    <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                    <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-red-500 rounded-full" />
                    
                    <div className="absolute bottom-3 right-3 bg-[#0D090C] border border-white/10 px-3 py-1 rounded-xl text-[10px] text-slate-400 font-bold">
                      Route: Health Center A ➔ Your GPS
                    </div>
                    <IconCurrentLocation className="w-8 h-8 text-[#0089C1] animate-bounce" />
                  </div>

                  {/* Active responder detail */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Coordinator</span>
                      <h4 className="text-sm font-black text-white mt-0.5">Nurse Jevinro K.</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Emergency Triage Team</p>
                    </div>
                    <a
                      href="tel:+234800HNARASOS"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-red-600/10"
                    >
                      <IconPhoneCall className="w-4 h-4" />
                      Call Now
                    </a>
                  </div>

                  {/* Supportive Message */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start gap-3">
                    <IconHeartFilled className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                      Remain calm. The midwife at Health Center A has been paged with your gestational age ({gestationData.gestationWeeks} weeks) and is preparing an obstetric care room.
                    </p>
                  </div>

                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
