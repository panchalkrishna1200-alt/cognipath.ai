import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStudent } from "../App.jsx";
import RadarChartView from "../components/RadarChartView.jsx";

// FRAC Framework & Evidence Confidence Mapping for Government Competencies
const FRAC_TAXONOMY = {
  survey_design: {
    role: "Statistical Officer (Cadre Level 8)",
    activity: "Formulate survey instruments, design questionnaires, cognitive pre-testing, and sample frame selection",
    currentLevel: 2, // Level 2: Developing / Supervised
    requiredLevel: 4, // Level 4: Advanced / Independent
    levelLabels: ["None", "Awareness", "Developing", "Competent", "Advanced", "Expert"],
    evidenceScore: 50,
    evidenceConfidence: 94, // % trust
    evidenceSource: "Diagnostic Assessment (12 MCQs)",
    selfScore: 65,
    selfConfidence: 45, // % trust
  },
  sampling_methods: {
    role: "Statistical Officer (Cadre Level 8)",
    activity: "Design stratified multistage cluster plans, calculate PPS weights, and estimate cluster variance",
    currentLevel: 3,
    requiredLevel: 4,
    levelLabels: ["None", "Awareness", "Developing", "Competent", "Advanced", "Expert"],
    evidenceScore: 65,
    evidenceConfidence: 91,
    evidenceSource: "Diagnostic Assessment (8 MCQs)",
    selfScore: 70,
    selfConfidence: 48,
  },
  data_collection: {
    role: "Statistical Officer (Cadre Level 8)",
    activity: "Supervise CAPI field operations, respondent verification, and primary data capture protocols",
    currentLevel: 5,
    requiredLevel: 4,
    levelLabels: ["None", "Awareness", "Developing", "Competent", "Advanced", "Expert"],
    evidenceScore: 90,
    evidenceConfidence: 96,
    evidenceSource: "Diagnostic Assessment (10 MCQs) + Field Log",
    selfScore: 90,
    selfConfidence: 55,
  },
  statistical_analysis: {
    role: "Statistical Officer (Cadre Level 8)",
    activity: "Execute multivariate econometric diagnostics, time-series decomposition, and inference testing",
    currentLevel: 3,
    requiredLevel: 4,
    levelLabels: ["None", "Awareness", "Developing", "Competent", "Advanced", "Expert"],
    evidenceScore: 70,
    evidenceConfidence: 89,
    evidenceSource: "Diagnostic Assessment (10 MCQs)",
    selfScore: 75,
    selfConfidence: 50,
  },
  data_visualization: {
    role: "Statistical Officer (Cadre Level 8)",
    activity: "Translate raw tabulations into geospatial thematic maps and executive policy dashboards",
    currentLevel: 4,
    requiredLevel: 4,
    levelLabels: ["None", "Awareness", "Developing", "Competent", "Advanced", "Expert"],
    evidenceScore: 85,
    evidenceConfidence: 95,
    evidenceSource: "Diagnostic Assessment (6 MCQs) + Report Rubric",
    selfScore: 85,
    selfConfidence: 60,
  },
  data_governance: {
    role: "Statistical Officer (Cadre Level 8)",
    activity: "Audit compliance with DPDP Act 2023, enforce NDSAP metadata, and verify microdata k-anonymity",
    currentLevel: 2,
    requiredLevel: 4,
    levelLabels: ["None", "Awareness", "Developing", "Competent", "Advanced", "Expert"],
    evidenceScore: 55,
    evidenceConfidence: 92,
    evidenceSource: "Diagnostic Assessment (8 MCQs)",
    selfScore: 60,
    selfConfidence: 40,
  },
};

export default function CompetencyGap() {
  const { competencies } = useStudent();
  const navigate = useNavigate();

  const [selectedGap, setSelectedGap] = useState(null); // When modal is opened
  const [activeTab, setActiveTab] = useState("all"); // "all" | "critical"
  const [scoreSourceView, setScoreSourceView] = useState("evidence"); // "evidence" | "self" | "comparison"
  const [viewMode, setViewMode] = useState("standard"); // "standard" | "frac"

  // Filtered gaps
  const displayedCompetencies = activeTab === "critical"
    ? competencies.filter((c) => c.status === "Critical Gap")
    : competencies;

  const handleOpenDiagnosis = (comp) => {
    setSelectedGap(comp);
  };

  const getStatusBadge = (status) => {
    if (status === "Strong") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Strong
        </span>
      );
    }
    if (status === "Developing") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          Developing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
        Critical Gap
      </span>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Diagnostic Intelligence Layer
            </span>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Government FRAC Framework Standard
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Competency &amp; Skill-Gap Analysis
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Identifies existing competencies and deficits mapped against the national <strong>FRAC framework</strong> (Role &rarr; Activity &rarr; Competency &rarr; Proficiency Level 1–5), tagged with <strong>Evidence vs. Self-Declaration confidence ratings</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/career-path"
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>Career Path</span>
            <span>&rarr;</span>
          </Link>

          <button
            onClick={() => handleOpenDiagnosis(competencies[0])}
            className="bg-gradient-to-r from-[#0F2F64] to-[#2563EB] hover:from-[#173E80] hover:to-[#1D4ED8] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Explain My Gap (AI Diagnosis)</span>
          </button>
        </div>
      </div>

      {/* ── FRAC & Evidence Control Bar ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* View Mode Toggle: Standard vs FRAC Framework Hierarchy */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Framework View:
          </span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setViewMode("standard")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "standard"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode("frac")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === "frac"
                  ? "bg-[#0F2F64] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🏛️ FRAC Framework (Levels 1–5)</span>
            </button>
          </div>
        </div>

        {/* Score Source & Trust Confidence Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Score Source:
          </span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setScoreSourceView("evidence")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                scoreSourceView === "evidence"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Verified Evidence (Quiz)</span>
              <span className="text-[10px] bg-white/20 px-1 rounded font-bold">~93% Trust</span>
            </button>
            <button
              onClick={() => setScoreSourceView("self")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                scoreSourceView === "self"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Self-Declaration</span>
              <span className="text-[10px] bg-white/20 px-1 rounded font-bold">~45% Trust</span>
            </button>
            <button
              onClick={() => setScoreSourceView("comparison")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                scoreSourceView === "comparison"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Compare Both
            </button>
          </div>
        </div>
      </div>

      {/* ── FRAC Hierarchy Banner when in FRAC View ── */}
      {viewMode === "frac" && (
        <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">
              Government FRAC Skill Architecture (MoSPI &amp; iGOT Karmayogi)
            </span>
            <span className="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
              Role &rarr; Activity &rarr; Competency &rarr; Proficiency 1–5
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Framework for Roles, Activities and Competencies (FRAC) measures capability across 5 proficiency tiers:
            <strong> Level 1 (Awareness)</strong> &bull; <strong>Level 2 (Developing)</strong> &bull; <strong>Level 3 (Competent)</strong> &bull; <strong>Level 4 (Advanced)</strong> &bull; <strong>Level 5 (Expert)</strong>. Statistical Officers are expected to attain <strong>Level 4</strong> autonomy.
          </p>
        </div>
      )}

      {/* ── Visual Comparison Grid: Required vs Current Table + Radar Chart ── */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Required vs Current List & Progress Bars */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {viewMode === "frac"
                ? "FRAC Mapped Competencies & Proficiency Levels"
                : "Required Competency vs. Current Competency"}
            </h2>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === "all" ? "bg-white text-slate-900 font-bold shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All (6)
              </button>
              <button
                onClick={() => setActiveTab("critical")}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === "critical" ? "bg-white text-rose-700 font-bold shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Critical Gaps Only (2)
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {displayedCompetencies.map((comp) => {
              const frac = FRAC_TAXONOMY[comp.id] || {
                role: "Statistical Officer",
                activity: "Official statistical duties",
                currentLevel: 2,
                requiredLevel: 4,
                levelLabels: ["", "L1", "L2", "L3", "L4", "L5"],
                evidenceScore: comp.current,
                evidenceConfidence: 90,
                selfScore: comp.current + 10,
                selfConfidence: 45,
              };

              const activeScore = scoreSourceView === "self" ? frac.selfScore : frac.evidenceScore;
              const gap = Math.max(0, comp.required - activeScore);

              return (
                <div
                  key={comp.id}
                  className="bg-slate-50/60 border border-slate-200/80 rounded-xl p-4 hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{comp.name}</h3>
                      <p className="text-[11px] text-slate-400">{comp.category}</p>
                      {viewMode === "frac" && (
                        <p className="text-[11px] text-slate-600 mt-1 bg-white p-2 rounded-lg border border-slate-100">
                          <strong className="text-slate-700 font-semibold">Activity:</strong> {frac.activity}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {getStatusBadge(comp.status)}
                      <button
                        onClick={() => handleOpenDiagnosis(comp)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 transition-colors"
                      >
                        Explain Gap
                      </button>
                    </div>
                  </div>

                  {/* FRAC Level Stepper (1 to 5) */}
                  {viewMode === "frac" ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs text-slate-600 font-medium">
                        <span>
                          Current: <strong>Level {frac.currentLevel} ({frac.levelLabels[frac.currentLevel]})</strong>
                        </span>
                        <span>
                          Benchmark Target: <strong>Level {frac.requiredLevel} ({frac.levelLabels[frac.requiredLevel]})</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5">
                        {[1, 2, 3, 4, 5].map((lvl) => {
                          const isAchieved = lvl <= frac.currentLevel;
                          const isTarget = lvl === frac.requiredLevel;
                          return (
                            <div
                              key={lvl}
                              className={`py-1.5 text-center rounded-lg text-[10px] font-bold border transition-all ${
                                isAchieved
                                  ? "bg-emerald-500 text-white border-emerald-600"
                                  : isTarget
                                  ? "bg-blue-50 text-blue-800 border-dashed border-2 border-blue-400"
                                  : "bg-slate-200/70 text-slate-400 border-slate-200"
                              }`}
                            >
                              L{lvl}: {frac.levelLabels[lvl]}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Standard Dual Bar Progress */
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-600 font-medium">
                        <span>
                          Current: <strong className="text-slate-900">{activeScore}%</strong>
                          {scoreSourceView === "comparison" && (
                            <span className="text-[10px] text-slate-400 ml-1">
                              (Evidence: {frac.evidenceScore}%, Self: {frac.selfScore}%)
                            </span>
                          )}
                        </span>
                        <span>
                          Required: <strong className="text-slate-900">{comp.required}%</strong>
                        </span>
                      </div>

                      <div className="relative w-full h-3 bg-slate-200/90 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            activeScore >= 75
                              ? "bg-emerald-500"
                              : activeScore >= 60
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${activeScore}%` }}
                        ></div>
                        {gap > 0 && (
                          <div
                            className="absolute top-0 bottom-0 bg-rose-300/40 border-l border-dashed border-rose-400"
                            style={{
                              left: `${activeScore}%`,
                              width: `${gap}%`,
                            }}
                          ></div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Confidence Rating Tag & Gap Details */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className={gap > 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
                      {gap > 0 ? `Competency Gap: ${gap}% deficit` : "No deficit (Benchmark Achieved)"}
                    </span>

                    {/* Evidence confidence badge */}
                    <div className="flex items-center gap-1.5 text-[10px]">
                      {scoreSourceView === "self" ? (
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                          Self-Declared &bull; Confidence: {frac.selfConfidence}% (Low Trust)
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          ✓ Evidence-Based &bull; Confidence: {frac.evidenceConfidence}% (High Trust)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Radar Chart Benchmark Overlay & Why Do I Have This Gap */}
        <div className="lg:col-span-5 space-y-6">
          {/* Radar Chart Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Competency Radar Overlay
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Blue polygon represents Evidence Mastery; Orange dashed perimeter represents 80% Required Benchmark.
            </p>

            <RadarChartView
              competencies={competencies}
              showRequired={true}
              showReAssessed={false}
              height={320}
            />
          </div>

          {/* "Why do I have this gap?" Section (Exact requirement from prompt) */}
          <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-900">
              <span className="text-lg">💡</span>
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Why do I have this gap?
              </h3>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-normal">
              &ldquo;Your assessment indicates difficulty in survey design concepts, questionnaire structure, and sampling framework selection.&rdquo;
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              While your field data capture and visualization skills are top-tier, recent statutory mandates (DPDP Act) and multistage sample weighting require targeted methodological upskilling.
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleOpenDiagnosis(competencies[0])}
                className="text-xs font-bold text-[#0F2F64] hover:text-[#173E80] flex items-center gap-1.5"
              >
                <span>Read Full AI Gap Diagnosis</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI GAP DIAGNOSIS MODAL / DRAWER ── */}
      {selectedGap && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0F2F64] to-[#1E3A8A] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl font-bold">
                  🧠
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                    AI Gap Diagnosis
                  </span>
                  <h2 className="text-xl font-bold">{selectedGap.name} Gap</h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedGap(null)}
                className="text-white/70 hover:text-white text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Diagnosis Narrative */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  1. Root-Cause Diagnostic Analysis
                </h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed font-medium">
                  {selectedGap.diagnosis}
                </p>
              </div>

              {/* Specific Skills Missing */}
              {selectedGap.missing && selectedGap.missing.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    2. Specific Sub-Skills Missing (Prerequisite DAG Gaps)
                  </h4>
                  <ul className="space-y-2">
                    {selectedGap.missing.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-700 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100"
                      >
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Action */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  3. Recommended Remediation Action
                </h4>
                <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl text-xs text-blue-900 leading-relaxed font-semibold">
                  {selectedGap.recommendedAction}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedGap(null)}
                  className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedGap(null);
                    navigate("/learning-path");
                  }}
                  className="bg-[#0F2F64] hover:bg-[#173E80] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm"
                >
                  Start Prescribed Learning Path &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
