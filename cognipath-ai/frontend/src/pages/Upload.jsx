import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { useStudent } from "../App.jsx";

export default function Upload() {
  const { student, documents, addDocument, addDocuments, removeDocument } = useStudent();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadResults, setUploadResults] = useState(null);

  if (!student) {
    return (
      <Notice>
        Create a student profile first.{" "}
        <a href="/" className="text-trail underline">Go to Profile</a>
      </Notice>
    );
  }

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setError(null);
    setUploadResults(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) return;
    setLoading(true);
    setError(null);
    setUploadResults(null);

    try {
      if (files.length === 1) {
        // Single file upload
        const result = await api.uploadDocument(student.student_id, student.target_subject, files[0]);
        addDocument(result);
        setUploadResults({ uploaded: [result], errors: [] });
      } else {
        // Multi-file upload
        const result = await api.uploadMultipleDocuments(
          student.student_id,
          student.target_subject,
          files
        );
        if (result.uploaded && result.uploaded.length > 0) {
          addDocuments(result.uploaded);
        }
        setUploadResults(result);
      }
      setFiles([]);
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Collect all unique topics across all documents
  const allTopics = [...new Set(documents.flatMap((d) => d.topics_detected || []))];

  return (
    <div>
      <h2 className="text-3xl mb-2">Upload your learning material</h2>
      <p className="text-mist mb-8 max-w-lg">
        Upload multiple PDF, TXT or Markdown files. CogniPath extracts the text, splits it into
        topic-coherent chunks, embeds them, and detects which topics your material covers.
      </p>

      <form onSubmit={handleUpload} className="max-w-lg space-y-4">
        <label className="block border border-dashed border-contour bg-inkLight px-6 py-10 text-center cursor-pointer hover:border-trail transition">
          <input
            type="file"
            accept=".pdf,.txt,.md"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-sm text-parchment">
            {files.length > 0
              ? `${files.length} file${files.length > 1 ? "s" : ""} selected: ${files.map((f) => f.name).join(", ")}`
              : "Click to choose files (multiple allowed)"}
          </p>
          <p className="text-xs text-mist mt-1">PDF, TXT, or MD &mdash; select one or more files</p>
        </label>

        {error && <p className="text-rust text-sm">{error}</p>}

        {uploadResults && uploadResults.errors && uploadResults.errors.length > 0 && (
          <div className="text-sm space-y-1">
            {uploadResults.errors.map((err, i) => (
              <p key={i} className="text-rust">
                ⚠ {err.filename}: {err.error}
              </p>
            ))}
          </div>
        )}

        {uploadResults && uploadResults.uploaded && uploadResults.uploaded.length > 0 && (
          <p className="text-sm text-emerald-400">
            ✓ Successfully uploaded {uploadResults.uploaded.length} file
            {uploadResults.uploaded.length > 1 ? "s" : ""}
          </p>
        )}

        <button
          type="submit"
          disabled={!files.length || loading}
          className="bg-trail text-ink px-5 py-2 text-sm font-medium hover:brightness-110 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : `Extract & analyze${files.length > 1 ? ` (${files.length} files)` : ""}`}
        </button>
      </form>

      {/* List of all uploaded documents */}
      {documents.length > 0 && (
        <div className="mt-8 max-w-lg space-y-3">
          <h3 className="text-lg font-display text-parchment mb-2">
            Uploaded Documents ({documents.length})
          </h3>

          {documents.map((doc) => (
            <div
              key={doc.document_id}
              className="border border-contour bg-inkLight p-4 flex items-start justify-between"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-parchment truncate">{doc.filename}</p>
                <p className="text-xs text-mist mt-1">
                  {doc.chunk_count} chunks extracted
                </p>
                {doc.topics_detected && doc.topics_detected.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {doc.topics_detected.map((t) => (
                      <span
                        key={t}
                        className="text-xs border border-trail text-trail px-2 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeDocument(doc.document_id)}
                className="ml-3 text-xs text-mist hover:text-rust transition flex-shrink-0"
                title="Remove from list"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Combined topics summary */}
          {allTopics.length > 0 && (
            <div className="border border-contour bg-inkLight p-4 mt-4">
              <p className="text-xs text-mist mb-2">
                All topics across {documents.length} document{documents.length > 1 ? "s" : ""}:
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {allTopics.map((t) => (
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
      )}
    </div>
  );
}

function Notice({ children }) {
  return <div className="border border-contour bg-inkLight p-6 text-sm text-mist">{children}</div>;
}
