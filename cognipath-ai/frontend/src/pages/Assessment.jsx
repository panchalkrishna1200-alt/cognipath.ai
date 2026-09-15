import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useStudent } from "../App.jsx";

export default function Assessment() {
  const { student, documents, assessment, setAssessment } = useStudent();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!student || !documents || documents.length === 0) {
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
        document_ids: documents.map((d) => d.document_id),
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

  // Check if all questions are answered
  const allAnswered = assessment
    ? assessment.questions.every((q, i) => {
        const answer = answers[i];
        if (q.type === "short_answer") {
          return typeof answer === "string" && answer.trim().length > 0;
        }
        return answer !== undefined && answer !== null;
      })
    : false;

  return (
    <div>
      <h2 className="text-3xl mb-2">Diagnostic assessment</h2>
      <p className="text-mist mb-4 max-w-lg">
        Questions are generated from your uploaded material and span different levels of
        understanding — including multiple-choice and short-answer questions.
      </p>

      {documents.length > 0 && (
        <p className="text-xs text-mist mb-6">
          Drawing from {documents.length} document{documents.length > 1 ? "s" : ""}:{" "}
          {documents.map((d) => d.filename).join(", ")}
        </p>
      )}

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
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-trail uppercase tracking-wide">
                  {q.topic} &middot; {q.bloom_level}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 border ${
                    q.type === "short_answer"
                      ? "border-amber-400 text-amber-400"
                      : "border-sky-400 text-sky-400"
                  }`}
                >
                  {q.type === "short_answer" ? "Q&A" : "MCQ"}
                </span>
              </div>
              <p className="text-sm text-parchment mb-3">{q.question}</p>

              {/* MCQ options */}
              {(q.type === "mcq" || (!q.type && q.options)) && q.options && Array.isArray(q.options) && q.options.length > 0 && (
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
              )}

              {/* MCQ with missing options - show error */}
              {q.type === "mcq" && (!q.options || !Array.isArray(q.options) || q.options.length === 0) && (
                <p className="text-xs text-rust">Options failed to load for this question. Please regenerate the assessment.</p>
              )}

              {/* Short answer textarea */}
              {q.type === "short_answer" && (
                <textarea
                  className="w-full border border-contour bg-ink text-parchment text-sm px-3 py-2 mt-1 min-h-[80px] resize-y focus:border-trail focus:outline-none transition"
                  placeholder="Type your answer here..."
                  value={answers[i] || ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [i]: e.target.value })
                  }
                />
              )}
            </div>
          ))}

          <button
            onClick={submit}
            disabled={loading || !allAnswered}
            className="bg-trail text-ink px-5 py-2 text-sm font-medium hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "Grading..." : "Submit assessment"}
          </button>

          {!allAnswered && (
            <p className="text-xs text-mist">
              Answer all {assessment.questions.length} questions to submit.
            </p>
          )}
        </div>
      )}

      {result && (
        <div className="max-w-2xl mt-6 space-y-6">
          {/* Score summary */}
          <div className="border border-contour bg-inkLight p-5 space-y-4">
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
          </div>

          {/* Q&A feedback section */}
          {result.qa_feedback && result.qa_feedback.length > 0 && (
            <div className="border border-contour bg-inkLight p-5 space-y-4">
              <h3 className="text-sm font-display text-parchment">
                Short Answer Feedback
              </h3>
              {result.qa_feedback.map((fb, i) => (
                <div
                  key={i}
                  className={`border-l-2 pl-3 py-2 ${
                    fb.correct ? "border-emerald-400" : "border-rust"
                  }`}
                >
                  <p className="text-xs text-mist mb-1">{fb.topic}</p>
                  <p className="text-sm text-parchment mb-2">{fb.question}</p>
                  <p className="text-xs text-mist">
                    <span className="text-parchment">Your answer:</span>{" "}
                    {fb.student_answer || "(empty)"}
                  </p>
                  <p className="text-xs text-mist">
                    <span className="text-parchment">Reference:</span>{" "}
                    {fb.reference_answer}
                  </p>
                  {fb.feedback && (
                    <p
                      className={`text-xs mt-1 ${
                        fb.correct ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {fb.feedback}
                    </p>
                  )}
                  <p className="text-xs text-mist mt-1">
                    Score: {Math.round((fb.score || 0) * 100)}%
                  </p>
                </div>
              ))}
            </div>
          )}

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
