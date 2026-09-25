import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { useStudent } from "../App.jsx";

const DEFAULT_WEEKS = [
  {
    week: 1,
    topics: [
      {
        topic: "Data Structures & Python Fundamentals",
        items: [
          "Tuples, Dictionaries, List Comprehensions, and Functional Iteration",
          "Working with tabular datasets in Pandas and NumPy arrays",
        ],
      },
    ],
  },
  {
    week: 2,
    topics: [
      {
        topic: "Relational Queries & SQL Aggregations",
        items: [
          "Window functions, Subqueries, and Complex Joins",
          "Data cleaning, normalization, and indexing strategies",
        ],
      },
    ],
  },
  {
    week: 3,
    topics: [
      {
        topic: "Statistical Foundations & Inference",
        items: [
          "Probability distributions, Confidence Intervals, and p-value interpretations",
          "Hypothesis testing and A/B test formulation",
        ],
      },
    ],
  },
  {
    week: 4,
    topics: [
      {
        topic: "Applied Machine Learning Models",
        items: [
          "Supervised classification & regression algorithms",
          "Cross-validation, bias-variance tradeoff, and AUC-ROC evaluation metrics",
        ],
      },
    ],
  },
];

export default function Roadmap() {
  const { student } = useStudent();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const existing = await api.getLatestRoadmap(student?.student_id || 1);
      if (existing?.weeks?.length) setRoadmap(existing);
    } catch {
      // Keep default structured roadmap
    }
  };

  useEffect(() => {
    load();
  }, [student]);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.generateRoadmap(student?.student_id || 1, 4);
      setRoadmap(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const weeks = roadmap?.weeks?.length ? roadmap.weeks : DEFAULT_WEEKS;

  return (
    <div className="w-full max-w-4xl">
      {/* ── Breadcrumb ── */}
      <div className="mb-3">
        <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
          <Link to="/" className="hover:text-slate-600 transition-colors">
            Home
          </Link>{" "}
          / <span className="text-slate-500">Adaptive Roadmap</span>
        </p>
      </div>

      {/* ── Header ── */}
      <div className="mb-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Adaptive Learning Roadmap
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Prioritizes foundational gaps and weakest prerequisites first so you progress efficiently.
          </p>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="bg-[#0F2F64] hover:bg-[#173E80] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm disabled:opacity-50 shrink-0"
        >
          {loading ? "Synthesizing Roadmap..." : "Regenerate Path"}
        </button>
      </div>

      {error && <p className="text-rose-600 text-sm mb-4">{error}</p>}

      {/* Roadmap Timeline */}
      <div className="border border-slate-200/80 bg-white rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-200 space-y-8">
          {weeks.map((week) => (
            <div key={week.week} className="relative">
              {/* Bullet Node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-0.5 w-4 h-4 rounded-full bg-[#0F2F64] border-2 border-white shadow" />

              <div className="mb-2">
                <span className="text-xs font-bold text-[#0F2F64] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded">
                  Phase &bull; Week {week.week}
                </span>
              </div>

              <div className="space-y-3 mt-3">
                {week.topics.map((t) => (
                  <div
                    key={t.topic}
                    className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all shadow-none hover:shadow-sm"
                  >
                    <p className="text-sm font-bold text-slate-900 mb-2">
                      {t.topic}
                    </p>
                    <ul className="space-y-1.5">
                      {t.items.map((item, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="text-blue-600 font-bold mt-0.5">&bull;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
