import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudent } from "../App.jsx";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

// ── Correct MoSPI Organisational Structure (verified Sept 2026) ──
// Source: MoSPI Compendium of Divisions + Aug 2024 reorganisation order (SDRD → HSD)
const MOSPI_WINGS = {
  NSS: {
    label: "NSS Wing (DG, NSS)",
    divisions: ["FOD", "HSD", "EnSD", "C&QCD"],
    fullNames: {
      FOD: "Field Operations Division",
      HSD: "Household Survey Division",        // ← was SDRD before Aug 2024
      EnSD: "Enterprise Survey Division",
      "C&QCD": "Coordination & Quality Control Division",
    },
  },
  STATS: {
    label: "Statistics Wing (DG, Statistics)",
    divisions: ["ESD", "NAD", "SSD", "PSD"],
    fullNames: {
      ESD: "Economic Statistics Division",
      NAD: "National Accounts Division",
      SSD: "Social Statistics Division",
      PSD: "Price Statistics Division",
    },
  },
  OTHER: {
    label: "Other Divisions",
    divisions: ["DIID", "NSSTA", "CICD", "ASPD"],
    fullNames: {
      DIID: "Data Informatics & Innovation Division",
      NSSTA: "Capacity Development Division / NSSTA",
      CICD: "Coordination & International Cooperation Division",
      ASPD: "Administrative Statistics & Policy Division",
    },
  },
};

// ── FRAC BDF Competency Colours ──
// Behavioural = amber, Domain = blue, Functional = teal (per blueprint §6)
const BDF_COLORS = {
  Behavioural: "#C4732A",
  Domain:      "#1B4B91",
  Functional:  "#0F7A72",
};

// ── Department data (using correct division codes) ──
const DEPARTMENTS = [
  { code: "FOD",    wing: "NSS",   officials: 38, avgScore: 63, critical: 8,  developing: 20, strong: 10 },
  { code: "HSD",    wing: "NSS",   officials: 18, avgScore: 66, critical: 5,  developing: 9,  strong: 4  },
  { code: "EnSD",   wing: "NSS",   officials: 12, avgScore: 70, critical: 3,  developing: 6,  strong: 3  },
  { code: "NAD",    wing: "STATS", officials: 24, avgScore: 71, critical: 3,  developing: 12, strong: 9  },
  { code: "ESD",    wing: "STATS", officials: 20, avgScore: 76, critical: 1,  developing: 9,  strong: 10 },
  { code: "PSD",    wing: "STATS", officials: 16, avgScore: 74, critical: 2,  developing: 8,  strong: 6  },
  { code: "SSD",    wing: "STATS", officials: 14, avgScore: 69, critical: 4,  developing: 7,  strong: 3  },
  { code: "DIID",   wing: "OTHER", officials: 10, avgScore: 78, critical: 1,  developing: 5,  strong: 4  },
  { code: "NSSTA",  wing: "OTHER", officials: 30, avgScore: 55, critical: 12, developing: 14, strong: 4  },
];

// ── Officers with correct BDF competency scores ──
const OFFICERS = [
  { id: "SO-IND-2024-884", name: "Krishna Patel",   role: "Statistical Officer",       division: "HSD",  wing: "NSS",   level: "L2", score: 68,
    behavioural: 75, domain: 60, functional: 58, trend: "up" },
  { id: "DSO-HQ-2021-034", name: "Ananya Sharma",   role: "Dy. Statistical Officer",   division: "NAD",  wing: "STATS", level: "L4", score: 78,
    behavioural: 80, domain: 76, functional: 72, trend: "up" },
  { id: "FO-REG-2022-109", name: "Rajesh Verma",    role: "Field Officer",             division: "FOD",  wing: "NSS",   level: "L2", score: 63,
    behavioural: 70, domain: 65, functional: 48, trend: "stable" },
  { id: "DA-GOV-2023-412", name: "Priya Sundaram",  role: "Lead Data Analyst",         division: "DIID", wing: "OTHER", level: "L3", score: 76,
    behavioural: 72, domain: 70, functional: 82, trend: "up" },
  { id: "STU-NSSTA-2025",  name: "Aarav Sharma",    role: "Trainee Probationer",       division: "NSSTA",wing: "OTHER", level: "L1", score: 48,
    behavioural: 55, domain: 42, functional: 40, trend: "up" },
  { id: "SO-ESD-2023-221", name: "Meera Pillai",    role: "Statistical Officer",       division: "ESD",  wing: "STATS", level: "L3", score: 74,
    behavioural: 76, domain: 72, functional: 68, trend: "up" },
  { id: "SO-PSD-2022-150", name: "Arvind Nair",     role: "Statistical Officer",       division: "PSD",  wing: "STATS", level: "L2", score: 71,
    behavioural: 74, domain: 68, functional: 64, trend: "stable" },
  { id: "FO-HSD-2024-301", name: "Lakshmi Bai",     role: "Field Officer",             division: "HSD",  wing: "NSS",   level: "L2", score: 61,
    behavioural: 68, domain: 58, functional: 52, trend: "up" },
];

// ── BDF × Division heatmap ──
const BDF_HEATMAP = [
  { bdf: "Behavioural", FOD: 70, HSD: 68, EnSD: 72, NAD: 76, ESD: 78, PSD: 74, SSD: 70, DIID: 75, NSSTA: 58 },
  { bdf: "Domain",      FOD: 60, HSD: 63, EnSD: 68, NAD: 72, ESD: 76, PSD: 72, SSD: 65, DIID: 68, NSSTA: 48 },
  { bdf: "Functional",  FOD: 52, HSD: 60, EnSD: 65, NAD: 65, ESD: 70, PSD: 68, SSD: 62, DIID: 82, NSSTA: 42 },
];

const TREND_DATA = [
  { month: "Apr", score: 58 }, { month: "May", score: 61 }, { month: "Jun", score: 63 },
  { month: "Jul", score: 65 }, { month: "Aug", score: 67 }, { month: "Sep", score: 70 },
];

const PIE_DATA = [
  { name: "Strong (≥75%)", value: 43, color: "#2E7D4F" },
  { name: "Developing (55–74%)", value: 72, color: "#B8860B" },
  { name: "Critical Gap (<55%)", value: 27, color: "#B3261E" },
];

// ── ACBP Three-Lens Structure (CBC official structure) ──
const ACBP_LENSES = [
  {
    id: "national_priorities",
    label: "National Priorities",
    icon: "🏛️",
    color: "from-[#1B4B91] to-[#2563EB]",
    badge: "bg-blue-100 text-blue-800 border-blue-300",
    description: "Training aligned to government-wide priority programmes and schemes.",
    interventions: [
      { type: "Training",     title: "National Accounts Statistics (SNA 2008 aligned)", division: "NAD", gap_competency: "National Accounts", priority: "HIGH", mode: "iGOT + NSSTA TPAC" },
      { type: "Training",     title: "Census Data Processing and Digital Cartography",  division: "FOD/HSD", gap_competency: "GIS/Geospatial", priority: "HIGH", mode: "NSSTA TPAC" },
      { type: "Non-Training", title: "Job rotation: ESD ↔ NAD cross-posting",          division: "ESD/NAD", gap_competency: "Domain breadth", priority: "MED", mode: "HR intervention" },
      { type: "Training",     title: "DPDP Act 2023 compliance for data custodians",   division: "DIID/HSD", gap_competency: "Data Governance", priority: "HIGH", mode: "iGOT mandatory" },
    ],
  },
  {
    id: "emerging_technologies",
    label: "Emerging Technologies",
    icon: "⚡",
    color: "from-[#0F7A72] to-teal-600",
    badge: "bg-teal-100 text-teal-800 border-teal-300",
    description: "Upskilling in technologies reshaping official statistics globally.",
    interventions: [
      { type: "Training",     title: "R Programming for Survey Data Analysis",          division: "HSD/FOD", gap_competency: "Survey Programming", priority: "HIGH", mode: "NSSTA TPAC (35 hrs)" },
      { type: "Training",     title: "Python for Official Statistics (Pandas + PySpark)", division: "DIID/ESD", gap_competency: "Survey Programming", priority: "MED", mode: "iGOT + NSSTA" },
      { type: "Training",     title: "GIS & Remote Sensing for Census Operations",     division: "FOD/HSD", gap_competency: "GIS/Geospatial", priority: "HIGH", mode: "NSSTA TPAC (20 hrs)" },
      { type: "Non-Training", title: "Pilot AI-assisted data validation (DIID sandbox)", division: "DIID", gap_competency: "Functional – digital tools", priority: "MED", mode: "Internal pilot" },
    ],
  },
  {
    id: "citizen_centricity",
    label: "Citizen Centricity",
    icon: "🤝",
    color: "from-[#C4732A] to-amber-600",
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    description: "Competencies that improve quality, transparency and accessibility of official statistics for citizens.",
    interventions: [
      { type: "Training",     title: "Communicating Statistics to Non-Technical Audiences", division: "All divisions", gap_competency: "Stakeholder Communication", priority: "MED", mode: "iGOT (bilingual)" },
      { type: "Training",     title: "Open Data Standards and Metadata Publishing",      division: "DIID/NAD", gap_competency: "Data Governance", priority: "MED", mode: "iGOT Karmayogi" },
      { type: "Non-Training", title: "Citizen charter refresh — turnaround SLAs",        division: "ASPD", gap_competency: "Behavioural – service orientation", priority: "LOW", mode: "Policy intervention" },
      { type: "Training",     title: "Ethics and Confidentiality in Statistical Practice", division: "All", gap_competency: "Ethical Conduct", priority: "LOW", mode: "iGOT mandatory module" },
    ],
  },
];

function getHeatColor(val) {
  if (val >= 75) return "bg-emerald-500 text-white";
  if (val >= 60) return "bg-amber-400 text-white";
  if (val >= 45) return "bg-orange-400 text-white";
  return "bg-rose-600 text-white";
}
function getBDFColor(cat) {
  return { Behavioural: "bg-amber-100 text-amber-800 border-amber-300", Domain: "bg-blue-100 text-blue-800 border-blue-300", Functional: "bg-teal-100 text-teal-800 border-teal-300" }[cat] || "";
}

const ALL_DIVS = ["FOD","HSD","EnSD","NAD","ESD","PSD","SSD","DIID","NSSTA"];
const HEATMAP_DIVS = ["FOD","HSD","NAD","ESD","PSD","DIID","NSSTA"];

export default function AdminDashboard() {
  const { student } = useStudent();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDept, setSelectedDept] = useState("All");
  const [overrideModal, setOverrideModal] = useState(null);
  const [overrideJustification, setOverrideJustification] = useState("");
  const [overrideScore, setOverrideScore] = useState("");
  const [overrides, setOverrides] = useState({});
  const [acbpLens, setAcbpLens] = useState("national_priorities");
  const [acbpYear, setAcbpYear] = useState("2026–27");

  const filteredOfficers = selectedDept === "All" ? OFFICERS : OFFICERS.filter(o => o.division === selectedDept);
  const totalOfficials = DEPARTMENTS.reduce((a, d) => a + d.officials, 0);
  const avgOverall = Math.round(DEPARTMENTS.reduce((a, d) => a + d.avgScore * d.officials, 0) / totalOfficials);
  const criticalCount = DEPARTMENTS.reduce((a, d) => a + d.critical, 0);

  const handleOverrideSave = () => {
    if (!overrideJustification.trim() || !overrideScore) return;
    setOverrides(prev => ({ ...prev, [overrideModal.id]: { score: parseInt(overrideScore), justification: overrideJustification, by: student?.name, date: new Date().toLocaleDateString("en-IN") } }));
    setOverrideModal(null); setOverrideJustification(""); setOverrideScore("");
  };

  const exportCSV = () => {
    const headers = ["ID","Name","Role","Division","Wing","Level","Score","Behavioural","Domain","Functional"];
    const rows = OFFICERS.map(o => [o.id, o.name, o.role, o.division, o.wing, o.level, overrides[o.id]?.score || o.score, o.behavioural, o.domain, o.functional]);
    const csv = [headers,...rows].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "mospi_workforce_bdf_analytics.csv"; a.click();
  };

  const activeLens = ACBP_LENSES.find(l => l.id === acbpLens);

  const TABS = [
    { id: "overview", label: "📊 Overview" },
    { id: "heatmap",  label: "🗺️ BDF Heatmap" },
    { id: "officers", label: "👥 All Officers" },
    { id: "acbp",     label: "📋 ACBP Builder" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0C2340] to-[#1B4B91] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Admin · MDO</span>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-medium">Workforce Competency Intelligence</span>
            </div>
            <h1 className="text-2xl font-black text-white">MoSPI Division Analytics</h1>
            <p className="text-blue-200 text-sm mt-1 text-white/80">
              FRAC BDF Framework · {totalOfficials} Officials · {DEPARTMENTS.length} Divisions
              <span className="ml-2 text-xs text-amber-300 font-semibold">NSS Wing + Statistics Wing + DIID/NSSTA</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all shadow-sm">
              ⬇ Export BDF CSV
            </button>
            <button onClick={() => navigate("/student-dashboard")} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/20">
              🎓 Student View
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total Officials", value: totalOfficials, icon: "👥", color: "bg-white/10" },
            { label: "Avg BDF Score",  value: `${avgOverall}%`,  icon: "📊", color: "bg-emerald-500/20" },
            { label: "Critical Gap",   value: `${criticalCount}`, icon: "⚠️", color: "bg-rose-500/20" },
            { label: "Divisions",      value: DEPARTMENTS.length, icon: "🏛️", color: "bg-blue-500/20" },
          ].map(kpi => (
            <div key={kpi.label} className={`${kpi.color} rounded-xl p-4 border border-white/10`}>
              <p className="text-2xl">{kpi.icon}</p>
              <p className="text-xl font-black mt-1">{kpi.value}</p>
              <p className="text-xs text-blue-200 mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* BDF legend */}
        <div className="flex items-center gap-4 mt-4">
          <p className="text-xs text-blue-300 font-semibold">FRAC BDF:</p>
          {Object.entries(BDF_COLORS).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: color }} />
              <span className="text-xs text-blue-200 font-semibold">{cat}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === t.id ? "bg-white text-[#0F2F64]" : "bg-white/10 text-white hover:bg-white/20"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">📈 Organisation-wide Score Trend (FY 2026)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 80]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v}%`, "Avg Score"]} />
                <Line type="monotone" dataKey="score" stroke="#1B4B91" strokeWidth={2.5} dot={{ fill: "#1B4B91", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">🎯 Workforce Distribution</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart><Pie data={PIE_DATA} cx="50%" cy="50%" outerRadius={65} dataKey="value">
                {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie><Tooltip formatter={(v) => [`${v} officials`]} /></PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {PIE_DATA.map(p => (
                <div key={p.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} /><span className="text-slate-600">{p.name}</span></div>
                  <span className="font-bold text-slate-900">{p.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Division bar by wing */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">🏛️ Division-wise Avg Score (NSS Wing · Statistics Wing · Other)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={DEPARTMENTS} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="code" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="avgScore" name="Avg Score" fill="#1B4B91" radius={[4,4,0,0]} />
                <Bar dataKey="critical" name="Critical Gap" fill="#B3261E" radius={[4,4,0,0]} />
                <Bar dataKey="strong"   name="Strong" fill="#2E7D4F" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Wing breakdown */}
            <div className="grid lg:grid-cols-3 gap-4 mt-5">
              {Object.entries(MOSPI_WINGS).map(([key, wing]) => (
                <div key={key} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{wing.label}</p>
                  <div className="space-y-1.5">
                    {wing.divisions.map(d => {
                      const dept = DEPARTMENTS.find(x => x.code === d);
                      return (
                        <div key={d} className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800">{d}</span>
                            <span className="text-[10px] text-slate-400 ml-1">{wing.fullNames[d]?.replace(/Division|Coordination/g, "").trim()}</span>
                          </div>
                          {dept && <span className={`font-black text-xs ${dept.avgScore >= 70 ? "text-emerald-600" : dept.avgScore >= 60 ? "text-amber-600" : "text-rose-600"}`}>{dept.avgScore}%</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BDF HEATMAP ── */}
      {activeTab === "heatmap" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">FRAC BDF × MoSPI Division Heatmap</h3>
              <p className="text-xs text-slate-500 mt-0.5">Behavioural · Domain · Functional — official CBC taxonomy</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {[["bg-emerald-500","≥75%"],["bg-amber-400","60–74%"],["bg-orange-400","45–59%"],["bg-rose-600","<45%"]].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1"><div className={`w-3 h-3 rounded ${c}`}/><span className="text-slate-600">{l}</span></div>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 text-slate-500 font-bold w-40">BDF Category</th>
                  {HEATMAP_DIVS.map(d => (
                    <th key={d} className="py-2 px-2 text-center">
                      <p className="font-black text-slate-700">{d}</p>
                      <p className="text-[9px] text-slate-400 font-normal">{MOSPI_WINGS.NSS.fullNames[d] || MOSPI_WINGS.STATS.fullNames[d] || MOSPI_WINGS.OTHER.fullNames[d] || ""}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {BDF_HEATMAP.map(row => (
                  <tr key={row.bdf} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: BDF_COLORS[row.bdf] }} />
                        <span className="font-bold text-slate-700">{row.bdf}</span>
                      </div>
                    </td>
                    {HEATMAP_DIVS.map(d => (
                      <td key={d} className="py-2 px-2 text-center">
                        <span className={`inline-block w-10 py-1 rounded-lg text-xs font-bold ${getHeatColor(row[d])}`}>{row[d]}%</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Division cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {DEPARTMENTS.map(d => (
              <div key={d.code} className="p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-900">{d.code}</p>
                    <p className="text-[10px] text-slate-500">{MOSPI_WINGS.NSS.fullNames[d.code] || MOSPI_WINGS.STATS.fullNames[d.code] || MOSPI_WINGS.OTHER.fullNames[d.code]}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${d.wing === "NSS" ? "bg-blue-100 text-blue-700" : d.wing === "STATS" ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"}`}>
                      {d.wing === "NSS" ? "NSS Wing" : d.wing === "STATS" ? "Statistics Wing" : "Other"}
                    </span>
                  </div>
                  <span className={`text-base font-black ${d.avgScore >= 70 ? "text-emerald-600" : d.avgScore >= 60 ? "text-amber-600" : "text-rose-600"}`}>{d.avgScore}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full mt-3">
                  <div className={`h-full rounded-full ${d.avgScore >= 70 ? "bg-emerald-500" : d.avgScore >= 60 ? "bg-amber-400" : "bg-rose-600"}`} style={{ width: `${d.avgScore}%` }} />
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

      {/* ── OFFICERS TABLE ── */}
      {activeTab === "officers" && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">All Officers — FRAC BDF Scores</h3>
              <p className="text-xs text-slate-400">Behavioural · Domain · Functional (CBC official categories)</p>
            </div>
            <div className="flex items-center gap-3">
              <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none">
                <option value="All">All Divisions</option>
                {ALL_DIVS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <button onClick={exportCSV} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold">⬇ Export</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Official","Division","Wing","Level","Overall Score","Behavioural","Domain","Functional","Sup. Override"].map(h => (
                    <th key={h} className="py-3 px-3 text-left font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOfficers.map(o => {
                  const ov = overrides[o.id];
                  const score = ov?.score || o.score;
                  return (
                    <tr key={o.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">{o.name}</p>
                        <p className="text-[10px] text-slate-500">{o.role}</p>
                        <p className="text-[10px] font-mono text-slate-400">{o.id}</p>
                        {ov && <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 rounded font-bold">Override by {ov.by}</span>}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-black text-slate-800">{o.division}</span>
                        <p className="text-[10px] text-slate-400">{MOSPI_WINGS.NSS.fullNames[o.division] || MOSPI_WINGS.STATS.fullNames[o.division] || MOSPI_WINGS.OTHER.fullNames[o.division] || ""}</p>
                      </td>
                      <td className="py-3 px-3"><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${o.wing === "NSS" ? "bg-blue-100 text-blue-700" : o.wing === "STATS" ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"}`}>{o.wing}</span></td>
                      <td className="py-3 px-3"><span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">{o.level}</span></td>
                      <td className="py-3 px-3"><span className={`font-black text-sm ${score >= 75 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-rose-600"}`}>{score}%</span></td>
                      {["behavioural","domain","functional"].map(k => (
                        <td key={k} className="py-3 px-3">
                          <span className={`inline-block w-9 text-center py-0.5 rounded text-[10px] font-bold ${getHeatColor(o[k])}`}>{o[k]}</span>
                        </td>
                      ))}
                      <td className="py-3 px-3">
                        <button onClick={() => { setOverrideModal(o); setOverrideScore(score); }}
                          className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-2 py-1 rounded font-bold whitespace-nowrap">
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

      {/* ── ACBP BUILDER ── */}
      {activeTab === "acbp" && (
        <div className="space-y-5">
          {/* ACBP Header */}
          <div className="bg-gradient-to-r from-[#0C2340] to-[#1B4B91] rounded-2xl p-6 text-white">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded font-bold">CBC</span>
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-medium">Annual Capacity Building Plan</span>
                </div>
                <h2 className="text-xl font-black text-white">ACBP — MoSPI Division</h2>
                <p className="text-blue-200 text-sm mt-1">
                  Built from TNA gap data · Three-lens CBC structure · Generated by CogniPath AI
                </p>
                <p className="text-xs text-blue-300 mt-1">
                  Source: Capacity Building Commission (cbc.gov.in) — ACBP structured around National Priorities, Emerging Technologies, Citizen Centricity
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select value={acbpYear} onChange={e => setAcbpYear(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white text-xs rounded-lg px-3 py-2 focus:outline-none">
                  <option className="bg-[#0F2F64]" value="2026–27">FY 2026–27</option>
                  <option className="bg-[#0F2F64]" value="2027–28">FY 2027–28</option>
                </select>
                <button onClick={() => alert("ACBP PDF export — would generate a formatted CBC-standard PDF in production.")}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all">
                  ⬇ Export PDF/DOCX
                </button>
              </div>
            </div>

            {/* 3-lens selector */}
            <div className="flex gap-2 mt-5 flex-wrap">
              {ACBP_LENSES.map(lens => (
                <button key={lens.id} onClick={() => setAcbpLens(lens.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    acbpLens === lens.id ? "bg-white text-[#0F2F64]" : "bg-white/10 text-white hover:bg-white/20"
                  }`}>
                  <span>{lens.icon}</span><span>{lens.label}</span>
                  {acbpLens === lens.id && <span className="text-[9px] bg-amber-400 text-amber-900 px-1 rounded">Active</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Active lens content */}
          {activeLens && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className={`bg-gradient-to-r ${activeLens.color} rounded-xl p-4 text-white mb-5`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeLens.icon}</span>
                  <div>
                    <h3 className="font-black text-lg">{activeLens.label}</h3>
                    <p className="text-white/80 text-sm">{activeLens.description}</p>
                  </div>
                </div>
              </div>

              {/* Interventions table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {["Type","Intervention","Division(s)","Gap Competency","Priority","Delivery Mode"].map(h => (
                        <th key={h} className="py-3 px-3 text-left font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeLens.interventions.map((iv, i) => (
                      <tr key={i} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${iv.type === "Training" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"}`}>
                            {iv.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800 max-w-xs">{iv.title}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">{iv.division}</td>
                        <td className="py-3 px-3 text-slate-600">{iv.gap_competency}</td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            iv.priority === "HIGH" ? "bg-rose-100 text-rose-700" :
                            iv.priority === "MED"  ? "bg-amber-100 text-amber-700" :
                            "bg-slate-100 text-slate-600"
                          }`}>{iv.priority}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{iv.mode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
                <strong>📌 Note:</strong> This ACBP draft is auto-generated from the TNA gap snapshot as of {acbpYear}. A human L&D admin should review and edit before submission to CBC. Non-training interventions (job rotation, policy changes) require HR/administration approval.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Override Modal */}
      {overrideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 mb-1">Supervisor Score Override</h3>
            <p className="text-xs text-slate-500 mb-4">Override BDF score for <strong>{overrideModal.name}</strong> · {overrideModal.division}</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">New Overall Score (0–100)</label>
                <input type="number" min="0" max="100" value={overrideScore} onChange={e => setOverrideScore(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Justification (required by FRAC audit trail) *</label>
                <textarea rows={3} value={overrideJustification} onChange={e => setOverrideJustification(e.target.value)}
                  placeholder="e.g. Officer completed additional HSD field training not yet reflected in system..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={handleOverrideSave} className="flex-1 bg-[#1B4B91] hover:bg-[#153d7a] text-white py-2.5 rounded-xl font-bold text-sm transition-all">Save Override</button>
                <button onClick={() => setOverrideModal(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
