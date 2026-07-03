"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Bell,
  MessageSquare,
  ArrowUpRight,
  Heart,
  Calendar,
  Clock,
  Plus,
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  SlidersHorizontal,
  ArrowUpDown
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#E8EFF4] text-slate-800 font-sans flex flex-col overflow-x-hidden">
      
      {/* NAVBAR */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-50">
        {/* Logo and Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4F475] flex items-center justify-center">
            <img src="/logo.png" alt="Ahnara Logo" className="w-7 h-7 object-contain" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 text-display">Ahnara Mama</span>
        </div>

        {/* Mid Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#" className="hover:text-slate-950 transition-colors">Features</a>
          <a href="#" className="hover:text-slate-950 transition-colors">About</a>
          <a href="#" className="hover:text-slate-950 transition-colors">Members</a>
          <a href="#" className="hover:text-slate-950 transition-colors">Pricing</a>
          <a href="#" className="hover:text-slate-950 transition-colors">Blog</a>
          <a href="#" className="hover:text-slate-950 transition-colors">Pages</a>
        </nav>

        {/* Action Button */}
        <div>
          <button className="bg-white border border-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-slate-50 transition-all shadow-sm">
            Sign Up
          </button>
        </div>
      </header>

      {/* HERO CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 mb-6">
        
        {/* Large Rounded Hero Card */}
        <div className="w-full bg-[#E9F2F5] rounded-[48px] pt-10 px-6 md:px-12 flex flex-col items-center text-center relative overflow-hidden border border-slate-200/20">
          
          {/* Floating 3D Shapes */}
          {/* Left Shape (Lime Green Cylinder) */}
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[-4%] top-[25%] w-64 h-64 hidden xl:block pointer-events-none z-10"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
              <path d="M 40,80 L 40,110 A 60,30 0 0,0 160,110 L 160,80 Z" fill="#B5D95C" />
              <ellipse cx="100" cy="80" rx="60" ry="30" fill="#D4F475" />
            </svg>
          </motion.div>

          {/* Right Shape (Teal Cylinder) */}
          <motion.div
            animate={{ y: [0, 12, 0], rotate: [0, -4, 0] }}
            transition={{ duration: 6, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[-4%] top-[22%] w-64 h-64 hidden xl:block pointer-events-none z-10"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
              <path d="M 40,90 L 40,120 A 60,30 0 0,0 160,120 L 160,90 Z" fill="#3D5C5B" />
              <ellipse cx="100" cy="90" rx="60" ry="30" fill="#5F8D8C" />
            </svg>
          </motion.div>

          {/* Version Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-[10px] font-bold text-slate-500 shadow-sm border border-slate-100 uppercase tracking-wider mb-4 relative z-20">
            New Version 2.0
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-normal text-slate-900 tracking-tight text-display mb-4 leading-[1.1] max-w-4xl text-center relative z-20">
            Healthcare, Simplified <br />
            You Can Focus on Living.
          </h1>

          {/* Description */}
          <p className="text-slate-600 font-semibold text-base md:text-lg mb-6 max-w-2xl text-center leading-relaxed relative z-20">
            We remove the stress and guesswork from healthcare, so you always feel informed, supported, and in control.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 mb-5 relative z-20">
            <Link href="/provider/dashboard">
              <button className="bg-[#1E293B] text-white hover:bg-slate-800 transition-all font-bold px-8 py-3.5 rounded-full shadow-lg">
                Get Started
              </button>
            </Link>
            <button className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 transition-all font-bold px-8 py-3.5 rounded-full shadow-sm">
              See Features
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col items-center gap-2 mb-8 relative z-20">
            <div className="flex items-center gap-1">
              {/* Avatar stack */}
              <div className="flex -space-x-2">
                <img src="/character1.jpg" className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                <img src="/character2.jpg" className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                <img src="/character3.jpg" className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                <img src="/character4.jpg" className="w-8 h-8 rounded-full object-cover border-2 border-white" />
              </div>
              {/* Stars */}
              <div className="flex items-center gap-0.5 ml-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500">Trusted by 1 Million user</span>
          </div>

          {/* Browser Window Preview Frame */}
          <div className="w-full max-w-5xl bg-[#E8EFF4] rounded-t-3xl shadow-2xl border-t border-x border-slate-200/80 overflow-hidden relative z-20 flex flex-col">
            
            {/* Window chrome header */}
            <div className="h-10 bg-slate-100/80 border-b border-slate-200/60 flex items-center px-4 gap-2 flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>

            {/* Dashboard Content Mockup */}
            <div className="w-full bg-[#E8EFF4] p-4 flex flex-col gap-4 text-left pointer-events-none select-none">
              
              {/* Dashboard Nav Bar */}
              <div className="bg-white px-5 py-4 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4F475] flex items-center justify-center">
                    <img src="/logo.png" alt="Logo" className="w-5.5 h-5.5 object-contain" />
                  </div>
                  <nav className="flex items-center gap-2">
                    <span className="bg-[#1E293B] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <LayoutDashboard className="w-3.5 h-3.5" fill="currentColor" />
                      Dashboard
                    </span>
                    <span className="bg-[#F1F5F9]/70 border border-slate-200/40 text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5" />
                      Statistics
                    </span>
                    <span className="bg-[#F1F5F9]/70 border border-slate-200/40 text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Schedule
                    </span>
                    <span className="bg-[#F1F5F9]/70 border border-slate-200/40 text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Doctors
                    </span>
                    <span className="bg-[#F1F5F9]/70 border border-slate-200/40 text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5" />
                      Settings
                    </span>
                  </nav>
                </div>
                
                {/* Profile and icons */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <img src="/character3.jpg" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                    <div className="hidden sm:block text-left">
                      <p className="font-bold text-xs text-slate-900 leading-none">Tyra Dhillon</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Doctor</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                
                {/* Left columns */}
                <div className="lg:col-span-9 flex flex-col gap-3">
                  
                  {/* Title Row */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Hello, Tyra</h2>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">You have 1 appointment today</p>
                    </div>
                    {/* Search and Filters */}
                    <div className="flex items-center gap-1.5">
                      <div className="bg-[#F1F5F9]/50 border border-slate-200/80 rounded-xl py-1.5 px-3 flex items-center gap-2 text-xs">
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-400">Search</span>
                      </div>
                      <div className="bg-[#F1F5F9]/50 border border-slate-200/80 rounded-xl py-1.5 px-3 flex items-center gap-1.5 text-xs text-slate-600">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Filter
                      </div>
                      <div className="bg-[#F1F5F9]/50 border border-slate-200/80 rounded-xl py-1.5 px-3 flex items-center gap-1.5 text-xs text-slate-600">
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        Sort By
                      </div>
                    </div>
                  </div>

                  {/* Widget row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    
                    {/* Heart Rate */}
                    <div className="bg-white p-4 border border-slate-100 rounded-2xl flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Heart Rate</span>
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </div>
                      <div className="text-xl font-extrabold text-slate-900">120 <span className="text-xs font-semibold text-slate-400">BPM</span></div>
                      {/* Mini wave graph */}
                      <svg className="w-full h-8 text-blue-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M0 15 Q 15 5, 30 18 T 60 12 T 90 20 T 100 15" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Blood Cell */}
                    <div className="bg-white p-4 border border-slate-100 rounded-2xl flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Blood Cell</span>
                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="text-xl font-extrabold text-slate-900">9,800 <span className="text-xs font-semibold text-slate-400">uL</span></div>
                      {/* Mini bar graph */}
                      <div className="flex items-end gap-1 h-8 pt-2">
                        <div className="bg-emerald-400 w-full h-1/2 rounded-sm" />
                        <div className="bg-emerald-500 w-full h-3/4 rounded-sm" />
                        <div className="bg-emerald-300 w-full h-2/5 rounded-sm" />
                        <div className="bg-emerald-500 w-full h-full rounded-sm" />
                        <div className="bg-emerald-400 w-full h-2/3 rounded-sm" />
                      </div>
                    </div>

                    {/* Water */}
                    <div className="bg-white p-4 border border-slate-100 rounded-2xl flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Water</span>
                        <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="text-xl font-extrabold text-slate-900">89% <span className="text-xs font-semibold text-slate-400">1.70/2 Litres</span></div>
                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-2">
                        <div className="bg-amber-400 h-full w-[89%]" />
                      </div>
                    </div>

                    {/* Add Widget */}
                    <div className="border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all rounded-2xl flex flex-col items-center justify-center p-4 gap-1.5 text-slate-400">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold">Add Widget</span>
                    </div>

                  </div>
                </div>

                {/* Right columns */}
                <div className="lg:col-span-3">
                  {/* Upcoming Appointment */}
                  <div className="bg-[#E8F3CE] border border-[#CDE0A4] rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#0D090C] text-xs">Upcoming Appointment</span>
                      <div className="w-6 h-6 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-800">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start border-t border-[#C7DB9C] pt-2">
                      <div>
                        <div className="bg-[#E3F4BE] text-[#608216] text-[8px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded border border-[#D3EAA2] inline-block mb-0.5">
                          Dentist
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Dr. Priscilla</h4>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#1E293B] flex items-center justify-center text-white">
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </div>

                    <div className="w-24 h-24 rounded-full bg-[#E5F2C9] border-2 border-white overflow-hidden flex items-end justify-center mx-auto">
                      <img src="/character2.jpg" alt="Doctor" className="w-full h-full object-cover scale-110" />
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
