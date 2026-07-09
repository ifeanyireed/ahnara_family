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
  IconSparkles,
  IconActivity,
  IconUser,
  IconMoodSmile
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";
import { AhnaraInput } from "@/components/ahnara/AhnaraInput";
import { useAuth } from "@/components/ahnara/AuthContext";
import { getAuthToken } from "@/lib/api";

// Baby size milestone mapping by gestational week (Maternal)
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
  const { user, login } = useAuth();

  // Step 0: Profile Type selection
  const [profileType, setProfileType] = useState<"maternal" | "pediatric" | null>(null);
  const [currentStep, setCurrentStep] = useState(0); // 0 = Profile Selection, 1, 2, 3 = steps
  
  // ==========================================
  // MATERNAL FLOW STATE
  // ==========================================
  const [lmpDate, setLmpDate] = useState("");
  const [edd, setEdd] = useState<string | null>(null);
  const [gestationWeeks, setGestationWeeks] = useState<number | null>(null);
  const [gestationDays, setGestationDays] = useState<number | null>(null);
  const [trimester, setTrimester] = useState<number | null>(null);
  
  const [maternalRisks, setMaternalRisks] = useState({
    underAgeOrOverAge: false,
    hypertension: false,
    diabetes: false,
    previousPreeclampsia: false,
    multiplePregnancy: false,
  });
  
  const [maternalPartnerCode, setMaternalPartnerCode] = useState("");
  const [maternalIsSynced, setMaternalIsSynced] = useState(false);

  // ==========================================
  // PEDIATRIC FLOW STATE
  // ==========================================
  const [childName, setChildName] = useState("");
  const [childDob, setChildDob] = useState("");
  const [biologicalSex, setBiologicalSex] = useState<"Male" | "Female">("Male");
  
  const [childWeight, setChildWeight] = useState("3200"); // grams
  const [childLength, setChildLength] = useState("50"); // cm
  const [childHeadCircumference, setChildHeadCircumference] = useState("35"); // cm
  
  const [apgarHeartRate, setApgarHeartRate] = useState<number>(2);
  const [apgarRespiration, setApgarRespiration] = useState<number>(2);
  const [apgarMuscleTone, setApgarMuscleTone] = useState<number>(2);
  const [apgarReflexes, setApgarReflexes] = useState<number>(2);
  const [apgarSkinColor, setApgarSkinColor] = useState<number>(2);
  const [apgarScore, setApgarScore] = useState<number>(10);

  const [mamaRecordSync, setMamaRecordSync] = useState("");
  const [pediatricPartnerCode, setPediatricPartnerCode] = useState("");
  const [pediatricPartnerSynced, setPediatricPartnerSynced] = useState(false);
  const [pediatricRisks, setPediatricRisks] = useState({
    preterm: false,
    lowBirthWeight: false,
    multipleBirth: false,
    maternalComplication: false,
    congenitalChecks: false
  });

  // ==========================================
  // INITIALIZATIONS
  // ==========================================
  useEffect(() => {
    // Generate partner sync codes
    const codeM = "NARA-" + Math.floor(100 + Math.random() * 900) + "-" + Math.floor(100 + Math.random() * 900);
    setMaternalPartnerCode(codeM);

    const codeP = "NARA-KIDS-" + Math.floor(100 + Math.random() * 900) + "-" + Math.floor(100 + Math.random() * 900);
    setPediatricPartnerCode(codeP);
    
    // Set default dates
    const defaultMaternalDate = new Date();
    defaultMaternalDate.setDate(defaultMaternalDate.getDate() - 84); // 12 weeks ago
    const yyyyM = defaultMaternalDate.getFullYear();
    const mmM = String(defaultMaternalDate.getMonth() + 1).padStart(2, '0');
    const ddM = String(defaultMaternalDate.getDate()).padStart(2, '0');
    setLmpDate(`${yyyyM}-${mmM}-${ddM}`);

    const defaultPedDate = new Date();
    defaultPedDate.setDate(defaultPedDate.getDate() - 95); // ~3 months ago
    const yyyyP = defaultPedDate.getFullYear();
    const mmP = String(defaultPedDate.getMonth() + 1).padStart(2, '0');
    const ddP = String(defaultPedDate.getDate()).padStart(2, '0');
    setChildDob(`${yyyyP}-${mmP}-${ddP}`);
    
    setMamaRecordSync("MAMA-849-204");
  }, []);

  // Pre-populate role selection if user has role
  useEffect(() => {
    if (user?.role === "KIDS") {
      setProfileType("pediatric");
    } else if (user?.role === "MAMA") {
      setProfileType("maternal");
    }
  }, [user]);

  // Recalculate gestation whenever LMP date changes
  useEffect(() => {
    if (!lmpDate) return;
    
    const lmp = new Date(lmpDate);
    const today = new Date();
    
    if (lmp > today) {
      setEdd(null);
      setGestationWeeks(null);
      setGestationDays(null);
      setTrimester(null);
      return;
    }
    
    const eddDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
    setEdd(eddDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
    
    const diffTime = Math.abs(today.getTime() - lmp.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    
    setGestationWeeks(weeks);
    setGestationDays(days);
    
    if (weeks < 13) {
      setTrimester(1);
    } else if (weeks < 27) {
      setTrimester(2);
    } else {
      setTrimester(3);
    }
  }, [lmpDate]);

  // Calculate APGAR Score dynamically
  useEffect(() => {
    const score = apgarHeartRate + apgarRespiration + apgarMuscleTone + apgarReflexes + apgarSkinColor;
    setApgarScore(score);
  }, [apgarHeartRate, apgarRespiration, apgarMuscleTone, apgarReflexes, apgarSkinColor]);

  // ==========================================
  // ACTIONS & HANDLERS
  // ==========================================
  const toggleMaternalRisk = (key: keyof typeof maternalRisks) => {
    setMaternalRisks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePediatricRisk = (key: keyof typeof pediatricRisks) => {
    setPediatricRisks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasAnyMaternalRisk = Object.values(maternalRisks).some(v => v);
  const hasAnyPediatricRisk = Object.values(pediatricRisks).some(v => v) || Number(childWeight) < 2500 || apgarScore < 7;

  const handleNext = () => {
    if (currentStep === 0) {
      if (!profileType) {
        alert("Please select a workspace profile to continue.");
        return;
      }
      setCurrentStep(1);
      return;
    }

    if (profileType === "maternal") {
      if (currentStep === 1 && (!gestationWeeks || gestationWeeks > 42)) {
        alert("Please enter a valid Last Menstrual Period (LMP) date to calculate your gestation.");
        return;
      }
    } else {
      if (currentStep === 1) {
        if (!childName.trim()) {
          alert("Please enter the child's full name.");
          return;
        }
        if (!childDob) {
          alert("Please select the child's date of birth.");
          return;
        }
        const selectedDob = new Date(childDob);
        if (selectedDob > new Date()) {
          alert("Date of birth cannot be in the future.");
          return;
        }
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = () => {
    // Dynamically update the user's role in global context
    const updatedRole = profileType === "maternal" ? "MAMA" : "KIDS";
    if (user) {
      const token = getAuthToken() || "mock-token";
      login(token, {
        ...user,
        role: updatedRole
      });
    }

    if (profileType === "maternal") {
      // Save settings to LocalStorage
      const onboardingData = {
        lmpDate,
        edd,
        gestationWeeks,
        gestationDays,
        trimester,
        risks: maternalRisks,
        riskLevel: hasAnyMaternalRisk ? "high" : "low",
        partnerCode: maternalPartnerCode,
        partnerSynced: maternalIsSynced,
        setupCompleted: true,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem("mama_gestation_data", JSON.stringify(onboardingData));
      router.push("/dashboard");
    } else {
      const onboardingData = {
        childName,
        dob: childDob,
        biologicalSex,
        birthWeight: Number(childWeight),
        birthLength: Number(childLength),
        headCircumference: Number(childHeadCircumference),
        apgarScore,
        apgarMetrics: {
          heartRate: apgarHeartRate,
          respiration: apgarRespiration,
          muscleTone: apgarMuscleTone,
          reflexes: apgarReflexes,
          skinColor: apgarSkinColor
        },
        mamaRecordSync,
        partnerCode: pediatricPartnerCode,
        partnerSynced: pediatricPartnerSynced,
        risks: {
          ...pediatricRisks,
          lowBirthWeight: Number(childWeight) < 2500,
          lowApgar: apgarScore < 7
        },
        riskLevel: hasAnyPediatricRisk ? "high" : "low",
        setupCompleted: true,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem("kids_profile_data", JSON.stringify(onboardingData));
      router.push("/kids");
    }
  };

  const apgarCategory = () => {
    if (apgarScore >= 7) return { text: "Normal / Excellent Status", color: "text-[#608216] bg-[#E8F3CE] border-[#CDE0A4]" };
    if (apgarScore >= 4) return { text: "Moderately Depressed (Needs Support)", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { text: "Severely Depressed (Emergency Alert)", color: "text-red-700 bg-red-50 border-red-200" };
  };

  const babyInfo = (profileType === "maternal" && gestationWeeks !== null) ? getBabySizeInfo(gestationWeeks) : null;

  return (
    <div className="min-h-screen bg-[#E8EFF4] text-[#0D090C] font-sans flex flex-col items-center justify-center p-4 md:p-8">
      {/* Container Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Header Branding */}
        <div className="px-6 pt-8 pb-4 text-center border-b border-slate-100 bg-[#E8F3CE]/20 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#D4F475] flex items-center justify-center mb-3 shadow-md">
            <img src="/logo.png" alt="Ahnara Logo" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#0D090C] text-display">Ahnara Family</h1>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Family Health &amp; Care Workspace</p>
        </div>

        {/* Multi-step progress indicator */}
        {currentStep > 0 && (
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
                    {profileType === "maternal" ? (
                      <>
                        {step === 1 && "Calculator"}
                        {step === 2 && "Risk Check"}
                        {step === 3 && "NARA Link"}
                      </>
                    ) : (
                      <>
                        {step === 1 && "Basic Info"}
                        {step === 2 && "Birth Metrics"}
                        {step === 3 && "EHR Link & Risks"}
                      </>
                    )}
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
        )}

        {/* Step Content */}
        <div className="p-6 md:p-8 flex-1">
          <AnimatePresence mode="wait">
            
            {/* STEP 0: PROFILE SELECTOR */}
            {currentStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-6"
              >
                <div className="text-left">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight text-display">Choose Workspace Profile</h2>
                  <p className="text-sm text-slate-500 font-semibold mt-1">
                    Select the workspace mode appropriate for your care needs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Maternal Card */}
                  <button
                    onClick={() => setProfileType("maternal")}
                    className={`p-6 rounded-2xl border text-left flex flex-col gap-4 transition-all duration-300 ${
                      profileType === "maternal"
                        ? "bg-[#E8F3CE]/45 border-[#CDE0A4] ring-2 ring-[#8BB436]"
                        : "bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-slate-350"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      profileType === "maternal" ? "bg-[#8BB436] text-white" : "bg-slate-200 text-slate-500"
                    }`}>
                      <IconHeart className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight">Maternal Care</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1.5 leading-relaxed">
                        Pregnancy timeline (40-week calculator), WHO clinical checkups, digital birth planner, and midwife SOS alerts.
                      </p>
                    </div>
                  </button>

                  {/* Pediatric Card */}
                  <button
                    onClick={() => setProfileType("pediatric")}
                    className={`p-6 rounded-2xl border text-left flex flex-col gap-4 transition-all duration-300 ${
                      profileType === "pediatric"
                        ? "bg-[#DDEEF3]/65 border-sky-350 ring-2 ring-[#0089C1]"
                        : "bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-slate-350"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      profileType === "pediatric" ? "bg-[#0089C1] text-white" : "bg-slate-200 text-slate-500"
                    }`}>
                      <IconMoodSmile className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight">Pediatric Care</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1.5 leading-relaxed">
                        Child health profiling, birth measurements, immunization calendars, developmental milestones, and pediatrician consults.
                      </p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ========================================== */}
            {/* MATERNAL FLOW SCREENS */}
            {/* ========================================== */}
            {profileType === "maternal" && currentStep === 1 && (
              <motion.div
                key="mStep1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-5"
              >
                <div className="text-left">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight text-display">Calculate Gestation Week</h2>
                  <p className="text-sm text-slate-500 font-semibold mt-1">
                    Select the first day of your Last Menstrual Period (LMP) to configure your pregnancy timeline.
                  </p>
                </div>

                <div className="flex flex-col gap-4 text-left">
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
                          <span className="text-lg font-bold text-[#0D090C] mt-1">{edd}</span>
                          <span className="text-xs text-slate-500 font-semibold mt-1">
                            Calculated at 280 gestational days
                          </span>
                        </div>
                      </div>

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

            {profileType === "maternal" && currentStep === 2 && (
              <motion.div
                key="mStep2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
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
                      onClick={() => toggleMaternalRisk(item.key as keyof typeof maternalRisks)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                        maternalRisks[item.key as keyof typeof maternalRisks]
                          ? "bg-[#E8F3CE]/45 border-[#CDE0A4] text-[#608216]"
                          : "bg-slate-50/50 border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all ${
                        maternalRisks[item.key as keyof typeof maternalRisks]
                          ? "bg-[#8BB436] text-white"
                          : "border border-slate-300 bg-white"
                      }`}>
                        {maternalRisks[item.key as keyof typeof maternalRisks] && <IconCheck className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-sm font-semibold leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-2 text-left">
                  {hasAnyMaternalRisk ? (
                    <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-4 flex items-start gap-3">
                      <IconAlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-orange-800 uppercase tracking-wide">High Risk Assessment Flags</span>
                        <p className="text-xs text-orange-700 font-semibold mt-1 leading-relaxed">
                          We will highlight these factors for your clinic midwife. Rest assured, this helps customize your care plan for a safe delivery.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
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

            {profileType === "maternal" && currentStep === 3 && (
              <motion.div
                key="mStep3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-6"
              >
                <div className="text-left">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight text-display">Sync with Partner or Midwife</h2>
                  <p className="text-sm text-slate-500 font-semibold mt-1">
                    Connect your timelines and SOS tracking with your partner, family companion, or clinic nurse using NARA Link.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-50/50 border border-slate-200/60 p-6 rounded-2xl">
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
                        {maternalPartnerCode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-3.5 leading-relaxed">
                      Share this code or let them scan the QR to automatically receive your kick counts, vitals updates, and GPS dispatch during SOS emergencies.
                    </p>

                    <button 
                      onClick={() => setMaternalIsSynced(prev => !prev)}
                      className={`mt-4 inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
                        maternalIsSynced 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${maternalIsSynced ? "bg-emerald-500 text-white" : "bg-slate-200"}`}>
                        {maternalIsSynced && <IconCheck className="w-2.5 h-2.5" />}
                      </div>
                      {maternalIsSynced ? "Connected to Partner Link" : "Mark as Synced (Simulate)"}
                    </button>
                  </div>
                </div>

                <div className="bg-[#DDEEF3] border border-slate-300/30 rounded-2xl p-4 flex items-start gap-3 text-left">
                  <IconSparkles className="w-5 h-5 text-[#0089C1] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    You can also link your partner at any time from your dashboard profile. Click below to complete calculations and launch your Family Workspace.
                  </p>
                </div>
              </motion.div>
            )}


            {/* ========================================== */}
            {/* PEDIATRIC FLOW SCREENS */}
            {/* ========================================== */}
            {profileType === "pediatric" && currentStep === 1 && (
              <motion.div
                key="pStep1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-5"
              >
                <div className="text-left">
                  <h2 className="text-xl font-bold text-[#0D090C] tracking-tight text-display">Register Newborn or Child</h2>
                  <p className="text-sm text-slate-500 font-semibold mt-1">
                    Enter basic identity details for the child to establish appropriate developmental age-bands.
                  </p>
                </div>

                <div className="flex flex-col gap-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Child's Full Name
                    </label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="e.g. Aria Dhillon"
                      className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-3 px-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-350 transition-all font-semibold text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={childDob}
                          onChange={(e) => setChildDob(e.target.value)}
                          className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-3 pl-4 pr-10 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-350 transition-all font-semibold text-slate-800"
                        />
                        <IconCalendar className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Biological Sex
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setBiologicalSex("Male")}
                          className={`py-2 rounded-lg text-xs font-bold transition-all ${
                            biologicalSex === "Male"
                              ? "bg-[#1E293B] text-white shadow-sm"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          onClick={() => setBiologicalSex("Female")}
                          className={`py-2 rounded-lg text-xs font-bold transition-all ${
                            biologicalSex === "Female"
                              ? "bg-[#1E293B] text-white shadow-sm"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Female
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#DDEEF3] border border-slate-300/30 rounded-2xl p-4 flex items-start gap-3 mt-2">
                    <IconSparkles className="w-5 h-5 text-[#0089C1] flex-shrink-0 mt-0.5 animate-pulse" />
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                      Entering correct demographic details automatically maps vaccination dates against the standard pediatric schedules (EPI calendar).
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {profileType === "pediatric" && currentStep === 2 && (
              <motion.div
                key="pStep2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-5"
              >
                <div className="text-left">
                  <h2 className="text-xl font-bold text-[#0D090C] tracking-tight text-display">Birth Metrics &amp; APGAR</h2>
                  <p className="text-sm text-slate-500 font-semibold mt-1">
                    Input birth measurements to track percentiles and calculate baby's immediate physiological status.
                  </p>
                </div>

                <div className="flex flex-col gap-4 text-left">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Weight (grams)
                      </label>
                      <input
                        type="number"
                        value={childWeight}
                        onChange={(e) => setChildWeight(e.target.value)}
                        placeholder="e.g. 3200"
                        className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2 px-3 text-xs outline-none focus:bg-white font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        value={childLength}
                        onChange={(e) => setChildLength(e.target.value)}
                        placeholder="e.g. 50"
                        className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2 px-3 text-xs outline-none focus:bg-white font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Head Circum. (cm)
                      </label>
                      <input
                        type="number"
                        value={childHeadCircumference}
                        onChange={(e) => setChildHeadCircumference(e.target.value)}
                        placeholder="e.g. 35"
                        className="w-full bg-[#F1F5F9]/50 border border-slate-200 rounded-xl py-2 px-3 text-xs outline-none focus:bg-white font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  {/* APGAR Score Calculator Widget */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <IconActivity className="w-5 h-5 text-[#0089C1]" />
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">APGAR Calculator Widget</h4>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${apgarCategory().color}`}>
                        Score: {apgarScore} / 10
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">1. Heart Rate (Pulse)</label>
                        <select
                          value={apgarHeartRate}
                          onChange={(e) => setApgarHeartRate(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                        >
                          <option value={0}>0 — Absent (No pulse)</option>
                          <option value={1}>1 — Under 100 beats/min</option>
                          <option value={2}>2 — Over 100 beats/min</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">2. Respiration (Effort)</label>
                        <select
                          value={apgarRespiration}
                          onChange={(e) => setApgarRespiration(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                        >
                          <option value={0}>0 — Absent (No cry/breath)</option>
                          <option value={1}>1 — Slow, irregular, weak cry</option>
                          <option value={2}>2 — Good crying, normal breathing</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">3. Muscle Tone (Activity)</label>
                        <select
                          value={apgarMuscleTone}
                          onChange={(e) => setApgarMuscleTone(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                        >
                          <option value={0}>0 — Flaccid, limp muscles</option>
                          <option value={1}>1 — Some flexion of arms &amp; legs</option>
                          <option value={2}>2 — Active motion, flexed limbs</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">4. Reflexes (Grimace)</label>
                        <select
                          value={apgarReflexes}
                          onChange={(e) => setApgarReflexes(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                        >
                          <option value={0}>0 — No response to stimuli</option>
                          <option value={1}>1 — Grimace during stimulation</option>
                          <option value={2}>2 — Active mouth cough or vigorous cry</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">5. Skin Color (Appearance)</label>
                        <select
                          value={apgarSkinColor}
                          onChange={(e) => setApgarSkinColor(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                        >
                          <option value={0}>0 — Cyanosis (Entirely blue/pale)</option>
                          <option value={1}>1 — Acrocyanosis (Pink body, blue extremities)</option>
                          <option value={2}>2 — Normal (Completely pink skin)</option>
                        </select>
                      </div>
                    </div>

                    <div className={`mt-2 border rounded-xl p-3 text-xs font-semibold ${apgarCategory().color}`}>
                      <span className="font-bold">Assessment Category:</span> {apgarCategory().text}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {profileType === "pediatric" && currentStep === 3 && (
              <motion.div
                key="pStep3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-6"
              >
                <div className="text-left">
                  <h2 className="text-xl font-bold text-[#0D090C] tracking-tight text-display">Sync &amp; Pre-Screening Risks</h2>
                  <p className="text-sm text-slate-500 font-semibold mt-1">
                    Sync newborn files with the mother's antenatal records and identify checkups indicators.
                  </p>
                </div>

                {/* Mama Link Sync */}
                <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-50 border border-slate-200 p-5 rounded-2xl text-left">
                  <div className="relative bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center">
                    <div className="w-24 h-24 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <IconQrcode className="w-14 h-14 text-[#0089C1] opacity-75 animate-pulse" />
                    </div>
                    <span className="text-[8px] text-slate-400 font-black tracking-widest mt-1.5 uppercase">Sync Link</span>
                  </div>

                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-[#0089C1] uppercase tracking-wider">Antenatal Mama Sync ID</span>
                    <input
                      type="text"
                      value={mamaRecordSync}
                      onChange={(e) => setMamaRecordSync(e.target.value)}
                      placeholder="e.g. MAMA-849-204"
                      className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-slate-900/10 font-mono font-bold mt-1 text-slate-800"
                    />
                    <p className="text-[10px] text-slate-500 font-semibold mt-2.5 leading-normal">
                      Linking immediately synchronizes postpartum delivery history, gestational risks, and maternal blood group datasets.
                    </p>
                  </div>
                </div>

                {/* Pre-Screening checklist */}
                <div className="flex flex-col gap-2 text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Newborn Pre-Screening Checklist</span>
                  
                  {[
                    { key: "preterm", label: "Preterm delivery (born before 37 weeks)" },
                    { key: "multipleBirth", label: "Multiple pregnancy birth (twins, triplets)" },
                    { key: "maternalComplication", label: "Mother experienced high blood pressure/pre-eclampsia" },
                    { key: "congenitalChecks", label: "Doctor advised special follow-up for vital organs/heart" }
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => togglePediatricRisk(item.key as any)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        pediatricRisks[item.key as keyof typeof pediatricRisks]
                          ? "bg-[#E8F3CE] border-[#CDE0A4] text-[#608216]"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded flex-shrink-0 flex items-center justify-center transition-all ${
                        pediatricRisks[item.key as keyof typeof pediatricRisks]
                          ? "bg-[#8BB436] text-white"
                          : "border border-slate-300 bg-white"
                      }`}>
                        {pediatricRisks[item.key as keyof typeof pediatricRisks] && <IconCheck className="w-3 h-3" />}
                      </div>
                      <span className="text-xs font-bold leading-none">{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* Risk outcome */}
                <div className="mt-1 text-left">
                  {hasAnyPediatricRisk ? (
                    <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-4 flex items-start gap-3">
                      <IconAlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-orange-800 uppercase tracking-wide">Higher Risk Assessment Flags</span>
                        <p className="text-[10px] text-orange-700 font-semibold mt-1 leading-normal">
                          We found indicators (low APGAR, birth weight under 2500g, or preterm checks). Standard clinic schedules will be highlighted with pediatrician consult guidelines.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
                      <IconShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Optimal Development Mapped</span>
                        <p className="text-[10px] text-emerald-700 font-semibold mt-1 leading-normal">
                          Child baseline metrics are within optimal parameters. Safe standard immunization reminders and growth percentiles are configured.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {currentStep > 0 ? (
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

          {currentStep === 0 ? (
            <AhnaraButton 
              variant="primary" 
              onClick={handleNext}
              disabled={!profileType}
              rightIcon={<IconArrowRight className="w-4 h-4" />}
              className="!rounded-xl bg-[#1E293B] hover:bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </AhnaraButton>
          ) : currentStep < 3 ? (
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
