"use client";

import React, { useState } from "react";
import { 
  IconShieldCheck, 
  IconCheck, 
  IconHourglass,
  IconSparkles,
  IconArrowRight
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function GirlieMediaLiteracyPage() {
  const [quizStep, setQuizStep] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const quizQuestions = [
    {
      text: "Look at this model's smooth pore-less cheeks and bright blue eyes. Is this photo filtered or real?",
      options: ["Filtered / Retouched", "100% Real Camera"],
      correct: "Filtered / Retouched",
      explanation: "No human skin has zero pores or lines! Digital airbrush filters smooth out skin textures to create artificial beauty standards."
    },
    {
      text: "You receive a message from a user asking for your school name and home address. What should you do?",
      options: ["Share it to make friends", "Block the user and tell a parent/teacher"],
      correct: "Block the user and tell a parent/teacher",
      explanation: "Never share sensitive private details like your location or school name online with strangers."
    }
  ];

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    setShowAnswer(true);
    if (option === quizQuestions[quizStep].correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    setQuizStep(prev => prev + 1);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 text-left">
      
      {/* Quiz Screen (7 cols) */}
      <main className="lg:col-span-7 flex flex-col gap-3">
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs min-h-[480px]">
          <div className="flex items-center gap-2">
            <IconSparkles className="w-6 h-6 text-pink-500" />
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight text-display">Media Literacy Quiz</h3>
          </div>

          {quizStep < quizQuestions.length ? (
            <div className="flex flex-col gap-4">
              <span className="text-[9px] font-black text-pink-550 uppercase tracking-widest block">Question {quizStep + 1} of {quizQuestions.length}</span>
              <p className="text-xs font-black text-slate-800 leading-normal">{quizQuestions[quizStep].text}</p>

              <div className="flex flex-col gap-2">
                {quizQuestions[quizStep].options.map((opt) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => !showAnswer && handleAnswer(opt)}
                      disabled={showAnswer}
                      className={`p-4 rounded-xl border text-xs font-bold text-left transition-all ${
                        isSelected 
                          ? opt === quizQuestions[quizStep].correct
                            ? "bg-emerald-50 border-emerald-350 text-emerald-800"
                            : "bg-rose-50 border-rose-350 text-rose-800"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100/50 text-slate-650"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {showAnswer && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2">
                  <span className="text-[10px] font-black text-pink-600 uppercase tracking-wider block">
                    {selectedOption === quizQuestions[quizStep].correct ? "Correct! 🎉" : "Incorrect 🌸"}
                  </span>
                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed">{quizQuestions[quizStep].explanation}</p>
                  
                  <button 
                    onClick={handleNext}
                    className="self-end mt-2 px-4 py-2 bg-pink-500 text-white rounded-lg text-[10px] font-black uppercase flex items-center gap-1 border-none active:scale-95 transition-all"
                  >
                    Next Question
                    <IconArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-12">
              <span className="text-4xl">🏆</span>
              <div>
                <h4 className="font-extrabold text-base text-slate-800">Quiz Completed!</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">You scored {quizScore} out of {quizQuestions.length} points.</p>
              </div>
              <AhnaraButton 
                variant="primary" 
                onClick={() => {
                  setQuizStep(0);
                  setQuizScore(0);
                  setSelectedOption(null);
                  setShowAnswer(false);
                }}
                className="bg-pink-500 hover:bg-pink-650 border-none text-white rounded-xl text-xs font-bold py-3 px-6 mt-2"
              >
                Restart Quiz
              </AhnaraButton>
            </div>
          )}
        </AhnaraCard>
      </main>

      {/* Safety checklists & Timer limits (5 cols) */}
      <aside className="lg:col-span-5 flex flex-col gap-3">
        
        {/* Screen limits */}
        <AhnaraCard variant="flat" className="bg-pink-50/20 border border-pink-100 p-5 flex items-start gap-3">
          <IconHourglass className="w-6 h-6 text-pink-500 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <h4 className="font-extrabold text-xs uppercase tracking-wide text-pink-655">Screen Time Safeguard</h4>
            <p className="text-[11px] font-bold leading-normal text-pink-800 mt-1">
              Active: <strong>55 Minutes Used</strong>. Ahnara will prompt a full screen rest break warning once you reach 60 consecutive minutes to guard against digital fatigue.
            </p>
          </div>
        </AhnaraCard>

        {/* Safety checklist */}
        <AhnaraCard variant="flat" className="bg-white border border-slate-100 p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <IconShieldCheck className="w-5 h-5 text-pink-500" />
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight text-display">Digital Safety Guidelines</h3>
          </div>

          <div className="flex flex-col gap-2">
            {[
              "Keep accounts set to Private by default",
              "Block and report comments that feel unsafe",
              "Take regular screen breaks every 60 minutes",
              "Talk to parents or mentors about cyberbullying"
            ].map((tip, idx) => (
              <div key={idx} className="flex gap-2 items-start text-xs font-semibold text-slate-650 leading-relaxed">
                <div className="p-0.5 bg-emerald-50 rounded text-emerald-600 mt-0.5">
                  <IconCheck className="w-3.5 h-3.5" />
                </div>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </AhnaraCard>

      </aside>

    </div>
  );
}
