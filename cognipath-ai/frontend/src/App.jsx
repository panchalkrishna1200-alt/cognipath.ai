import { createContext, useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Profile from "./pages/Profile.jsx";
import Upload from "./pages/Upload.jsx";
import Assessment from "./pages/Assessment.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Roadmap from "./pages/Roadmap.jsx";

// Minimal shared state (no Redux needed for a single-student demo flow):
// student id + active document flow through this context so pages don't
// need prop-drilling through the router.
const StudentContext = createContext(null);
export const useStudent = () => useContext(StudentContext);

export default function App() {
  const [student, setStudent] = useState(null);       // { student_id, name, ... }
  const [document, setDocument] = useState(null);      // { document_id, topics_detected, ... }
  const [assessment, setAssessment] = useState(null);  // { assessment_id, questions }

  return (
    <StudentContext.Provider
      value={{ student, setStudent, document, setDocument, assessment, setAssessment }}
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
