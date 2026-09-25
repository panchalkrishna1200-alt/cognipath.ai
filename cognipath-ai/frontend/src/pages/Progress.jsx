import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStudent } from "../App.jsx";
import { api } from "../api/client.js";

// Baseline benchmark skills matching SamarthSetu reference
const DEFAULT_SKILLS = [
  {
    name: "Python",
    category: "Programming and data processing",
    current: 40,
    baseline: 40,
    improvement: 0,
  },
  {
    name: "SQL",
    category: "Database querying and management",
    current: 65,
    baseline: 65,
    improvement: 0,
  },
  {
    name: "Machine Learning",
    category: "Supervised and unsupervised algorithms",
    current: 72,
    baseline: 60,
    improvement: 12,
  },
  {
    name: "Statistics & Probability",
    category: "Hypothesis testing, distributions and inference",
    current: 55,
    baseline: 50,
    improvement: 5,
  },
  {
    name: "Data Visualization",
    category: "Exploratory analytics and dashboard design",
    current: 60,
    baseline: 60,
    improvement: 0,
  },
  {
    name: "Git & Version Control",
    category: "Collaboration and repository management",
    current: 50,
    baseline: 50,
    improvement: 0,
  },
];

export default function Progress() {
  const { student } = useStudent();
  const [competencyData, setCompetencyData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student?.student_id) {
      setLoading(true);
      api
        .getCompetency(student.student_id)
        .then((res) => setCompetencyData(res))
        .catch(() => {
          // Backend offline or empty profile: fallback gracefully to defaults
        })
        .finally(() => setLoading(false));
    }
  }, [student]);

  // Merge real assessment data if available
  const skills = competencyData?.topics?.length
    ? competencyData.topics.map((t, idx) => {
        const currentScore = Math.round(t.mastery_pct || t.raw_score_pct || 40);
        const baselineScore = Math.round(t.raw_score_pct || 40);
        const imp = currentScore - baselineScore;
        return {
          name: t.topic,
          category: t.category || "Applied Domain Competency",
          current: currentScore,
          baseline: baselineScore,
          improvement: imp >= 0 ? imp : 0,
        };
      })
    : DEFAULT_SKILLS;

  // Compute aggregated stats
  const averageProficiency = skills.length
    ? Math.round(skills.reduce((acc, s) => acc + s.current, 0) / skills.length)
    : 57;

  const completedTrainingCount = 17;
  const skillsTrackedCount = skills.length || 6;

  return (
    <div className="w-full">
      {/* ── Breadcrumb ── */}
      <div className="mb-3">
        <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
          <Link to="/" className="hover:text-slate-600 transition-colors">
            Home
          </Link>{" "}
          / <span className="text-slate-500">Progress</span>
        </p>
      </div>

      {/* ── Page Header ── */}
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Learning Progress
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track competency development and completed training.
        </p>
      </div>

      {/* ── 3 Metric / KPI Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Average Current Proficiency */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
          <p className="text-xs font-medium text-slate-500">
            Average Current Proficiency
          </p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1.5 tabular-nums">
            {averageProficiency}%
          </p>
        </div>

        {/* Card 2: Completed Training */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-xs font-medium text-slate-500">
            Completed Training
          </p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1.5 tabular-nums">
            {completedTrainingCount}
          </p>
        </div>

        {/* Card 3: Skills Tracked */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <p className="text-xs font-medium text-slate-500">
            Skills Tracked
          </p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1.5 tabular-nums">
            {skillsTrackedCount}
          </p>
        </div>
      </div>

      {/* ── Competency Development Main Card ── */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 sm:p-8 shadow-sm">
        {/* Card Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            Competency Development
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Baseline compared with current proficiency
          </p>
        </div>

        {/* Competencies List */}
        <div className="divide-y divide-slate-100">
          {skills.map((skill, index) => (
            <div
              key={skill.name || index}
              className={`py-5 ${index === 0 ? "pt-0" : ""}`}
            >
              {/* Skill Top Meta: Title & Improvement tag */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {skill.category}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-500">
                    Improvement:{" "}
                    <span
                      className={
                        skill.improvement > 0
                          ? "font-semibold text-emerald-600"
                          : "text-slate-600"
                      }
                    >
                      {skill.improvement > 0
                        ? `+${skill.improvement}%`
                        : `${skill.improvement}%`}
                    </span>
                  </span>
                </div>
              </div>

              {/* Progress Bar Row */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Current: {skill.current}%</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 h-2.5 overflow-hidden rounded-none">
                    <div
                      className="bg-[#0F2F64] h-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.max(2, Math.min(100, skill.current))}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800 tabular-nums min-w-[32px] text-right">
                    {skill.current}%
                  </span>
                </div>

                {/* Baseline Note */}
                <p className="text-xs text-slate-400 mt-2">
                  Baseline proficiency: {skill.baseline}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action button below */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Need to evaluate recent progress? Take a diagnostic quiz or refresh your baseline.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/assessment"
              className="bg-[#0F2F64] hover:bg-[#173E80] text-white px-5 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Take Assessment &rarr;
            </Link>
            <Link
              to="/dashboard"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 text-xs font-semibold rounded-lg transition-colors"
            >
              View Gap Analysis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
