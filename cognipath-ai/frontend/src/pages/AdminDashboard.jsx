import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudent } from "../App.jsx";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

// ── Department Cohort Data ──
const DEPARTMENTS = [
  { name: "National Accounts Division", code: "NAD", officials: 24, avgScore: 71, critical: 3, developing: 12, strong: 9 },
  { name: "Field Operations Division", code: "FOD", officials: 38, avgScore: 63, critical: 8, developing: 20, strong: 10 },
  { name: "Price Statistics Division", code: "PSD", officials: 16, avgScore: 74, critical: 2, developing: 8, strong: 6 },
  { name: "Survey Design & Research", code: "SDR", officials: 12, avgScore: 68, critical: 4, developing: 5, strong: 3 },
  { name: "Economic Statistics Division", code: "ESD", officials: 20, avgScore: 76, critical: 1, developing: 9, strong: 10 },
  { name: "NSSTA Training Academy", code: "NSSTA", officials: 30, avgScore: 55, critical: 12, developing: 14, strong: 4 },
];

const OFFICERS = [
  { id: "EMP-01", name: "Krishna Patel", role: "Statistical Officer", dept: "NAD", level: "L2", score: 68, survey: 50, sampling: 65, collection: 90, analysis: 70, r_prog: 45, python: 40, gis: 35, governance: 55, leadership: 60, project: 65, trend: "up" },
  { id: "EMP-02", name: "Ananya Sharma", role: "Dy. Statistical Officer", dept: "FOD", level: "L4", score: 78, survey: 75, sampling: 72, collection: 88, analysis: 78, r_prog: 62, python: 55, gis: 50, governance: 72, leadership: 75, project: 70, trend: "up" },
  { id: "EMP-03", name: "Rajesh Verma", role: "Field Officer", dept: "FOD", level: "L2", score: 63, survey: 45, sampling: 58, collection: 95, analysis: 60, r_prog: 30, python: 25, gis: 40, governance: 52, leadership: 55, project: 62, trend: "stable" },
  { id: "EMP-04", name: "Priya Sundaram", role: "Lead Data Analyst", dept: "DIID", level: "L3", score: 76, survey: 60, sampling: 70, collection: 80, analysis: 85, r_prog: 80, python: 88, gis: 55, governance: 68, leadership: 65, project: 68, trend: "up" },
  { id: "EMP-05", name: "Aarav Sharma", role: "Trainee Probationer", dept: "NSSTA", level: "L1", score: 48, survey: 40, sampling: 45, collection: 60, analysis: 52, r_prog: 35, python: 38, gis: 20, governance: 38, leadership: 42, project: 48, trend: "up" },
  { id: "EMP-06", name: "Meera Pillai", role: "Statistical Officer", dept: "PSD", level: "L3", score: 74, survey: 70, sampling: 72, collection: 82, analysis: 76, r_prog: 58, python: 52, gis: 45, governance: 70, leadership: 68, project: 72, trend: "up" },
];

const PILLAR_HEATMAP = [
  { pillar: "Statistical Competencies", NAD: 72, FOD: 61, PSD: 76, SDR: 69, ESD: 78, NSSTA: 52 },
  { pillar: "Technical Tools", NAD: 55, FOD: 42, PSD: 60, SDR: 58, ESD: 65, NSSTA: 38 },
  { pillar: "Digital Governance", NAD: 68, FOD: 60, PSD: 72, SDR: 65, ESD: 74, NSSTA: 48 },
  { pillar: "Managerial Skills", NAD: 66, FOD: 58, PSD: 70, SDR: 63, ESD: 72, NSSTA: 45 },
];

const TREND_DATA = [
  { month: "Apr", score: 58 }, { month: "May", score: 61 }, { month: "Jun", score: 63 },
  { month: "Jul", score: 65 }, { month: "Aug", score: 67 }, { month: "Sep", score: 70 },
];

const PIE_DATA = [
  { name: "Strong (≥75%)", value: 42, color: "#16A34A" },
  { name: "Developing (55–74%)", value: 68, color: "#F59E0B" },
  { name: "Critical Gap (<55%)", value: 30, color: "#DC2626" },
];

const COMPETENCY_KEYS = ["survey", "sampling", "collection", "analysis", "r_prog", "python", "gis", "governance", "leadership", "project"];
const COMPETENCY_LABELS = { survey: "Survey", sampling: "Sampling", collection: "Field Ops", analysis: "Analysis", r_prog: "R Prog", python: "Python", gis: "GIS", governance: "Governance", leadership: "Leadership", project: "Project Mgmt" };

function getHeatColor(val) {
  if (val >= 75) return "bg-emerald-500 text-white";
  if (val >= 60) return "bg-amber-400 text-white";
  if (val >= 45) return "bg-orange-400 text-white";
  return "bg-rose-500 text-white";
}

export default function AdminDashboard() {
  const { student } = useStudent();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDept, setSelectedDept] = useState("All");
  const [overrideModal, setOverrideModal] = useState(null);
  const [overrideJustification, setOverrideJustification] = useState("");
  const [overrideScore, setOverrideScore] = useState("");
  const [overrides, setOverrides] = useState({});

  const filteredOfficers = selectedDept === "All" ? OFFICERS : OFFICERS.filter(o => o.dept === selectedDept);

  const totalOfficials = DEPARTMENTS.reduce((a, d) => a + d.officials, 0);
  const avgOverall = Math.round(DEPARTMENTS.reduce((a, d) => a + d.avgScore * d.officials, 0) / totalOfficials);
  const criticalCount = DEPARTMENTS.reduce((a, d) => a + d.critical, 0);

  const handleOverrideSave = () => {
    if (!overrideJustification.trim() || !overrideScore) return;
    setOverrides(prev => ({ ...prev, [overrideModal.id]: { score: parseInt(overrideScore), justification: overrideJustification, by: student?.name, date: new Date().toLocaleDateString("en-IN") } }));
    setOverrideModal(null);
    setOverrideJustification("");
    setOverrideScore("");
  };

  const exportCSV = () => {
    const headers = ["ID", "Name", "Role", "Dept", "Level", "Score", ...COMPETENCY_KEYS.map(k => COMPETENCY_LABELS[k])];
    const rows = OFFICERS.map(o => [o.id, o.name, o.role, o.dept, o.level, overrides[o.id]?.score || o.score, ...COMPETENCY_KEYS.map(k => o[k])]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "cognipath_workforce_analytics.csv";
    a.click();
  };

  const TABS = [
    { id: "overview", label: "📊 Overview" },
    { id: "heatmap", label: "🗺️ Dept Heatmap" },
    { id: "officers", label: "👥 All Officers" },
    { id: "pillar", label: "4-Pillar Analysis" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0C2340] to-[#1E3A8A] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Admin</span>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-medium">MDO Analytics Dashboard</span>
            </div>
            <h1 className="text-2xl font-black text-white">Workforce Competency Intelligence</h1>
            <p className="text-blue-200 text-sm mt-1 text-white/80">MoSPI · FRAC 4-Pillar Framework · {totalOfficials} Officials Tracked</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all shadow-sm">
              ⬇ Export CSV
            </button>
            <button onClick={() => navigate("/student-dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/20">
              🎓 Student View
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total Officials", value: totalOfficials, icon: "👥", color: "bg-white/10" },
            { label: "Avg Competency", value: `${avgOverall}%`, icon: "📊", color: "bg-emerald-500/20" },
            { label: "Critical Gap", value: `${criticalCount} officials`, icon: "⚠️", color: "bg-rose-500/20" },
            { label: "Departments", value: DEPARTMENTS.length, icon: "🏛️", color: "bg-blue-500/20" },
          ].map(kpi => (
            <div key={kpi.label} className={`${kpi.color} rounded-xl p-4 border border-white/10`}>
              <p className="text-2xl">{kpi.icon}</p>
              <p className="text-xl font-black mt-1">{kpi.value}</p>
              <p className="text-xs text-blue-200 mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-5 flex-wrap">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === t.id ? "bg-white text-[#0F2F64]" : "bg-white/10 text-white hover:bg-white/20"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trend chart */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">📈 Organisation-wide Competency Trend (FY 2026)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 80]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v}%`, "Avg Score"]} />
                <Line type="monotone" dataKey="score" stroke="#0F2F64" strokeWidth={2.5} dot={{ fill: "#0F2F64", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">🎯 Workforce Distribution</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" outerRadius={65} dataKey="value">
                  {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v} officials`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {PIE_DATA.map(p => (
                <div key={p.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
                    <span className="text-slate-600">{p.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{p.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dept bar */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">🏛️ Department-wise Average Competency Score</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DEPARTMENTS} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="code" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v}%`]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="avgScore" name="Avg Score" fill="#0F2F64" radius={[4, 4, 0, 0]} />
                <Bar dataKey="critical" name="Critical Gap" fill="#DC2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="strong" name="Strong" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── HEATMAP TAB ── */}
      {activeTab === "heatmap" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-900">🗺️ Department × 4-Pillar Competency Heatmap</h3>
            <div className="flex items-center gap-3 text-xs">
              {[["bg-emerald-500","≥75%"],["bg-amber-400","60–74%"],["bg-orange-400","45–59%"],["bg-rose-500","<45%"]].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1"><div className={`w-3 h-3 rounded ${c}`}/><span className="text-slate-600">{l}</span></div>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 text-slate-500 font-bold w-44">Pillar</th>
                  {["NAD","FOD","PSD","SDR","ESD","NSSTA"].map(d => (
                    <th key={d} className="py-2 px-3 text-slate-600 font-bold text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PILLAR_HEATMAP.map(row => (
                  <tr key={row.pillar} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-semibold text-slate-700">{row.pillar}</td>
                    {["NAD","FOD","PSD","SDR","ESD","NSSTA"].map(d => (
                      <td key={d} className="py-2 px-3 text-center">
                        <span className={`inline-block w-12 py-1 rounded-lg text-xs font-bold ${getHeatColor(row[d])}`}>{row[d]}%</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dept cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {DEPARTMENTS.map(d => (
              <div key={d.code} className="p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-900">{d.name}</p>
                    <p className="text-[10px] text-slate-500">{d.officials} officials</p>
                  </div>
                  <span className={`text-base font-black ${d.avgScore >= 70 ? "text-emerald-600" : d.avgScore >= 60 ? "text-amber-600" : "text-rose-600"}`}>{d.avgScore}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full mt-3">
                  <div className={`h-full rounded-full ${d.avgScore >= 70 ? "bg-emerald-500" : d.avgScore >= 60 ? "bg-amber-400" : "bg-rose-500"}`} style={{ width: `${d.avgScore}%` }} />
                </div>
                <div className="flex gap-2 mt-2 text-[10px]">
                  <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-bold">{d.critical} critical</span>
                  <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold">{d.developing} developing</span>
                  <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">{d.strong} strong</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── OFFICERS TABLE TAB ── */}
      {activeTab === "officers" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-sm font-bold text-slate-900">👥 All Officials — Competency Scores</h3>
            <div className="flex items-center gap-3">
              <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100">
                <option value="All">All Departments</option>
                {["NAD","FOD","PSD","DIID","NSSTA"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <button onClick={exportCSV} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold transition-colors">
                ⬇ Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Official","Dept","Level","Overall","Survey","Sampling","Field Ops","Analysis","R Prog","Python","GIS","Governance","Leadership","Proj Mgmt","Override"].map(h => (
                    <th key={h} className="py-3 px-3 text-left font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOfficers.map(o => {
                  const ov = overrides[o.id];
                  const score = ov?.score || o.score;
                  return (
                    <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">{o.name}</p>
                        <p className="text-[10px] text-slate-500">{o.role}</p>
                        {ov && <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 rounded font-bold">Overridden by {ov.by}</span>}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{o.dept}</td>
                      <td className="py-3 px-3"><span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">{o.level}</span></td>
                      <td className="py-3 px-3">
                        <span className={`font-black ${score >= 75 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-rose-600"}`}>{score}%</span>
                      </td>
                      {["survey","sampling","collection","analysis","r_prog","python","gis","governance","leadership","project"].map(k => (
                        <td key={k} className="py-3 px-3">
                          <span className={`inline-block w-8 text-center py-0.5 rounded text-[10px] font-bold ${getHeatColor(o[k])}`}>{o[k]}</span>
                        </td>
                      ))}
                      <td className="py-3 px-3">
                        <button onClick={() => { setOverrideModal(o); setOverrideScore(score); }}
                          className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-2 py-1 rounded font-bold transition-colors whitespace-nowrap">
                          ✏️ Override
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 4-PILLAR TAB ── */}
      {activeTab === "pillar" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {["NAD","FOD","PSD","NSSTA"].map(dept => {
            const deptData = PILLAR_HEATMAP.map(p => ({ pillar: p.pillar.split(" ")[0], score: p[dept] }));
            return (
              <div key={dept} className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3">{dept} — 4-Pillar Radar</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={deptData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 10, fill: "#64748B" }} />
                    <Radar name={dept} dataKey="score" stroke="#0F2F64" fill="#0F2F64" fillOpacity={0.15} strokeWidth={2} />
                    <Tooltip formatter={(v) => [`${v}%`]} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      )}

      {/* Override Modal */}
      {overrideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 mb-1">Manager Score Override</h3>
            <p className="text-xs text-slate-500 mb-4">Override competency score for <strong>{overrideModal.name}</strong></p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">New Score (0–100)</label>
                <input type="number" min="0" max="100" value={overrideScore} onChange={e => setOverrideScore(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Justification *</label>
                <textarea rows={3} value={overrideJustification} onChange={e => setOverrideJustification(e.target.value)}
                  placeholder="e.g. Officer completed additional field training not captured in system..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={handleOverrideSave}
                  className="flex-1 bg-[#0F2F64] hover:bg-[#173E80] text-white py-2.5 rounded-xl font-bold text-sm transition-all">
                  Save Override
                </button>
                <button onClick={() => setOverrideModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
