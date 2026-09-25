import { useState } from "react";
import { Link } from "react-router-dom";

const COHORT_OFFICERS = [
  {
    id: "EMP-01",
    name: "Krishna Patel",
    role: "Statistical Officer",
    department: "National Accounts Division",
    scores: {
      survey: 50,
      sampling: 65,
      collection: 90,
      analysis: 70,
      visualization: 85,
      governance: 55,
    },
  },
  {
    id: "EMP-02",
    name: "Ananya Sharma",
    role: "Deputy Statistical Officer",
    department: "Field Operations Division (FOD)",
    scores: {
      survey: 55,
      sampling: 60,
      collection: 88,
      analysis: 72,
      visualization: 80,
      governance: 50,
    },
  },
  {
    id: "EMP-03",
    name: "Rajesh Verma",
    role: "Field Officer",
    department: "Regional Office, Lucknow",
    scores: {
      survey: 45,
      sampling: 58,
      collection: 95,
      analysis: 60,
      visualization: 70,
      governance: 52,
    },
  },
  {
    id: "EMP-04",
    name: "Priya Sundaram",
    role: "Data Analyst",
    department: "Data Informatics & Innovation Division (DIID)",
    scores: {
      survey: 60,
      sampling: 70,
      collection: 80,
      analysis: 85,
      visualization: 92,
      governance: 68,
    },
  },
  {
    id: "EMP-05",
    name: "Vikram Singh",
    role: "Statistical Officer",
    department: "Price Statistics Division",
    scores: {
      survey: 48,
      sampling: 62,
      collection: 85,
      analysis: 68,
      visualization: 75,
      governance: 56,
    },
  },
  {
    id: "EMP-06",
    name: "Neha Gupta",
    role: "Data Analyst",
    department: "Economic Statistics Wing",
    scores: {
      survey: 54,
      sampling: 66,
      collection: 78,
      analysis: 75,
      visualization: 82,
      governance: 62,
    },
  },
  {
    id: "EMP-07",
    name: "Amit Deshmukh",
    role: "Field Officer",
    department: "Regional Office, Pune",
    scores: {
      survey: 52,
      sampling: 64,
      collection: 92,
      analysis: 65,
      visualization: 74,
      governance: 54,
    },
  },
  {
    id: "EMP-08",
    name: "Sunita Rao",
    role: "Statistical Officer",
    department: "Social Statistics Division",
    scores: {
      survey: 52,
      sampling: 67,
      collection: 84,
      analysis: 73,
      visualization: 78,
      governance: 59,
    },
  },
];

// Competencies with averages matching prompt item 12:
// Survey Design: 52%, Sampling: 64%, Data Collection: 82%, Statistical Analysis: 71%, Visualization: 78%, Data Governance: 58%
const COMPETENCY_METRICS = [
  { id: "survey", label: "Survey Design", average: 52, status: "Critical Gap", priority: "Highest" },
  { id: "sampling", label: "Sampling Methods", average: 64, status: "Developing", priority: "Medium" },
  { id: "collection", label: "Data Collection", average: 82, status: "Strong", priority: "Low" },
  { id: "analysis", label: "Statistical Analysis", average: 71, status: "Developing", priority: "Medium" },
  { id: "visualization", label: "Data Visualization", average: 78, status: "Strong", priority: "Low" },
  { id: "governance", label: "Data Governance", average: 58, status: "Critical Gap", priority: "High" },
];

export default function AdminAnalytics() {
  const [officers, setOfficers] = useState(COHORT_OFFICERS);
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [overrideModal, setOverrideModal] = useState(null); // Officer object or null
  const [overrideForm, setOverrideForm] = useState({
    skill: "survey",
    newScore: 75,
    reason: "Supervisor field inspection verified practical competency on NSS 79th Round manual",
    authorizedBy: "Cadre Supervisor / Joint Director",
  });
  const [toastMessage, setToastMessage] = useState(null);

  const getHeatmapColor = (score) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-900 border-emerald-200 font-bold";
    if (score >= 65) return "bg-blue-100 text-blue-900 border-blue-200 font-semibold";
    if (score >= 55) return "bg-amber-100 text-amber-900 border-amber-200 font-semibold";
    return "bg-rose-100 text-rose-900 border-rose-200 font-bold";
  };

  const filteredOfficers = officers.filter((o) => {
    const matchDept = selectedDept === "all" || o.department.includes(selectedDept);
    const matchRole = selectedRole === "all" || o.role.toLowerCase().includes(selectedRole.toLowerCase());
    return matchDept && matchRole;
  });

  const handleExportCSV = () => {
    const headers = [
      "Officer ID",
      "Full Name",
      "Cadre Role",
      "Department",
      "Survey Design",
      "Sampling Methods",
      "Data Collection",
      "Statistical Analysis",
      "Data Visualization",
      "Data Governance",
      "Overall Avg",
      "Audit Status"
    ];
    const rows = officers.map((o) => {
      const vals = Object.values(o.scores);
      const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
      return [
        o.id,
        `"${o.name}"`,
        `"${o.role}"`,
        `"${o.department}"`,
        o.scores.survey,
        o.scores.sampling,
        o.scores.collection,
        o.scores.analysis,
        o.scores.visualization,
        o.scores.governance,
        avg,
        o.isOverridden ? `"Manager Overridden: ${o.overrideReason || ''}"` : '"Standard Baseline"'
      ].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mospi_workforce_competency_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage("Report Exported: Downloaded mospi_workforce_competency_audit.csv successfully!");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveOverride = (e) => {
    e.preventDefault();
    if (!overrideModal) return;

    setOfficers((prev) =>
      prev.map((o) => {
        if (o.id === overrideModal.id) {
          const updatedScores = {
            ...o.scores,
            [overrideForm.skill]: Number(overrideForm.newScore),
          };
          return {
            ...o,
            scores: updatedScores,
            isOverridden: true,
            overrideSkill: overrideForm.skill,
            overrideReason: overrideForm.reason,
            overrideAuthor: overrideForm.authorizedBy,
          };
        }
        return o;
      })
    );

    setToastMessage(`Manager Override Applied: Updated ${overrideModal.name}'s score to ${overrideForm.newScore}% with audit justification.`);
    setTimeout(() => setToastMessage(null), 4500);
    setOverrideModal(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-lg flex items-center justify-between text-xs font-semibold animate-slide-up">
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">&times;</button>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Institutional Capacity Oversight
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-0.5 font-display">
            Workforce Competency Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated institutional competency radar, department-level gaps, and national training priorities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
            title="Download complete workforce competency matrix as CSV spreadsheet"
          >
            <span>📥 Export Audit Report (CSV)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs"
          >
            Print / PDF
          </button>
          <Link
            to="/training-roi"
            className="bg-[#0F2F64] hover:bg-[#173E80] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>Training ROI</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Competency</span>
          <p className="text-3xl font-black text-[#0F2F64] mt-1">67.5%</p>
          <p className="text-xs text-slate-500 mt-0.5">Across MoSPI Cadre Cohort</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Most Critical Skill Gap</span>
          <p className="text-xl font-bold text-rose-700 mt-1 truncate">Survey Design (52%)</p>
          <p className="text-xs text-slate-500 mt-0.5">Followed by Governance (58%)</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department Gap Index</span>
          <p className="text-3xl font-black text-amber-600 mt-1">FOD & Price</p>
          <p className="text-xs text-slate-500 mt-0.5">Highest training need</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Training Priority Action</span>
          <p className="text-base font-bold text-slate-900 mt-1 truncate">Deploy NSSTA Survey Track</p>
          <p className="text-xs text-slate-500 mt-0.5">Mandatory via iGOT Karmayogi</p>
        </div>
      </div>

      {/* ── Competency Averages & Training Priorities (Prompt Item 12 Table) ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              National Cadre Competency Averages
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Highlighting the most common competency gaps across the surveyed cohort
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">Benchmark: 80%</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMPETENCY_METRICS.map((metric) => {
            const isCritical = metric.status === "Critical Gap";
            return (
              <div
                key={metric.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCritical
                    ? "bg-rose-50/50 border-rose-200"
                    : "bg-slate-50/60 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900">{metric.label}</h3>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isCritical
                        ? "bg-rose-100 text-rose-800"
                        : metric.status === "Strong"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {metric.average}%
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      isCritical ? "bg-rose-500" : metric.average >= 75 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${metric.average}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between mt-2.5 text-[11px]">
                  <span className="text-slate-500 font-medium">Status: {metric.status}</span>
                  <span className={`font-bold ${isCritical ? "text-rose-700" : "text-slate-600"}`}>
                    Priority: {metric.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Competency Heatmap Matrix (Prompt Item 12) ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Officer Competency Heatmap Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual skill distribution across statistical officers and analysts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Department Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-500">Division:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700"
              >
                <option value="all">All Divisions</option>
                <option value="National Accounts">National Accounts</option>
                <option value="Field Operations">Field Operations</option>
                <option value="Data Informatics">Data Informatics</option>
                <option value="Price Statistics">Price Statistics</option>
                <option value="Economic Statistics">Economic Statistics</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-500">Cadre Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700"
              >
                <option value="all">All Roles / Grades</option>
                <option value="Statistical Officer">Statistical Officers</option>
                <option value="Data Analyst">Data Analysts</option>
                <option value="Field Officer">Field Officers</option>
              </select>
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-medium text-slate-600 text-[11px]">
                <span className="w-2.5 h-2.5 rounded bg-rose-200 border border-rose-300"></span> &lt;60%
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-600 text-[11px]">
                <span className="w-2.5 h-2.5 rounded bg-amber-200 border border-amber-300"></span> 60-74%
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-600 text-[11px]">
                <span className="w-2.5 h-2.5 rounded bg-emerald-200 border border-emerald-300"></span> ≥75%
              </span>
            </div>
          </div>
        </div>

        {/* Heatmap Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Officer & Designation</th>
                <th className="py-3 px-2 text-center">Survey Design</th>
                <th className="py-3 px-2 text-center">Sampling</th>
                <th className="py-3 px-2 text-center">Data Collection</th>
                <th className="py-3 px-2 text-center">Statistical Analysis</th>
                <th className="py-3 px-2 text-center">Visualization</th>
                <th className="py-3 px-2 text-center">Data Governance</th>
                <th className="py-3 px-2 text-center">Avg Score</th>
                <th className="py-3 px-3 text-center">Manager Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOfficers.map((officer) => {
                const vals = Object.values(officer.scores);
                const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
                const isSelectedKrishna = officer.name === "Krishna Patel";

                return (
                  <tr
                    key={officer.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelectedKrishna ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-bold text-slate-900 flex items-center gap-1.5">
                            {officer.name}
                            {isSelectedKrishna && (
                              <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-semibold">
                                Current User
                              </span>
                            )}
                            {officer.isOverridden && (
                              <span className="text-[9px] bg-purple-100 text-purple-800 border border-purple-200 px-1 py-0.2 rounded font-mono font-bold" title={`Overridden by: ${officer.overrideAuthor}`}>
                                Overridden
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-400">{officer.role} &bull; {officer.department}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-2 text-center">
                      <span className={`inline-block w-12 py-1 rounded text-center border ${getHeatmapColor(officer.scores.survey)}`}>
                        {officer.scores.survey}%
                      </span>
                    </td>

                    <td className="py-2.5 px-2 text-center">
                      <span className={`inline-block w-12 py-1 rounded text-center border ${getHeatmapColor(officer.scores.sampling)}`}>
                        {officer.scores.sampling}%
                      </span>
                    </td>

                    <td className="py-2.5 px-2 text-center">
                      <span className={`inline-block w-12 py-1 rounded text-center border ${getHeatmapColor(officer.scores.collection)}`}>
                        {officer.scores.collection}%
                      </span>
                    </td>

                    <td className="py-2.5 px-2 text-center">
                      <span className={`inline-block w-12 py-1 rounded text-center border ${getHeatmapColor(officer.scores.analysis)}`}>
                        {officer.scores.analysis}%
                      </span>
                    </td>

                    <td className="py-2.5 px-2 text-center">
                      <span className={`inline-block w-12 py-1 rounded text-center border ${getHeatmapColor(officer.scores.visualization)}`}>
                        {officer.scores.visualization}%
                      </span>
                    </td>

                    <td className="py-2.5 px-2 text-center">
                      <span className={`inline-block w-12 py-1 rounded text-center border ${getHeatmapColor(officer.scores.governance)}`}>
                        {officer.scores.governance}%
                      </span>
                    </td>

                    <td className="py-2.5 px-2 text-center font-black text-slate-900 text-sm">
                      {avg}%
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => {
                          setOverrideModal(officer);
                          setOverrideForm({
                            skill: "survey",
                            newScore: officer.scores.survey + 15,
                            reason: "Supervisor field inspection verified practical competency on NSS 79th Round manual",
                            authorizedBy: "Cadre Supervisor / Joint Director",
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 transition-colors border border-slate-200"
                        title="Authorized Supervisor Competency Override"
                      >
                        ⚙️ Override
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MANAGER / ADMIN OVERRIDE MODAL ── */}
      {overrideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-base font-bold">
                  ⚙️
                </div>
                <div>
                  <h3 className="text-sm font-bold">Manager Competency Override</h3>
                  <p className="text-[11px] text-purple-200">Authorized administrative adjustment with audit trail</p>
                </div>
              </div>
              <button
                onClick={() => setOverrideModal(null)}
                className="text-white/80 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveOverride} className="p-6 space-y-4 text-xs">
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-purple-900">
                <p className="font-bold">{overrideModal.name} &bull; <span className="font-normal">{overrideModal.role}</span></p>
                <p className="text-[11px] text-purple-700 mt-0.5">{overrideModal.department}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Competency to Override
                </label>
                <select
                  value={overrideForm.skill}
                  onChange={(e) => setOverrideForm({ ...overrideForm, skill: e.target.value })}
                  className="gov-input text-xs"
                >
                  <option value="survey">Survey Design (Current: {overrideModal.scores.survey}%)</option>
                  <option value="sampling">Sampling Methods (Current: {overrideModal.scores.sampling}%)</option>
                  <option value="collection">Data Collection (Current: {overrideModal.scores.collection}%)</option>
                  <option value="analysis">Statistical Analysis (Current: {overrideModal.scores.analysis}%)</option>
                  <option value="visualization">Data Visualization (Current: {overrideModal.scores.visualization}%)</option>
                  <option value="governance">Data Governance (Current: {overrideModal.scores.governance}%)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Adjusted Score (0 - 100%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={overrideForm.newScore}
                  onChange={(e) => setOverrideForm({ ...overrideForm, newScore: e.target.value })}
                  className="gov-input font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Justification / Audit Reason *
                </label>
                <textarea
                  rows="3"
                  required
                  value={overrideForm.reason}
                  onChange={(e) => setOverrideForm({ ...overrideForm, reason: e.target.value })}
                  className="gov-input text-xs"
                  placeholder="e.g. Field inspection and peer evaluation verified practical competency..."
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Authorized By
                </label>
                <input
                  type="text"
                  required
                  value={overrideForm.authorizedBy}
                  onChange={(e) => setOverrideForm({ ...overrideForm, authorizedBy: e.target.value })}
                  className="gov-input text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setOverrideModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-800 hover:bg-purple-900 text-white px-5 py-2 rounded-xl font-bold shadow-md transition-all"
                >
                  Save Override & Log Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
