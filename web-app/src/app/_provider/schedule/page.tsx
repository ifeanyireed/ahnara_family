"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  Settings,
  Bell,
  MessageSquare,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpRight,
  Plus,
  Clock,
  Info
} from "lucide-react";
import {
  IconLayoutDashboard,
  IconLayoutDashboardFilled,
  IconChartPie,
  IconChartPieFilled,
  IconCalendar,
  IconCalendarFilled,
  IconUser,
  IconUserFilled,
  IconSettings,
  IconSettingsFilled
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState("Schedule");
  const [searchValue, setSearchValue] = useState("");

  const menuItems = [
    { name: "Dashboard", icon: IconLayoutDashboard, activeIcon: IconLayoutDashboardFilled },
    { name: "Statistics", icon: IconChartPie, activeIcon: IconChartPieFilled },
    { name: "Schedule", icon: IconCalendar, activeIcon: IconCalendarFilled },
    { name: "Doctors", icon: IconUser, activeIcon: IconUserFilled },
    { name: "Settings", icon: IconSettings, activeIcon: IconSettingsFilled },
  ];

  const patients = [
    { id: 1, name: "Jane Cooper", condition: "Heart failure", status: "Acute From", statusBg: "bg-slate-100 text-slate-600 border border-slate-200/50", date: "July 29, 2025", image: "/character5.jpg" },
    { id: 2, name: "Wade Warren", condition: "Heart failure", status: "In Remission", statusBg: "bg-blue-50 text-blue-600 border border-blue-100/50", date: "July 29, 2025", image: "/character6.jpg" },
    { id: 3, name: "Guy Hawkins", condition: "Heart failure", status: "Acute From", statusBg: "bg-slate-100 text-slate-600 border border-slate-200/50", date: "July 29, 2025", image: "/character7.jpg" },
    { id: 4, name: "Robert Fox", condition: "Heart failure", status: "Chronic Care", statusBg: "bg-[#E3F4BE] text-[#608216] border border-[#D3EAA2]/50", date: "July 29, 2025", image: "/character8.jpg" },
  ];

  const treatments = [
    { id: "10A", name: "Cardiac MRI" },
    { id: "08B", name: "Stress Test" },
    { id: "12G", name: "Echocardiography" },
    { id: "15D", name: "Angioplasty" }
  ];

  const calendarDays = [
    { day: 27, active: false },
    { day: 28, active: false },
    { day: 29, active: true },
    { day: 30, active: false },
    { day: 31, active: false },
    { day: "01", active: false }
  ];

  // SVG treatment activity/pulse icon
  const TreatmentIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#608216]">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#E8EFF4] text-slate-800 font-sans flex flex-col">
        
        {/* TOP HEADER */}
        <header className="px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo and Nav Menu Group */}
          <div className="flex items-center gap-4">
            {/* Logo in Green circle */}
            <div className="w-10 h-10 rounded-full bg-[#D4F475] flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
            </div>

            {/* Navigation Tab Menu */}
            <nav className="flex items-center gap-1 bg-[#DDEEF3] p-1 rounded-2xl border border-slate-300/30">
              {menuItems.map((item) => {
                const isActive = activeTab === item.name;
                const Icon = isActive ? item.activeIcon : item.icon;
                const linkHref = item.name === "Dashboard" ? "/provider/dashboard" : item.name === "Schedule" ? "/provider/schedule" : "#";
                
                return (
                  <Link
                    key={item.name}
                    href={linkHref}
                    onClick={() => setActiveTab(item.name)}
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
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Notifications and Profile */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-600 hover:text-slate-800 hover:scale-105 transition-all shadow-sm">
              <Bell className="w-4.5 h-4.5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-600 hover:text-slate-800 hover:scale-105 transition-all shadow-sm">
              <MessageSquare className="w-4.5 h-4.5" />
            </button>
            <div className="flex items-center gap-2 pl-2">
              <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden">
                <img src="/character1.jpg" alt="Tyra Dhillon" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-bold text-sm text-slate-900 leading-tight">Tyra Dhillon</p>
                <p className="text-[10px] text-slate-400 font-semibold leading-tight mt-0.5">Doctor</p>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTAINER */}
        <div className="flex-1 px-8 pt-6 pb-8 flex flex-col gap-5">
          
          {/* Greeting and CTAs Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="text-left">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Hello, Jevinro</h2>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight text-display mt-0.5">Patients</h1>
            </div>

            <div className="flex items-center gap-2.5">
              <button className="w-10 h-10 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-600 hover:text-slate-800 shadow-sm hover:scale-105 transition-all">
                <Settings className="w-4.5 h-4.5" />
              </button>
              <AhnaraButton
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-[#D4F475] text-[#608216] border border-[#CDE0A4] !rounded-full !px-6 hover:bg-[#c5ec59] transition-all shadow-sm"
              >
                Add New Patients
              </AhnaraButton>
            </div>
          </motion.div>

          {/* Filters Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search by name or condition..."
                className="w-full bg-[#DDEEF3]/50 border border-slate-200/80 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all placeholder:text-slate-400 text-slate-800 font-semibold"
              />
            </div>
            <div className="flex items-center gap-2 self-stretch md:self-auto">
              <AhnaraButton
                variant="outline"
                leftIcon={<Filter className="w-4 h-4" />}
                className="!rounded-2xl border-slate-200/80 !py-3 hover:bg-slate-50 text-slate-700 whitespace-nowrap bg-white"
              >
                <span className="text-sm font-semibold">Filter</span>
              </AhnaraButton>
              <AhnaraButton
                variant="outline"
                leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                className="!rounded-2xl border-slate-200/80 !py-3 hover:bg-slate-50 text-slate-700 whitespace-nowrap bg-white"
              >
                <span className="text-sm font-semibold">Sort By</span>
              </AhnaraButton>
            </div>
          </motion.div>

          {/* GRID LAYOUT: Left (5 Cols) and Right (7 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            
            {/* LEFT COLUMN: PATIENTS LIST & SCHEDULE (5 COLS) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              
              {/* Patients List Card */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-full"
              >
                <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-[#0D090C] text-lg tracking-tight text-display">Patients List</h3>
                    <span className="text-xs font-bold text-[#608216]/70 uppercase tracking-wide">4 active</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {patients.map((pat, idx) => (
                      <motion.div
                        key={pat.id}
                        whileHover={{ scale: 1.01, x: 3 }}
                        className="bg-white p-3 rounded-2xl flex items-center justify-between border border-[#C7DB9C]/40 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={pat.image}
                            alt={pat.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                          />
                          <div className="text-left">
                            <p className="font-bold text-sm text-slate-900 group-hover:text-[#8BB436] transition-colors">{pat.name}</p>
                            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{pat.condition}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end gap-0.5">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${pat.statusBg}`}>
                              {pat.status}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold">{pat.date}</span>
                          </div>
                          <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-800 group-hover:border-slate-300 transition-all">
                            <ChevronRight className="w-4.5 h-4.5" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AhnaraCard>
              </motion.div>

              {/* Schedule Widget Card */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="h-full"
              >
                <AhnaraCard variant="flat" padding="none" className="bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-[#0D090C] text-lg tracking-tight text-display">Schedule</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#D4F475] text-[#608216] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#CDE0A4]">
                        July
                      </span>
                      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200/50 text-slate-600 shadow-xs hover:scale-105 transition-all">
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200/50 text-slate-600 shadow-xs hover:scale-105 transition-all">
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal calendar day row */}
                  <div className="flex items-center justify-between bg-white/40 p-2.5 rounded-2xl border border-[#C7DB9C]/30 gap-1.5">
                    {calendarDays.map((d, index) => (
                      <div
                        key={index}
                        className={`flex-1 py-2.5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                          d.active
                            ? "bg-[#D4F475] text-[#608216] font-bold shadow-sm"
                            : "bg-transparent text-slate-600 hover:bg-white/40 font-semibold"
                        }`}
                      >
                        <span className="text-xs uppercase opacity-70 tracking-wider">
                          {index === 0 && "Mon"}
                          {index === 1 && "Tue"}
                          {index === 2 && "Wed"}
                          {index === 3 && "Thu"}
                          {index === 4 && "Fri"}
                          {index === 5 && "Sat"}
                        </span>
                        <span className="text-lg font-extrabold mt-0.5">{d.day}</span>
                      </div>
                    ))}
                  </div>

                  {/* Eleanor Pena Appointment Card */}
                  <div className="bg-white p-3 rounded-2xl flex items-center justify-between border border-[#C7DB9C]/40">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100">
                        <img src="/character9.jpg" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Dr. Eleanor Pena</h4>
                        <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                          <Clock className="w-3.5 h-3.5 text-[#8BB436]" />
                          <span className="text-[10px] font-bold">Today, 12:42 PM</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                        <MessageSquare className="w-4 h-4 fill-current" />
                      </button>
                      <AhnaraButton className="bg-[#D4F475] text-[#608216] border border-[#CDE0A4] !rounded-xl !px-4 !h-9 text-xs font-extrabold hover:bg-[#c5ec59] transition-all">
                        Book Now
                      </AhnaraButton>
                    </div>
                  </div>
                </AhnaraCard>
              </motion.div>

            </div>

            {/* RIGHT COLUMN: PATIENT DETAILED WORKSPACE (7 COLS) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              
              {/* Doctor Portrait & Treatments Grid Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                
                {/* Photo Portrait Frame */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="md:col-span-5 h-full min-h-[220px]"
                >
                  <div className="w-full h-full rounded-[32px] overflow-hidden border border-slate-200/50 shadow-sm relative group bg-white">
                    <img
                      src="/character10.jpg"
                      alt="Doctor Portrait"
                      className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                </motion.div>

                {/* Treatment Card */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="md:col-span-7 h-full"
                >
                  <AhnaraCard variant="flat" padding="none" className="h-full bg-[#E8F3CE] border-none p-5 flex flex-col gap-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-[#0D090C] text-lg tracking-tight text-display">Treatment</h3>
                      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-800 shadow-xs hover:scale-105 transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Sub-cards grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {treatments.map((t) => (
                        <div
                          key={t.id}
                          className="bg-white border border-[#C7DB9C]/40 p-3 rounded-2xl flex items-center justify-between group hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
                        >
                          <div className="text-left">
                            <span className="text-[10px] font-extrabold text-slate-400 font-mono block leading-none mb-1">{t.id}</span>
                            <span className="text-[11px] font-bold text-slate-700 tracking-tight block truncate max-w-[90px]">{t.name}</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-[#E8F3CE]/70 border border-[#CDE0A4]/40 flex items-center justify-center group-hover:bg-[#E8F3CE] transition-all">
                            <TreatmentIcon />
                          </div>
                        </div>
                      ))}
                    </div>
                  </AhnaraCard>
                </motion.div>

              </div>

              {/* Diagnosis Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-2 shadow-sm text-left">
                  <h3 className="font-extrabold text-slate-900 text-base tracking-tight text-display">Diagnosis Summary</h3>
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed mt-0.5">
                    Chronic heart failure and hypertension actively monitored and managed through personalized care plans.
                  </p>
                </AhnaraCard>
              </motion.div>

              {/* Next Steps for Better Health Card */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
              >
                <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-2 shadow-sm text-left relative">
                  <h3 className="font-extrabold text-slate-900 text-base tracking-tight text-display">Next Steps for Better Health</h3>
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed mt-0.5 pr-8">
                    To reduce future risk: avoid smoking, stay active, maintain healthy habits, and follow your Medixa care plan.
                  </p>
                  <button className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#E8EFF4]/60 border border-slate-200/50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </AhnaraCard>
              </motion.div>

              {/* Bottom Test & Condition Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                
                {/* Test Card */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="h-full"
                >
                  <AhnaraCard variant="flat" padding="none" className="h-full bg-white border border-slate-100 p-4 flex flex-col gap-3.5 shadow-sm text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-sm tracking-tight text-display">Test</h4>
                      <button className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {["Echo", "Diastolic Stress", "Coronary Angiography"].map((testName, i) => (
                        <div
                          key={i}
                          className="bg-[#E8F3CE]/45 text-[#608216] border border-[#CDE0A4]/40 px-3 py-1.5 rounded-xl text-[10px] font-extrabold tracking-wide uppercase text-center cursor-pointer hover:bg-[#E8F3CE]/70 transition-colors"
                        >
                          • {testName}
                        </div>
                      ))}
                    </div>
                  </AhnaraCard>
                </motion.div>

                {/* Next Visit Card */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.53 }}
                  className="h-full"
                >
                  <AhnaraCard variant="flat" padding="none" className="h-full bg-[#D4F475] border-none p-5 flex flex-col justify-between shadow-sm min-h-[160px] text-left">
                    <div>
                      <h4 className="font-extrabold text-[#608216] text-xs uppercase tracking-wider">Next visit</h4>
                      <p className="text-[#608216]/70 text-[10px] font-bold mt-0.5">Estimated timeline check</p>
                    </div>
                    <div>
                      <span className="text-4xl font-black text-[#608216] tracking-tight block text-display">15/25</span>
                      <span className="text-[10px] font-extrabold text-[#608216]/60 tracking-wider uppercase block mt-1">Days remaining</span>
                    </div>
                  </AhnaraCard>
                </motion.div>

                {/* Heart Condition Level Card */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.56 }}
                  className="h-full"
                >
                  <AhnaraCard variant="flat" padding="none" className="h-full bg-white border border-slate-100 p-4 flex flex-col items-center justify-between shadow-sm text-center">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1 leading-none">Your Heart Condition Level</span>
                    
                    {/* Stylized 3D heart asset */}
                    <div className="w-20 h-24 overflow-hidden relative flex items-center justify-center">
                      <img
                        src="/heart_3d.jpg"
                        alt="3D Heart rendering"
                        className="w-full h-full object-contain object-center scale-110 drop-shadow-md"
                      />
                    </div>

                    {/* Radial progress ring */}
                    <div className="flex items-center gap-2 mt-2 w-full justify-center">
                      <div className="w-7 h-7 relative flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="14" cy="14" r="10" stroke="#F1F5F9" strokeWidth="2.5" fill="transparent" />
                          <circle cx="14" cy="14" r="10" stroke="#8BB436" strokeWidth="2.5" fill="transparent" strokeDasharray="62.8" strokeDashoffset="18.8" />
                        </svg>
                        <span className="text-[8px] font-black absolute text-slate-700">70%</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Excellent</span>
                    </div>
                  </AhnaraCard>
                </motion.div>

              </div>

            </div>

          </div>

        </div>
    </div>
  );
}
