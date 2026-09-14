import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useStudent } from "../App.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import RadarChartView from "../components/RadarChartView.jsx";
import DependencyGraph from "../components/DependencyGraph.jsx";

export default function Dashboard() {
  const { student } = useStudent();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!student) return;
    api.getCompetency(student.student_id).then(setData).catch((e) => setError(e.message));
  }, [student]);

  if (!student) {
    return (
      <Notice>
        Create a profile first. <a href="/" className="text-trail underline">Go to Profile</a>
      </Notice>
    );
  }

  if (error) return <Notice>{error}</Notice>;
  if (!data) return <Notice>Loading competency data...</Notice>;

  if (!data.topics.length) {
    return (
      <Notice>
        No assessments taken yet.{" "}
        <a href="/assessment" className="text-trail underline">Take the diagnostic assessment</a>
      </Notice>
    );
  }

  return (
    <div>
      <h2 className="text-3xl mb-2">Your competency</h2>
      <p className="text-mist mb-8 max-w-lg">
        Mastery is a Bayesian estimate that accounts for lucky guesses and careless slips -
        not just raw quiz accuracy.
      </p>

      <div className="border border-contour bg-inkLight p-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs text-mist mb-1">Overall mastery</p>
          <p className="text-4xl font-display text-trail">{data.overall_mastery_pct}%</p>
        </div>
        {data.biggest_gap && (
          <div className="text-right">
            <p className="text-xs text-mist mb-1">Biggest gap</p>
            <p className="text-lg text-rust">{data.biggest_gap.topic}</p>
            {data.biggest_gap.blocking_prerequisite !== data.biggest_gap.topic && (
              <p className="text-xs text-mist mt-1">
                Root cause: {data.biggest_gap.blocking_prerequisite}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg mb-4">Topic-wise mastery</h3>
          {data.topics.map((t) => (
            <ProgressBar
              key={t.topic}
              label={t.topic}
              pct={t.mastery_pct}
              status={t.status}
              subLabel={`quiz ${t.raw_score_pct}%`}
            />
          ))}
        </div>
        <div>
          <h3 className="text-lg mb-4">Radar view</h3>
          <RadarChartView topics={data.topics} />
        </div>
      </div>

      <h3 className="text-lg mb-4">Prerequisite gap analysis</h3>
      <DependencyGraph gaps={data.biggest_gap ? [data.biggest_gap] : []} />

      <button
        onClick={() => navigate("/roadmap")}
        className="mt-8 bg-trail text-ink px-5 py-2 text-sm font-medium hover:brightness-110 transition"
      >
        Generate my roadmap &rarr;
      </button>
    </div>
  );
}

function Notice({ children }) {
  return <div className="border border-contour bg-inkLight p-6 text-sm text-mist">{children}</div>;
}
