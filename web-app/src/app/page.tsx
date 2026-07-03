"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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
          <a href="#features" className="hover:text-slate-950 transition-colors">Features</a>
          <a href="#" className="hover:text-slate-950 transition-colors">About</a>
          <a href="#" className="hover:text-slate-950 transition-colors">Clinics</a>
          <a href="#" className="hover:text-slate-950 transition-colors">Education</a>
          <a href="#" className="hover:text-slate-950 transition-colors">Support</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link href="/login">
            <button className="bg-white border border-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-slate-50 transition-all shadow-sm">
              Sign In
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-[#1E293B] text-white hover:bg-slate-800 transition-all font-bold px-5 py-2.5 rounded-full text-sm shadow-sm">
              Register
            </button>
          </Link>
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
            Ahnara Mama Portal
          </div>

          {/* Headline - Aligned to Ahnara Mama */}
          <h1 className="text-4xl md:text-6xl font-normal text-slate-900 tracking-tight text-display mb-4 leading-[1.1] max-w-4xl text-center relative z-20">
            Maternal Care, Reimagined. <br />
            Every Checkpoint, Guided.
          </h1>

          {/* Description - Aligned to Ahnara Mama */}
          <p className="text-slate-600 font-semibold text-base md:text-lg mb-6 max-w-2xl text-center leading-relaxed relative z-20">
            Ahnara Mama empowers mothers with dynamic 40-week gestation timelines, WHO-approved ANC tracking, digital birth planning, and immediate AI midwife support.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-5 relative z-20">
            <Link href="/onboarding">
              <button className="bg-[#1E293B] text-white hover:bg-slate-800 transition-all font-bold px-8 py-3.5 rounded-full shadow-lg whitespace-nowrap">
                Get Started
              </button>
            </Link>
            <Link href="#features">
              <button className="bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 transition-all font-bold px-8 py-3.5 rounded-full shadow-sm whitespace-nowrap">
                See Features
              </button>
            </Link>
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
            <span className="text-xs font-semibold text-slate-500">Trusted by thousands of mothers</span>
          </div>

          {/* Browser Window Preview Frame */}
          <div id="features" className="w-full max-w-5xl bg-[#E8EFF4] rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden relative z-20 flex flex-col scroll-mt-6">
            
            {/* Dashboard Content Screenshot (Matches requested UI-screenshot.png) */}
            <div className="w-full relative bg-[#E8EFF4]">
              <img 
                src="/UI-screenshot.png" 
                alt="Ahnara Mama Dashboard Screenshot" 
                className="w-full object-cover select-none pointer-events-none"
              />
            </div>

          </div>

          {/* Partner & Clinical Network Banner */}
          <div className="w-full max-w-5xl py-8 px-6 bg-[#E8EFF4]/40 rounded-3xl border border-slate-200/80 flex flex-col items-center gap-6 relative z-20 mt-10 mb-20 shadow-xs">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">clinical standards &amp; networks</span>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-85">
              
              {/* Medtronic */}
              <div className="flex items-center gap-1.5 text-[#002855] select-none pointer-events-none">
                <svg className="w-5 h-5 text-[#002855]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 22h4l6-12 6 12h4L12 2zm0 6l-3.5 7h7L12 8z" />
                </svg>
                <span className="font-sans font-black text-sm tracking-tight text-slate-800">Medtronic</span>
              </div>
              
              {/* Zebra */}
              <div className="flex items-center gap-1.5 text-black select-none pointer-events-none">
                <svg className="w-5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="3" y1="4" x2="3" y2="20" />
                  <line x1="7" y1="4" x2="7" y2="20" />
                  <line x1="11" y1="4" x2="11" y2="20" />
                  <line x1="15" y1="4" x2="15" y2="20" />
                  <line x1="17" y1="4" x2="17" y2="20" />
                  <line x1="21" y1="4" x2="21" y2="20" />
                </svg>
                <span className="font-sans font-black text-sm tracking-widest text-slate-900">ZEBRA</span>
              </div>

              {/* Principal */}
              <div className="flex items-center gap-1 text-[#007da5] select-none pointer-events-none">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14h-2V8h2c1.7 0 3 1.3 3 3s-1.3 3-3 3z" />
                </svg>
                <span className="font-sans font-extrabold text-sm tracking-tight text-slate-800">Principal</span>
              </div>

              {/* Darden */}
              <div className="flex items-center gap-1 text-slate-700 select-none pointer-events-none">
                <svg className="w-4.5 h-4.5 text-emerald-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="font-serif font-bold text-sm tracking-wider text-slate-800">DARDEN</span>
              </div>

              {/* Broadridge */}
              <div className="flex items-center gap-1.5 text-slate-800 select-none pointer-events-none">
                <svg className="w-5 h-5 text-teal-600" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
                <span className="font-sans font-bold text-sm tracking-tight text-slate-800">Broadridge</span>
              </div>

              {/* Celanese */}
              <div className="flex items-center gap-1.5 text-slate-800 select-none pointer-events-none">
                <div className="w-3.5 h-3.5 rounded-full bg-orange-500" />
                <span className="font-sans font-extrabold text-sm tracking-tight text-slate-800">Celanese</span>
              </div>

              {/* Palo Alto */}
              <div className="flex items-center gap-0.5 text-[#005a9c] select-none pointer-events-none">
                <span className="font-mono font-bold text-sm text-[#005a9c]">//</span>
                <span className="font-sans font-black text-sm tracking-tighter text-slate-900">paloalto</span>
              </div>

            </div>
          </div>

          {/* Features Intro Header */}
          <div className="flex flex-col items-center text-center max-w-3xl mb-12 relative z-20 mt-10">
            <span className="bg-[#E8F3CE] border border-[#CDE0A4] text-[#608216] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-5xl font-normal text-slate-900 tracking-tight text-display mb-4 leading-tight">
              Care Made Clear, Personal, and Easy
            </h2>
            <p className="text-slate-500 font-semibold text-base max-w-xl leading-relaxed">
              Explore Ahnara Mama's smart, human-centered features — designed to bring clarity, comfort, and confidence to your everyday health journey.
            </p>
          </div>

          {/* Alternating Feature Cards Grid */}
          <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-24 relative z-20">
            
            {/* Card 1: Photo (Resting pregnant mother) */}
            <div className="aspect-square rounded-3xl overflow-hidden shadow-md group relative">
              <img src="/maternal-rest.jpg" alt="Maternal Rest" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-slate-950/10" />
            </div>

            {/* Card 2: Text Card (Smart Health Tracking) */}
            <div className="aspect-square rounded-3xl bg-[#E8F6FA] border border-sky-200/30 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-3">
                  Smart Health <br />Tracking
                </h3>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  Stay on top of your vitals, medications, and progress all from one secure, easy to use dashboard.
                </p>
              </div>
              <a href="/onboarding" className="text-xs font-black text-[#0089C1] hover:underline flex items-center gap-1">
                More Information &rarr;
              </a>
            </div>

            {/* Card 3: Photo (Maternal exercise) */}
            <div className="aspect-square rounded-3xl overflow-hidden shadow-md group relative">
              <img src="/maternal-exercise.jpg" alt="Maternal Exercise" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-slate-950/10" />
            </div>

            {/* Card 4: Text Card (Personalized Care Plans) */}
            <div className="aspect-square rounded-3xl bg-slate-800 border border-slate-700 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight leading-tight mb-3">
                  Personalized <br />Care Plans
                </h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  Receive clear, actionable steps tailored to your health goals. No guesswork. Just guidance you can trust.
                </p>
              </div>
              <a href="/onboarding" className="text-xs font-black text-[#8BB436] hover:underline flex items-center gap-1">
                More Information &rarr;
              </a>
            </div>

            {/* Card 5: Text Card (Wellness & Lifestyle) */}
            <div className="aspect-square rounded-3xl bg-slate-100 border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-3">
                  Wellness &amp; <br />Lifestyle Support
                </h3>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  From mindfulness tools to nutrition insights, Ahnara supports the full picture of your health — body and mind.
                </p>
              </div>
              <a href="/onboarding" className="text-xs font-black text-slate-700 hover:underline flex items-center gap-1">
                More Information &rarr;
              </a>
            </div>

            {/* Card 6: Photo (Maternal meditation) */}
            <div className="aspect-square rounded-3xl overflow-hidden shadow-md group relative">
              <img src="/maternal-meditation.jpg" alt="Maternal Meditation" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-slate-950/10" />
            </div>

            {/* Card 7: Text Card (Seamless Scheduling) */}
            <div className="aspect-square rounded-3xl bg-[#E8F3CE]/45 border border-[#CDE0A4] p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-3">
                  Seamless <br />Scheduling
                </h3>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  Book, reschedule, or manage your appointments in seconds. Your time matters — and we respect that.
                </p>
              </div>
              <a href="/onboarding" className="text-xs font-black text-[#608216] hover:underline flex items-center gap-1">
                More Information &rarr;
              </a>
            </div>

            {/* Card 8: Photo (Maternal yoga outdoors) */}
            <div className="aspect-square rounded-3xl overflow-hidden shadow-md group relative">
              <img src="/maternal-yoga.jpg" alt="Prenatal Yoga" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-slate-950/10" />
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#E8EFF4] text-[#0D090C]/60 py-16 border-t border-slate-300/40 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Logo & Slogan Column */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#D4F475] flex items-center justify-center border border-[#CDE0A4]">
                <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Ahnara Mama</span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm font-semibold">
              Empowering maternal health journeys with WHO clinical insights, personalized timelines, digital birth planning, and direct midwifery coordination.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Product</h4>
            <a href="#" className="text-xs font-semibold hover:text-[#0089C1] transition-colors">Features</a>
            <a href="#" className="text-xs font-semibold hover:text-[#0089C1] transition-colors">Gestation Tracker</a>
            <a href="#" className="text-xs font-semibold hover:text-[#0089C1] transition-colors">AI Midwife Support</a>
            <a href="#" className="text-xs font-semibold hover:text-[#0089C1] transition-colors">Clinic Integrations</a>
          </div>

          {/* Clinical Standards Column */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Clinical Standards</h4>
            <a href="#" className="text-xs font-semibold hover:text-[#0089C1] transition-colors">WHO 8-Contact ANC Model</a>
            <a href="#" className="text-xs font-semibold hover:text-[#0089C1] transition-colors">Postpartum Recovery Guidelines</a>
            <a href="#" className="text-xs font-semibold hover:text-[#0089C1] transition-colors">Emergency Protocol Alignment</a>
            <a href="#" className="text-xs font-semibold hover:text-[#0089C1] transition-colors">Midwifery Certification Standards</a>
          </div>

          {/* Legal / Contact Column */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Connect &amp; Support</h4>
            <a href="#" className="text-xs font-semibold hover:text-[#0089C1] transition-colors">Support Center</a>
            <a href="#" className="text-xs font-semibold hover:text-[#0089C1] transition-colors">Clinical Advisory Panel</a>
            <a href="#" className="text-xs font-semibold hover:text-[#0089C1] transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs font-semibold hover:text-[#0089C1] transition-colors">Contact Clinical Support</a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-300/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>&copy; {new Date().getFullYear()} Ahnara Health, Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Practices</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Clinical Notice</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
