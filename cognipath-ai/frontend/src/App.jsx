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

const StudentContext = createContext(null);
export const useStudent = () => useContext(StudentContext);

// ── 4-Pillar FRAC Competency Framework (MoSPI) ──
// Pillar 1: Statistical Competencies
// Pillar 2: Technical Tools
// Pillar 3: Digital Governance
// Pillar 4: Managerial Skills
const INITIAL_COMPETENCIES = [
  // ── PILLAR 1: Statistical Competencies ──
  {
    id: "survey_design",
    name: "Survey Design",
    category: "Pillar 1: Statistical Competencies",
    current: 50,
    required: 80,
    gap: 30,
    status: "Critical Gap",
    reAssessed: 78,
    missing: [
      "Survey methodology & sample size determination",
      "Questionnaire design & cognitive pre-testing",
      "Sampling framework selection",
      "Non-sampling error mitigation & survey planning",
    ],
    diagnosis: "Your assessment indicates difficulty in survey design concepts, questionnaire structure, and sampling framework selection.",
    recommendedAction: "Complete the Survey Design Fundamentals learning path and retake the assessment.",
  },
  {
    id: "sampling_methods",
    name: "Sampling Methods",
    category: "Pillar 1: Statistical Competencies",
    current: 65,
    required: 80,
    gap: 15,
    status: "Developing",
    reAssessed: 82,
    missing: [
      "Stratified multistage cluster design",
      "Probability proportional to size (PPS) sampling",
      "Finite population correction factors",
      "Cluster variance estimation",
    ],
    diagnosis: "Demonstrates basic probability concepts but struggles with multi-stage stratified clustering and PPS variance weights.",
    recommendedAction: "Review Sampling Fundamentals and complete Advanced Sampling Methods modules.",
  },
  {
    id: "data_collection",
    name: "Data Collection",
    category: "Pillar 1: Statistical Competencies",
    current: 90,
    required: 75,
    gap: 0,
    status: "Strong",
    reAssessed: 90,
    missing: [],
    diagnosis: "High proficiency in CAPI field operations, respondent verification, and primary data capture protocols.",
    recommendedAction: "Maintain proficiency; eligible to mentor junior field enumerators.",
  },
  {
    id: "statistical_analysis",
    name: "Statistical Analysis",
    category: "Pillar 1: Statistical Competencies",
    current: 70,
    required: 75,
    gap: 5,
    status: "Developing",
    reAssessed: 75,
    missing: [
      "Multivariate regression diagnostics",
      "Time-series seasonal decomposition",
      "Standard error propagation",
    ],
    diagnosis: "Good grasp of descriptive summary indicators; minor gap in econometric adjustment and inference testing.",
    recommendedAction: "Complete Applied Statistical Inference module on iGOT Karmayogi.",
  },
  {
    id: "national_accounts",
    name: "National Accounts (NAS)",
    category: "Pillar 1: Statistical Competencies",
    current: 55,
    required: 75,
    gap: 20,
    status: "Critical Gap",
    reAssessed: 70,
    missing: [
      "GDP estimation & supply-use tables",
      "Sectoral accounts compilation",
      "Price deflation & chain-linking",
    ],
    diagnosis: "Needs structured training on NAS compilation methodology and sectoral account frameworks.",
    recommendedAction: "Enroll in National Accounts Statistics TPAC module at NSSTA.",
  },
  // ── PILLAR 2: Technical Tools ──
  {
    id: "r_programming",
    name: "R Programming",
    category: "Pillar 2: Technical Tools",
    current: 45,
    required: 70,
    gap: 25,
    status: "Critical Gap",
    reAssessed: 65,
    missing: [
      "Data manipulation with tidyverse",
      "Statistical modelling in R",
      "Survey data analysis (srvyr package)",
      "Automated report generation (R Markdown)",
    ],
    diagnosis: "Limited exposure to R statistical programming; foundational skills required for data analysis workflows.",
    recommendedAction: "Complete R Programming for Statistical Analysis TPAC module (35 hrs).",
  },
  {
    id: "python_analytics",
    name: "Python for Data Analysis",
    category: "Pillar 2: Technical Tools",
    current: 40,
    required: 65,
    gap: 25,
    status: "Critical Gap",
    reAssessed: 60,
    missing: [
      "Pandas & NumPy for data wrangling",
      "Matplotlib / Seaborn visualization",
      "Scikit-learn for predictive modelling",
      "Jupyter notebooks for reproducibility",
    ],
    diagnosis: "Python skills are below the required threshold for modern data analysis tasks in MoSPI workflows.",
    recommendedAction: "Complete Python for Data Analysis (Government) TPAC module (40 hrs).",
  },
  {
    id: "gis_geospatial",
    name: "GIS & Geospatial Analysis",
    category: "Pillar 2: Technical Tools",
    current: 35,
    required: 60,
    gap: 25,
    status: "Critical Gap",
    reAssessed: 55,
    missing: [
      "QGIS for Census mapping",
      "Spatial data analysis & choropleth maps",
      "GPS-based enumeration block boundaries",
      "Geospatial data integration with survey data",
    ],
    diagnosis: "GIS skills needed for Census digital mapping and geospatial survey frame maintenance.",
    recommendedAction: "Enroll in GIS & Geospatial Data for Census TPAC module (20 hrs).",
  },
  // ── PILLAR 3: Digital Governance ──
  {
    id: "data_governance",
    name: "Data Governance & DPDP",
    category: "Pillar 3: Digital Governance (DPI)",
    current: 55,
    required: 75,
    gap: 20,
    status: "Critical Gap",
    reAssessed: 76,
    missing: [
      "National Data Sharing and Accessibility Policy (NDSAP)",
      "Digital Personal Data Protection (DPDP) Act 2023 compliance",
      "Microdata anonymization and k-anonymity protocols",
      "Institutional metadata repository standards",
    ],
    diagnosis: "Lacks familiarity with modern statutory privacy frameworks and anonymization standards for microdata dissemination.",
    recommendedAction: "Complete DPDP Act & Data Privacy for Officials TPAC module.",
  },
  {
    id: "data_visualization",
    name: "Data Visualization & Dashboards",
    category: "Pillar 3: Digital Governance (DPI)",
    current: 85,
    required: 80,
    gap: 0,
    status: "Strong",
    reAssessed: 88,
    missing: [],
    diagnosis: "Exemplary ability to translate complex tables into executive chart decks and geospatial maps.",
    recommendedAction: "Maintain mastery; explore advanced PowerBI/D3.js government reporting templates.",
  },
  // ── PILLAR 4: Managerial Skills ──
  {
    id: "leadership",
    name: "Leadership & Public Administration",
    category: "Pillar 4: Managerial Skills",
    current: 60,
    required: 70,
    gap: 10,
    status: "Developing",
    reAssessed: 72,
    missing: [
      "Public policy analysis & decision-making",
      "Administrative ethics & conduct rules",
      "Performance management & target-setting",
    ],
    diagnosis: "Developing managerial competencies; needs structured exposure to administrative leadership frameworks.",
    recommendedAction: "Complete Leadership & Managerial Skills for DSOs TPAC module.",
  },
  {
    id: "project_management",
    name: "Project & Survey Management",
    category: "Pillar 4: Managerial Skills",
    current: 65,
    required: 72,
    gap: 7,
    status: "Developing",
    reAssessed: 73,
    missing: [
      "Survey project planning & timelines",
      "Budget management for field surveys",
      "Stakeholder coordination (State DES, DRDA)",
    ],
    diagnosis: "Good coordination skills but needs project management frameworks specific to large-scale surveys.",
    recommendedAction: "Complete Project Management for Statistical Surveys TPAC module.",
  },
];

export default function App() {
  // Pre-populated default user matching prompt item 15:
  // Krishna Patel, Statistical Officer, Official Statistical System, Overall 68%
  const [student, setStudent] = useState({
    student_id: 1,
    name: "Krishna Patel",
    role: "Statistical Officer",
    department: "Official Statistical System",
    designation: "Senior Statistical Officer",
    employeeId: "SO-IND-2024-884",
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
