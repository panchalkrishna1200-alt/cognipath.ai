import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudent } from "../App.jsx";

const LEARNING_PATHS = [
  {
    priority: 1,
    competency: "Survey Design",
    gap: 30,
    currentProgress: 25, // e.g. at Learning stage
    competencyAddressed: "Methodological Frameworks & Questionnaire Architecture (FRAC Level 2 → Level 4)",
    whyRanked: "Ranked #1 Priority: Addresses your highest competency deficit of 30%. The prerequisite DAG identified that errors in sample weighting and non-sampling errors stem directly from questionnaire design deficits.",
    rootCause: "Prerequisite graph detected weak cognitive pre-testing as root cause of downstream field verification issues.",
    stages: [
      { id: "s1", label: "Start", pct: 0, done: true },
      { id: "s2", label: "Learning", pct: 25, done: true, current: true },
      { id: "s3", label: "Practice", pct: 50, done: false },
      { id: "s4", label: "Assessment", pct: 75, done: false },
      { id: "s5", label: "Competency Achieved", pct: 100, done: false },
    ],
    modules: [
      {
        title: "Survey Design Fundamentals",
        type: "Interactive Course",
        duration: "3 hrs",
        provider: "iGOT Karmayogi",
        status: "Completed",
      },
      {
        title: "Questionnaire Design & Pre-testing",
        type: "Case Study & Lab",
        duration: "4 hrs",
        provider: "NSSTA",
        status: "In Progress",
      },
      {
        title: "Sampling Techniques for Field Officers",
        type: "Methodology Brief",
        duration: "2.5 hrs",
        provider: "MoSPI Academy",
        status: "Upcoming",
      },
      {
        title: "Practice Assessment & Diagnostic Re-Test",
        type: "Adaptive Quiz",
        duration: "45 mins",
        provider: "CogniPath AI",
        status: "Locked",
      },
    ],
  },
  {
    priority: 2,
    competency: "Data Governance",
    gap: 20,
    currentProgress: 0, // at Start
    competencyAddressed: "Compliance & Security (DPDP Act 2023 & NDSAP Policy)",
    whyRanked: "Ranked #2 Priority: Addresses a 20% critical deficit. Essential statutory prerequisite for publishing official microdata without incurring legal liabilities under the Digital Personal Data Protection Act.",
    rootCause: "Lacks formal familiarity with statutory anonymization benchmarks (k-anonymity) required for open data dissemination.",
    stages: [
      { id: "g1", label: "Start", pct: 0, done: true, current: true },
      { id: "g2", label: "Learning", pct: 25, done: false },
      { id: "g3", label: "Practice", pct: 50, done: false },
      { id: "g4", label: "Assessment", pct: 75, done: false },
      { id: "g5", label: "Competency Achieved", pct: 100, done: false },
    ],
    modules: [
      {
        title: "Data Governance Fundamentals",
        type: "Core Module",
        duration: "2 hrs",
        provider: "iGOT Karmayogi",
        status: "Ready",
      },
      {
        title: "Data Privacy and Security (DPDP Act)",
        type: "Statutory Law",
        duration: "3.5 hrs",
        provider: "MeitY / iGOT",
        status: "Ready",
      },
      {
        title: "Governance Assessment",
        type: "Evaluation",
        duration: "30 mins",
        provider: "CogniPath AI",
        status: "Locked",
      },
    ],
  },
  {
    priority: 3,
    competency: "Sampling Methods",
    gap: 15,
    currentProgress: 50, // at Practice
    competencyAddressed: "Statistical Methodology (Stratified Multistage Cluster & PPS)",
    whyRanked: "Ranked #3 Priority: Secondary deficit of 15%. Foundational sampling concepts are already sound (65%); focuses on multi-stage cluster variance estimation.",
    rootCause: "Demonstrates basic probability concepts but requires practice on finite population correction weighting.",
    stages: [
      { id: "m1", label: "Start", pct: 0, done: true },
      { id: "m2", label: "Learning", pct: 25, done: true },
      { id: "m3", label: "Practice", pct: 50, done: true, current: true },
      { id: "m4", label: "Assessment", pct: 75, done: false },
      { id: "m5", label: "Competency Achieved", pct: 100, done: false },
    ],
    modules: [
      {
        title: "Sampling Fundamentals",
        type: "Refresher",
        duration: "2 hrs",
        provider: "NSSTA",
        status: "Completed",
      },
      {
        title: "Advanced Sampling Methods & Multi-Stage PPS",
        type: "Applied Statistics",
        duration: "4.5 hrs",
        provider: "iGOT Karmayogi",
        status: "In Progress",
      },
    ],
  },
];

const MOCK_IGOT_COURSES = [
  {
    id: "igot-101",
    code: "NSSTA-SD-401",
    title: "Official Survey Design & Frame Architecture",
    provider: "National Statistical Systems Training Academy (NSSTA)",
    hours: "12 Hours",
    rating: "4.9",
    enrolled: "3,420 Officers",
    tags: ["Survey Design", "MoSPI Certified"],
    level: "Advanced",
  },
  {
    id: "igot-102",
    code: "IGOT-DPDP-202",
    title: "DPDP Statutory Compliance & Public Microdata Anonymization",
    provider: "iGOT Karmayogi / MeitY",
    hours: "6 Hours",
    rating: "4.8",
    enrolled: "8,950 Officers",
    tags: ["Data Governance", "Legal"],
    level: "Intermediate",
  },
  {
    id: "igot-103",
    code: "MOSPI-SAMP-305",
    title: "Multistage Stratified Sampling & Variance Estimation",
    provider: "National Sample Survey Office (NSSO)",
    hours: "8 Hours",
    rating: "4.7",
    enrolled: "2,180 Officers",
    tags: ["Sampling Methods", "Applied Stats"],
    level: "Advanced",
  },
];

export default function LearningPath() {
  const navigate = useNavigate();
  const [completedSimulations, setCompletedSimulations] = useState({});

  const handleSimulateCompletion = (priorityNum) => {
    setCompletedSimulations((prev) => ({
      ...prev,
      [priorityNum]: true,
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Curated Capacity Building
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-0.5 font-display">
            Your Personalized Learning Path
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Prioritized automatically based on competency gap severity and public service role relevance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/career-path")}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>AI Career Path</span>
            <span>&rarr;</span>
          </button>
          <button
            onClick={() => navigate("/reassessment")}
            className="bg-[#0F2F64] hover:bg-[#173E80] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <span>Proceed to Re-Assessment</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* ── Prioritized Learning Tracks (Prompt Item 8) ── */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>Priority Tracks Ranked by Competency Deficit</span>
          <span className="text-xs font-normal text-slate-400">
            (3 Priority Tracks Identified)
          </span>
        </h2>

        {LEARNING_PATHS.map((path) => {
          const isSimulated = completedSimulations[path.priority];
          return (
            <div
              key={path.priority}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6 hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white ${
                      path.priority === 1
                        ? "bg-rose-600"
                        : path.priority === 2
                        ? "bg-amber-600"
                        : "bg-blue-600"
                    }`}
                  >
                    P{path.priority}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{path.competency}</h3>
                      <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                        Gap: {path.gap}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Targeted upskilling curriculum to achieve required 80% benchmark
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSimulateCompletion(path.priority)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      isSimulated
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isSimulated ? "✓ Modules Completed (Ready to Re-Assess)" : "⚡ Simulate Module Study"}
                  </button>
                </div>
              </div>

              {/* Explainable AI Justification Box (Feature 2 Requirement) */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Explainable AI Recommendation Rationale:</span>
                  </span>
                  <span className="text-[10px] font-bold bg-white text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                    Ranked #{path.priority} by Gap Severity &amp; DAG
                  </span>
                </div>
                <p className="text-xs text-blue-950 font-medium leading-relaxed">
                  {path.whyRanked}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-blue-900/80">
                  <span><strong>Competency Target:</strong> {path.competencyAddressed}</span>
                  <span>&bull;</span>
                  <span><strong>Prerequisite Root-Cause:</strong> {path.rootCause}</span>
                </div>
              </div>

              {/* Progress Milestones (0% -> Start, 25% -> Learning, 50% -> Practice, 75% -> Assessment, 100% -> Competency Achieved) */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Competency Milestone Progression
                </p>
                <div className="grid grid-cols-5 gap-2 sm:gap-4 relative">
                  {path.stages.map((stg, sIdx) => {
                    const active = isSimulated ? true : stg.done;
                    const isCurrent = isSimulated && sIdx === 4 ? true : stg.current;
                    return (
                      <div key={stg.id} className="text-center space-y-1.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            active
                              ? "bg-emerald-500 shadow-xs"
                              : "bg-slate-200"
                          }`}
                        ></div>
                        <p className="text-[10px] font-bold text-slate-400">{stg.pct}%</p>
                        <p
                          className={`text-xs ${
                            isCurrent
                              ? "font-extrabold text-blue-800"
                              : active
                              ? "font-semibold text-slate-800"
                              : "text-slate-400"
                          }`}
                        >
                          {stg.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sequential Learning Path Modules */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Curated Action Sequence
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {path.modules.map((mod, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                          <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            Step {mIdx + 1}
                          </span>
                          <span>{mod.duration}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">
                          {mod.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60 text-[10px]">
                        <span className="text-slate-500 font-medium">{mod.provider}</span>
                        <span
                          className={`font-bold ${
                            isSimulated || mod.status === "Completed"
                              ? "text-emerald-600"
                              : mod.status === "In Progress"
                              ? "text-blue-600"
                              : "text-slate-400"
                          }`}
                        >
                          {isSimulated ? "Completed" : mod.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Section: LEARNING ECOSYSTEM (Prompt Item 9) ── */}
      <div className="bg-gradient-to-br from-slate-900 to-[#0F2F64] rounded-2xl p-6 sm:p-9 text-white shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
              Integration Architecture
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-0.5 font-display">
              Learning Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl">
              CogniPath AI acts as the non-invasive intelligence layer orchestrating competency diagnosis with public capacity builders.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl text-xs font-medium text-blue-200 shrink-0">
            Recommended from available learning resources
          </div>
        </div>

        {/* Visual Architecture Diagram (Prompt item 9) */}
        <div className="bg-white/5 border border-white/15 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-center">
            {/* Step 1 */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-sm mb-2 shadow-inner">
                1
              </div>
              <h4 className="text-sm font-bold text-white">CogniPath AI</h4>
              <p className="text-[11px] text-blue-200 mt-1">
                Ingests manuals, administers adaptive diagnostic quiz
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-black text-sm mb-2 shadow-inner">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Identifies Gap</h4>
              <p className="text-[11px] text-blue-200 mt-1">
                Pinpoints 30% Survey Design & 20% Governance deficits
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-sm mb-2 shadow-inner">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Curates Content</h4>
              <p className="text-[11px] text-blue-200 mt-1">
                Maps micro-modules to specific missing knowledge areas
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-sm mb-2 shadow-inner">
                4
              </div>
              <h4 className="text-sm font-bold text-white">iGOT / NSSTA</h4>
              <p className="text-[11px] text-blue-200 mt-1">
                Directs learner to certified national training programs
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-center text-[11px] text-blue-200">
            <strong>Architecture Notice:</strong> Prototype uses realistic mock course data. Real Parichay SSO and live iGOT API integration will be provisioned on MeghRaj Cloud.
          </div>
        </div>

        {/* Mock iGOT Courses Catalog */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-200 mb-3">
            Recommended Courses from National Capacity Platforms
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {MOCK_IGOT_COURSES.map((course) => (
              <div
                key={course.id}
                className="bg-white text-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
                      {course.code}
                    </span>
                    <span className="text-amber-600 font-bold text-xs flex items-center gap-1">
                      ★ {course.rating}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {course.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">{course.provider}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{course.hours} &bull; {course.level}</span>
                  <button
                    onClick={() => navigate("/reassessment")}
                    className="bg-[#0F2F64] hover:bg-[#173E80] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    Enroll / Start &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
