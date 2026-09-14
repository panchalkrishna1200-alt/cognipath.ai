import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { useStudent } from "../App.jsx";

export default function Roadmap() {
  const { student } = useStudent();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const existing = await api.getLatestRoadmap(student.student_id);
      setRoadmap(existing);
    } catch {
      // no roadmap yet - that's fine, user generates one below
    }
  };

  useEffect(() => {
    if (student) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student]);

  if (!student) {
    return (
      <Notice>
        Create a profile first. <a href="/" className="text-trail underline">Go to Profile</a>
      </Notice>
    );
  }

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.generateRoadmap(student.student_id, 4);
      setRoadmap(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl mb-2">Your adaptive roadmap</h2>
      <p className="text-mist mb-8 max-w-lg">
        Built from your current gaps, weakest prerequisite first. Regenerate any time after a
        reassessment - the plan reshuffles as your mastery changes.
      </p>

      <button
        onClick={generate}
        disabled={loading}
        className="bg-trail text-ink px-5 py-2 text-sm font-medium hover:brightness-110 transition disabled:opacity-50 mb-8"
      >
        {loading
          ? "Building roadmap..."
          : roadmap
          ? "Regenerate roadmap"
          : "Generate my roadmap"}
      </button>

      {error && <p className="text-rust text-sm mb-4">{error}</p>}

      {roadmap && roadmap.message && (
        <Notice>{roadmap.message}</Notice>
      )}

      {roadmap && roadmap.weeks && roadmap.weeks.length > 0 && (
        <div className="relative pl-6 border-l border-contour space-y-8 max-w-2xl">
          {roadmap.weeks.map((week) => (
            <div key={week.week} className="relative">
              <span className="absolute -left-[31px] top-1 w-3 h-3 bg-trail" />
              <p className="text-xs text-mist mb-2 uppercase tracking-wide">Week {week.week}</p>
              <div className="space-y-3">
                {week.topics.map((t) => (
                  <div key={t.topic} className="border border-contour bg-inkLight p-4">
                    <p className="text-sm text-parchment mb-2">{t.topic}</p>
                    <ul className="space-y-1">
                      {t.items.map((item, i) => (
                        <li key={i} className="text-xs text-mist flex gap-2">
                          <span className="text-trail">&middot;</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {roadmap && roadmap.gap_summary && roadmap.gap_summary.length > 0 && (
        <div className="mt-10 max-w-2xl">
          <h3 className="text-lg mb-3">Why this order</h3>
          <div className="space-y-2">
            {roadmap.gap_summary.map((g) => (
              <p key={g.topic} className="text-xs text-mist">
                <span className="text-parchment">{g.topic}</span> ({g.mastery_pct}% mastery) is
                blocked by{" "}
                <span className="text-parchment">{g.blocking_prerequisite}</span> (
                {g.blocking_mastery_pct}% mastery) - so that's studied first.
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Notice({ children }) {
  return <div className="border border-contour bg-inkLight p-6 text-sm text-mist">{children}</div>;
}
