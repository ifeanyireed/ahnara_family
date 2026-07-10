"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconShieldExclamation, 
  IconCheck, 
  IconAlertTriangle, 
  IconChevronRight, 
  IconBell, 
  IconLock,
  IconSearch,
  IconExclamationCircle
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function SeniorsScamShield() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: "SMS Message", sender: "+234 809 122 4012", content: "CRITICAL: Your pension account has been suspended. Please click link to confirm identity: http://pension-verification.com", risk: "high", date: "Today, 11:32 AM", blocked: true },
    { id: 2, type: "Email", sender: "support@legitbank-update.net", content: "Security Alert: Suspicious transaction detected. Reply with your card pin to freeze your account.", risk: "high", date: "Yesterday, 04:15 PM", blocked: true },
    { id: 3, type: "Voice Call", sender: "Unknown (+44 20 7946 0958)", content: "Voice signature mismatch flagged during suspicious bank query.", risk: "medium", date: "Jul 05, 2026", blocked: false }
  ]);

  const [scanText, setScanText] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanText.trim()) return;

    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const containsKeywords = ["bank", "pin", "pension", "lottery", "click", "transfer", "link", "card", "suspended"].some(word => 
        scanText.toLowerCase().includes(word)
      );

      if (containsKeywords) {
        setScanResult({
          risk: "high",
          message: "Scam Detected!",
          details: "This message contains high-risk keywords associated with financial phishing. Caregivers will be alerted if this is received on your device."
        });
      } else {
        setScanResult({
          risk: "low",
          message: "Secure Message",
          details: "NLP analysis indicates this message is likely safe. No immediate fraud patterns detected."
        });
      }
    }, 1200);
  };

  const handleNotifyCaregiver = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, blocked: true } : a));
    alert("Caregiver notified. Emergency circle is auditing this incident.");
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Alerts Feed (8 cols) */}
      <main className="lg:col-span-8 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">fraud prevention</span>
              <h3 className="font-extrabold text-xl text-slate-800 tracking-tight text-display">Scam Shield Log</h3>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5 animate-pulse">
              <IconShieldExclamation className="w-4 h-4" />
              Protection Active
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all ${
                  alert.blocked
                    ? "bg-slate-50/50 border-slate-200 opacity-80"
                    : "bg-rose-50/30 border-rose-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{alert.type}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold">{alert.sender}</span>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    alert.risk === "high" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {alert.risk} risk
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-700 bg-white border border-slate-100 p-3 rounded-xl font-mono">
                  {alert.content}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] font-bold text-slate-400 mt-1">
                  <span>Detected: {alert.date}</span>
                  
                  {alert.blocked ? (
                    <span className="text-emerald-700 font-black flex items-center gap-1">
                      <IconCheck className="w-3.5 h-3.5" />
                      Blocked &amp; Caregiver Alerted
                    </span>
                  ) : (
                    <button
                      onClick={() => handleNotifyCaregiver(alert.id)}
                      className="text-rose-600 hover:text-rose-700 font-black flex items-center gap-1 uppercase tracking-wider"
                    >
                      <IconBell className="w-3.5 h-3.5" />
                      Notify Caregiver
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </AhnaraCard>
      </main>

      {/* NLP Scanner & Emergency Action (4 cols) */}
      <aside className="lg:col-span-4 flex flex-col gap-3">
        
        {/* NLP Scanner Box */}
        <AhnaraCard variant="flat" padding="none" className="bg-white border border-slate-100 p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <div className="flex items-center gap-1.5">
              <IconSearch className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Scam Text Scanner</h4>
            </div>
          </div>

          <form onSubmit={handleScanTextSubmit} className="flex flex-col gap-3 text-left">
            <p className="text-[10px] text-slate-400 font-bold leading-normal">
              Copy and paste any suspicious email, text message, or link below to scan it with Scam Shield NLP:
            </p>
            
            <textarea
              rows={3}
              required
              value={scanText}
              onChange={(e) => setScanText(e.target.value)}
              placeholder="Paste message content here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs outline-none focus:bg-white focus:border-indigo-300 font-semibold text-slate-800 resize-none"
            />

            <AhnaraButton
              type="submit"
              variant="outline"
              disabled={isScanning}
              className="w-full !rounded-xl text-indigo-600 border-indigo-200 hover:bg-indigo-50 font-bold"
            >
              {isScanning ? "Analyzing Text..." : "Scan Message"}
            </AhnaraButton>

            <AnimatePresence>
              {scanResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-3 rounded-xl border text-[10px] leading-normal flex items-start gap-2.5 ${
                    scanResult.risk === "high" 
                      ? "bg-rose-50 border-rose-200 text-rose-800" 
                      : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  }`}
                >
                  <IconExclamationCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase block">{scanResult.message}</span>
                    <p className="font-semibold text-slate-500 mt-0.5">{scanResult.details}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </AhnaraCard>

        {/* Emergency Freeze */}
        <AhnaraCard variant="flat" padding="none" className="bg-[#E9F2F5] border border-slate-200/50 p-5 flex flex-col gap-3 text-slate-800 shadow-xs text-left">
          <span className="text-[9px] text-indigo-600 font-black uppercase tracking-wider block">Financial Guard</span>
          <h4 className="text-sm font-black text-slate-800">Emergency Protection</h4>
          <p className="text-[10px] text-slate-500 font-semibold leading-normal">
            If you suspect you have shared sensitive financial passcodes or details, click below to lock linked payment cards.
          </p>
          <AhnaraButton
            variant="outline"
            className="w-full mt-1.5 bg-white text-rose-600 border-rose-200 hover:bg-rose-50/50 !rounded-xl font-bold flex items-center justify-center gap-1.5"
          >
            <IconLock className="w-4 h-4" />
            Freeze Linked Accounts
          </AhnaraButton>
        </AhnaraCard>

      </aside>

    </div>
  );
}
