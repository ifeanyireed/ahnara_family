"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  BarChart3,
  Calendar,
  Users,
  Settings,
  Bell,
  MessageSquare,
  Search,
  Filter,
  SlidersHorizontal,
  Heart,
  Droplets,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Clock,
  ExternalLink,
} from "lucide-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

// Custom SVG Icons for the supplements
const SupplementBottle = ({ color, labelColor }: { color: string; labelColor: string }) => (
  <svg viewBox="0 0 60 100" className="w-12 h-20 filter drop-shadow-md transition-transform duration-300 group-hover:scale-105">
    {/* Cap */}
    <rect x="18" y="10" width="24" height="8" rx="2" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
    <line x1="22" y1="10" x2="22" y2="18" stroke="#94A3B8" />
    <line x1="26" y1="10" x2="26" y2="18" stroke="#94A3B8" />
    <line x1="30" y1="10" x2="30" y2="18" stroke="#94A3B8" />
    <line x1="34" y1="10" x2="34" y2="18" stroke="#94A3B8" />
    <line x1="38" y1="10" x2="38" y2="18" stroke="#94A3B8" />
    {/* Neck */}
    <rect x="22" y="18" width="16" height="8" fill="#F1F5F9" />
    {/* Body */}
    <rect x="10" y="26" width="40" height="64" rx="8" fill={color} opacity="0.85" />
    {/* Label */}
    <rect x="12" y="40" width="36" height="36" rx="2" fill="#FFFFFF" />
    {/* Pill/Design inside Label */}
    <rect x="16" y="46" width="28" height="12" rx="6" fill={labelColor} opacity="0.8" />
    <line x1="16" y1="64" x2="32" y2="64" stroke="#CBD5E1" strokeWidth="2" />
    <line x1="16" y1="70" x2="26" y2="70" stroke="#E2E8F0" strokeWidth="2" />
  </svg>
);

const DropperBottle = () => (
  <svg viewBox="0 0 60 100" className="w-12 h-20 filter drop-shadow-md transition-transform duration-300 group-hover:scale-105">
    {/* Squeeze bulb */}
    <path d="M22 18 C22 10, 38 10, 38 18 Z" fill="#334155" />
    {/* Cap */}
    <rect x="18" y="18" width="24" height="10" rx="1" fill="#1E293B" />
    {/* Neck */}
    <rect x="24" y="28" width="12" height="4" fill="#E2E8F0" />
    {/* Amber Bottle Body */}
    <rect x="12" y="32" width="36" height="58" rx="8" fill="#78350F" opacity="0.9" />
    {/* Liquid inside */}
    <rect x="14" y="45" width="32" height="42" rx="4" fill="#B45309" opacity="0.7" />
    {/* Label */}
    <rect x="15" y="48" width="30" height="28" rx="2" fill="#FFFFFF" />
    {/* Dropper logo on label */}
    <circle cx="30" cy="58" r="4" fill="#D97706" />
    <path d="M30 52 L30 58" stroke="#D97706" strokeWidth="2" />
  </svg>
);

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchValue, setSearchValue] = useState("");

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Statistics", icon: BarChart3 },
    { name: "Schedule", icon: Calendar },
    { name: "Doctors", icon: Users },
    { name: "Settings", icon: Settings },
  ];

  const latestAppointments = [
    {
      name: "Dr. Naresh Kumar",
      specialty: "Cardiologist",
      date: "15 Nov 2024",
      image: "/character8.jpg",
    },
    {
      name: "Dr. Jane Cooper",
      specialty: "Pediatrician",
      date: "2 Nov 2024",
      image: "/character11.jpg",
    },
    {
      name: "Dr. Jenny Wilson",
      specialty: "GP",
      date: "13 Oct 2024",
      image: "/character12.jpg",
    },
    {
      name: "Dr. Devon Lane",
      specialty: "Neurologist",
      date: "11 Aug 2024",
      image: "/character10.jpg",
    },
  ];

  const supplements = [
    { id: "01", name: "Fish Oil", color: "#FEF3C7", labelColor: "#F59E0B" },
    { id: "02", name: "Vitamin B", color: "#FFEDD5", labelColor: "#EA580C" },
    { id: "03", name: "Stamina Booster", color: "#ECFDF5", labelColor: "#10B981" },
    { id: "04", name: "Blood Booster", color: "#FEE2E2", labelColor: "#EF4444" },
    { id: "05", name: "Skin Medication", isDropper: true },
    { id: "06", name: "Bone Medication", color: "#E0F2FE", labelColor: "#0EA5E9" },
  ];

  return (
    <div className="min-h-screen bg-[#E8EFF4] text-slate-800 font-sans flex flex-col">
        
        {/* TOP HEADER */}
        <header className="px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo and Nav Menu Group */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="w-10 h-10 rounded-full bg-[#D4F475] flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
            </div>

            {/* Navigation Tab Menu */}
            <nav className="flex items-center gap-1 bg-[#DDEEF3] p-1 rounded-2xl border border-slate-300/30">
              {menuItems.map((item) => {
                const isActive = activeTab === item.name;
                const Icon = item.icon;
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
                    <Icon className="w-5 h-5" fill={isActive ? "currentColor" : "none"} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Notifications and Profile */}
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all">
              <MessageSquare className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <img
                src="/character3.jpg"
                alt="Profile Avatar"
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div className="text-left hidden sm:block">
                <p className="font-bold text-sm text-slate-900">Tyra Dhillon</p>
                <p className="text-xs text-slate-400 font-medium">Doctor</p>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT BODY */}
        <div className="flex-1 px-4 pt-12 pb-4 grid grid-cols-1 lg:grid-cols-12 gap-3 bg-[#E8EFF4]">
          
          {/* LEFT/CENTER PANELS (9 COLS) */}
          <main className="lg:col-span-9 flex flex-col gap-3">
            
            {/* Greeting & Search Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="text-left">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-display">Hello, Tyra</h2>
                <p className="text-slate-500 font-medium mt-1">You have 1 appointment today</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 self-stretch md:self-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search"
                    className="w-full bg-[#F1F5F9]/50 border border-slate-200/80 rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all placeholder:text-slate-400 text-slate-800"
                  />
                </div>
                <AhnaraButton
                  variant="outline"
                  leftIcon={<Filter className="w-4 h-4" />}
                  className="!rounded-2xl border-slate-200/80 !py-2.5 hover:bg-slate-50 text-slate-700 whitespace-nowrap"
                >
                  <span className="text-sm font-semibold">Filter</span>
                </AhnaraButton>
                <AhnaraButton
                  variant="outline"
                  leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                  className="!rounded-2xl border-slate-200/80 !py-2.5 hover:bg-slate-50 text-slate-700 whitespace-nowrap"
                >
                  <span className="text-sm font-semibold">Sort By</span>
                </AhnaraButton>
              </div>
            </motion.div>

            {/* Top row widget grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Heart Rate Card */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="h-full"
              >
                <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Heart Rate</span>
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-[0_2px_8px_rgba(59,130,246,0.1)]">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                  
                  {/* Wave graph SVG */}
                  <div className="h-16 w-full flex items-center mb-2">
                    <svg className="w-full h-full" viewBox="0 0 160 50">
                      <defs>
                        <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2"/>
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0"/>
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,25 C10,25 15,10 20,10 C25,10 30,35 35,35 C40,35 45,5 50,5 C55,5 60,40 65,40 C70,40 75,20 80,20 C85,20 90,30 95,30 C100,30 105,15 110,15 C115,15 120,28 125,28 C130,28 135,25 140,25 C150,25 155,25 160,25"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M0,25 C10,25 15,10 20,10 C25,10 30,35 35,35 C40,35 45,5 50,5 C55,5 60,40 65,40 C70,40 75,20 80,20 C85,20 90,30 95,30 C100,30 105,15 110,15 C115,15 120,28 125,28 C130,28 135,25 140,25 C150,25 155,25 160,25 L160,50 L0,50 Z"
                        fill="url(#heartGradient)"
                      />
                    </svg>
                  </div>
                  
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-3xl font-extrabold text-slate-800 text-display">120</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">BPM</span>
                  </div>
                </AhnaraCard>
              </motion.div>

              {/* Blood Cell Card */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.23 }}
                className="h-full"
              >
                <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Blood Cell</span>
                    <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shadow-[0_2px_8px_rgba(20,184,166,0.1)]">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <circle cx="8" cy="8" r="4" />
                        <circle cx="16" cy="10" r="3" />
                        <circle cx="10" cy="16" r="3" />
                      </svg>
                    </div>
                  </div>

                  {/* Vertical bar chart SVG */}
                  <div className="h-16 w-full flex items-end justify-between px-2 gap-1 mb-2">
                    {[25, 45, 30, 55, 40, 50, 35, 48, 38, 42].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        className="flex-1 bg-[#70A4A2] rounded-full"
                      />
                    ))}
                  </div>

                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-3xl font-extrabold text-slate-800 text-display">9,800</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">uL</span>
                  </div>
                </AhnaraCard>
              </motion.div>

              {/* Water Card */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28 }}
                className="h-full"
              >
                <AhnaraCard variant="flat" padding="none" className="h-full bg-white p-5 border border-slate-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Water</span>
                    <div className="w-9 h-9 rounded-full bg-[#F5F8EB] flex items-center justify-center text-[#9CC031] shadow-[0_2px_8px_rgba(156,192,49,0.1)]">
                      <Droplets className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Horizontal progress bar */}
                  <div className="h-16 w-full flex flex-col justify-center gap-2 mb-2">
                    <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "89%" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-[#C5EC59] rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between gap-1.5 mt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-800 text-display">89%</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">1.78/2 Litres</span>
                  </div>
                </AhnaraCard>
              </motion.div>

              {/* Add Widget Card */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.33 }}
                className="h-full"
              >
                <AhnaraCard
                  variant="interactive"
                  padding="none"
                  className="h-full bg-slate-50/50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-5 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all duration-300 cursor-pointer min-h-[148px]"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 mb-2">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold tracking-tight">Add Widget</span>
                </AhnaraCard>
              </motion.div>

            </div>

            {/* Bottom Row Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Latest Appointments Card (5 COLS) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="md:col-span-5 flex flex-col"
              >
                <AhnaraCard variant="flat" padding="none" className="w-full h-full bg-[#E8F3CE] border-none p-6 flex flex-col gap-6 relative overflow-hidden shadow-sm">
                  
                  {/* Arrow up-right button absolute */}
                  <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white border border-slate-200/10 flex items-center justify-center text-slate-800 shadow-sm hover:scale-105 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <div className="text-left pr-12">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight text-display">Latest Appointments</h3>
                    <p className="text-slate-500 text-xs font-semibold mt-1">Stay updated on your last healthcare visit.</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {latestAppointments.map((doc, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="bg-white p-3.5 rounded-2xl flex items-center justify-between border border-[#E4EFD7] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-100"
                          />
                          <div className="text-left">
                            <p className="font-bold text-sm text-slate-900 group-hover:text-[#8BB436] transition-colors">{doc.name}</p>
                            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{doc.specialty} • {doc.date}</p>
                          </div>
                        </div>

                        <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-800 group-hover:border-slate-300 transition-all">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AhnaraCard>
              </motion.div>

              {/* Your Vitamin Supplements Card (7 COLS) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="md:col-span-7 flex flex-col"
              >
                <AhnaraCard variant="flat" padding="none" className="w-full h-full bg-white border border-slate-100 p-6 flex flex-col gap-6 relative shadow-sm">
                  
                  {/* Arrow button absolute */}
                  <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#F4F9EC] flex items-center justify-center text-slate-800 hover:scale-105 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <div className="text-left pr-12">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight text-display">Your Vitamin Supplements</h3>
                    <p className="text-slate-500 text-xs font-semibold mt-1">Don't forget to take your daily vitamin supplement today!</p>
                  </div>

                  {/* Supplement Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {supplements.map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -4 }}
                        className="border border-slate-200/40 rounded-2xl flex flex-col items-stretch overflow-hidden text-center cursor-pointer group hover:border-slate-300/80 hover:shadow-sm transition-all duration-300 bg-white"
                      >
                        {/* Top half: Product presentation (solid green matching appointment card) */}
                        <div className="bg-[#E8F3CE] p-4 flex flex-col items-center justify-center relative flex-1 gap-2">
                          <div className="absolute top-3 left-4">
                            <span className="text-xs font-bold text-[#608216]/60 font-mono">{item.id}</span>
                          </div>
                          <div className="pt-2">
                            {item.isDropper ? (
                              <DropperBottle />
                            ) : (
                              <SupplementBottle color={item.color || "#FEF3C7"} labelColor={item.labelColor || "#F59E0B"} />
                            )}
                          </div>
                        </div>

                        {/* Bottom half: Product details (light blue matching page background) */}
                        <div className="bg-[#E8EFF4] border-t border-[#C7DB9C]/40 px-3 py-2.5 flex items-center justify-center group-hover:bg-slate-100/50 transition-colors">
                          <span className="text-[11px] font-bold text-slate-700 tracking-tight block max-w-full truncate">{item.name}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination Dots */}
                  <div className="flex justify-center items-center gap-1.5 mt-2">
                    <span className="w-5 h-1.5 bg-[#8BB436] rounded-full" />
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                  </div>
                </AhnaraCard>
              </motion.div>

            </div>

          </main>

          {/* RIGHT SIDE PANEL: UPCOMING APPOINTMENTS (3 COLS) */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-3"
          >
            {/* Spacer to align card with filter buttons row on desktop */}
            <div className="hidden lg:block h-[68px]" />

            {/* Upcoming Appointment Card */}
            <div className="bg-[#E8F3CE] border border-[#CDE0A4] rounded-[32px] p-5 flex flex-col gap-5 relative overflow-hidden group">
              
              {/* Header inside the card */}
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#0D090C] text-lg tracking-tight text-display">Upcoming Appointment</span>
                <button className="w-8 h-8 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-800 shadow-sm hover:scale-105 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Doctor details and chat button */}
              <div className="flex justify-between items-start pt-2 border-t border-[#C7DB9C]">
                <div className="text-left">
                  <div className="inline-block bg-[#E3F4BE] text-[#608216] text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-lg border border-[#D3EAA2] mb-1">
                    Dentist
                  </div>
                  <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight text-display leading-tight">Dr. Priscilla</h4>
                </div>
                
                {/* Chat button */}
                <button className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-white hover:scale-105 transition-all shadow-md">
                  <MessageSquare className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Centered Circle Doctor Portrait */}
              <div className="w-40 h-40 rounded-full bg-[#E5F2C9] border-4 border-white overflow-hidden flex items-end justify-center mx-auto relative shadow-sm my-1">
                {/* Subtle overlay inside circle */}
                <div className="absolute inset-0 rounded-full border border-white/20 z-20 pointer-events-none" />
                <img
                  src="/character2.jpg"
                  alt="Dr. Priscilla"
                  className="w-full h-full object-cover scale-110 relative z-10 transition-transform duration-500 group-hover:scale-115"
                />
              </div>

              {/* About Doctor */}
              <div className="text-left">
                <p className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-1.5">About Doctor Priscilla</p>
                <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                  Dr. Priscilla is a skilled dentist dedicated to providing top-quality dental care with a focus on patient comfort and satisfaction.{" "}
                  <span className="text-[#8BB436] font-bold hover:underline cursor-pointer">See more</span>
                </p>
              </div>

              {/* Appointment stats */}
              <div className="border-t border-[#C7DB9C] pt-4 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Calendar className="w-4 h-4 text-[#8BB436]" />
                  <span>23 Nov, 12:30 PM</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Clock className="w-4 h-4 text-[#8BB436]" />
                  <span>30 Minutes</span>
                </div>
              </div>

              {/* Check appointment CTA button */}
              <AhnaraButton className="w-full bg-[#1E293B] text-white hover:bg-slate-800 transition-all font-bold rounded-2xl h-12 shadow-md">
                Check Appointments
              </AhnaraButton>

            </div>
          </motion.aside>

        </div>
    </div>
  );
}
