"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconLayoutDashboard,
  IconLayoutDashboardFilled,
  IconCalendar,
  IconCalendarFilled,
  IconShieldCheck,
  IconShieldFilled,
  IconActivity,
  IconDeviceHeartMonitor,
  IconHourglass,
  IconBell,
  IconX,
  IconHeartFilled,
  IconFlame,
  IconFlameFilled,
  IconFileText,
  IconFileTextFilled,
  IconBook,
  IconBookFilled,
  IconEar,
  IconCheck
} from "@tabler/icons-react";
import { AhnaraLoader } from "@/components/ahnara/AhnaraLoader";

export default function LadyWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ladyData, setLadyData] = useState<any>(null);
  
  // Load mock or onboarding data for Lady workspace
  useEffect(() => {
    // Check local storage or set defaults
    const dataStr = localStorage.getItem("lady_profile_data");
    if (!dataStr) {
      // Initialize with default parameters for demonstration
      const defaults = {
        name: "Clara Reed",
        age: 32,
        cycleLength: 28,
        activePhase: "Luteal Phase",
        dayInCycle: 22,
        setupCompleted: true
      };
      localStorage.setItem("lady_profile_data", JSON.stringify(defaults));
      setLadyData(defaults);
    } else {
      try {
        setLadyData(JSON.parse(dataStr));
      } catch (e) {
        setLadyData({
          name: "Clara Reed",
          age: 32,
          cycleLength: 28,
          activePhase: "Luteal Phase",
          dayInCycle: 22,
          setupCompleted: true
        });
      }
    }
  }, [pathname, router]);

  const menuItems = [
    { name: "Dashboard", href: "/lady", icon: IconLayoutDashboard, activeIcon: IconLayoutDashboardFilled },
    { name: "Fertility", href: "/lady/fertility", icon: IconCalendar, activeIcon: IconCalendarFilled },
    { name: "Screenings", href: "/lady/screenings", icon: IconShieldCheck, activeIcon: IconShieldFilled },
    { name: "Pain Map", href: "/lady/pain-map", icon: IconActivity, activeIcon: IconActivity },
    { name: "Pelvic Coach", href: "/lady/coach", icon: IconHourglass, activeIcon: IconHourglass },
    { name: "Hot Flush", href: "/lady/hot-flush", icon: IconFlame, activeIcon: IconFlameFilled },
    { name: "Reports", href: "/lady/reports", icon: IconFileText, activeIcon: IconFileTextFilled },
    { name: "Academy", href: "/lady/academy", icon: IconBook, activeIcon: IconBookFilled },
  ];

  if (!ladyData) {
    return <AhnaraLoader fullScreen size="lg" />;
  }

  return (
    <div className="min-h-screen bg-[#E8EFF4] text-[#0D090C] font-sans flex flex-col select-none">
      
      {/* TOP HEADER */}
      <header className="px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 bg-transparent border-none">
        
        {/* Logo and Nav Menu Group */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Logo */}
          <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center">
            <img src="/logo-white.png" alt="Logo" className="w-7 h-7 object-contain" />
          </div>

          {/* Navigation Tab Menu */}
          <nav className="flex items-center gap-1 bg-[#DDEEF3] p-1 rounded-2xl border border-slate-300/30 overflow-x-auto max-w-full">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = isActive ? item.activeIcon : item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors duration-200 z-10 whitespace-nowrap ${
                    isActive ? "text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="ladyActiveTabBackground"
                      className="absolute inset-0 bg-rose-500 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4.5 h-4.5" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Notifications and Profile */}
        <div className="flex items-center gap-4">
          
          <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all relative bg-white shadow-xs">
            <IconBell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="h-8 w-px bg-slate-200" />
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 font-extrabold text-sm shadow-xs uppercase">
              {ladyData.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="font-bold text-sm text-slate-900 leading-none">{ladyData.name}</p>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                {ladyData.activePhase} • Day {ladyData.dayInCycle}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN SCREEN WORKSPACE CONTAINER */}
      <div className="flex-1 px-8 pt-6 pb-6 flex flex-col">
        {children}
      </div>

    </div>
  );
}
