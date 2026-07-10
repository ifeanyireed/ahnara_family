"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  IconMoodSmile, 
  IconCalendar, 
  IconActivity, 
  IconSparkles, 
  IconUser,
  IconShieldCheck,
  IconClock,
  IconLogout,
  IconSchool
} from "@tabler/icons-react";
import { useAuth } from "@/components/ahnara/AuthContext";
import { AhnaraLoader } from "@/components/ahnara/AhnaraLoader";

export default function GirlieLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return <AhnaraLoader />;
  }

  const menuItems = [
    { href: "/girlie", label: "Guide & Cycle", icon: IconCalendar },
    { href: "/girlie/cramp-log", label: "Cramp Log", icon: IconActivity },
    { href: "/girlie/ai-coach", label: "AI Coach", icon: IconSparkles },
    { href: "/girlie/body-image", label: "Body Image", icon: IconMoodSmile },
    { href: "/girlie/skin-hygiene", label: "Skin & Hygiene", icon: IconUser },
    { href: "/girlie/media-literacy", label: "Media Literacy", icon: IconShieldCheck },
    { href: "/girlie/parent-link", label: "Parent Link", icon: IconClock },
    { href: "/girlie/academy", label: "Academy", icon: IconSchool }
  ];

  return (
    <div className="min-h-screen bg-[#FDF8FA] text-slate-800 font-sans flex flex-col">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100/50 px-6 py-4 flex items-center justify-between shadow-xs">
        
        {/* Brand logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-200">
            <IconMoodSmile className="w-6 h-6 text-pink-500" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">Ahnara Girlie</h1>
            <span className="text-[10px] text-pink-500 font-bold uppercase tracking-wider block mt-0.5">Adolescent Care Workspace</span>
          </div>
        </div>

        {/* Desktop Navbar Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[#F9EFF3] p-1 rounded-2xl border border-pink-200/20">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                  isActive 
                    ? "bg-pink-500 text-white shadow-sm" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile & actions */}
        <div className="flex items-center gap-3.5">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-black text-slate-800 block">Jane Doe (Girlie)</span>
            <span className="text-[10px] text-slate-400 font-bold block">Age: 14</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl transition-all"
            title="Log Out"
          >
            <IconLogout className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile navigation tab scroll bar */}
      <div className="lg:hidden bg-white border-b border-pink-100/50 p-2 overflow-x-auto flex gap-1.5 scrollbar-none sticky top-18 z-30">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-black uppercase whitespace-nowrap transition-colors ${
                isActive 
                  ? "bg-pink-500 text-white" 
                  : "bg-slate-50 border border-slate-200 text-slate-600"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Main workspace frame container */}
      <div className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col">
        {children}
      </div>

    </div>
  );
}
