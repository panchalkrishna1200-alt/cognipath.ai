import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Master dataset of training programs across national platforms (iGOT Karmayogi, NSSTA, MoSPI)
const MASTER_TRAINING_PROGRAMS = [
  {
    id: "CRS-01",
    title: "National Sample Survey (NSS) Design & Methodology",
    provider: "NSSTA (National Academy)",
    category: "Survey Design",
    department: "Field Operations Division (FOD)",
    state: "Maharashtra & Western Zone",
    role: "Statistical Officer (SO)",
    enrolled: 420,
    completed: 365,
    completionRate: 86.9,
    preScore: 48.5,
    postScore: 77.2,
    uplift: 28.7,
    avgHoursSpent: 18.5,
    expectedHours: 20.0,
    verdict: "High Impact",
    verdictBadge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    rootCause: "High retention due to mandatory field case studies and peer survey reviews.",
    action: "Maintain as mandatory flagship training.",
  },
  {
    id: "CRS-02",
    title: "DPDP Act 2023 & Statistical Data Governance Protocols",
    provider: "iGOT Karmayogi & MeitY",
    category: "Data Governance",
    department: "National Accounts Division (NAD)",
    state: "Delhi NCR & Central HQ",
    role: "Senior Statistical Officer (SSO)",
    enrolled: 380,
    completed: 342,
    completionRate: 90.0,
    preScore: 52.0,
    postScore: 78.4,
    uplift: 26.4,
    avgHoursSpent: 12.0,
    expectedHours: 14.0,
    verdict: "High Impact",
    verdictBadge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    rootCause: "Interactive microdata anonymization drills drove high conceptual mastery.",
    action: "Recommend rollout to all regional branch offices.",
  },
  {
    id: "CRS-03",
    title: "Advanced Stratified & Multi-Stage Sampling Methods",
    provider: "MoSPI Academy",
    category: "Sampling Methods",
    department: "Field Operations Division (FOD)",
    state: "Uttar Pradesh & Northern Zone",
    role: "Statistical Officer (SO)",
    enrolled: 290,
    completed: 232,
    completionRate: 80.0,
    preScore: 61.0,
    postScore: 81.5,
    uplift: 20.5,
    avgHoursSpent: 15.0,
    expectedHours: 16.0,
    verdict: "Effective",
    verdictBadge: "bg-blue-100 text-blue-800 border-blue-300",
    rootCause: "Solid mathematical gains in PPS cluster variance calculations.",
    action: "Supplement with R/Python simulation templates.",
  },
  {
    id: "CRS-04",
    title: "Executive Data Storytelling & Dashboard Visualization",
    provider: "iGOT Karmayogi",
    category: "Data Visualization",
    department: "Data Informatics & Innovation (DIID)",
    state: "Tamil Nadu & Southern Zone",
    role: "Data Analyst (DA)",
    enrolled: 310,
    completed: 260,
    completionRate: 83.9,
    preScore: 71.0,
    postScore: 88.5,
    uplift: 17.5,
    avgHoursSpent: 10.0,
    expectedHours: 12.0,
    verdict: "Effective",
    verdictBadge: "bg-blue-100 text-blue-800 border-blue-300",
    rootCause: "Hands-on PowerBI templates helped officers translate raw tables into policy briefs.",
    action: "Standardize ministry report templates across departments.",
  },
  {
    id: "CRS-05",
    title: "Overview of National Accounts & Macroeconomic Aggregates",
    provider: "iGOT Karmayogi",
    category: "Statistical Analysis",
    department: "Price Statistics Division",
    state: "Uttar Pradesh & Northern Zone",
    role: "Statistical Officer (SO)",
    enrolled: 510,
    completed: 485,
    completionRate: 95.1,
    preScore: 58.2,
    postScore: 61.4,
    uplift: 3.2,
    avgHoursSpent: 4.1,
    expectedHours: 16.0,
    verdict: "Ineffective (Click-Through Risk)",
    verdictBadge: "bg-rose-100 text-rose-800 border-rose-300 animate-pulse font-bold",
    rootCause:
      "CRITICAL: 95.1% completion rate, but only +3.2% score uplift! Officers spent just 4.1 hrs out of 16 hrs (skipping videos/slides on auto-play) without acquiring actual national accounting skills.",
    action:
      "Overhaul course immediately: replace passive slides with mandatory quiz gates and hands-on GDP calculation problems, or drop from mandatory list.",
  },
  {
    id: "CRS-06",
    title: "Basic Spreadsheet Literacy for Field Enumerators",
    provider: "Digital India LMS",
    category: "Data Collection",
    department: "Field Operations Division (FOD)",
    state: "West Bengal & Eastern Zone",
    role: "Field Investigator (FI)",
    enrolled: 340,
    completed: 318,
    completionRate: 93.5,
    preScore: 79.0,
    postScore: 81.2,
    uplift: 2.2,
    avgHoursSpent: 2.8,
    expectedHours: 10.0,
    verdict: "Ineffective (Click-Through Risk)",
    verdictBadge: "bg-rose-100 text-rose-800 border-rose-300 font-bold",
    rootCause:
      "Redundant elementary syllabus: modern CAPI enumerators already possess basic spreadsheet skills. Officers clicked through in under 3 hours without acquiring new competency.",
    action: "Drop course from mandatory curriculum; reallocate training hours to Advanced CAPI Diagnostics.",
  },
  {
    id: "CRS-07",
    title: "Applied Econometric Time-Series Analysis",
    provider: "Indian Statistical Institute & MoSPI",
    category: "Statistical Analysis",
    department: "National Accounts Division (NAD)",
    state: "Maharashtra & Western Zone",
    role: "Senior Statistical Officer (SSO)",
    enrolled: 220,
    completed: 106,
    completionRate: 48.2,
    preScore: 50.0,
    postScore: 74.0,
    uplift: 24.0,
    avgHoursSpent: 24.0,
    expectedHours: 30.0,
    verdict: "High Dropout Risk",
    verdictBadge: "bg-amber-100 text-amber-800 border-amber-300 font-semibold",
    rootCause:
      "High skill gain (+24%) for completers, but low completion (48.2%) due to steep mathematical prerequisites without adequate introductory bridge modules.",
    action: "Introduce foundational mathematics primer before allowing officers into advanced econometric track.",
  },
];

// Breakdown statistics by department
const DEPARTMENT_BREAKDOWN = [
  {
    name: "National Accounts Division (NAD)",
    enrolled: 340,
    completed: 298,
    completionRate: 87.6,
    preAvg: 56.4,
    postAvg: 78.1,
    uplift: 21.7,
    status: "Strong ROI",
    flagged: 1,
  },
  {
    name: "Field Operations Division (FOD)",
    enrolled: 520,
    completed: 435,
    completionRate: 83.7,
    preAvg: 49.2,
    postAvg: 73.8,
    uplift: 24.6,
    status: "Strong ROI",
    flagged: 1,
  },
  {
    name: "Price Statistics Division",
    enrolled: 240,
    completed: 196,
    completionRate: 81.7,
    preAvg: 54.0,
    postAvg: 71.5,
    uplift: 17.5,
    status: "Moderate ROI",
    flagged: 1,
  },
  {
    name: "Data Informatics & Innovation (DIID)",
    enrolled: 190,
    completed: 171,
    completionRate: 90.0,
    preAvg: 64.5,
    postAvg: 86.0,
    uplift: 21.5,
    status: "High ROI",
    flagged: 0,
  },
  {
    name: "Social Statistics Division",
    enrolled: 190,
    completed: 145,
    completionRate: 76.3,
    preAvg: 51.5,
    postAvg: 70.8,
    uplift: 19.3,
    status: "Moderate ROI",
    flagged: 1,
  },
];

// Breakdown statistics by state / region
const STATE_BREAKDOWN = [
  {
    name: "Maharashtra & Western Zone",
    enrolled: 380,
    completed: 332,
    completionRate: 87.4,
    preAvg: 53.0,
    postAvg: 78.5,
    uplift: 25.5,
    clickThroughRisk: "Low (4.2%)",
  },
  {
    name: "Uttar Pradesh & Northern Zone",
    enrolled: 410,
    completed: 344,
    completionRate: 83.9,
    preAvg: 48.5,
    postAvg: 71.0,
    uplift: 22.5,
    clickThroughRisk: "Elevated (18.4%)",
  },
  {
    name: "Delhi NCR & Central HQ",
    enrolled: 310,
    completed: 279,
    completionRate: 90.0,
    preAvg: 58.0,
    postAvg: 81.2,
    uplift: 23.2,
    clickThroughRisk: "Low (6.1%)",
  },
  {
    name: "Tamil Nadu & Southern Zone",
    enrolled: 260,
    completed: 226,
    completionRate: 86.9,
    preAvg: 54.5,
    postAvg: 79.0,
    uplift: 24.5,
    clickThroughRisk: "Low (5.0%)",
  },
  {
    name: "West Bengal & Eastern Zone",
    enrolled: 120,
    completed: 64,
    completionRate: 53.3,
    preAvg: 47.0,
    postAvg: 63.8,
    uplift: 16.8,
    clickThroughRisk: "High Dropout (46.7%)",
  },
];

// Breakdown statistics by role
const ROLE_BREAKDOWN = [
  {
    name: "Statistical Officer (SO)",
    enrolled: 680,
    completed: 578,
    completionRate: 85.0,
    preAvg: 51.0,
    postAvg: 75.0,
    uplift: 24.0,
    topFocus: "Survey Design & Sampling",
  },
  {
    name: "Senior Statistical Officer (SSO)",
    enrolled: 340,
    completed: 292,
    completionRate: 85.9,
    preAvg: 62.0,
    postAvg: 82.5,
    uplift: 20.5,
    topFocus: "Data Governance & DPDP",
  },
  {
    name: "Field Investigator (FI)",
    enrolled: 280,
    completed: 224,
    completionRate: 80.0,
    preAvg: 45.0,
    postAvg: 68.2,
    uplift: 23.2,
    topFocus: "CAPI Verification & Quality",
  },
  {
    name: "Data Analyst (DA)",
    enrolled: 180,
    completed: 151,
    completionRate: 83.9,
    preAvg: 66.0,
    postAvg: 85.5,
    uplift: 19.5,
    topFocus: "Automated Dashboards & Python",
  },
];

// Competency before vs after chart data
const COMPETENCY_CHART_DATA = [
  {
    competency: "Survey Design",
    preTraining: 50,
    postTraining: 78,
    uplift: 28,
  },
  {
    competency: "Sampling Methods",
    preTraining: 64,
    postTraining: 82,
    uplift: 18,
  },
  {
    competency: "Data Collection",
    preTraining: 82,
    postTraining: 92,
    uplift: 10,
  },
  {
    competency: "Statistical Analysis",
    preTraining: 68,
    postTraining: 84,
    uplift: 16,
  },
  {
    competency: "Data Visualization",
    preTraining: 76,
    postTraining: 90,
    uplift: 14,
  },
  {
    competency: "Data Governance",
    preTraining: 55,
    postTraining: 78,
    uplift: 23,
  },
];

export default function TrainingRoiDashboard() {
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [activeTableTab, setActiveTableTab] = useState("all"); // "all" | "flagged" | "high_impact"
  const [breakdownView, setBreakdownView] = useState("department"); // "department" | "state" | "role"
  const [selectedCourseForAudit, setSelectedCourseForAudit] = useState(null);

  // Filtered training courses
  const filteredPrograms = useMemo(() => {
    return MASTER_TRAINING_PROGRAMS.filter((p) => {
      if (selectedDept !== "all" && !p.department.includes(selectedDept)) return false;
      if (selectedState !== "all" && !p.state.includes(selectedState)) return false;
      if (selectedRole !== "all" && !p.role.includes(selectedRole)) return false;
      if (activeTableTab === "flagged" && !p.verdict.includes("Ineffective")) return false;
      if (activeTableTab === "high_impact" && !p.verdict.includes("High Impact")) return false;
      return true;
    });
  }, [selectedDept, selectedState, selectedRole, activeTableTab]);

  // Aggregate stats from filtered items
  const totalEnrolled = useMemo(
    () => filteredPrograms.reduce((acc, curr) => acc + curr.enrolled, 0),
    [filteredPrograms]
  );
  const totalCompleted = useMemo(
    () => filteredPrograms.reduce((acc, curr) => acc + curr.completed, 0),
    [filteredPrograms]
  );
  const avgCompletionRate = totalEnrolled
    ? Math.round((100 * totalCompleted) / totalEnrolled)
    : 0;

  const avgPre = totalCompleted
    ? Math.round(
        filteredPrograms.reduce((acc, c) => acc + c.preScore * c.completed, 0) / totalCompleted
      )
    : 0;

  const avgPost = totalCompleted
    ? Math.round(
        filteredPrograms.reduce((acc, c) => acc + c.postScore * c.completed, 0) / totalCompleted
      )
    : 0;

  const netUplift = avgPost - avgPre;

  const flaggedCount = MASTER_TRAINING_PROGRAMS.filter((p) =>
    p.verdict.includes("Ineffective")
  ).length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Workforce Capacity & Accountability
            </span>
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Real Impact vs Attendance
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Training ROI Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Answers the decisive question:{" "}
            <strong className="text-slate-900 font-semibold">
              &ldquo;Did this training actually make officers better at their job, or did they just click through it?&rdquo;
            </strong>{" "}
            Tracks verified competency gains before vs. after training across departments, states, and cadres.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/career-path"
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>Career Path Generator</span>
            <span>&rarr;</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-[#0F2F64] hover:bg-[#173E80] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export Executive Audit</span>
          </button>
        </div>
      </div>

      {/* ── Filter Bar: Department, State, Role ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Segment Training Performance Filters
            </span>
          </div>

          {(selectedDept !== "all" || selectedState !== "all" || selectedRole !== "all") && (
            <button
              onClick={() => {
                setSelectedDept("all");
                setSelectedState("all");
                setSelectedRole("all");
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
            >
              Reset Filters &times;
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Department Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Filter by Department / Division
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="all">All Divisions (National Scope)</option>
              <option value="Field Operations Division (FOD)">Field Operations Division (FOD)</option>
              <option value="National Accounts Division (NAD)">National Accounts Division (NAD)</option>
              <option value="Price Statistics Division">Price Statistics Division</option>
              <option value="Data Informatics & Innovation (DIID)">Data Informatics & Innovation (DIID)</option>
            </select>
          </div>

          {/* State / Zone Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Filter by State / Regional Zone
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="all">All States & Zones</option>
              <option value="Maharashtra">Maharashtra & Western Zone</option>
              <option value="Uttar Pradesh">Uttar Pradesh & Northern Zone</option>
              <option value="Delhi NCR">Delhi NCR & Central HQ</option>
              <option value="Tamil Nadu">Tamil Nadu & Southern Zone</option>
              <option value="West Bengal">West Bengal & Eastern Zone</option>
            </select>
          </div>

          {/* Cadre / Role Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Filter by Cadre / Designation
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="all">All Cadres & Roles</option>
              <option value="Statistical Officer (SO)">Statistical Officer (SO)</option>
              <option value="Senior Statistical Officer (SSO)">Senior Statistical Officer (SSO)</option>
              <option value="Field Investigator (FI)">Field Investigator (FI)</option>
              <option value="Data Analyst (DA)">Data Analyst (DA)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── KPI Hero Cards: Attendance vs Real Skill Gain ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Completed Training */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Officers Completed Training
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-[#0F2F64]">
                {totalCompleted.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {avgCompletionRate}% Rate
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
            Out of <strong>{totalEnrolled.toLocaleString()}</strong> officers enrolled
          </p>
        </div>

        {/* Card 2: Competency Before vs After */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Competency Before vs After
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-400 line-through">
                {avgPre}%
              </span>
              <span className="text-slate-400 font-bold">&rarr;</span>
              <span className="text-3xl font-black text-blue-700">
                {avgPost}%
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
            Pre-assessment diagnostic vs post-assessment re-test
          </p>
        </div>

        {/* Card 3: Net Real Skill Uplift */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Verified Net Skill Uplift
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-emerald-600">
                +{netUplift}%
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                True Learning ROI
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
            Statistically verified capability jump in job performance
          </p>
        </div>

        {/* Card 4: Click-Through Risk Warning */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                Click-Through Warning
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-rose-700">
                {flaggedCount} Programs
              </span>
            </div>
          </div>
          <p className="text-xs text-rose-900 mt-3 pt-2 border-t border-rose-200/60 font-medium">
            High completion (&gt;90%) but negligible skill gain (&lt;5%). Action required!
          </p>
        </div>
      </div>

      {/* ── Competency Scores Before vs. After Training (Visual Chart) ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Competency Scores Before vs. After Training
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Proves real competency gain instead of passive attendance across all 6 official competency areas
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className="w-3 h-3 rounded bg-slate-300"></span> Pre-Training (Baseline)
            </span>
            <span className="flex items-center gap-1.5 font-bold text-blue-700">
              <span className="w-3 h-3 rounded bg-[#2563EB]"></span> Post-Training (Re-Assessed)
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={COMPETENCY_CHART_DATA}
              margin={{ top: 10, right: 10, left: -15, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="competency"
                tick={{ fontSize: 11, fill: "#475569" }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#475569" }}
                unit="%"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs space-y-1">
                        <p className="font-bold text-slate-900">{data.competency}</p>
                        <p className="text-slate-500">
                          Pre-Training Score: <strong className="text-slate-800">{data.preTraining}%</strong>
                        </p>
                        <p className="text-blue-600">
                          Post-Training Score: <strong className="text-blue-700">{data.postTraining}%</strong>
                        </p>
                        <p className="text-emerald-600 font-bold pt-1 border-t border-slate-100">
                          Net Skill Uplift: +{data.uplift}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="preTraining" name="Before Training" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="postTraining" name="After Training" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Competency Uplift Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {COMPETENCY_CHART_DATA.map((c) => (
            <div key={c.competency} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold text-slate-700 block truncate">
                {c.competency}
              </span>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-xs text-slate-400">{c.preTraining}%</span>
                <span className="text-[10px] text-slate-400">&rarr;</span>
                <span className="text-xs font-bold text-slate-900">{c.postTraining}%</span>
              </div>
              <span className="inline-block mt-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                +{c.uplift}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Training Programs ROI Auditor: Flag Low-Value & Ineffective Courses ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Training Programs ROI & Effectiveness Auditor
              </h2>
              <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                {flaggedCount} Low-ROI Flagged
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Highlights courses that aren&apos;t leading to skill improvement, so low-value courses can be fixed or dropped
            </p>
          </div>

          {/* Table Filter Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTableTab("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTableTab === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Programs ({MASTER_TRAINING_PROGRAMS.length})
            </button>
            <button
              onClick={() => setActiveTableTab("flagged")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeTableTab === "flagged"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-rose-700 hover:bg-rose-50"
              }`}
            >
              <span>⚠️ Click-Through Risk</span>
              <span className="bg-white text-rose-700 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {flaggedCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTableTab("high_impact")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTableTab === "high_impact"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              ⭐ High Impact
            </button>
          </div>
        </div>

        {/* Table of Programs */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Course Title & Provider</th>
                <th className="py-3 px-2 text-center">Officers Completed</th>
                <th className="py-3 px-2 text-center">Completion Rate</th>
                <th className="py-3 px-2 text-center">Pre &rarr; Post Score</th>
                <th className="py-3 px-2 text-center">Net Uplift</th>
                <th className="py-3 px-2 text-center">Training ROI Verdict</th>
                <th className="py-3 px-3 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPrograms.map((course) => {
                const isIneffective = course.verdict.includes("Ineffective");
                const isHigh = course.verdict.includes("High Impact");

                return (
                  <tr
                    key={course.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isIneffective ? "bg-rose-50/30" : ""
                    }`}
                  >
                    <td className="py-3 px-3 max-w-xs">
                      <div>
                        <p className="font-bold text-slate-900 leading-snug">
                          {course.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {course.provider} &bull;{" "}
                          <span className="text-slate-500">{course.category}</span>
                        </p>
                      </div>
                    </td>

                    <td className="py-3 px-2 text-center font-medium text-slate-700">
                      {course.completed} / {course.enrolled}
                    </td>

                    <td className="py-3 px-2 text-center">
                      <span className="font-bold text-slate-800">
                        {course.completionRate}%
                      </span>
                    </td>

                    <td className="py-3 px-2 text-center">
                      <span className="text-slate-400 font-medium">{course.preScore}%</span>
                      <span className="text-slate-400 mx-1">&rarr;</span>
                      <span className="font-bold text-slate-900">{course.postScore}%</span>
                    </td>

                    <td className="py-3 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-black text-xs ${
                          course.uplift >= 20
                            ? "bg-emerald-100 text-emerald-800"
                            : course.uplift >= 10
                            ? "bg-blue-100 text-blue-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        +{course.uplift}%
                      </span>
                    </td>

                    <td className="py-3 px-2 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${course.verdictBadge}`}
                      >
                        {course.verdict}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedCourseForAudit(course)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isIneffective
                            ? "bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {isIneffective ? "Audit / Drop ⚠️" : "View Audit"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Breakdown Switcher: By Department, By State, or By Role ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Department, State & Role Performance Breakdown
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empowers administrators to pinpoint which geographic zones and administrative units are improving vs lagging
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setBreakdownView("department")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                breakdownView === "department"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              By Department
            </button>
            <button
              onClick={() => setBreakdownView("state")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                breakdownView === "state"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              By State / Zone
            </button>
            <button
              onClick={() => setBreakdownView("role")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                breakdownView === "role"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              By Cadre / Role
            </button>
          </div>
        </div>

        {/* View 1: Department Breakdown */}
        {breakdownView === "department" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEPARTMENT_BREAKDOWN.map((dept) => (
              <div
                key={dept.name}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold text-slate-900">{dept.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {dept.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Completion</span>
                    <span className="font-extrabold text-slate-900">
                      {dept.completionRate}%
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      ({dept.completed}/{dept.enrolled})
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Real Uplift</span>
                    <span className="font-extrabold text-emerald-600">
                      +{dept.uplift}%
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {dept.preAvg}% &rarr; {dept.postAvg}%
                    </span>
                  </div>
                </div>

                {dept.flagged > 0 && (
                  <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200 flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>{dept.flagged} low-ROI course flagged in this division</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* View 2: State / Regional Breakdown */}
        {breakdownView === "state" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STATE_BREAKDOWN.map((st) => (
              <div
                key={st.name}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold text-slate-900">{st.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    +{st.uplift}% Gain
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Completion</span>
                    <span className="font-extrabold text-slate-900">{st.completionRate}%</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Click-Through</span>
                    <span className="font-semibold text-slate-700">{st.clickThroughRisk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View 3: Role Breakdown */}
        {breakdownView === "role" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROLE_BREAKDOWN.map((rl) => (
              <div
                key={rl.name}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold text-slate-900">{rl.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    +{rl.uplift}%
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-slate-500">
                    Trained: <strong className="text-slate-800">{rl.completed}</strong> officers
                  </p>
                  <p className="text-slate-500">
                    Top Capacity Priority:{" "}
                    <strong className="text-blue-700">{rl.topFocus}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal: Course Deep-Dive Audit & Syllabus Remediation ── */}
      {selectedCourseForAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Pedagogical & Retention Audit
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedCourseForAudit.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedCourseForAudit.provider} &bull; {selectedCourseForAudit.category}
                </p>
              </div>
              <button
                onClick={() => setSelectedCourseForAudit(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                &times;
              </button>
            </div>

            {/* Metrics Comparison Pill */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Completion</span>
                <span className="text-lg font-black text-slate-800">
                  {selectedCourseForAudit.completionRate}%
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Score Gain</span>
                <span className="text-lg font-black text-slate-800">
                  +{selectedCourseForAudit.uplift}%
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Time Spent</span>
                <span className="text-lg font-black text-slate-800">
                  {selectedCourseForAudit.avgHoursSpent}h / {selectedCourseForAudit.expectedHours}h
                </span>
              </div>
            </div>

            {/* Root cause analysis */}
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                <span>🔍</span>
                <span>Root Cause Diagnostic</span>
              </span>
              <p className="text-xs text-amber-950 leading-relaxed">
                {selectedCourseForAudit.rootCause}
              </p>
            </div>

            {/* Actionable recommendation */}
            <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-xl space-y-1.5">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                <span>⚡</span>
                <span>Executive Action Required</span>
              </span>
              <p className="text-xs text-blue-950 leading-relaxed font-medium">
                {selectedCourseForAudit.action}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedCourseForAudit(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              >
                Close Audit
              </button>
              {selectedCourseForAudit.verdict.includes("Ineffective") && (
                <button
                  onClick={() => {
                    alert(`Flagged "${selectedCourseForAudit.title}" for MoSPI National Training Board curriculum review.`);
                    setSelectedCourseForAudit(null);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Confirm Drop / Overhaul Flag
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
