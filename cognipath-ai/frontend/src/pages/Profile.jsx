import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useStudent } from "../App.jsx";

const INPUT_CLASS =
  "w-full bg-inkLight border border-contour text-parchment px-3 py-2 text-sm outline-none focus:border-trail";
const BUTTON_CLASS =
  "bg-trail text-ink px-5 py-2 text-sm font-medium hover:brightness-110 transition disabled:opacity-50";

export default function Profile() {
  const { student, setStudent } = useStudent();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    course: "",
    semester: "",
    target_subject: "Machine Learning",
    current_level: "Beginner",
    learning_goal: "Learn Machine Learning from the ground up",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await api.createStudent(form);
      setStudent(result);
      navigate("/upload");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl mb-2">Who's learning today?</h2>
      <p className="text-mist mb-8 max-w-lg">
        This sets up the goal CogniPath measures everything against - what subject you're
        studying, and where you're starting from.
      </p>

      {student && (
        <div className="mb-6 border border-contour bg-inkLight px-4 py-3 text-sm text-mist">
          Signed in as <span className="text-parchment">{student.name}</span> (student #
          {student.student_id}). Submitting again starts a fresh profile.
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
        <Field label="Name">
          <input
            required
            value={form.name}
            onChange={update("name")}
            className={INPUT_CLASS}
            placeholder="e.g. Aditi Sharma"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Course">
            <input value={form.course} onChange={update("course")} className={INPUT_CLASS} placeholder="B.Tech CSE" />
          </Field>
          <Field label="Semester">
            <input value={form.semester} onChange={update("semester")} className={INPUT_CLASS} placeholder="5th" />
          </Field>
        </div>
        <Field label="Target subject">
          <input value={form.target_subject} onChange={update("target_subject")} className={INPUT_CLASS} />
        </Field>
        <Field label="Current level">
          <select value={form.current_level} onChange={update("current_level")} className={INPUT_CLASS}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </Field>
        <Field label="Learning goal">
          <textarea
            value={form.learning_goal}
            onChange={update("learning_goal")}
            className={INPUT_CLASS}
            rows={2}
          />
        </Field>

        {error && <p className="text-rust text-sm">{error}</p>}

        <button type="submit" disabled={loading} className={BUTTON_CLASS}>
          {loading ? "Creating profile..." : "Start learning journey"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs text-mist mb-1">{label}</span>
      {children}
    </label>
  );
}
