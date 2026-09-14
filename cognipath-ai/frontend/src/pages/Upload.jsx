import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useStudent } from "../App.jsx";

export default function Upload() {
  const { student, document, setDocument } = useStudent();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!student) {
    return (
      <Notice>
        Create a student profile first.{" "}
        <a href="/" className="text-trail underline">Go to Profile</a>
      </Notice>
    );
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.uploadDocument(student.student_id, student.target_subject, file);
      setDocument(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl mb-2">Upload your learning material</h2>
      <p className="text-mist mb-8 max-w-lg">
        PDF, TXT or Markdown notes. CogniPath extracts the text, splits it into topic-coherent
        chunks, embeds them, and detects which topics your material actually covers.
      </p>

      <form onSubmit={handleUpload} className="max-w-lg space-y-4">
        <label className="block border border-dashed border-contour bg-inkLight px-6 py-10 text-center cursor-pointer hover:border-trail transition">
          <input
            type="file"
            accept=".pdf,.txt,.md"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-sm text-parchment">
            {file ? file.name : "Click to choose a file"}
          </p>
          <p className="text-xs text-mist mt-1">PDF, TXT, or MD</p>
        </label>

        {error && <p className="text-rust text-sm">{error}</p>}

        <button
          type="submit"
          disabled={!file || loading}
          className="bg-trail text-ink px-5 py-2 text-sm font-medium hover:brightness-110 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Extract & analyze"}
        </button>
      </form>

      {document && (
        <div className="mt-8 max-w-lg border border-contour bg-inkLight p-5">
          <p className="text-sm text-mist mb-2">
            Extracted <span className="text-parchment">{document.chunk_count}</span> content
            chunks from <span className="text-parchment">{document.filename}</span>.
          </p>
          <p className="text-xs text-mist mb-2">Topics detected:</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {document.topics_detected.map((t) => (
              <span key={t} className="text-xs border border-trail text-trail px-2 py-1">
                {t}
              </span>
            ))}
          </div>
          <button
            onClick={() => navigate("/assessment")}
            className="bg-trail text-ink px-5 py-2 text-sm font-medium hover:brightness-110 transition"
          >
            Start diagnostic assessment &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

function Notice({ children }) {
  return <div className="border border-contour bg-inkLight p-6 text-sm text-mist">{children}</div>;
}
