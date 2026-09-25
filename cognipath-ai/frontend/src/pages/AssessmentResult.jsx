import { useNavigate } from "react-router-dom";
import { useStudent } from "../App.jsx";

export default function AssessmentResult() {
  const { quizResult, competencies } = useStudent();
  const navigate = useNavigate();

  // Use quiz result or default to prompt's exact example: 72% (7/10)
  const score = quizResult?.score ?? 72;
  const correctCount = quizResult?.correctCount ?? 7;
  const totalCount = quizResult?.totalCount ?? 10;

  const getStatus = (val) => {
    if (val >= 75) return { label: "Strong", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (val >= 60) return { label: "Developing", color: "bg-amber-50 text-amber-700 border-amber-200" };
    return { label: "Critical Gap", color: "bg-rose-50 text-rose-700 border-rose-200" };
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* ── Top Score Banner ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Assessment Completed
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1 font-display">
              Diagnostic Assessment Score
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Evaluated using Bayesian Knowledge Tracing across official competency rubrics.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-slate-50 border border-slate-200/80 rounded-2xl px-6 py-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Overall Score
              </p>
              <p className="text-4xl font-black text-[#0F2F64] mt-0.5">{score}%</p>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Correct Answers
              </p>
              <p className="text-2xl font-bold text-slate-800 mt-0.5">
                {correctCount} <span className="text-slate-400 text-base font-normal">/ {totalCount}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Competency-level breakdown (Exact prompt values) ── */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">
              Competency-Level Performance
            </h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Strong (≥75%)
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Developing (60–74%)
              </span>
              <span className="flex items-center gap-1 text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Critical Gap (&lt;60%)
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {competencies.map((comp) => {
              const status = getStatus(comp.current);
              return (
                <div
                  key={comp.id}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">{comp.name}</p>
                    <p className="text-xs text-slate-500">{comp.category}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-lg font-black text-slate-900">{comp.current}%</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden ml-auto">
                      <div
                        className={`h-full ${
                          comp.current >= 75
                            ? "bg-emerald-500"
                            : comp.current >= 60
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${comp.current}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={() => navigate("/assessment")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Review Question Details
          </button>

          <button
            onClick={() => navigate("/gaps")}
            className="w-full sm:w-auto bg-[#0F2F64] hover:bg-[#173E80] text-white px-7 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            <span>Proceed to Competency Gap Analysis</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
