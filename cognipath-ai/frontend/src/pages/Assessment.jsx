import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useStudent } from "../App.jsx";

export default function Assessment() {
  const { student, document, assessment, setAssessment } = useStudent();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!student || !document) {
    return (
      <Notice>
        Upload learning material first.{" "}
        <a href="/upload" className="text-trail underline">Go to Upload</a>
      </Notice>
    );
  }

  const startAssessment = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setAnswers({});
    try {
      const gen = await api.generateAssessment({
        student_id: student.student_id,
        document_id: document.document_id,
        questions_per_topic: 3,
      });
      setAssessment(gen);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.submitAssessment({
        assessment_id: assessment.assessment_id,
        answers,
      });
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl mb-2">Diagnostic assessment</h2>
      <p className="text-mist mb-8 max-w-lg">
        Questions are generated from your own material and span different levels of
        understanding, not just recall.
      </p>

      {!assessment && (
        <button
          onClick={startAssessment}
          disabled={loading}
          className="bg-trail text-ink px-5 py-2 text-sm font-medium hover:brightness-110 transition disabled:opacity-50"
        >
          {loading ? "Generating questions..." : "Generate diagnostic assessment"}
        </button>
      )}

      {error && <p className="text-rust text-sm mt-4">{error}</p>}

      {assessment && !result && (
        <div className="space-y-6 max-w-2xl mt-6">
          {assessment.questions.map((q, i) => (
            <div key={i} className="border border-contour bg-inkLight p-5">
              <p className="text-xs text-trail mb-1 uppercase tracking-wide">
                {q.topic} &middot; {q.bloom_level}
              </p>
              <p className="text-sm text-parchment mb-3">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`block px-3 py-2 border cursor-pointer text-sm ${
                      answers[i] === oi
                        ? "border-trail bg-ink text-parchment"
                        : "border-contour text-mist hover:border-trail"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${i}`}
                      className="hidden"
                      checked={answers[i] === oi}
                      onChange={() => setAnswers({ ...answers, [i]: oi })}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={submit}
            disabled={loading || Object.keys(answers).length < assessment.questions.length}
            className="bg-trail text-ink px-5 py-2 text-sm font-medium hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "Grading..." : "Submit assessment"}
          </button>
        </div>
      )}

      {result && (
        <div className="max-w-lg mt-6 border border-contour bg-inkLight p-5 space-y-4">
          <p className="text-lg font-display">
            Score: {result.score}/{result.total}
          </p>
          <div className="space-y-2">
            {Object.entries(result.topic_breakdown).map(([topic, stats]) => (
              <div key={topic} className="flex justify-between text-sm">
                <span className="text-parchment">{topic}</span>
                <span className="text-mist">
                  {stats.correct}/{stats.total} correct &middot; mastery{" "}
                  {result.updated_mastery[topic]}%
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-trail text-ink px-5 py-2 text-sm font-medium hover:brightness-110 transition"
          >
            See competency gap analysis &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

function Notice({ children }) {
  return <div className="border border-contour bg-inkLight p-6 text-sm text-mist">{children}</div>;
}
