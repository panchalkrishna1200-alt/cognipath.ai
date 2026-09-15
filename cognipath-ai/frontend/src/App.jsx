import { createContext, useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Profile from "./pages/Profile.jsx";
import Upload from "./pages/Upload.jsx";
import Assessment from "./pages/Assessment.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Roadmap from "./pages/Roadmap.jsx";

// Minimal shared state (no Redux needed for a single-student demo flow):
// student id + active documents flow through this context so pages don't
// need prop-drilling through the router.
const StudentContext = createContext(null);
export const useStudent = () => useContext(StudentContext);

export default function App() {
  const [student, setStudent] = useState(null);           // { student_id, name, ... }
  const [documents, setDocuments] = useState([]);          // [{ document_id, topics_detected, ... }, ...]
  const [assessment, setAssessment] = useState(null);      // { assessment_id, questions }

  // Helper: add a newly uploaded document to the list
  const addDocument = (doc) => {
    setDocuments((prev) => {
      // Avoid duplicates by document_id
      const exists = prev.some((d) => d.document_id === doc.document_id);
      return exists ? prev : [...prev, doc];
    });
  };

  // Helper: add multiple documents at once
  const addDocuments = (docs) => {
    setDocuments((prev) => {
      const existingIds = new Set(prev.map((d) => d.document_id));
      const newDocs = docs.filter((d) => !existingIds.has(d.document_id));
      return [...prev, ...newDocs];
    });
  };

  // Helper: remove a document from the list
  const removeDocument = (documentId) => {
    setDocuments((prev) => prev.filter((d) => d.document_id !== documentId));
  };

  return (
    <StudentContext.Provider
      value={{
        student, setStudent,
        documents, setDocuments, addDocument, addDocuments, removeDocument,
        assessment, setAssessment,
      }}
    >
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
        </Route>
      </Routes>
    </StudentContext.Provider>
  );
}
