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

const StudentContext = createContext(null);
export const useStudent = () => useContext(StudentContext);

// Initial 6 core government competencies matching prompt items 2, 5, 6, 10, 15
const INITIAL_COMPETENCIES = [
  {
    id: "survey_design",
    name: "Survey Design",
    category: "Methodological Frameworks",
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
    diagnosis:
      "Your assessment indicates difficulty in survey design concepts, questionnaire structure, and sampling framework selection.",
    recommendedAction:
      "Complete the Survey Design Fundamentals learning path and retake the assessment.",
  },
  {
    id: "sampling_methods",
    name: "Sampling Methods",
    category: "Statistical Methodology",
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
    diagnosis:
      "Demonstrates basic probability concepts but struggles with multi-stage stratified clustering and PPS variance weights.",
    recommendedAction:
      "Review Sampling Fundamentals and complete Advanced Sampling Methods modules.",
  },
  {
    id: "data_collection",
    name: "Data Collection",
    category: "Field Operations & CAPI",
    current: 90,
    required: 75,
    gap: 0,
    status: "Strong",
    reAssessed: 90,
    missing: [],
    diagnosis:
      "High proficiency in CAPI field operations, respondent verification, and primary data capture protocols.",
    recommendedAction:
      "Maintain proficiency; eligible to mentor junior field enumerators.",
  },
  {
    id: "statistical_analysis",
    name: "Statistical Analysis",
    category: "Inferential & Descriptive",
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
    diagnosis:
      "Good grasp of descriptive summary indicators; minor gap in econometric adjustment and inference testing.",
    recommendedAction:
      "Complete Applied Statistical Inference module on iGOT Karmayogi.",
  },
  {
    id: "data_visualization",
    name: "Data Visualization",
    category: "Reporting & Dashboards",
    current: 85,
    required: 80,
    gap: 0,
    status: "Strong",
    reAssessed: 88,
    missing: [],
    diagnosis:
      "Exemplary ability to translate complex tables into executive chart decks and geospatial maps.",
    recommendedAction:
      "Maintain mastery; explore advanced PowerBI/D3.js government reporting templates.",
  },
  {
    id: "data_governance",
    name: "Data Governance",
    category: "Compliance & Security",
    current: 55,
    required: 75,
    gap: 20,
    status: "Critical Gap",
    reAssessed: 76,
    missing: [
      "National Data Sharing and Accessibility Policy (NDSAP)",
      "Digital Personal Data Protection (DPDP) Act compliance",
      "Microdata anonymization and k-anonymity protocols",
      "Institutional metadata repository standards",
    ],
    diagnosis:
      "Lacks familiarity with modern statutory privacy frameworks and anonymization standards for microdata dissemination.",
    recommendedAction:
      "Complete Data Governance Fundamentals and Data Privacy & Security certification.",
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
          <Route path="*" element={<Navigate to="/profile" replace />} />
        </Route>
      </Routes>
    </StudentContext.Provider>
  );
}
