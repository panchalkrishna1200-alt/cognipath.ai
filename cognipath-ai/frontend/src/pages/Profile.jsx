import { useNavigate } from "react-router-dom";
import { useStudent } from "../App.jsx";
import RadarChartView from "../components/RadarChartView.jsx";

export default function Profile() {
  const { student, competencies } = useStudent();
  const navigate = useNavigate();

  const overallScore = student?.overallScore || 68;

  const getStatusBadge = (score) => {
    if (score >= 75) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Strong
        </span>
      );
    }
    if (score >= 60) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          Developing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
        Critical Gap
      </span>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* ── Page Header / Hero Profile Banner ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-50/80 to-purple-50/40 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#0F2F64] to-[#2563EB] text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md shrink-0">
              {student?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "KP"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {student?.name || "Krishna Patel"}
                </h1>
                <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {student?.role || "Statistical Officer"}
                </span>
                <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full font-mono">
                  {student?.employeeId || "SO-IND-2024-884"}
                </span>
              </div>
              <p className="text-sm text-slate-600 font-medium">
                {student?.designation || "Senior Statistical Officer"} &bull;{" "}
                <span className="text-slate-500">{student?.department || "Official Statistical System"}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Competency Level: <strong>{student?.currentLevel || "Intermediate (Level 2)"}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Assessment Status: <strong className="text-blue-700">{student?.assessmentStatus || "Baseline Completed"}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
            <button
              onClick={() => navigate("/career-path")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <span>AI Career Path</span>
              <span>&rarr;</span>
            </button>
            <button
              onClick={() => navigate("/upload")}
              className="bg-[#0F2F64] hover:bg-[#173E80] text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Assessment</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button
              onClick={() => navigate("/gaps")}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-xs"
            >
              Gap Analysis
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Competency</p>
            <p className="text-3xl font-black text-[#0F2F64] mt-1">{overallScore}%</p>
            <p className="text-xs text-slate-500 mt-0.5">Across 6 Statistical Domains</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            📊
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Strong Competencies</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">2</p>
            <p className="text-xs text-slate-500 mt-0.5">Data Collection, Visualization</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            ✅
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Gaps</p>
            <p className="text-3xl font-black text-rose-600 mt-1">2</p>
            <p className="text-xs text-slate-500 mt-0.5">Survey Design, Governance</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg">
            ⚠️
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Benchmark</p>
            <p className="text-3xl font-black text-purple-700 mt-1">80%</p>
            <p className="text-xs text-slate-500 mt-0.5">iGOT Karmayogi Standard</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg">
            🎯
          </div>
        </div>
      </div>

      {/* ── Main Grid: Radar Chart & Competency Table ── */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Competency Breakdown List */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Current Competency Breakdown</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated against MoSPI National Statistical Capacity Standards
              </p>
            </div>
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg">
              6 Core Skills
            </span>
          </div>

          <div className="space-y-4">
            {competencies.map((comp) => {
              const gap = Math.max(0, comp.required - comp.current);
              return (
                <div
                  key={comp.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-800">{comp.name}</h3>
                      <span className="text-[11px] text-slate-400 font-normal">({comp.category})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(comp.current)}
                      <span className="text-sm font-black text-slate-800">{comp.current}%</span>
                    </div>
                  </div>

                  {/* Dual Bar (Current vs Benchmark) */}
                  <div className="relative w-full h-3 bg-slate-200/80 rounded-full overflow-hidden">
                    {/* Required Target Marker at 80% */}
                    <div
                      className="absolute top-0 bottom-0 bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${comp.current}%` }}
                    ></div>
                    {comp.required > comp.current && (
                      <div
                        className="absolute top-0 bottom-0 bg-rose-400/40 rounded-r-full"
                        style={{
                          left: `${comp.current}%`,
                          width: `${gap}%`,
                        }}
                      ></div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                    <span>
                      Current: <strong>{comp.current}%</strong> &bull; Benchmark: <strong>{comp.required}%</strong>
                    </span>
                    <span className={gap > 0 ? "text-rose-600 font-semibold" : "text-emerald-600 font-semibold"}>
                      {gap > 0 ? `Gap: ${gap}%` : "Benchmark Met ✓"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Need personalized training? Generate dynamic questions from your study materials.
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="text-xs font-bold text-[#0F2F64] hover:text-[#173E80] flex items-center gap-1"
            >
              Upload Material &rarr;
            </button>
          </div>
        </div>

        {/* Right: Radar Chart Visualization */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">Competency Radar Profile</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-axial visualization comparing current level vs required benchmark
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[340px]">
            <RadarChartView
              competencies={competencies}
              showRequired={true}
              showReAssessed={false}
              height={340}
            />
          </div>

          <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 leading-relaxed">
            <strong className="font-bold">AI Competency Insight:</strong> Your strongest domain is{" "}
            <span className="font-semibold text-blue-950">Data Collection (90%)</span>, while{" "}
            <span className="font-semibold text-rose-700">Survey Design (50%)</span> and{" "}
            <span className="font-semibold text-rose-700">Data Governance (55%)</span> represent priority gaps requiring targeted capacity building.
          </div>
        </div>
      </div>

      {/* ── 2. ADVANCED: Visual Skill Dependency Graph (DAG) ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Advanced AI Feature
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Competency Dependency &amp; Prerequisite Graph (DAG)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Visualizing prerequisite bottlenecks: how foundational gaps undermine downstream analytical mastery
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Topology: Directed Acyclic Graph (DAG)
          </span>
        </div>

        {/* DAG Nodes Flow */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative">
          {[
            {
              id: "survey_design",
              title: "1. Survey Design",
              domain: "Root Prerequisite",
              score: 50,
              status: "Critical Bottleneck",
              dependsOn: "Foundational",
              blocks: "Sampling & Analysis",
              color: "border-rose-400 bg-rose-50/70 text-rose-900",
              badge: "Bottleneck ⚠️",
            },
            {
              id: "sampling_methods",
              title: "2. Sampling Methods",
              domain: "Methodology",
              score: 65,
              status: "Developing",
              dependsOn: "Survey Design",
              blocks: "Variance Weights",
              color: "border-amber-300 bg-amber-50/70 text-amber-900",
              badge: "Developing",
            },
            {
              id: "data_collection",
              title: "3. Data Collection",
              domain: "Field Execution",
              score: 90,
              status: "Strong Mastery",
              dependsOn: "Sampling Plan",
              blocks: "Primary Data Scrub",
              color: "border-emerald-300 bg-emerald-50/70 text-emerald-900",
              badge: "Mastered ✓",
            },
            {
              id: "statistical_analysis",
              title: "4. Statistical Analysis",
              domain: "Inferential Modeling",
              score: 70,
              status: "Developing",
              dependsOn: "Clean CAPI Data",
              blocks: "Policy Estimates",
              color: "border-blue-300 bg-blue-50/70 text-blue-900",
              badge: "Developing",
            },
            {
              id: "data_visualization",
              title: "5. Visualization",
              domain: "Dissemination",
              score: 85,
              status: "High Competency",
              dependsOn: "Tabulated Data",
              blocks: "Cabinet Dashboards",
              color: "border-emerald-300 bg-emerald-50/70 text-emerald-900",
              badge: "Mastered ✓",
            },
            {
              id: "data_governance",
              title: "6. Data Governance",
              domain: "Statutory Law",
              score: 55,
              status: "Critical Gap",
              dependsOn: "DPDP & NDSAP",
              blocks: "Microdata Release",
              color: "border-rose-400 bg-rose-50/70 text-rose-900",
              badge: "Critical ⚠️",
            },
          ].map((node, idx) => (
            <div
              key={node.id}
              className={`rounded-xl border p-4 shadow-xs relative flex flex-col justify-between ${node.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    Stage {idx + 1}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white shadow-2xs">
                    {node.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {node.title}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{node.domain}</p>
                <div className="mt-2 text-xl font-black text-slate-900">
                  {node.score}%
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[9.5px] space-y-0.5 text-slate-600">
                <p>Depends: <span className="font-semibold text-slate-800">{node.dependsOn}</span></p>
                <p>Feeds Into: <span className="font-semibold text-slate-800">{node.blocks}</span></p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Prerequisite Warning */}
        <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-4 flex items-start gap-3 text-xs text-purple-900">
          <span className="text-lg">💡</span>
          <div>
            <strong className="font-bold">Prerequisite Causal Analysis:</strong> Because{" "}
            <span className="underline font-semibold">Survey Design (50%)</span> is a prerequisite for{" "}
            <span className="underline font-semibold">Sampling Methods (65%)</span>, addressing Survey Design first produces a compounding +18% lift across subsequent multistage estimation modules.
          </div>
        </div>
      </div>

      {/* ── 3. ADVANCED: Spaced Repetition Competency Retention Schedule (SM-2) ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Active SM-2 Memory Engine
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Spaced Repetition &amp; Memory Retention Schedule
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Preventing competency decay via automated SuperMemo SM-2 optimal review intervals
            </p>
          </div>
          <button
            onClick={() => navigate("/upload")}
            className="bg-[#0F2F64] hover:bg-[#173E80] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <span>Start 2-min Flash Review</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              topic: "Survey Design & Cognitive Pre-testing",
              due: "Due Today",
              interval: "1 Day Interval",
              repetition: "Review #1",
              decay: "Decaying (68% Retention)",
              status: "urgent",
              color: "border-rose-200 bg-rose-50/40 text-rose-800",
            },
            {
              topic: "DPDP Act 2023 Statutory Microdata Rules",
              due: "Due in 2 Days",
              interval: "3 Days Interval",
              repetition: "Review #2",
              decay: "Moderate (81% Retention)",
              status: "upcoming",
              color: "border-amber-200 bg-amber-50/40 text-amber-800",
            },
            {
              topic: "Multi-Stage Stratified PPS Sampling",
              due: "Due in 6 Days",
              interval: "7 Days Interval",
              repetition: "Review #3",
              decay: "Stable (89% Retention)",
              status: "stable",
              color: "border-blue-200 bg-blue-50/40 text-blue-800",
            },
            {
              topic: "CAPI Field Supervision & Verification",
              due: "Due in 18 Days",
              interval: "21 Days Interval",
              repetition: "Review #5",
              decay: "Permanent Memory (96%)",
              status: "mastered",
              color: "border-emerald-200 bg-emerald-50/40 text-emerald-800",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between ${item.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {item.repetition}
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-white shadow-2xs">
                    {item.due}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {item.topic}
                </h4>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[10px] text-slate-600 flex items-center justify-between">
                <span>{item.interval}</span>
                <span className="font-semibold text-slate-800">{item.decay}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
