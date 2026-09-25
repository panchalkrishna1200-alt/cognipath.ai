import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudent } from "../App.jsx";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line,
} from "recharts";

const EXAMS = [
  { id: "iss", name: "ISS", full: "Indian Statistical Service", authority: "UPSC", date: "Jun 2026", color: "from-[#0F2F64] to-[#2563EB]", icon: "📊" },
  { id: "jso", name: "JSO", full: "Junior Statistical Officer", authority: "SSC", date: "Mar 2026", color: "from-emerald-600 to-teal-600", icon: "🔢" },
  { id: "ssc", name: "SSC SI", full: "Statistical Investigator Gr.II", authority: "SSC", date: "Apr 2026", color: "from-amber-500 to-orange-600", icon: "🗂️" },
];

const STUDY_PLAN = [
  { week: "W1", target: 60, actual: 58 },
  { week: "W2", target: 62, actual: 65 },
  { week: "W3", target: 64, actual: 63 },
  { week: "W4", target: 66, actual: 68 },
  { week: "W5", target: 68, actual: 70 },
  { week: "W6", target: 70, actual: null },
];

const RADAR_DATA = [
  { subject: "Probability", A: 72 },
  { subject: "Sampling", A: 60 },
  { subject: "Stat Inference", A: 55 },
  { subject: "Econometrics", A: 48 },
  { subject: "NAS/Accounts", A: 42 },
  { subject: "Data Gov", A: 50 },
];

const MOCK_TESTS = [
  { id: 1, name: "ISS Paper I — Full Mock", date: "22 Sep 2026", score: 68, total: 100, status: "Completed" },
  { id: 2, name: "Sampling Methods Practice", date: "18 Sep 2026", score: 72, total: 100, status: "Completed" },
  { id: 3, name: "Official Statistics Framework", date: "25 Sep 2026", score: null, total: 100, status: "Upcoming" },
  { id: 4, name: "NAS & Macroeconomics", date: "28 Sep 2026", score: null, total: 100, status: "Upcoming" },
];

const TPAC_ENROLLED = [
  { id: 1, title: "Foundations of Official Statistics", progress: 85, duration: "20 hrs", category: "Statistical Methods", color: "bg-blue-500" },
  { id: 2, title: "Sample Survey Methods (NSS Manual)", progress: 60, duration: "25 hrs", category: "Statistical Methods", color: "bg-emerald-500" },
  { id: 3, title: "DPDP Act & Data Privacy", progress: 30, duration: "12 hrs", category: "Digital Governance", color: "bg-purple-500" },
  { id: 4, title: "R Programming for Statistics", progress: 45, duration: "35 hrs", category: "Technical Tools", color: "bg-amber-500" },
];

const IGOT_COURSES = [
  { title: "Official Statistics: Data Collection & Quality", provider: "iGOT Karmayogi", match: 96, duration: "18 hrs", status: "Enrolled", icon: "📊" },
  { title: "Statistical Inference for Civil Services", provider: "NSSTA", match: 92, duration: "22 hrs", status: "Recommended", icon: "🔬" },
  { title: "Sampling Methods & Survey Design", provider: "iGOT Karmayogi", match: 89, duration: "15 hrs", status: "Recommended", icon: "🎯" },
  { title: "Introduction to R for Data Analysis", provider: "NSSTA TPAC", match: 85, duration: "35 hrs", status: "Enrolled", icon: "💻" },
  { title: "National Accounts Statistics Fundamentals", provider: "iGOT Karmayogi", match: 88, duration: "30 hrs", status: "Not Started", icon: "💹" },
  { title: "DPDP Act & Data Governance for Officials", provider: "DoPT / iGOT", match: 80, duration: "12 hrs", status: "Not Started", icon: "🔒" },
];

const DAILY_SCHEDULE = [
  { time: "6:00–7:30 AM", subject: "Probability Theory", type: "Theory", color: "border-blue-400 bg-blue-50" },
  { time: "8:00–9:00 AM", subject: "Previous Year MCQs (Sampling)", type: "Practice", color: "border-emerald-400 bg-emerald-50" },
  { time: "5:00–6:30 PM", subject: "Official Statistics (NSS)", type: "TPAC Module", color: "border-purple-400 bg-purple-50" },
  { time: "7:00–8:00 PM", subject: "Mock Test Review", type: "Revision", color: "border-amber-400 bg-amber-50" },
];

export default function StudentDashboard() {
  const { student } = useStudent();
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState(EXAMS[0]);
  const [activeTab, setActiveTab] = useState("overview");

  const overallProgress = Math.round(RADAR_DATA.reduce((a, d) => a + d.A, 0) / RADAR_DATA.length);
  const enrolledCount = TPAC_ENROLLED.length;
  const completedMocks = MOCK_TESTS.filter(m => m.status === "Completed").length;
  const avgMockScore = Math.round(MOCK_TESTS.filter(m => m.score).reduce((a, m) => a + m.score, 0) / completedMocks);

  const TABS = [
    { id: "overview", label: "📋 Overview" },
    { id: "exams", label: "🎯 My Exam Path" },
    { id: "courses", label: "📚 iGOT + TPAC" },
    { id: "schedule", label: "📅 Study Plan" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded font-bold uppercase tracking-wider">🎓 Student</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-medium">Aspirant Track</span>
            </div>
            <h1 className="text-2xl font-black">My Exam Preparation Dashboard</h1>
            <p className="text-emerald-100 text-sm mt-1">
              {student?.name} · {student?.designation || "Student / Aspirant"} · ISS · JSO · SSC Pathways
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/upload")}
              className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-800 rounded-xl text-sm font-bold transition-all shadow-sm hover:bg-emerald-50">
              📄 AI Quiz from Syllabus
            </button>
            <button onClick={() => navigate("/admin-dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/20">
              👔 Admin View
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Overall Readiness", value: `${overallProgress}%`, icon: "📊", color: "bg-white/10" },
            { label: "Courses Enrolled", value: enrolledCount, icon: "📚", color: "bg-emerald-500/20" },
            { label: "Mocks Completed", value: `${completedMocks} tests`, icon: "✅", color: "bg-teal-500/20" },
            { label: "Avg Mock Score", value: `${avgMockScore}%`, icon: "🎯", color: "bg-blue-500/20" },
          ].map(kpi => (
            <div key={kpi.label} className={`${kpi.color} rounded-xl p-4 border border-white/10`}>
              <p className="text-2xl">{kpi.icon}</p>
              <p className="text-xl font-black mt-1">{kpi.value}</p>
              <p className="text-xs text-emerald-100 mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Exam selector chips */}
        <div className="flex gap-2 mt-5 flex-wrap">
          {EXAMS.map(e => (
            <button key={e.id} onClick={() => setSelectedExam(e)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedExam.id === e.id ? "bg-white text-emerald-800" : "bg-white/10 text-white hover:bg-white/20"
              }`}>
              <span>{e.icon}</span><span>{e.name}</span>
              {selectedExam.id === e.id && <span className="text-[9px] bg-emerald-600 text-white px-1 rounded">Active</span>}
            </button>
          ))}
          <div className="flex gap-2 mt-0">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === t.id ? "bg-amber-400 text-amber-900" : "bg-white/10 text-white hover:bg-white/20"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Radar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-1">📡 Competency Radar — {selectedExam.name}</h3>
            <p className="text-xs text-slate-400 mb-3">MoSPI 4-Pillar Framework</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748B" }} />
                <Radar dataKey="A" stroke="#059669" fill="#059669" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip formatter={(v) => [`${v}%`]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Progress over time */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">📈 Weekly Score Progress</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={STUDY_PLAN}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 80]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="target" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="5 5" name="Target" dot={false} />
                <Line type="monotone" dataKey="actual" stroke="#059669" strokeWidth={2.5} name="Actual" dot={{ fill: "#059669", r: 4 }} connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Mock Tests */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">📝 Mock Test Results</h3>
            <div className="space-y-3">
              {MOCK_TESTS.map(m => (
                <div key={m.id} className={`p-3 rounded-xl border transition-all ${m.status === "Completed" ? "bg-white border-slate-200" : "bg-slate-50 border-slate-200 opacity-70"}`}>
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold text-slate-800 leading-snug">{m.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${m.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                      {m.status}
                    </span>
                  </div>
                  {m.score ? (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                        <div className={`h-full rounded-full ${m.score >= 70 ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${m.score}%` }} />
                      </div>
                      <span className={`text-xs font-black ${m.score >= 70 ? "text-emerald-600" : "text-amber-600"}`}>{m.score}%</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">📅 {m.date}</p>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/upload")}
              className="w-full mt-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors border border-emerald-200">
              + Generate New Mock Test from PDF
            </button>
          </div>

          {/* Subject gaps bar */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">📊 Subject-wise Readiness vs Required ({selectedExam.name})</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={RADAR_DATA} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [`${v}%`]} />
                <Bar dataKey="A" name="Your Score" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── EXAM PATH TAB ── */}
      {activeTab === "exams" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {EXAMS.map(exam => (
            <div key={exam.id} className={`rounded-2xl overflow-hidden border ${selectedExam.id === exam.id ? "border-emerald-400 shadow-lg ring-2 ring-emerald-200" : "border-slate-200"}`}>
              <div className={`bg-gradient-to-r ${exam.color} p-5 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl">{exam.icon}</p>
                    <h3 className="text-lg font-black mt-2">{exam.name}</h3>
                    <p className="text-xs text-white/80">{exam.full}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/70">Authority</p>
                    <p className="font-black">{exam.authority}</p>
                    <p className="text-xs text-white/70 mt-1">Exam Date</p>
                    <p className="font-bold text-sm">{exam.date}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Overall Readiness</span>
                  <span className="font-black text-slate-900">{overallProgress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${overallProgress}%` }} />
                </div>
                <div className="space-y-2">
                  {RADAR_DATA.slice(0, 3).map(s => (
                    <div key={s.subject} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{s.subject}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1 bg-slate-100 rounded-full">
                          <div className={`h-full rounded-full ${s.A >= 70 ? "bg-emerald-500" : s.A >= 55 ? "bg-amber-400" : "bg-rose-500"}`} style={{ width: `${s.A}%` }} />
                        </div>
                        <span className="font-bold text-slate-800 w-6 text-right">{s.A}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => { setSelectedExam(exam); setActiveTab("overview"); }}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all">
                    View Full Path →
                  </button>
                  <button onClick={() => navigate("/student-track")}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                    Resources
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── COURSES TAB ── */}
      {activeTab === "courses" && (
        <div className="space-y-5">
          {/* Enrolled TPAC */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">🏛️ NSSTA TPAC Modules — My Progress</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {TPAC_ENROLLED.map(m => (
                <div key={m.id} className="p-4 rounded-xl border border-slate-200 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{m.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{m.category} · {m.duration}</p>
                    </div>
                    <span className="text-xs font-black text-slate-900 ml-2 shrink-0">{m.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${m.color} transition-all duration-700`} style={{ width: `${m.progress}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{m.progress < 50 ? "In progress" : m.progress < 80 ? "More than halfway!" : "Almost done!"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* iGOT Course Recommendations */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">🎓 AI-Recommended iGOT Karmayogi Courses</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {IGOT_COURSES.map((c, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{c.icon}</span>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {c.match}% match
                      </span>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{c.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">{c.provider} · {c.duration}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === "Enrolled" ? "bg-blue-100 text-blue-700" :
                      c.status === "Recommended" ? "bg-amber-100 text-amber-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>{c.status}</span>
                    <button onClick={() => navigate("/learning-path")}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-800 group-hover:underline">
                      {c.status === "Enrolled" ? "Continue →" : "Enroll →"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SCHEDULE TAB ── */}
      {activeTab === "schedule" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">📅 Today's Study Schedule</h3>
            <div className="space-y-3">
              {DAILY_SCHEDULE.map((s, i) => (
                <div key={i} className={`p-3.5 rounded-xl border-l-4 ${s.color}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">{s.subject}</p>
                    <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-medium">{s.type}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">🕐 {s.time}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-xs font-bold text-emerald-800">💡 AI Study Tip</p>
              <p className="text-[11px] text-emerald-700 mt-1">Focus on <strong>Sampling Methods</strong> today — it has the highest weight in ISS Paper I and you have a 25% gap. Use the NSS Manual PDF for practice.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">📆 Upcoming Milestones</h3>
            <div className="space-y-3">
              {[
                { date: "25 Sep", event: "Mock Test — Official Statistics Framework", type: "Test", color: "bg-rose-100 text-rose-700 border-rose-200" },
                { date: "28 Sep", event: "NAS & Macroeconomics Module Deadline", type: "TPAC", color: "bg-purple-100 text-purple-700 border-purple-200" },
                { date: "01 Oct", event: "Weekly Progress Review", type: "Review", color: "bg-blue-100 text-blue-700 border-blue-200" },
                { date: "05 Oct", event: "ISS Full-Length Practice Paper", type: "Test", color: "bg-rose-100 text-rose-700 border-rose-200" },
                { date: "10 Oct", event: "R Programming TPAC — Module 3 Due", type: "TPAC", color: "bg-amber-100 text-amber-700 border-amber-200" },
                { date: "15 Oct", event: "Mentor Review Session (NSSTA)", type: "Session", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="text-center shrink-0 w-12">
                    <p className="text-[10px] text-slate-400 font-semibold">{m.date.split(" ")[1]}</p>
                    <p className="text-sm font-black text-slate-800">{m.date.split(" ")[0]}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{m.event}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${m.color}`}>{m.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
