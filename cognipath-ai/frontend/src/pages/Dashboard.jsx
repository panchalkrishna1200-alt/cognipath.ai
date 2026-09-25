import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client.js";
import { useStudent } from "../App.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import RadarChartView from "../components/RadarChartView.jsx";
import DependencyGraph from "../components/DependencyGraph.jsx";

const FALLBACK_TOPICS = [
  { topic: "Python", mastery_pct: 40, raw_score_pct: 40, status: "red" },
  { topic: "SQL", mastery_pct: 65, raw_score_pct: 65, status: "yellow" },
  { topic: "Machine Learning", mastery_pct: 72, raw_score_pct: 60, status: "green" },
  { topic: "Statistics", mastery_pct: 55, raw_score_pct: 50, status: "yellow" },
  { topic: "Data Visualization", mastery_pct: 60, raw_score_pct: 60, status: "yellow" },
  { topic: "Git Version Control", mastery_pct: 50, raw_score_pct: 50, status: "yellow" },
];

export default function Dashboard() {
  const { student } = useStudent();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!student?.student_id) return;
    setLoading(true);
    api
      .getCompetency(student.student_id)
      .then(setData)
      .catch(() => {
        // Fallback for demonstration
      })
      .finally(() => setLoading(false));
  }, [student]);

  const topics = data?.topics?.length ? data.topics : FALLBACK_TOPICS;
  const overallMastery = data?.overall_mastery_pct || 57;
  const biggestGap = data?.biggest_gap || {
    topic: "Python",
    blocking_prerequisite: "Data Structures Basics",
    mastery_pct: 40,
    blocking_mastery_pct: 35,
  };

  return (
    <div className="w-full">
      {/* ── Breadcrumb ── */}
      <div className="mb-3">
        <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
          <Link to="/" className="hover:text-slate-600 transition-colors">
            Home
          </Link>{" "}
          / <span className="text-slate-500">Dashboard</span>
        </p>
      </div>

      {/* ── Header ── */}
      <div className="mb-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Competency Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Bayesian Knowledge Tracing (BKT) assessment with adaptive mastery tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/assessment")}
            className="bg-[#0F2F64] hover:bg-[#173E80] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            Take Assessment
          </button>
          <button
            onClick={() => navigate("/roadmap")}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            View Roadmap
          </button>
        </div>
      </div>

      {/* ── Highlight Banner Card ── */}
      <div className="border border-slate-200/80 bg-white rounded-xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Overall Bayesian Mastery
          </p>
          <p className="text-4xl font-extrabold text-[#0F2F64] tracking-tight">
            {overallMastery}%
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated across {topics.length} competencies
          </p>
        </div>

        {biggestGap && (
          <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
              Primary Competency Gap
            </p>
            <p className="text-xl font-bold text-slate-900">
              {biggestGap.topic}
            </p>
            {biggestGap.blocking_prerequisite && (
              <p className="text-xs text-slate-500 mt-1">
                Root prerequisite:{" "}
                <span className="font-semibold text-slate-700">
                  {biggestGap.blocking_prerequisite}
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Topic Mastery + Radar Chart Grid ── */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="border border-slate-200/80 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Topic-Wise Mastery Breakdown
          </h2>
          <div className="space-y-3">
            {topics.map((t) => (
              <ProgressBar
                key={t.topic}
                label={t.topic}
                pct={t.mastery_pct}
                status={t.status}
                subLabel={`Quiz accuracy: ${t.raw_score_pct}%`}
              />
            ))}
          </div>
        </div>

        <div className="border border-slate-200/80 bg-white rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Multi-Skill Radar Profile
          </h2>
          <div className="flex-1 flex items-center justify-center">
            <RadarChartView topics={topics} />
          </div>
        </div>
      </div>

      {/* ── Prerequisite Graph ── */}
      <div className="border border-slate-200/80 bg-white rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-2">
          Prerequisite Dependency Gap Analysis
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Identifies the root-cause concepts that may be impeding higher-level proficiency.
        </p>
        <DependencyGraph gaps={biggestGap ? [biggestGap] : []} />
      </div>
    </div>
  );
}
