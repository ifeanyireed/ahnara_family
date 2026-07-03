"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  IconCalendar, 
  IconHeart, 
  IconArrowRight, 
  IconArrowLeft, 
  IconQrcode, 
  IconCheck, 
  IconInfoCircle,
  IconShieldCheck,
  IconAlertTriangle,
  IconSparkles
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraInput } from "@/components/ahnara/AhnaraInput";

// Baby size milestone mapping by gestational week
const getBabySizeInfo = (weeks: number) => {
  if (weeks < 4) return { size: "Poppy Seed", desc: "Your baby is just starting to take shape as an embryo.", icon: "🌱" };
  if (weeks < 7) return { size: "Sweet Pea", desc: "Baby's heart is beating and tiny arm buds are growing.", icon: "🍃" };
  if (weeks < 9) return { size: "Raspberry", desc: "Hands and feet are forming, and little nose/lips are appearing.", icon: "🍒" };
  if (weeks < 13) return { size: "Lime", desc: "Baby's organs are fully formed and muscles are starting to twitch.", icon: "🍋" };
  if (weeks < 17) return { size: "Avocado", desc: "Eyes can move, and your baby is starting to grow fine hair (lanugo).", icon: "🥑" };
  if (weeks < 21) return { size: "Banana", desc: "Your baby can swallow and is very active. Kick counts are near!", icon: "🍌" };
  if (weeks < 25) return { size: "Cantaloupe", desc: "Inner ear is fully developed, and baby can hear your voice and heartbeat.", icon: "🍈" };
  if (weeks < 29) return { size: "Eggplant", desc: "Lungs are developing rapidly, and baby can open and close their eyes.", icon: "🍆" };
  if (weeks < 33) return { size: "Pineapple", desc: "Bones are fully developed, and baby is gaining fat underneath their skin.", icon: "🍍" };
  if (weeks < 37) return { size: "Papaya", desc: "Organs are matured enough to function outside, and baby is dropping lower.", icon: "🥭" };
  return { size: "Watermelon", desc: "Your baby is fully grown and ready to meet you! Happy due date month.", icon: "🍉" };
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: LMP Calculator state
  const [lmpDate, setLmpDate] = useState("");
  const [edd, setEdd] = useState<string | null>(null);
  const [gestationWeeks, setGestationWeeks] = useState<number | null>(null);
  const [gestationDays, setGestationDays] = useState<number | null>(null);
  const [trimester, setTrimester] = useState<number | null>(null);
  
  // Step 2: Risk Checklist state
  const [risks, setRisks] = useState({
    underAgeOrOverAge: false,
    hypertension: false,
    diabetes: false,
    previousPreeclampsia: false,
    multiplePregnancy: false,
  });
  
  // Step 3: Partner sync state
  const [partnerCode, setPartnerCode] = useState("");
  const [isSynced, setIsSynced] = useState(false);

  // Generate random partner sync code on mount
  useEffect(() => {
    const code = "NARA-" + Math.floor(100 + Math.random() * 900) + "-" + Math.floor(100 + Math.random() * 900);
    setPartnerCode(code);
    
    // Set default LMP date to 12 weeks ago to give a good starting preview
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() - 84); // 12 weeks ago
    const yyyy = defaultDate.getFullYear();
    const mm = String(defaultDate.getMonth() + 1).padStart(2, '0');
    const dd = String(defaultDate.getDate()).padStart(2, '0');
    setLmpDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Recalculate gestation whenever LMP date changes
  useEffect(() => {
    if (!lmpDate) return;
    
    const lmp = new Date(lmpDate);
    const today = new Date();
    
    // Clear future or invalid dates
    if (lmp > today) {
      setEdd(null);
      setGestationWeeks(null);
      setGestationDays(null);
      setTrimester(null);
      return;
    }
    
    // Calculate EDD: LMP + 280 days
    const eddDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
    setEdd(eddDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
    
    // Calculate difference in days
    const diffTime = Math.abs(today.getTime() - lmp.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    
    setGestationWeeks(weeks);
    setGestationDays(days);
    
    // Determine Trimester
    if (weeks < 13) {
      setTrimester(1);
    } else if (weeks < 27) {
      setTrimester(2);
    } else {
      setTrimester(3);
    }
  }, [lmpDate]);

  const toggleRisk = (key: keyof typeof risks) => {
    setRisks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasAnyRisk = Object.values(risks).some(v => v);

  const handleNext = () => {
    if (currentStep === 1 && (!gestationWeeks || gestationWeeks > 42)) {
      alert("Please enter a valid Last Menstrual Period (LMP) date to calculate your gestation.");
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = () => {
    // Save settings to LocalStorage (SafeState caching)
    const onboardingData = {
      lmpDate,
      edd,
      gestationWeeks,
      gestationDays,
      trimester,
      risks,
      riskLevel: hasAnyRisk ? "high" : "low",
      partnerCode,
      partnerSynced: isSynced,
      setupCompleted: true,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem("mama_gestation_data", JSON.stringify(onboardingData));
    
    // Direct redirect to mama dashboard
    router.push("/dashboard");
  };

  const babyInfo = gestationWeeks !== null ? getBabySizeInfo(gestationWeeks) : null;

  return (
    <div className="min-h-screen bg-[#E8EFF4] text-[#0D090C] font-sans flex flex-col items-center justify-center p-4 md:p-8">
      {/* Container Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Header Branding */}
        <div className="px-6 pt-8 pb-4 text-center border-b border-slate-100 bg-[#E8F3CE]/20 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#D4F475] flex items-center justify-center mb-3 shadow-md">
            <img src="/logo.png" alt="Ahnara Logo" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#0D090C] text-display">Ahnara Mama</h1>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Maternal Wellness Workspace</p>
        </div>

        {/* Multi-step progress indicator */}
        <div className="px-8 pt-6 flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2.5">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    currentStep === step 
                      ? "bg-[#1E293B] text-white ring-4 ring-slate-200"
                      : currentStep > step 
                      ? "bg-[#8BB436] text-white"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}
                >
                  {currentStep > step ? <IconCheck className="w-4 h-4" /> : step}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${
                  currentStep === step ? "text-[#0D090C]" : "text-slate-400"
                }`}>
                  {step === 1 && "Calculator"}
                  {step === 2 && "Risk Check"}
                  {step === 3 && "NARA Link"}
                </span>
              </div>
              {step < 3 && (
                <div className={`flex-1 h-0.5 mx-4 rounded-full transition-all duration-300 ${
                  currentStep > step ? "bg-[#8BB436]" : "bg-slate-100"
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 md:p-8 flex-1">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: CALCULATOR */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-5"
              >
                <div className="text-left">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight text-display">Calculate Gestation Week</h2>
                  <p className="text-sm text-slate-500 font-semibold mt-1">
                    Select the first day of your Last Menstrual Period (LMP) to configure your pregnancy timeline.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Last Menstrual Period (LMP)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={lmpDate}
                        onChange={(e) => setLmpDate(e.target.value)}
                        className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-2xl py-3 pl-4 pr-10 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all font-semibold text-slate-800"
                      />
                      <IconCalendar className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {gestationWeeks !== null && gestationWeeks >= 0 && gestationWeeks <= 42 ? (
                    <div className="flex flex-col gap-4 mt-2">
                      
                      {/* Gestation Badge & EDD */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-[#E8F3CE] border border-[#CDE0A4] rounded-2xl p-4 flex flex-col justify-center text-left">
                          <span className="text-[10px] font-bold text-[#608216] uppercase tracking-wider">Gestational Age</span>
                          <span className="text-xl font-extrabold text-[#0D090C] mt-1 text-display">
                            Week {gestationWeeks} <span className="text-sm font-semibold text-slate-600">({gestationDays} Days)</span>
                          </span>
                          <span className="text-xs text-[#608216]/90 font-bold mt-1 uppercase tracking-wider">
                            Trimester {trimester}
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col justify-center text-left">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expected Due Date (EDD)</span>
                          <span className="text-lg font-bold text-[#0D090C] mt-1">
                            {edd}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold mt-1">
                            Calculated at 280 gestational days
                          </span>
                        </div>
                      </div>

                      {/* Milestone Fruit Box */}
                      {babyInfo && (
                        <div className="bg-[#DDEEF3] border border-slate-300/30 rounded-2xl p-5 flex items-center gap-4 text-left">
                          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm">
                            {babyInfo.icon}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-[#0D090C]">
                              Baby is the size of a <span className="text-[#0089C1]">{babyInfo.size}</span>
                            </h4>
                            <p className="text-xs text-slate-600 font-semibold mt-0.5 leading-relaxed">
                              {babyInfo.desc}
                            </p>
                          </div>
                        </div>
                      )}

                    </div>
                  ) : lmpDate ? (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 flex items-center gap-3 text-left">
                      <IconInfoCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-xs font-semibold">
                        LMP date cannot be in the future or exceed 42 weeks ago. Please choose a valid date.
                      </p>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )}

            {/* STEP 2: RISK CHECKLIST */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-5"
              >
                <div className="text-left">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight text-display">Health Pre-Checklist</h2>
                  <p className="text-sm text-slate-500 font-semibold mt-1">
                    Select any pre-existing health factors to personalize your clinical alerts and midwives dashboard triggers.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 text-left">
                  {[
                    { key: "underAgeOrOverAge", label: "Maternal age is under 18 or over 35" },
                    { key: "hypertension", label: "Pre-existing high blood pressure (hypertension)" },
                    { key: "diabetes", label: "Pre-existing diabetes or high blood sugar" },
                    { key: "previousPreeclampsia", label: "History of pre-eclampsia or seizures in previous pregnancy" },
                    { key: "multiplePregnancy", label: "Expecting twins, triplets or multiple babies" }
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => toggleRisk(item.key as keyof typeof risks)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                        risks[item.key as keyof typeof risks]
                          ? "bg-[#E8F3CE]/45 border-[#CDE0A4] text-[#608216]"
                          : "bg-slate-50/50 border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all ${
                        risks[item.key as keyof typeof risks]
                          ? "bg-[#8BB436] text-white"
                          : "border border-slate-300 bg-white"
                      }`}>
                        {risks[item.key as keyof typeof risks] && <IconCheck className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-sm font-semibold leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* Risk assessment output banner */}
                <div className="mt-2">
                  {hasAnyRisk ? (
                    <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-4 flex items-start gap-3 text-left">
                      <IconAlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-orange-800 uppercase tracking-wide">High Risk Assessment Flags</span>
                        <p className="text-xs text-orange-700 font-semibold mt-1 leading-relaxed">
                          We will highlight these factors for your clinic midwife. Rest assured, this helps customize your care plan for a safe delivery.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3 text-left">
                      <IconShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Standard Care Protocol Assessed</span>
                        <p className="text-xs text-emerald-700 font-semibold mt-1 leading-relaxed">
                          No initial clinical risk indicators flags checked. You are set for standard antenatal care schedules!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 3: NARA SYNC */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
              >
                <div className="text-left">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight text-display">Sync with Partner or Midwife</h2>
                  <p className="text-sm text-slate-500 font-semibold mt-1">
                    Connect your timelines and SOS tracking with your husband, family companion, or clinic nurse using NARA Link.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-50/50 border border-slate-200/60 p-6 rounded-2xl">
                  
                  {/* Mock QR Code */}
                  <div className="relative bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                    <div className="w-32 h-32 flex items-center justify-center bg-slate-100 rounded-xl border border-dashed border-slate-300">
                      <IconQrcode className="w-20 h-20 text-[#0089C1] opacity-75" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-black tracking-widest mt-2 uppercase">Scan to Link</span>
                  </div>

                  <div className="flex-1 text-left">
                    <span className="text-[10px] font-bold text-[#0089C1] uppercase tracking-wider">Sync Activation Code</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono font-black text-xl text-slate-800 bg-white border border-slate-200 rounded-xl px-4 py-2 select-all shadow-sm">
                        {partnerCode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-3.5 leading-relaxed">
                      Share this code or let them scan the QR to automatically receive your kick counts, vitals updates, and GPS dispatch during SOS emergencies.
                    </p>

                    <button 
                      onClick={() => setIsSynced(prev => !prev)}
                      className={`mt-4 inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
                        isSynced 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${isSynced ? "bg-emerald-500 text-white" : "bg-slate-200"}`}>
                        {isSynced && <IconCheck className="w-2.5 h-2.5" />}
                      </div>
                      {isSynced ? "Connected to Partner Link" : "Mark as Synced (Simulate)"}
                    </button>
                  </div>
                </div>

                <div className="bg-[#DDEEF3] border border-slate-300/30 rounded-2xl p-4 flex items-start gap-3 text-left">
                  <IconSparkles className="w-5 h-5 text-[#0089C1] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    You can also link your partner at any time from your dashboard profile. Click below to complete calculations and launch your "Today" dashboard.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          {currentStep > 1 ? (
            <AhnaraButton 
              variant="outline" 
              onClick={handleBack}
              leftIcon={<IconArrowLeft className="w-4 h-4" />}
              className="!rounded-xl hover:bg-white text-slate-700"
            >
              Back
            </AhnaraButton>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <AhnaraButton 
              variant="primary" 
              onClick={handleNext}
              rightIcon={<IconArrowRight className="w-4 h-4" />}
              className="!rounded-xl bg-[#1E293B] hover:bg-slate-800 text-white"
            >
              Next Step
            </AhnaraButton>
          ) : (
            <AhnaraButton 
              variant="success" 
              onClick={handleComplete}
              rightIcon={<IconCheck className="w-4 h-4" />}
              className="!rounded-xl bg-[#8BB436] hover:bg-[#7aa02e] border-none text-white font-bold"
            >
              Calculate &amp; Enter Dashboard
            </AhnaraButton>
          )}
        </div>

      </div>
    </div>
  );
}
