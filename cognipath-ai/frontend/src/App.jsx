import { createContext, useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Upload from "./pages/Upload.jsx";
import Assessment from "./pages/Assessment.jsx";
import AssessmentResult from "./pages/AssessmentResult.jsx";
import CompetencyGap from "./pages/CompetencyGap.jsx";
import LearningPath from "./pages/LearningPath.jsx";
import ReAssessment from "./pages/ReAssessment.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import TrainingRoiDashboard from "./pages/TrainingRoiDashboard.jsx";
import CareerPathGenerator from "./pages/CareerPathGenerator.jsx";
import StudentTrack from "./pages/StudentTrack.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import LandingPage from "./pages/LandingPage.jsx";

const StudentContext = createContext(null);
export const useStudent = () => useContext(StudentContext);

// ── FRAC Competency Framework: BDF (Behavioural · Domain · Functional) ──
// Source: Capacity Building Commission, Mission Karmayogi (cbc.gov.in)
// Three categories ONLY. Subject tags layered under Domain/Functional — NOT separate categories.
const INITIAL_COMPETENCIES = [
  // ══ DOMAIN — MoSPI subject-matter expertise ══
  { id: "sampling_theory", name: "Sampling Theory and Survey Design", category: "Domain", subject_tag: "Sampling Theory", bloom_level: "Apply", evidence_source: "SELF", current: 50, required: 80, gap: 30, status: "Critical Gap", reAssessed: 78, missing: ["Stratified multistage cluster design","Probability proportional to size (PPS) sampling","Survey methodology and sample size determination","Non-sampling error mitigation"], diagnosis: "Critical gap in core MoSPI domain competency. Struggles with multi-stage stratified clustering and PPS variance weights.", recommendedAction: "Enroll in Sampling Methods on iGOT Karmayogi and complete HSD-specific field training." },
  { id: "national_accounts", name: "National Accounts Statistics (NAS)", category: "Domain", subject_tag: "National Accounts", bloom_level: "Analyse", evidence_source: "SELF", current: 55, required: 75, gap: 20, status: "Critical Gap", reAssessed: 70, missing: ["GDP estimation and supply-use tables","Sectoral accounts compilation methodology","Price deflation and chain-linking","SNA 2008 compliance"], diagnosis: "Needs structured training on NAS compilation methodology and SNA 2008 alignment.", recommendedAction: "Enroll in National Accounts Statistics TPAC module at NSSTA (NAD cadre mandatory)." },
  { id: "price_statistics", name: "Price Statistics and Index Numbers", category: "Domain", subject_tag: "Price Statistics", bloom_level: "Apply", evidence_source: "SELF", current: 65, required: 75, gap: 10, status: "Developing", reAssessed: 74, missing: ["CPI/WPI compilation methodology","Laspeyres vs. Paasche index construction","Seasonal adjustment techniques"], diagnosis: "Foundational understanding present; gaps in index construction and seasonal adjustment for PSD workflows.", recommendedAction: "Complete Price Statistics and CPI/WPI TPAC module (18 hrs)." },
  { id: "field_data_collection", name: "Field Data Collection and CAPI", category: "Domain", subject_tag: "Field Operations", bloom_level: "Apply", evidence_source: "SUPERVISOR", current: 90, required: 75, gap: 0, status: "Strong", reAssessed: 90, missing: [], diagnosis: "High proficiency in CAPI field operations, respondent verification, and primary data capture protocols (NSS rounds).", recommendedAction: "Maintain proficiency; eligible to mentor junior field enumerators in FOD." },
  // ══ FUNCTIONAL — role-execution skills ══
  { id: "statistical_analysis", name: "Statistical Analysis and Inference", category: "Functional", subject_tag: "Data Analysis", bloom_level: "Analyse", evidence_source: "QUIZ", current: 70, required: 75, gap: 5, status: "Developing", reAssessed: 75, missing: ["Multivariate regression diagnostics","Time-series seasonal decomposition","Standard error propagation in complex samples"], diagnosis: "Good grasp of descriptive summary indicators; minor gap in econometric adjustment.", recommendedAction: "Complete Applied Statistical Inference module on iGOT Karmayogi." },
  { id: "r_programming", name: "R Programming for Statistics", category: "Functional", subject_tag: "Survey Programming", bloom_level: "Apply", evidence_source: "AI_INFERRED", current: 45, required: 70, gap: 25, status: "Critical Gap", reAssessed: 65, missing: ["Data manipulation with tidyverse","Survey data analysis (srvyr package)","Statistical modelling in R","Automated report generation (R Markdown)"], diagnosis: "Limited exposure to R; foundational skills required for MoSPI data analysis workflows.", recommendedAction: "Complete R Programming for Statistical Analysis TPAC module (35 hrs)." },
  { id: "gis_geospatial", name: "GIS and Geospatial Analysis", category: "Functional", subject_tag: "GIS/Geospatial", bloom_level: "Apply", evidence_source: "SELF", current: 35, required: 60, gap: 25, status: "Critical Gap", reAssessed: 55, missing: ["QGIS for Census enumeration block mapping","Spatial data analysis and choropleth maps","GPS-based field boundary verification"], diagnosis: "GIS skills needed for Census digital mapping and geospatial survey frame maintenance (FOD/HSD).", recommendedAction: "Enroll in GIS and Geospatial Data for Census TPAC module (20 hrs)." },
  { id: "data_governance", name: "Data Governance and DPDP Compliance", category: "Functional", subject_tag: "Data Governance", bloom_level: "Evaluate", evidence_source: "SELF", current: 55, required: 75, gap: 20, status: "Critical Gap", reAssessed: 76, missing: ["National Data Sharing and Accessibility Policy (NDSAP)","Digital Personal Data Protection (DPDP) Act 2023","Microdata anonymization and k-anonymity","Institutional metadata standards (DIID)"], diagnosis: "Lacks familiarity with statutory privacy frameworks and anonymization standards for microdata dissemination.", recommendedAction: "Complete DPDP Act and Data Privacy for Officials TPAC module (mandatory for DIID/NAD officers)." },
  { id: "report_writing", name: "Report Writing and Data Visualization", category: "Functional", subject_tag: "Data Visualization", bloom_level: "Create", evidence_source: "SUPERVISOR", current: 85, required: 80, gap: 0, status: "Strong", reAssessed: 88, missing: [], diagnosis: "Exemplary ability to translate complex tables into executive chart decks and geospatial maps.", recommendedAction: "Maintain mastery; explore advanced PowerBI/D3.js government reporting templates." },
  // ══ BEHAVIOURAL — traits, motives, interpersonal ══
  { id: "stakeholder_communication", name: "Stakeholder Communication and Collaboration", category: "Behavioural", subject_tag: null, bloom_level: null, evidence_source: "SUPERVISOR", current: 72, required: 75, gap: 3, status: "Developing", reAssessed: 76, missing: ["Cross-division coordination (State DES, DRDA)","Communicating statistical findings to non-technical policy audiences"], diagnosis: "Good internal communication; minor gaps in translating statistical outputs for policy audiences.", recommendedAction: "Complete Communicating Statistics to Citizens module on iGOT." },
  { id: "ethical_conduct", name: "Ethical Decision-Making and Integrity", category: "Behavioural", subject_tag: null, bloom_level: null, evidence_source: "SUPERVISOR", current: 88, required: 85, gap: 0, status: "Strong", reAssessed: 88, missing: [], diagnosis: "Demonstrates high adherence to statistical confidentiality norms and conflict-of-interest protocols.", recommendedAction: "Maintain standards; eligible to conduct ethics induction for new entrants." },
  { id: "project_management", name: "Survey Project Management", category: "Behavioural", subject_tag: null, bloom_level: null, evidence_source: "SELF", current: 65, required: 72, gap: 7, status: "Developing", reAssessed: 73, missing: ["Survey project planning and milestone tracking","Budget management for field surveys","Stakeholder coordination across State DES offices"], diagnosis: "Good coordination skills; needs project management frameworks for large-scale NSS rounds.", recommendedAction: "Complete Project Management for Statistical Surveys TPAC module (NSSTA)." },
];

export default function App() {
  const [student, setStudent] = useState({
    student_id: 1,
    name: "Krishna Patel",
    role: "Statistical Officer",
    // HSD = Household Survey Division (replaced SDRD in Aug 2024 MoSPI order)
    department: "Household Survey Division (HSD)",
    designation: "Senior Statistical Officer",
    employeeId: "SO-IND-2024-884",
    division: "HSD",
    wing: "NSS Wing",
    currentLevel: "Intermediate (Level 2)",
    overallScore: 68,
    assessmentStatus: "Baseline Assessment Completed",
  });

  const [competencies, setCompetencies] = useState(INITIAL_COMPETENCIES);
  const [uploadedMaterial, setUploadedMaterial] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <StudentContext.Provider
      value={{
        student,
        setStudent,
        competencies,
        setCompetencies,
        uploadedMaterial,
        setUploadedMaterial,
        userAnswers,
        setUserAnswers,
        quizResult,
        setQuizResult,
        isAssistantOpen,
        setIsAssistantOpen,
      }}
    >
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        {/* Standalone Login route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Application Routes inside Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/quiz" element={<Assessment />} />
          <Route path="/results" element={<AssessmentResult />} />
          <Route path="/gaps" element={<CompetencyGap />} />
          <Route path="/learning-path" element={<LearningPath />} />
          <Route path="/roadmap" element={<LearningPath />} />
          <Route path="/reassessment" element={<ReAssessment />} />
          <Route path="/admin" element={<AdminAnalytics />} />
          <Route path="/training-roi" element={<TrainingRoiDashboard />} />
          <Route path="/roi" element={<TrainingRoiDashboard />} />
          <Route path="/career-path" element={<CareerPathGenerator />} />
          <Route path="/career" element={<CareerPathGenerator />} />
          <Route path="/student-track" element={<StudentTrack />} />
          <Route path="/exam-pathway" element={<StudentTrack />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="*" element={<Navigate to="/profile" replace />} />
        </Route>
      </Routes>
    </StudentContext.Provider>
  );
}
