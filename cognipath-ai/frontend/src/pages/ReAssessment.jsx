import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudent } from "../App.jsx";
import RadarChartView from "../components/RadarChartView.jsx";

export default function ReAssessment() {
  const { competencies, setCompetencies, setStudent } = useStudent();
  const navigate = useNavigate();

  const [hasReAssessed, setHasReAssessed] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Exact numbers from user prompt:
  // Survey Design BEFORE: 50% -> AFTER: 78% (+28%)
  const handleRetakeAssessment = () => {
    setIsSimulating(true);

    setTimeout(() => {
      setIsSimulating(false);
      setHasReAssessed(true);

      // Update global competencies and student score
      const updated = competencies.map((c) => {
        if (c.id === "survey_design") {
          return {
            ...c,
            current: 78,
            status: "Developing",
            gap: 2,
          };
        }
        if (c.id === "sampling_methods") {
          return {
            ...c,
            current: 82,
            status: "Strong",
            gap: 0,
          };
        }
        if (c.id === "data_governance") {
          return {
            ...c,
            current: 76,
            status: "Developing",
            gap: 0,
          };
        }
        return c;
      });

      setCompetencies(updated);
      setStudent((prev) => ({
        ...prev,
        overallScore: 82,
        assessmentStatus: "Continuous Loop: Re-Assessment Verified",
      }));
    }, 1200);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Continuous Capacity Building Loop
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-0.5 font-display">
            Competency Re-Assessment & Verification
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Validate post-learning mastery gains and update your official capability profile.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs"
          >
            &larr; Back to Profile Dashboard
          </button>
        </div>
      </div>

      {/* ── Continuous Learning Loop Flowchart Banner (Prompt item 10) ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">
          The Continuous Learning Loop
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold">
          <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200">
            1. Assess
          </span>
          <span className="text-slate-400 font-black">&rarr;</span>
          <span className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200">
            2. Identify Gap
          </span>
          <span className="text-slate-400 font-black">&rarr;</span>
          <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
            3. Learn (iGOT)
          </span>
          <span className="text-slate-400 font-black">&rarr;</span>
          <span className="px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 ring-2 ring-indigo-400">
            4. Re-Assess
          </span>
          <span className="text-slate-400 font-black">&rarr;</span>
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            5. Update Competency
          </span>
        </div>
      </div>

      {/* ── Retake Assessment CTA & Interactive State ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-extrabold text-slate-900 font-display">
            {hasReAssessed
              ? "Re-Assessment Verification Completed!"
              : "Ready to Verify Your Learning Progress?"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            {hasReAssessed
              ? "Your competency scores have been updated dynamically across the Bayesian Knowledge Tracing model."
              : "After completing the recommended modules on iGOT Karmayogi, take this 5-minute targeted evaluation to measure capability gains."}
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleRetakeAssessment}
              disabled={isSimulating}
              className="bg-[#0F2F64] hover:bg-[#173E80] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 group disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Evaluating Post-Learning Questions...</span>
                </>
              ) : (
                <>
                  <span>Retake Assessment</span>
                  <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── BEFORE VS AFTER COMPARISON (Prompt item 10) ── */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Before vs After Delta Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Before & After Competency Delta
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted gain analysis following completion of recommended capacity modules
              </p>
            </div>
            {hasReAssessed && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
                Score: 68% &rarr; 82% (+14%)
              </span>
            )}
          </div>

          {/* Primary Survey Design Card (Prompt Exact Example) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-blue-900">
                Primary Target: Survey Design
              </span>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Competency improved by 28%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BEFORE</span>
                <p className="text-2xl font-black text-rose-600 mt-0.5">50%</p>
                <span className="text-[10px] text-slate-500 font-medium">Critical Gap</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AFTER</span>
                <p className="text-2xl font-black text-emerald-600 mt-0.5">78%</p>
                <span className="text-[10px] text-slate-500 font-medium">Benchmark Approached</span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-emerald-600 text-white p-3 rounded-xl shadow-xs flex flex-col justify-center">
                <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">NET GAIN</span>
                <p className="text-2xl font-black mt-0.5">+28%</p>
                <span className="text-[10px] text-emerald-100 font-medium">Verified by AI</span>
              </div>
            </div>
          </div>

          {/* Secondary Gaps Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Comprehensive Domain Updates
            </h4>

            {competencies.map((comp) => {
              const beforeVal = comp.id === "survey_design" ? 50 : comp.current;
              const afterVal = comp.reAssessed;
              const delta = afterVal - beforeVal;

              return (
                <div
                  key={comp.id}
                  className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-800">{comp.name}</p>
                    <p className="text-[10px] text-slate-500">
                      Required: {comp.required}%
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Before</span>
                      <span className="font-bold text-slate-700">{beforeVal}%</span>
                    </div>

                    <span className="text-slate-300 font-bold">&rarr;</span>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">After</span>
                      <span className="font-bold text-slate-900">{afterVal}%</span>
                    </div>

                    <div className="w-16 text-right">
                      <span
                        className={`font-black px-2 py-0.5 rounded-full ${
                          delta > 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {delta > 0 ? `+${delta}%` : "0%"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Updated Radar Chart (Before vs After overlay) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Updated Competency Radar Profile
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Green perimeter displays post-learning capability gains across all 6 competencies.
            </p>
          </div>

          <div className="min-h-[340px] flex items-center justify-center">
            <RadarChartView
              competencies={competencies}
              showRequired={true}
              showReAssessed={true}
              height={340}
            />
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
            <strong className="font-bold">Continuous Loop Impact:</strong> Krishna Patel has closed the Survey Design gap by <strong className="font-bold">28 percentage points</strong>, moving from Critical Gap status to within 2% of the Ministry benchmark.
          </div>
        </div>
      </div>
    </div>
  );
}
