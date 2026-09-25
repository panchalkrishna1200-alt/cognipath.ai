import { useState } from "react";
import { useStudent } from "../App.jsx";
import { useNavigate } from "react-router-dom";

const EXAMS = [
  {
    id: "iss",
    name: "Indian Statistical Service (ISS)",
    code: "ISS 2026",
    authority: "UPSC",
    vacancies: 30,
    color: "from-[#0F2F64] to-[#2563EB]",
    badge: "bg-blue-100 text-blue-800 border-blue-300",
    icon: "📊",
    eligibility: "M.Sc. Statistics / Applied Mathematics",
    syllabus: [
      { subject: "Probability & Mathematical Statistics", coverage: 72, required: 90 },
      { subject: "Statistical Inference & Decision Theory", coverage: 65, required: 85 },
      { subject: "Linear Models & Design of Experiments", coverage: 58, required: 80 },
      { subject: "Sample Survey & Official Statistics", coverage: 45, required: 85 },
      { subject: "Econometrics & Time Series", coverage: 60, required: 80 },
    ],
    resources: [
      { title: "ISS Paper I — General Statistics", type: "NSSTA TPAC", duration: "40 hrs", status: "available" },
      { title: "Official Statistics Framework (MoSPI)", type: "iGOT Course", duration: "20 hrs", status: "available" },
      { title: "Sample Survey Methods (NSS Manual)", type: "PDF + Quiz", duration: "15 hrs", status: "available" },
      { title: "Statistical Inference (Advanced)", type: "NSSTA TPAC", duration: "30 hrs", status: "upcoming" },
    ],
  },
  {
    id: "jso",
    name: "Junior Statistical Officer (JSO)",
    code: "SSC JSO 2026",
    authority: "SSC",
    vacancies: 110,
    color: "from-emerald-600 to-teal-600",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: "🔢",
    eligibility: "B.Sc. Statistics (or equivalent)",
    syllabus: [
      { subject: "Descriptive Statistics", coverage: 82, required: 85 },
      { subject: "Probability Distributions", coverage: 70, required: 80 },
      { subject: "Index Numbers & Time Series", coverage: 55, required: 80 },
      { subject: "Sampling Techniques", coverage: 60, required: 85 },
      { subject: "Data Interpretation & Analysis", coverage: 75, required: 85 },
    ],
    resources: [
      { title: "SSC JSO Statistics Paper", type: "Practice Test", duration: "10 hrs", status: "available" },
      { title: "Index Numbers (CSO Guide)", type: "PDF + Quiz", duration: "8 hrs", status: "available" },
      { title: "Data Interpretation Mastery", type: "iGOT Course", duration: "12 hrs", status: "available" },
      { title: "Previous Year Papers (2019–2024)", type: "Mock Test", duration: "20 hrs", status: "available" },
    ],
  },
  {
    id: "ssc",
    name: "SSC Statistical Investigator Gr. II",
    code: "SSC SI 2026",
    authority: "SSC",
    vacancies: 200,
    color: "from-amber-500 to-orange-600",
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    icon: "🗂️",
    eligibility: "B.Sc. Statistics / Economics (with Statistics)",
    syllabus: [
      { subject: "Collection & Classification of Data", coverage: 88, required: 85 },
      { subject: "Measures of Central Tendency", coverage: 80, required: 85 },
      { subject: "Correlation & Regression", coverage: 65, required: 80 },
      { subject: "Vital Statistics & Demography", coverage: 50, required: 80 },
      { subject: "Probability Theory", coverage: 60, required: 80 },
    ],
    resources: [
      { title: "Statistical Investigator Foundation", type: "NSSTA TPAC", duration: "15 hrs", status: "available" },
      { title: "Vital Statistics (Registrar General)", type: "PDF + Quiz", duration: "10 hrs", status: "available" },
      { title: "Quantitative Aptitude for SSC", type: "Practice Test", duration: "12 hrs", status: "available" },
      { title: "Economic Survey — Key Indicators", type: "iGOT Course", duration: "8 hrs", status: "upcoming" },
    ],
  },
];

const TPAC_MODULES = [
  { id: 1, title: "Foundations of Official Statistics", duration: "20 hrs", level: "Foundational", status: "Open", category: "Statistical Methods", icon: "📐" },
  { id: 2, title: "National Sample Survey (NSS) Framework", duration: "25 hrs", level: "Intermediate", status: "Open", category: "Field Operations", icon: "🗺️" },
  { id: 3, title: "National Accounts Statistics (NAS)", duration: "30 hrs", level: "Advanced", status: "Open", category: "Economic Statistics", icon: "💹" },
  { id: 4, title: "Price Statistics & CPI/WPI", duration: "18 hrs", level: "Intermediate", status: "Open", category: "Price Statistics", icon: "📈" },
  { id: 5, title: "DPDP Act & Data Privacy for Officials", duration: "12 hrs", level: "Foundational", status: "Open", category: "Digital Governance", icon: "🔒" },
  { id: 6, title: "CAPI Field Operations & CSPC", duration: "15 hrs", level: "Foundational", status: "Enrolling", category: "Field Operations", icon: "📱" },
  { id: 7, title: "R Programming for Statistical Analysis", duration: "35 hrs", level: "Intermediate", status: "Open", category: "Technical Tools", icon: "💻" },
  { id: 8, title: "Python for Data Analysis (Government)", duration: "40 hrs", level: "Intermediate", status: "Open", category: "Technical Tools", icon: "🐍" },
  { id: 9, title: "GIS & Geospatial Data for Census", duration: "20 hrs", level: "Advanced", status: "Upcoming", category: "Technical Tools", icon: "🌍" },
  { id: 10, title: "Leadership & Managerial Skills for DSOs", duration: "15 hrs", level: "Advanced", status: "Open", category: "Managerial Skills", icon: "🎯" },
  { id: 11, title: "Public Administration & Ethics", duration: "10 hrs", level: "Foundational", status: "Open", category: "Managerial Skills", icon: "⚖️" },
  { id: 12, title: "Project Management for Statistical Surveys", duration: "18 hrs", level: "Intermediate", status: "Upcoming", category: "Managerial Skills", icon: "📋" },
];

export default function StudentTrack() {
  const { student } = useStudent();
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState(EXAMS[0]);
  const [activeTab, setActiveTab] = useState("exam"); // "exam" | "tpac"
  const [tpacFilter, setTpacFilter] = useState("All");

  const isStudent = student?.role === "Student";
  const tpacCategories = ["All", "Statistical Methods", "Field Operations", "Economic Statistics", "Technical Tools", "Digital Governance", "Managerial Skills"];
  const filteredTpac = tpacFilter === "All" ? TPAC_MODULES : TPAC_MODULES.filter(m => m.category === tpacFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F2F64] to-[#1E3A8A] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Dual-Track Platform
              </span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-medium">
                Students & Officials
              </span>
            </div>
            <h1 className="text-2xl font-black">Student & Aspirant Track</h1>
            <p className="text-blue-200 text-sm mt-1">
              ISS · JSO · SSC Exam Pathways + NSSTA TPAC Training Modules
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-300">Logged in as</p>
            <p className="font-bold">{student?.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isStudent ? "bg-amber-400 text-amber-900" : "bg-white/20 text-white"}`}>
              {isStudent ? "🎓 Student / Aspirant" : "👔 Official"}
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mt-5">
          <button onClick={() => setActiveTab("exam")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "exam" ? "bg-white text-[#0F2F64]" : "bg-white/10 text-white hover:bg-white/20"}`}>
            🎯 Exam Pathways (ISS/JSO/SSC)
          </button>
          <button onClick={() => setActiveTab("tpac")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "tpac" ? "bg-white text-[#0F2F64]" : "bg-white/10 text-white hover:bg-white/20"}`}>
            📚 NSSTA TPAC Modules
          </button>
        </div>
      </div>

      {/* ── EXAM PATHWAY TAB ── */}
      {activeTab === "exam" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Exam selector */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Select Target Exam</h2>
            {EXAMS.map((exam) => (
              <button key={exam.id} onClick={() => setSelectedExam(exam)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedExam.id === exam.id ? "border-blue-400 bg-blue-50 shadow-md ring-2 ring-blue-200" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${exam.color} flex items-center justify-center text-xl`}>
                    {exam.icon}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 leading-tight">{exam.name}</p>
                    <p className="text-[10px] text-slate-500">{exam.authority} · {exam.vacancies} vacancies</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${exam.badge}`}>{exam.code}</span>
                  {selectedExam.id === exam.id && (
                    <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">Selected ✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Exam detail */}
          <div className="lg:col-span-2 space-y-4">
            {/* Exam header */}
            <div className={`bg-gradient-to-r ${selectedExam.color} rounded-2xl p-5 text-white`}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs text-white/70 font-medium uppercase tracking-wider">{selectedExam.authority}</p>
                  <h2 className="text-xl font-black">{selectedExam.name}</h2>
                  <p className="text-white/80 text-xs mt-1">Eligibility: {selectedExam.eligibility}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/70">Available Vacancies</p>
                  <p className="text-3xl font-black">{selectedExam.vacancies}</p>
                </div>
              </div>
            </div>

            {/* Syllabus coverage */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>📋</span> Syllabus Coverage & Gap Analysis
              </h3>
              <div className="space-y-4">
                {selectedExam.syllabus.map((s) => {
                  const gap = Math.max(0, s.required - s.coverage);
                  const status = s.coverage >= s.required ? "Strong" : gap >= 20 ? "Critical Gap" : "Developing";
                  return (
                    <div key={s.subject}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-700">{s.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            status === "Strong" ? "bg-emerald-100 text-emerald-700" :
                            status === "Critical Gap" ? "bg-rose-100 text-rose-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>{status}</span>
                          <span className="text-xs font-black text-slate-800">{s.coverage}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
                        <div className="h-full bg-gradient-to-r from-[#0F2F64] to-[#2563EB] rounded-full transition-all duration-700"
                          style={{ width: `${s.coverage}%` }} />
                        {/* Required threshold marker */}
                        <div className="absolute top-0 h-full w-0.5 bg-rose-400"
                          style={{ left: `${s.required}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>Your coverage: {s.coverage}%</span>
                        <span className="text-rose-500">Required: {s.required}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended resources */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>📚</span> Recommended Study Resources
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {selectedExam.resources.map((r, i) => (
                  <div key={i} className={`p-3.5 rounded-xl border transition-all hover:shadow-sm ${
                    r.status === "upcoming" ? "bg-slate-50 border-slate-200 opacity-70" : "bg-white border-slate-200 hover:border-blue-300"
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-800 leading-snug">{r.title}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        r.status === "upcoming" ? "bg-slate-200 text-slate-600" :
                        r.type === "NSSTA TPAC" ? "bg-purple-100 text-purple-700" :
                        r.type === "iGOT Course" ? "bg-blue-100 text-blue-700" :
                        "bg-emerald-100 text-emerald-700"
                      }`}>
                        {r.status === "upcoming" ? "Soon" : r.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">⏱ {r.duration}</p>
                    {r.status !== "upcoming" && (
                      <button onClick={() => navigate("/learning-path")}
                        className="mt-2 text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        Start Learning →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button onClick={() => navigate("/upload")}
                className="flex-1 bg-gradient-to-r from-[#0F2F64] to-[#2563EB] text-white py-3 rounded-xl font-bold text-sm hover:opacity-95 transition-all shadow-md">
                📄 Upload Syllabus & Generate AI Quiz
              </button>
              <button onClick={() => navigate("/gaps")}
                className="px-5 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                View Full Gap Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NSSTA TPAC TAB ── */}
      {activeTab === "tpac" && (
        <div className="space-y-4">
          {/* Header info */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xl shrink-0">🏛️</div>
            <div>
              <h3 className="font-black text-purple-900">NSSTA TPAC Training Modules</h3>
              <p className="text-xs text-purple-700 mt-1 leading-relaxed">
                National Statistical Systems Training Academy (NSSTA) Training Programme for Augmenting Competency (TPAC) — 
                Official structured training modules for in-service officials and NSSTA students.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded font-bold">{TPAC_MODULES.length} Modules Available</span>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Free for MoSPI Officials</span>
              </div>
            </div>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {tpacCategories.map((cat) => (
              <button key={cat} onClick={() => setTpacFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  tpacFilter === cat
                    ? "bg-[#0F2F64] text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Modules grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTpac.map((m) => (
              <div key={m.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center text-xl transition-colors">
                    {m.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    m.status === "Open" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    m.status === "Enrolling" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-slate-100 text-slate-500 border-slate-200"
                  }`}>
                    {m.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{m.title}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{m.category}</span>
                  <span className="text-[10px] text-slate-400">{m.level}</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-slate-500">⏱ {m.duration}</span>
                  {m.status !== "Upcoming" ? (
                    <button onClick={() => navigate("/learning-path")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                      Enroll →
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Coming Soon</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
