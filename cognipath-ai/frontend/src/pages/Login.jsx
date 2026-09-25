import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStudent } from "../App.jsx";

// 5 Rich government & student default personas
export const DEFAULT_PERSONAS = [
  {
    name: "Krishna Patel",
    employeeId: "SO-IND-2024-884",
    department: "Official Statistical System",
    designation: "Senior Statistical Officer",
    role: "Statistical Officer",
    currentLevel: "Intermediate (Level 2)",
    overallScore: 68,
    assessmentStatus: "Baseline Assessment Completed",
    avatarBg: "from-[#0F2F64] to-[#2563EB]",
    tag: "Statistical Cadre",
    summary: "Strong in fieldwork and visualization; critical gaps in survey design and statutory DPDP compliance.",
    competencies: {
      survey_design: 50,
      sampling_methods: 65,
      data_collection: 90,
      statistical_analysis: 70,
      data_visualization: 85,
      data_governance: 55,
    },
  },
  {
    name: "Priya Sundaram",
    employeeId: "DA-GOV-2023-412",
    department: "Data Informatics & Innovation Division (DIID)",
    designation: "Lead Data Analyst",
    role: "Data Analyst",
    currentLevel: "Proficient (Level 3)",
    overallScore: 76,
    assessmentStatus: "Specialist Assessment Completed",
    avatarBg: "from-indigo-600 to-purple-600",
    tag: "Data Science Track",
    summary: "Exceptional statistical modeling and executive dashboard visualization; developing in survey frameworks.",
    competencies: {
      survey_design: 60,
      sampling_methods: 70,
      data_collection: 80,
      statistical_analysis: 85,
      data_visualization: 92,
      data_governance: 68,
    },
  },
  {
    name: "Rajesh Verma",
    employeeId: "FO-REG-2022-109",
    department: "Field Operations Division (FOD), Regional Office",
    designation: "Senior Field Enumerator",
    role: "Field Officer",
    currentLevel: "Developing (Level 2)",
    overallScore: 63,
    assessmentStatus: "Field Competency Audited",
    avatarBg: "from-emerald-600 to-teal-700",
    tag: "Field Operations",
    summary: "Unrivaled primary CAPI field operations mastery (95%); requires training in multi-stage cluster sampling.",
    competencies: {
      survey_design: 45,
      sampling_methods: 58,
      data_collection: 95,
      statistical_analysis: 60,
      data_visualization: 70,
      data_governance: 52,
    },
  },
  {
    name: "Ananya Sharma",
    employeeId: "DSO-HQ-2021-034",
    department: "National Accounts Division (NAD), Central HQ",
    designation: "Deputy Statistical Officer",
    role: "Statistical Officer",
    currentLevel: "Advanced (Level 4)",
    overallScore: 78,
    assessmentStatus: "Leadership Fast-Track",
    avatarBg: "from-blue-700 to-cyan-600",
    tag: "Cadre Leadership",
    summary: "High competency across macroeconomic estimation and survey methodology; candidate for Assistant Director.",
    competencies: {
      survey_design: 75,
      sampling_methods: 72,
      data_collection: 88,
      statistical_analysis: 78,
      data_visualization: 82,
      data_governance: 72,
    },
  },
  {
    name: "Aarav Sharma",
    employeeId: "STU-NSSTA-2025-05",
    department: "National Statistical Systems Training Academy (NSSTA)",
    designation: "Trainee Probationer / Student",
    role: "Student",
    currentLevel: "Foundational (Level 1)",
    overallScore: 48,
    assessmentStatus: "Pre-Service Intake Completed",
    avatarBg: "from-amber-600 to-orange-500",
    tag: "Probationer / Student",
    summary: "Entry-level trainee probationer embarking on the foundational official statistics curriculum.",
    competencies: {
      survey_design: 40,
      sampling_methods: 45,
      data_collection: 60,
      statistical_analysis: 52,
      data_visualization: 50,
      data_governance: 38,
    },
  },
];

// Helper to retrieve personas with custom friends added by the user
export function getStoredPersonas() {
  try {
    const custom = localStorage.getItem("cognipath_custom_personas");
    if (custom) {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return [...DEFAULT_PERSONAS, ...parsed];
      }
    }
  } catch (e) {
    console.error("Failed to load custom personas:", e);
  }
  return DEFAULT_PERSONAS;
}

export const PERSONAS = getStoredPersonas();

const ROLES = [
  "Statistical Officer",
  "Data Analyst",
  "Field Officer",
  "Student",
];

// Helper to generate baseline competencies for a new person based on role
function generateCompetenciesForRole(role) {
  if (role === "Data Analyst") {
    return {
      survey_design: 55,
      sampling_methods: 65,
      data_collection: 75,
      statistical_analysis: 88,
      data_visualization: 90,
      data_governance: 65,
    };
  } else if (role === "Field Officer") {
    return {
      survey_design: 50,
      sampling_methods: 60,
      data_collection: 92,
      statistical_analysis: 58,
      data_visualization: 65,
      data_governance: 50,
    };
  } else if (role === "Student") {
    return {
      survey_design: 45,
      sampling_methods: 48,
      data_collection: 58,
      statistical_analysis: 50,
      data_visualization: 52,
      data_governance: 40,
    };
  } else {
    // Default Statistical Officer
    return {
      survey_design: 60,
      sampling_methods: 68,
      data_collection: 85,
      statistical_analysis: 72,
      data_visualization: 78,
      data_governance: 60,
    };
  }
}

export default function Login() {
  const { student, setStudent, setCompetencies } = useStudent();
  const navigate = useNavigate();

  const [personaList, setPersonaList] = useState(getStoredPersonas());
  const [selectedPersona, setSelectedPersona] = useState(personaList[0]);
  const [activeTab, setActiveTab] = useState("presets"); // "presets" | "custom" | "add_friend"

  // Quick form for adding a friend
  const [friendForm, setFriendForm] = useState({
    name: "",
    role: "Statistical Officer",
    department: "",
    designation: "",
    employeeId: "",
  });

  // Custom login form state
  const [formData, setFormData] = useState({
    name: student?.name || personaList[0].name,
    employeeId: student?.employeeId || personaList[0].employeeId,
    department: student?.department || personaList[0].department,
    designation: student?.designation || personaList[0].designation,
    role: student?.role || personaList[0].role,
  });

  const handleApplyPersona = (p) => {
    setSelectedPersona(p);
    setFormData({
      name: p.name,
      employeeId: p.employeeId,
      department: p.department,
      designation: p.designation,
      role: p.role,
    });
  };

  const handleLoginSubmit = (personaToUse) => {
    const p = personaToUse || selectedPersona;

    const studentData = {
      student_id: 1,
      name: (personaToUse ? personaToUse.name : formData.name) || p.name,
      role: (personaToUse ? personaToUse.role : formData.role) || p.role,
      department: (personaToUse ? personaToUse.department : formData.department) || p.department,
      designation: (personaToUse ? personaToUse.designation : formData.designation) || p.designation,
      employeeId: (personaToUse ? personaToUse.employeeId : formData.employeeId) || p.employeeId,
      currentLevel: p.currentLevel || "Intermediate (Level 2)",
      overallScore: p.overallScore || 68,
      assessmentStatus: p.assessmentStatus || "Baseline Assessment Completed",
    };

    setStudent(studentData);

    // Update global competencies according to this persona's scores
    const compMap = p.competencies || generateCompetenciesForRole(studentData.role);
    setCompetencies((prev) =>
      prev.map((c) => {
        const newCurrent = compMap[c.id] ?? c.current;
        const newGap = Math.max(0, c.required - newCurrent);
        let newStatus = "Developing";
        if (newCurrent >= 75) newStatus = "Strong";
        else if (newGap >= 20) newStatus = "Critical Gap";

        return {
          ...c,
          current: newCurrent,
          gap: newGap,
          status: newStatus,
          reAssessed: Math.min(100, newCurrent + 15),
        };
      })
    );

    navigate("/profile");
  };

  // Add friend handler
  const handleAddFriendSubmit = (e) => {
    e.preventDefault();
    if (!friendForm.name.trim()) return;

    const roleComps = generateCompetenciesForRole(friendForm.role);
    const scoreValues = Object.values(roleComps);
    const avgScore = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);

    const newFriendPersona = {
      name: friendForm.name.trim(),
      employeeId: friendForm.employeeId.trim() || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      department: friendForm.department.trim() || "National Statistical System",
      designation: friendForm.designation.trim() || friendForm.role,
      role: friendForm.role,
      currentLevel: avgScore >= 75 ? "Proficient (Level 3)" : avgScore >= 60 ? "Intermediate (Level 2)" : "Foundational (Level 1)",
      overallScore: avgScore,
      assessmentStatus: "Self-Registered User",
      avatarBg: "from-teal-600 to-cyan-700",
      tag: "Friend / Custom User",
      isCustom: true,
      summary: `Registered official in ${friendForm.department || "National Statistical System"}. Ready for personalized competency tracking.`,
      competencies: roleComps,
    };

    // Save to localStorage
    try {
      const existing = localStorage.getItem("cognipath_custom_personas");
      const parsed = existing ? JSON.parse(existing) : [];
      const updated = [...parsed.filter((p) => p.employeeId !== newFriendPersona.employeeId), newFriendPersona];
      localStorage.setItem("cognipath_custom_personas", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save friend persona:", err);
    }

    const updatedList = [...DEFAULT_PERSONAS, newFriendPersona];
    setPersonaList(updatedList);
    setSelectedPersona(newFriendPersona);

    // Auto log in as the newly added friend
    handleLoginSubmit(newFriendPersona);
  };

  const handleDeleteCustomPersona = (e, employeeId) => {
    e.stopPropagation();
    try {
      const existing = localStorage.getItem("cognipath_custom_personas");
      if (existing) {
        const parsed = JSON.parse(existing);
        const filtered = parsed.filter((p) => p.employeeId !== employeeId);
        localStorage.setItem("cognipath_custom_personas", JSON.stringify(filtered));
        const updatedList = [...DEFAULT_PERSONAS, ...filtered];
        setPersonaList(updatedList);
        if (selectedPersona.employeeId === employeeId) {
          setSelectedPersona(DEFAULT_PERSONAS[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Top Emblem & Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0F2F64] to-[#2563EB] text-white shadow-lg shadow-blue-950/15 mb-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-display">
            Welcome to <span className="text-[#0F2F64]">CogniPath</span>{" "}
            <span className="text-[#2563EB]">AI</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 font-normal">
            Select an official to log in, or easily add your friend to log in with their own name!
          </p>
          <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Multi-User Persona Simulator &bull; Parichay / Jan Samarth SSO Ready
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 space-y-6">
          {/* Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("presets")}
                className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all ${
                  activeTab === "presets"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Log In As Official ({personaList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("add_friend")}
                className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === "add_friend"
                    ? "bg-[#0F2F64] text-white shadow-xs font-bold"
                    : "text-[#0F2F64] hover:bg-blue-50 font-bold"
                }`}
              >
                <span>+ Add Friend to Login</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("custom")}
                className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all ${
                  activeTab === "custom"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Quick Credentials
              </button>
            </div>
            <span className="text-xs text-slate-400 hidden sm:block">
              {activeTab === "add_friend" ? "Register any new person" : "Click any profile to log in"}
            </span>
          </div>

          {/* ── TAB 1: 1-Click Persona List ── */}
          {activeTab === "presets" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select Who Is Logging In:
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("add_friend")}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>+ Add your friend</span>
                </button>
              </div>

              <div className="grid gap-3">
                {personaList.map((p) => {
                  const isSelected = selectedPersona.employeeId === p.employeeId;
                  return (
                    <div
                      key={p.employeeId}
                      onClick={() => handleApplyPersona(p)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-blue-50/80 border-blue-500 shadow-xs ring-1 ring-blue-500"
                          : "bg-slate-50/60 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${p.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}
                        >
                          {p.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              p.isCustom 
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-white text-slate-700 border-slate-200"
                            }`}>
                              {p.tag}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {p.designation} &bull; <span className="text-slate-400">{p.department}</span>
                          </p>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-1 italic">
                            &ldquo;{p.summary}&rdquo;
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">
                            Competency
                          </span>
                          <span className="text-base font-black text-[#0F2F64]">
                            {p.overallScore}%
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          {p.isCustom && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteCustomPersona(e, p.employeeId)}
                              title="Remove custom user"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs"
                            >
                              &times;
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoginSubmit(p);
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                              isSelected
                                ? "bg-[#0F2F64] hover:bg-[#173E80] text-white"
                                : "bg-white hover:bg-blue-600 hover:text-white text-slate-700 border border-slate-200"
                            }`}
                          >
                            Log In &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add friend helper banner */}
              <div 
                onClick={() => setActiveTab("add_friend")}
                className="mt-4 p-4 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base">
                    +
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-900">Want your friend to log in?</p>
                    <p className="text-[11px] text-blue-700">Add your friend&apos;s name and role in 10 seconds to generate their login!</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-white px-3 py-1 rounded-lg border border-blue-200 shadow-2xs">
                  Add Now &rarr;
                </span>
              </div>
            </div>
          )}

          {/* ── TAB 2: Add Friend Form ── */}
          {activeTab === "add_friend" && (
            <form onSubmit={handleAddFriendSubmit} className="space-y-4">
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Add Any Friend or New Officer
                </h3>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Enter your friend&apos;s details below. They will immediately receive a customized AI competency profile and be permanently saved to your login list!
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Friend&apos;s Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={friendForm.name}
                  onChange={(e) => setFriendForm({ ...friendForm, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma, Sneha Rao, etc."
                  className="gov-input"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Cadre / Role
                  </label>
                  <select
                    value={friendForm.role}
                    onChange={(e) => setFriendForm({ ...friendForm, role: e.target.value })}
                    className="gov-input"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Employee / Roll ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={friendForm.employeeId}
                    onChange={(e) => setFriendForm({ ...friendForm, employeeId: e.target.value })}
                    placeholder="e.g. OFF-2025-102 (or leave blank)"
                    className="gov-input font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department / College
                  </label>
                  <input
                    type="text"
                    value={friendForm.department}
                    onChange={(e) => setFriendForm({ ...friendForm, department: e.target.value })}
                    placeholder="e.g. Price Statistics / NSSTA / IIT"
                    className="gov-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={friendForm.designation}
                    onChange={(e) => setFriendForm({ ...friendForm, designation: e.target.value })}
                    placeholder="e.g. Statistical Officer, Trainee"
                    className="gov-input"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#0F2F64] to-[#2563EB] hover:opacity-95 text-white py-3 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Save & Log In As Friend Now</span>
                  <span>&rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("presets")}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* ── TAB 3: Quick Custom Form ── */}
          {activeTab === "custom" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLoginSubmit(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Singh"
                  className="gov-input"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Employee / Registration ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="e.g. SO-IND-2024-884"
                    className="gov-input font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Role Category
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="gov-input"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department / Division
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Price Statistics Division"
                    className="gov-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Statistical Officer"
                    className="gov-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F2F64] hover:bg-[#173E80] text-white py-3 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Log In with Custom Profile</span>
                <span>&rarr;</span>
              </button>
            </form>
          )}

          {/* Prototype Notice */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-start gap-2.5 text-xs text-slate-500">
            <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong className="text-slate-700">Multi-User Persona Simulator:</strong> Adding your friend or logging in as any official instantly generates their personalized competency radar chart, skill gap diagnoses, learning paths, and career ladders.
            </span>
          </div>

          {/* Register CTA */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              New to CogniPath AI?{" "}
              <Link
                to="/register"
                className="text-[#0F2F64] font-bold hover:text-blue-600 transition-colors underline underline-offset-2"
              >
                Create a new account →
              </Link>
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              iGOT Karmayogi SSO Ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
