"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconCalendar,
  IconUser,
  IconCheck,
  IconPhoneCall,
  IconClock,
  IconBuildingHospital,
  IconMapPin,
  IconPlus,
  IconChecks,
  IconStar,
  IconAlertTriangle,
  IconShare,
  IconShield,
  IconLock,
  IconThumbUp,
  IconMessageCircle,
  IconTrash,
  IconVolume
} from "@tabler/icons-react";
import { AhnaraCard } from "@/components/ahnara/AhnaraCard";
import { AhnaraButton } from "@/components/ahnara/AhnaraButton";

export default function AhnaraCircleFeed() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [peerMatched, setPeerMatched] = useState(false);
  const [isModeratorView, setIsModeratorView] = useState(false);
  const [hasRSVP, setHasRSVP] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(42);
  const [isEscalateOpen, setIsEscalateOpen] = useState<any>(null);

  // Permission settings state (CI.7)
  const [permMaternal, setPermMaternal] = useState(true);
  const [permPediatric, setPermPediatric] = useState(true);
  const [permGeriatric, setPermGeriatric] = useState(false);
  const [permLady, setPermLady] = useState(false);
  const [permGirlie, setPermGirlie] = useState(false);

  const categories = [
    { name: "Maternal Care", color: "bg-[#8BB436] text-white border-[#8BB436]", colorHex: "#8BB436" },
    { name: "Newborn Care", color: "bg-[#0089C1] text-white border-[#0089C1]", colorHex: "#0089C1" },
    { name: "Geriatric Care", color: "bg-[#6366F1] text-white border-[#6366F1]", colorHex: "#6366F1" },
    { name: "Lady Care", color: "bg-[#E11D48] text-white border-[#E11D48]", colorHex: "#E11D48" },
    { name: "Adolescent Care", color: "bg-[#E572A1] text-white border-[#E572A1]", colorHex: "#E572A1" }
  ];

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Sarah Jenkins (Mama)",
      workspace: 0,
      time: "10m ago",
      text: "Experiencing severe morning sickness in Gestation Week 9. Any advice on natural remedies or should I consult my doctor?",
      nlpWarning: false,
      upvotes: 12,
      verifiedAnswer: "Dr. Adenuga (Pediatrician): Focus on small, dry snacks like ginger biscuits or crackers. Sip water slowly between meals.",
      expertBadge: true
    },
    {
      id: 2,
      author: "Liam Carter (Kids Parent)",
      workspace: 1,
      time: "1h ago",
      text: "My 4-month-old is sleeping 12 hours straight at night. Is this normal or should I wake them up to feed?",
      nlpWarning: false,
      upvotes: 8,
      verifiedAnswer: "Dr. Adenuga (Pediatrician): If their weight gain is normal and they feed well during the day, it is safe to let them sleep.",
      expertBadge: true
    },
    {
      id: 3,
      author: "Clara Rogers (Companion)",
      workspace: 2,
      time: "3h ago",
      text: "My father is showing sudden confusion today. Has anyone else noticed high-risk scams targeting elders on SMS?",
      nlpWarning: true,
      upvotes: 22,
      verifiedAnswer: null,
      expertBadge: false
    },
    {
      id: 4,
      author: "Jane Doe (Girlie Profile)",
      workspace: 4,
      time: "5h ago",
      text: "Is it normal to feel pelvic cramps two days before first period starts? P.S. I locked my logs with PIN code.",
      nlpWarning: false,
      upvotes: 5,
      verifiedAnswer: "Nurse Clara (Clinician): Yes! Pre-period cramps are very common as muscles contract. Keep a warm pad handy.",
      expertBadge: true
    }
  ]);

  const [flaggedComments, setFlaggedComments] = useState([
    {
      id: "INC-482-104",
      text: "You should double your medication dose without consulting the GP, it cured my joint stiffness immediately.",
      flagReason: "Unverified Medical Advice",
      strikes: 2
    },
    {
      id: "INC-204-859",
      text: "Adolescents should avoid seeking clinic help for cramps, just use home herbal remedies.",
      flagReason: "Harassment / Medical Spam",
      strikes: 1
    }
  ]);

  const activeColor = categories[activeCategoryIndex].colorHex;

  const handlePostUpvote = (postId: number) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://ahnara.com/invite/family-circle-sync");
    alert("WhatsApp invite link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pt-24 pb-16 px-4 md:px-8 text-left">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Milestone Support Feed</span>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight text-display mt-1">
              {isModeratorView ? "Safety & Moderation Panel" : "Ahnara Circle Hub"}
            </h1>
          </div>
          <AhnaraButton
            variant="outline"
            className="flex items-center gap-2 font-bold"
            style={{ color: activeColor, borderColor: `${activeColor}30` }}
            onClick={() => setIsModeratorView(!isModeratorView)}
          >
            {isModeratorView ? <IconChecks className="w-4 h-4" /> : <IconShield className="w-4 h-4" />}
            {isModeratorView ? "Switch to Community Feed" : "Moderator Dashboard"}
          </AhnaraButton>
        </div>

        {isModeratorView ? (
          /* ==========================================
             MODERATOR DESK (CI.9)
             ========================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <main className="lg:col-span-8 flex flex-col gap-4">
              <AhnaraCard variant="flat" className="bg-white p-6 shadow-xs border border-slate-100 flex flex-col gap-4">
                <div className="flex items-center gap-2.5 border-b border-slate-50 pb-4">
                  <IconShield className="w-6 h-6 text-red-500" />
                  <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">Pending Incident Reports</h3>
                </div>
                {flaggedComments.length === 0 ? (
                  <p className="text-sm text-slate-400 font-semibold py-8 text-center">No pending flags found.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {flaggedComments.map(flag => (
                      <div key={flag.id} className="p-5 rounded-2xl bg-red-50/20 border border-red-100 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase bg-red-100 text-red-800 px-3 py-1 rounded-lg">
                            {flag.flagReason}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {flag.id}</span>
                        </div>
                        <p className="text-sm text-slate-700 italic font-semibold leading-relaxed">
                          "{flag.text}"
                        </p>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                          <span className="text-xs text-slate-400 font-bold">Strikes: {flag.strikes} / 3</span>
                          <div className="flex items-center gap-2">
                            <AhnaraButton
                              variant="ghost"
                              className="text-xs text-slate-500 font-bold hover:bg-slate-100 py-1.5 px-3 rounded-lg"
                              onClick={() => {
                                setFlaggedComments(prev => prev.filter(f => f.id !== flag.id));
                                alert("Incident approved. Post restored.");
                              }}
                            >
                              Approve Post
                            </AhnaraButton>
                            <AhnaraButton
                              variant="secondary"
                              className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded-lg"
                              onClick={() => {
                                setFlaggedComments(prev => prev.filter(f => f.id !== flag.id));
                                alert("Post deleted. Strike issued to user.");
                              }}
                            >
                              Delete & Strike
                            </AhnaraButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AhnaraCard>
            </main>
            <aside className="lg:col-span-4 flex flex-col gap-4">
              <AhnaraCard variant="flat" className="bg-red-50 border border-red-100 p-5 flex flex-col gap-3 text-red-950 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600">AI Dialogue Moderator</span>
                <h4 className="font-extrabold text-sm leading-tight">NLP Auto-Classification</h4>
                <p className="text-xs font-semibold leading-relaxed text-red-900/80">
                  Ahnara's shared AI dialogue classifier automatically analyzes incoming messages. Medical claims lacking clinician confirmation are labeled with warning tags instantly.
                </p>
              </AhnaraCard>
            </aside>
          </div>
        ) : (
          /* ==========================================
             COMMUNITY FEED & WIDGETS
             ========================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Main content stream */}
            <main className="lg:col-span-8 flex flex-col gap-4">
              
              {/* CI.1: Verified Life-Stage Group Finder */}
              <AhnaraCard variant="flat" padding="none" className="bg-white p-4 shadow-xs border border-slate-100 flex items-center gap-2 overflow-x-auto">
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCategoryIndex(i)}
                    className={`px-4 py-2 rounded-xl text-xs font-black tracking-tight border transition-all whitespace-nowrap cursor-pointer ${
                      activeCategoryIndex === i 
                        ? `${cat.color} border-transparent shadow-sm`
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </AhnaraCard>

              {/* Pinned daily Q&A block (CI.2) */}
              <AhnaraCard variant="flat" className="bg-white p-6 shadow-xs border border-slate-100 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${activeColor}12`, color: activeColor }}>
                    <IconStar className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-slate-400 font-black uppercase">Q&A of the Day</span>
                    <h4 className="text-sm font-black text-slate-800">Dr. Adenuga [Pediatrician]</h4>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-extrabold text-base text-slate-800 leading-snug">
                    Q: How long can infant formula sit in the fridge or at room temp?
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer transition-all hover:scale-105 shadow-sm"
                        style={{ backgroundColor: activeColor }}
                      >
                        <IconVolume className="w-5 h-5" />
                      </button>
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Recorded Voice response</span>
                        <span className="text-xs font-bold text-slate-800">
                          {isPlayingAudio ? "Playing clinician audio... (2m 14s)" : "Tap to listen to clinician reply"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AhnaraCard>

              {/* Feed lists */}
              <div className="flex flex-col gap-3">
                {posts.filter(p => p.workspace === activeCategoryIndex).map(post => (
                  <div key={post.id} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col gap-4 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-800">{post.author}</span>
                      <span className="text-xs text-slate-400 font-bold">{post.time}</span>
                    </div>
                    
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                      {post.text}
                    </p>

                    {post.nlpWarning && (
                      <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 flex items-center gap-2 text-orange-950">
                        <IconAlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <span className="text-xs font-bold leading-normal text-orange-900">
                          Warning: Medical claims flagged for review by moderators.
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                      <button 
                        onClick={() => handlePostUpvote(post.id)}
                        className="flex items-center gap-1.5 text-xs text-slate-500 font-bold hover:text-slate-800 transition-colors"
                      >
                        <IconThumbUp className="w-4 h-4" />
                        {post.upvotes} Upvotes
                      </button>
                      <button 
                        onClick={() => setIsEscalateOpen(post)}
                        className="flex items-center gap-1.5 text-xs font-black uppercase transition-colors"
                        style={{ color: activeColor }}
                      >
                        <IconLock className="w-4 h-4" />
                        Ask Clinician
                      </button>
                    </div>

                    {post.verifiedAnswer && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 mt-1">
                        <IconShield className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                        <p className="text-xs font-bold leading-relaxed text-slate-700">
                          {post.verifiedAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </main>

            {/* Sidebar widgets */}
            <aside className="lg:col-span-4 flex flex-col gap-4">
              
              {/* CI.3: Peer-to-Peer Support Matching */}
              <AhnaraCard variant="flat" className="bg-white p-5 border border-slate-100 shadow-xs flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">matching portal</span>
                  <IconUser className="w-4 h-4 text-orange-500" />
                </div>
                {!peerMatched ? (
                  <>
                    <h4 className="font-extrabold text-sm text-slate-800">Peer support Matcher</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Connect privately with other members sharing identical clinical milestones (e.g. twins, dementia carers).
                    </p>
                    <AhnaraButton 
                      variant="outline"
                      className="w-full mt-1 font-bold text-xs"
                      style={{ color: activeColor, borderColor: `${activeColor}30` }}
                      onClick={() => setPeerMatched(true)}
                    >
                      Setup Peer Match
                    </AhnaraButton>
                  </>
                ) : (
                  <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs text-base">👩</div>
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] text-emerald-700 font-bold uppercase">98% Match</span>
                        <span className="text-xs font-black text-slate-800">Tyra Dhillon</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert("Private conversation gate unlocked.")}
                      className="p-1.5 bg-emerald-100 hover:bg-emerald-200 rounded-lg text-emerald-800 transition-colors"
                    >
                      <IconMessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </AhnaraCard>

              {/* CI.4: Community Event RSVP Card */}
              <AhnaraCard variant="flat" className="bg-white p-5 border border-slate-100 shadow-xs flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Outreach calendar</span>
                  <IconCalendar className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-800 leading-tight">Newborn Nutrition Workshop</span>
                  <span className="text-[10px] text-slate-400 font-bold mt-1">Saturday, 10:00 AM • Clinic A</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-extrabold text-slate-800">{rsvpCount} Attending</span>
                  <AhnaraButton
                    variant="primary"
                    className="text-xs font-bold py-1.5 px-3 rounded-lg"
                    style={{ backgroundColor: activeColor }}
                    onClick={() => {
                      if (hasRSVP) {
                        setHasRSVP(false);
                        setRsvpCount(prev => prev - 1);
                      } else {
                        setHasRSVP(true);
                        setRsvpCount(prev => prev + 1);
                      }
                    }}
                  >
                    {hasRSVP ? "Cancel RSVP" : "RSVP Attend"}
                  </AhnaraButton>
                </div>
              </AhnaraCard>

              {/* CI.7: Family Circle Link & Invite */}
              <AhnaraCard variant="flat" className="bg-white p-5 border border-slate-100 shadow-xs flex flex-col gap-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Permission coordinator</span>
                  <IconPlus className="w-4 h-4 text-indigo-500" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 leading-tight">Family Tree Link</h4>
                <div className="flex flex-col gap-3.5 my-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Share Maternal Progress Logs</span>
                    <input 
                      type="checkbox" 
                      checked={permMaternal} 
                      onChange={() => setPermMaternal(!permMaternal)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Share Pediatric Growth Charts</span>
                    <input 
                      type="checkbox" 
                      checked={permPediatric} 
                      onChange={() => setPermPediatric(!permPediatric)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Share Seniors Scam Shield Flags</span>
                    <input 
                      type="checkbox" 
                      checked={permGeriatric} 
                      onChange={() => setPermGeriatric(!permGeriatric)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <AhnaraButton
                  variant="secondary"
                  className="w-full font-bold text-xs bg-slate-900 hover:bg-black text-white flex items-center justify-center gap-1.5 mt-1"
                  onClick={handleCopyLink}
                >
                  <IconShare className="w-4 h-4" />
                  Generate WhatsApp Invite
                </AhnaraButton>
              </AhnaraCard>

            </aside>
          </div>
        )}
      </div>

      {/* CI.8: Triage Escalation Gateway Dialog Modal */}
      {isEscalateOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full flex flex-col gap-4">
            <h3 className="font-black text-lg text-slate-800">Ask Clinician Gateway</h3>
            <p className="text-xs font-semibold leading-relaxed text-slate-500">
              Would you like to route this community forum post to the Consult triage queue for private, clinical feedback?
            </p>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-400 font-bold italic leading-relaxed">
              "{isEscalateOpen.text}"
            </div>
            <div className="flex items-center gap-2 mt-2">
              <AhnaraButton
                variant="ghost"
                className="w-full text-xs font-bold"
                onClick={() => setIsEscalateOpen(null)}
              >
                Cancel
              </AhnaraButton>
              <AhnaraButton
                variant="primary"
                className="w-full text-xs font-bold"
                style={{ backgroundColor: activeColor }}
                onClick={() => {
                  setIsEscalateOpen(null);
                  alert("Triage ticket generated. Consult queue notified.");
                }}
              >
                Escalate Question
              </AhnaraButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
