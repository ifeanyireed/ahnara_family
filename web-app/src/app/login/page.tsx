"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/ahnara/AuthContext";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraInput } from "@/components/ahnara/AhnaraInput";
import { IconLock, IconMail, IconArrowRight } from "@tabler/icons-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { api } = await import("@/lib/api");
      const response = await api.post("/auth/login", { email, password });
      
      let mappedRole = "MAMA";
      if (response.user.email.toLowerCase().includes("kids") || response.user.email.toLowerCase().includes("pediatric") || response.user.id === "usr-child-001") {
        mappedRole = "KIDS";
      } else if (response.user.email.toLowerCase().includes("senior") || response.user.email.toLowerCase().includes("elder") || response.user.id === "usr-elder-001") {
        mappedRole = "SENIORS";
      } else if (response.user.email.toLowerCase().includes("lady") || response.user.email.toLowerCase().includes("clara") || response.user.id === "usr-lady-001") {
        mappedRole = "LADY";
      } else if (response.user.email.toLowerCase().includes("girlie") || response.user.email.toLowerCase().includes("teen") || response.user.id === "usr-girlie-001") {
        mappedRole = "GIRLIE";
      }

      login(response.token, {
        id: response.user.id,
        email: response.user.email,
        name: response.user.email.split("@")[0].replace(".", " "),
        role: mappedRole,
      });

      setIsLoading(false);
      router.push(
        mappedRole === "KIDS" 
          ? "/kids" 
          : mappedRole === "SENIORS" 
          ? "/seniors" 
          : mappedRole === "LADY" 
          ? "/lady" 
          : mappedRole === "GIRLIE" 
          ? "/girlie" 
          : "/mama/dashboard"
      );
    } catch (err: any) {
      console.warn("API login failed, falling back to mock login simulation:", err);
      // Mock login simulation fallback
      setTimeout(() => {
        setIsLoading(false);
        let role = "MAMA";
        if (email.toLowerCase().includes("kids") || email.toLowerCase().includes("pediatric")) {
          role = "KIDS";
        } else if (email.toLowerCase().includes("senior") || email.toLowerCase().includes("elder")) {
          role = "SENIORS";
        } else if (email.toLowerCase().includes("lady") || email.toLowerCase().includes("clara")) {
          role = "LADY";
        } else if (email.toLowerCase().includes("girlie") || email.toLowerCase().includes("teen")) {
          role = "GIRLIE";
        }
        login(
          role === "KIDS" 
            ? "mock-token-kids" 
            : role === "SENIORS" 
            ? "mock-token-seniors" 
            : role === "LADY" 
            ? "mock-token-lady" 
            : role === "GIRLIE" 
            ? "mock-token-girlie" 
            : "mock-token-mama", 
          {
            id: 
              role === "KIDS" 
                ? "mock-kids-id" 
                : role === "SENIORS" 
                ? "mock-seniors-id" 
                : role === "LADY" 
                ? "mock-lady-id" 
                : role === "GIRLIE" 
                ? "mock-girlie-id" 
                : "mock-mama-id",
            email: email,
            name: 
              role === "KIDS" 
                ? "Aria's Parent" 
                : role === "SENIORS" 
                ? "Grandma Margaret" 
                : role === "LADY" 
                ? "Clara Reed" 
                : role === "GIRLIE" 
                ? "Jane Doe (Girlie)" 
                : "Jane Doe",
            role: role,
          }
        );
        router.push(
          role === "KIDS" 
            ? "/kids" 
            : role === "SENIORS" 
            ? "/seniors" 
            : role === "LADY" 
            ? "/lady" 
            : role === "GIRLIE" 
            ? "/girlie" 
            : "/mama/dashboard"
        );
      }, 600);
    }
  };

  const handleQuickLogin = async (role: "MAMA" | "KIDS" | "SENIORS" | "LADY" | "GIRLIE") => {
    setIsLoading(true);
    setError(null);
    
    let targetEmail = "mama@ahnara.com";
    let password = "password";
    
    if (role === "MAMA") {
      targetEmail = "mother@ahnara.com";
    } else if (role === "KIDS") {
      targetEmail = "child@ahnara.com";
    } else if (role === "SENIORS") {
      targetEmail = "elder@ahnara.com";
    } else if (role === "LADY") {
      targetEmail = "clara@ahnara.com";
    } else if (role === "GIRLIE") {
      targetEmail = "girlie@ahnara.com";
    }

    try {
      const { api } = await import("@/lib/api");
      const response = await api.post("/auth/login", { email: targetEmail, password });
      
      login(response.token, {
        id: response.user.id,
        email: response.user.email,
        name: role === "MAMA" ? "Jane Doe (Mama)" : role === "KIDS" ? "Jane Doe (Kids)" : role === "SENIORS" ? "Grandma Margaret" : role === "LADY" ? "Clara Reed" : "Jane Doe (Girlie)",
        role: role,
      });
      setIsLoading(false);
      router.push(
        role === "KIDS" 
          ? "/kids" 
          : role === "SENIORS" 
          ? "/seniors" 
          : role === "LADY" 
          ? "/lady" 
          : role === "GIRLIE" 
          ? "/girlie" 
          : "/mama/dashboard"
      );
    } catch (err: any) {
      console.warn("API quick login failed, falling back to mock login:", err);
      setTimeout(() => {
        setIsLoading(false);
        login(
          role === "KIDS" 
            ? "mock-token-kids" 
            : role === "SENIORS" 
            ? "mock-token-seniors" 
            : role === "LADY" 
            ? "mock-token-lady" 
            : role === "GIRLIE" 
            ? "mock-token-girlie" 
            : "mock-token-mama",
          {
            id: 
              role === "KIDS" 
                ? "mock-kids-id" 
                : role === "SENIORS" 
                ? "mock-seniors-id" 
                : role === "LADY" 
                ? "mock-lady-id" 
                : role === "GIRLIE" 
                ? "mock-girlie-id" 
                : "mock-mama-id",
            email: 
              role === "KIDS" 
                ? "kids@ahnara.com" 
                : role === "SENIORS" 
                ? "seniors@ahnara.com" 
                : role === "LADY" 
                ? "clara@ahnara.com" 
                : role === "GIRLIE" 
                ? "girlie@ahnara.com" 
                : "mama@ahnara.com",
            name: 
              role === "KIDS" 
                ? "Jane Doe (Kids)" 
                : role === "SENIORS" 
                ? "Grandma Margaret" 
                : role === "LADY" 
                ? "Clara Reed" 
                : role === "GIRLIE" 
                ? "Jane Doe (Girlie)" 
                : "Jane Doe (Mama)",
            role: role,
          }
        );
        router.push(
          role === "KIDS" 
            ? "/kids" 
            : role === "SENIORS" 
            ? "/seniors" 
            : role === "LADY" 
            ? "/lady" 
            : role === "GIRLIE" 
            ? "/girlie" 
            : "/mama/dashboard"
        );
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8EFF4] text-[#0D090C] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4F475]/30 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#0089C1]/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md z-10"
      >
        <AhnaraCard variant="flat" className="bg-white/80 backdrop-blur-md border border-slate-200/80 p-8 shadow-2xl rounded-3xl flex flex-col gap-6">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <Link href="/" className="flex items-center justify-center w-12 h-12 rounded-full bg-[#D4F475] shadow-sm mb-2 hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Ahnara Logo" className="w-8 h-8 object-contain" />
            </Link>
            <h2 className="text-2xl font-black tracking-tight text-slate-800 text-display">Welcome Back</h2>
            <p className="text-xs text-slate-400 font-semibold">Access your maternal care companion portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            <AhnaraInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<IconMail className="w-5 h-5 text-slate-400" />}
            />

            <AhnaraInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<IconLock className="w-5 h-5 text-slate-400" />}
            />

            <AhnaraButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-[#1E293B] text-white hover:bg-slate-800 rounded-xl mt-2"
              isLoading={isLoading}
              rightIcon={<IconArrowRight className="w-4 h-4" />}
            >
              Sign In
            </AhnaraButton>
          </form>

          {/* Quick Login Shortcuts */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center">Demo Quick Login</span>
            <div className="grid grid-cols-5 gap-1">
              <button
                type="button"
                onClick={() => handleQuickLogin("MAMA")}
                className="py-3 px-0.5 bg-[#E8F3CE]/60 hover:bg-[#E8F3CE]/85 border border-[#CDE0A4]/45 rounded-xl text-[8px] font-black uppercase tracking-wider text-[#608216] transition-colors text-center"
              >
                Maternal
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("KIDS")}
                className="py-3 px-0.5 bg-[#DDEEF3]/60 hover:bg-[#DDEEF3]/85 border border-sky-200/50 rounded-xl text-[8px] font-black uppercase tracking-wider text-[#0089C1] transition-colors text-center"
              >
                Pediatric
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("SENIORS")}
                className="py-3 px-0.5 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/50 rounded-xl text-[8px] font-black uppercase tracking-wider text-indigo-700 transition-colors text-center"
              >
                Seniors
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("LADY")}
                className="py-3 px-0.5 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/50 rounded-xl text-[8px] font-black uppercase tracking-wider text-rose-700 transition-colors text-center"
              >
                Lady
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("GIRLIE")}
                className="py-3 px-0.5 bg-pink-50 hover:bg-pink-100/80 border border-pink-200/50 rounded-xl text-[8px] font-black uppercase tracking-wider text-pink-700 transition-colors text-center"
              >
                Girlie
              </button>
            </div>
          </div>

          {/* Footnotes */}
          <div className="text-center mt-2">
            <span className="text-xs text-slate-400 font-semibold">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#0089C1] hover:underline font-bold">
                Register here
              </Link>
            </span>
          </div>

        </AhnaraCard>
      </motion.div>

    </div>
  );
}
