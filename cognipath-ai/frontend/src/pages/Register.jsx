import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStudent } from "../App.jsx";

const ROLES = [
  { value: "Statistical Officer", label: "Statistical Officer", icon: "📊", dept: "Official Statistical System" },
  { value: "Data Analyst", label: "Data Analyst", icon: "🔬", dept: "Data Informatics & Innovation Division" },
  { value: "Field Officer", label: "Field Officer", icon: "🗺️", dept: "Field Operations Division" },
  { value: "Student", label: "Trainee / Student", icon: "🎓", dept: "National Statistical Systems Training Academy" },
];

const DEPARTMENTS = [
  "Official Statistical System",
  "Data Informatics & Innovation Division (DIID)",
  "Field Operations Division (FOD)",
  "National Accounts Division (NAD)",
  "Price Statistics Division",
  "National Statistical Systems Training Academy (NSSTA)",
  "Household Survey Division (HSD)",   // ← renamed from SDRD in Aug 2024
  "Economic Statistics Division",
  "Social Statistics Division",
  "Other",
];

const DESIGNATIONS = {
  "Statistical Officer": ["Junior Statistical Officer", "Statistical Officer", "Senior Statistical Officer", "Deputy Statistical Officer", "Assistant Director"],
  "Data Analyst": ["Junior Data Analyst", "Data Analyst", "Senior Data Analyst", "Lead Data Analyst", "Principal Analyst"],
  "Field Officer": ["Field Enumerator", "Senior Field Enumerator", "Field Supervisor", "Regional Field Officer"],
  "Student": ["Trainee Probationer", "NSSTA Student", "Research Intern", "Graduate Trainee"],
};

function generateCompetenciesForRole(role) {
  const maps = {
    "Statistical Officer": { survey_design: 60, sampling_methods: 68, data_collection: 85, statistical_analysis: 72, data_visualization: 78, data_governance: 60 },
    "Data Analyst": { survey_design: 55, sampling_methods: 65, data_collection: 75, statistical_analysis: 88, data_visualization: 90, data_governance: 65 },
    "Field Officer": { survey_design: 50, sampling_methods: 60, data_collection: 92, statistical_analysis: 58, data_visualization: 65, data_governance: 50 },
    "Student": { survey_design: 45, sampling_methods: 48, data_collection: 58, statistical_analysis: 50, data_visualization: 52, data_governance: 40 },
  };
  return maps[role] || maps["Statistical Officer"];
}

const STEPS = ["Account", "Profile", "Role & Dept", "Review"];

export default function Register() {
  const { setStudent, setCompetencies } = useStudent();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    employeeId: "",
    designation: "",
    phone: "",
    role: "Statistical Officer",
    department: "Official Statistical System",
    cadreLevel: "Intermediate (Level 2)",
    agreeTerms: false,
  });

  const set = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (step === 0) {
      if (!form.fullName.trim()) errs.fullName = "Full name is required.";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Enter a valid email address.";
      if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
      if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match.";
    }
    if (step === 1) {
      if (!form.employeeId.trim()) errs.employeeId = "Employee / Registration ID is required.";
      if (!form.designation) errs.designation = "Please select your designation.";
    }
    if (step === 2) {
      if (!form.agreeTerms) errs.agreeTerms = "You must accept the terms to register.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => s + 1); };
  const prev = () => setStep((s) => s - 1);

  const handleSubmit = () => {
    if (!validate()) return;

    const comps = generateCompetenciesForRole(form.role);
    const scoreValues = Object.values(comps);
    const avgScore = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);

    const newPersona = {
      name: form.fullName.trim(),
      email: form.email.trim(),
      employeeId: form.employeeId.trim(),
      designation: form.designation,
      department: form.department,
      role: form.role,
      currentLevel: form.cadreLevel,
      overallScore: avgScore,
      assessmentStatus: "Registration Complete – Awaiting Baseline Assessment",
      avatarBg: "from-teal-600 to-cyan-700",
      tag: "Newly Registered",
      isCustom: true,
      summary: `Newly registered ${form.designation} in ${form.department}. Ready for competency benchmarking and personalized AI learning path.`,
      competencies: comps,
    };

    try {
      const existing = localStorage.getItem("cognipath_custom_personas");
      const parsed = existing ? JSON.parse(existing) : [];
      const updated = [...parsed.filter((p) => p.employeeId !== newPersona.employeeId), newPersona];
      localStorage.setItem("cognipath_custom_personas", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save registration:", err);
    }

    setStudent({
      student_id: Date.now(),
      name: newPersona.name,
      role: newPersona.role,
      department: newPersona.department,
      designation: newPersona.designation,
      employeeId: newPersona.employeeId,
      currentLevel: newPersona.currentLevel,
      overallScore: newPersona.overallScore,
      assessmentStatus: newPersona.assessmentStatus,
    });

    const COMP_REQS = { survey_design: 80, sampling_methods: 80, data_collection: 75, statistical_analysis: 75, data_visualization: 80, data_governance: 75 };
    const COMP_META = {
      survey_design: { name: "Survey Design", category: "Methodological Frameworks" },
      sampling_methods: { name: "Sampling Methods", category: "Statistical Methodology" },
      data_collection: { name: "Data Collection", category: "Field Operations & CAPI" },
      statistical_analysis: { name: "Statistical Analysis", category: "Inferential & Descriptive" },
      data_visualization: { name: "Data Visualization", category: "Reporting & Dashboards" },
      data_governance: { name: "Data Governance", category: "Compliance & Security" },
    };

    setCompetencies(
      Object.entries(comps).map(([id, current]) => {
        const required = COMP_REQS[id] || 75;
        const gap = Math.max(0, required - current);
        let status = "Developing";
        if (current >= 75) status = "Strong";
        else if (gap >= 20) status = "Critical Gap";
        return {
          id,
          name: COMP_META[id]?.name || id,
          category: COMP_META[id]?.category || "",
          current, required, gap, status,
          reAssessed: Math.min(100, current + 15),
          missing: [],
          diagnosis: `Baseline competency from role profile: ${form.role}.`,
          recommendedAction: "Complete the baseline assessment to get a precise skill diagnosis.",
        };
      })
    );

    setSubmitted(true);
    setTimeout(() => navigate("/profile"), 2200);
  };

  const progressPct = (step / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] via-[#F8FAFC] to-[#EDF2FF] flex flex-col">
      {/* Gov Tricolor top */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-slate-200" />
        <div className="flex-1 bg-[#128807]" />
      </div>

      {/* Header */}
      <header className="bg-[#0C2340] text-white py-3 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg">🎯</div>
          <div>
            <p className="text-xs text-blue-200 font-medium tracking-wide">Ministry of Statistics &amp; Programme Implementation</p>
            <h1 className="text-sm font-bold tracking-tight">CogniPath AI · iGOT Karmayogi Portal</h1>
          </div>
        </div>
        <Link to="/login" className="text-xs text-blue-200 hover:text-white flex items-center gap-1.5 transition-colors">
          <span>Already registered?</span>
          <span className="font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg">Log In →</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="max-w-xl w-full space-y-6">

          {/* Branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0F2F64] to-[#2563EB] text-white shadow-xl shadow-blue-900/20 mb-1">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900">Create Your Account</h2>
            <p className="text-sm text-slate-500">
              Register on <span className="font-semibold text-[#0F2F64]">CogniPath AI</span> — Powered by iGOT Karmayogi Bharat
            </p>
          </div>

          {/* Success state */}
          {submitted ? (
            <div className="bg-white border border-emerald-200 rounded-2xl p-10 shadow-xl text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-4xl">✅</div>
              <h3 className="text-2xl font-black text-slate-900">Registration Successful!</h3>
              <p className="text-slate-500 text-sm">Your CogniPath AI account has been created. Redirecting to your dashboard…</p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden">
              {/* Step progress */}
              <div className="px-8 pt-6 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  {STEPS.map((label, i) => (
                    <div key={label} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        i < step ? "bg-emerald-500 text-white" :
                        i === step ? "bg-[#0F2F64] text-white ring-4 ring-blue-100" :
                        "bg-slate-100 text-slate-400"
                      }`}>
                        {i < step ? "✓" : i + 1}
                      </div>
                      <span className={`text-[10px] font-semibold hidden sm:block ${i === step ? "text-[#0F2F64]" : "text-slate-400"}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0F2F64] to-[#2563EB] transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="px-8 py-6 space-y-5">
                {/* STEP 0 */}
                {step === 0 && (
                  <div className="space-y-4 stagger-children">
                    <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-3.5 text-xs text-blue-800">
                      <strong>Step 1 of 4 — Account Credentials</strong><br />
                      Create your secure login credentials for CogniPath AI.
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name *</label>
                      <input type="text" value={form.fullName} onChange={set("fullName")}
                        placeholder="e.g. Arjun Mehta"
                        className={`gov-input ${errors.fullName ? "border-rose-400 ring-2 ring-rose-100" : ""}`} />
                      {errors.fullName && <p className="text-rose-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Official / Personal Email *</label>
                      <input type="email" value={form.email} onChange={set("email")}
                        placeholder="e.g. arjun.mehta@mospi.gov.in"
                        className={`gov-input ${errors.email ? "border-rose-400 ring-2 ring-rose-100" : ""}`} />
                      {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password *</label>
                        <input type="password" value={form.password} onChange={set("password")}
                          placeholder="Minimum 8 characters"
                          className={`gov-input ${errors.password ? "border-rose-400 ring-2 ring-rose-100" : ""}`} />
                        {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Confirm Password *</label>
                        <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")}
                          placeholder="Re-enter password"
                          className={`gov-input ${errors.confirmPassword ? "border-rose-400 ring-2 ring-rose-100" : ""}`} />
                        {errors.confirmPassword && <p className="text-rose-500 text-xs mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                  <div className="space-y-4 stagger-children">
                    <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-3.5 text-xs text-indigo-800">
                      <strong>Step 2 of 4 — Official Profile</strong><br />
                      Enter your government employee ID or NSSTA roll number.
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Employee / Roll Number ID *</label>
                      <input type="text" value={form.employeeId} onChange={set("employeeId")}
                        placeholder="e.g. SO-IND-2024-884 / STU-NSSTA-2025-01"
                        className={`gov-input font-mono text-xs ${errors.employeeId ? "border-rose-400 ring-2 ring-rose-100" : ""}`} />
                      {errors.employeeId && <p className="text-rose-500 text-xs mt-1">{errors.employeeId}</p>}
                      <p className="text-[10px] text-slate-400 mt-1">This ID maps you to your FRAC competency profile.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Designation *</label>
                      <select value={form.designation} onChange={set("designation")}
                        className={`gov-input ${errors.designation ? "border-rose-400 ring-2 ring-rose-100" : ""}`}>
                        <option value="">— Select Designation —</option>
                        {(DESIGNATIONS[form.role] || []).map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      {errors.designation && <p className="text-rose-500 text-xs mt-1">{errors.designation}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mobile / Phone (Optional)</label>
                      <input type="tel" value={form.phone} onChange={set("phone")}
                        placeholder="e.g. +91-9876543210" className="gov-input" />
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="space-y-4 stagger-children">
                    <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-3.5 text-xs text-emerald-800">
                      <strong>Step 3 of 4 — Role &amp; Department</strong><br />
                      Your role determines your FRAC competency benchmark and AI learning path.
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Cadre / Role *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {ROLES.map((r) => (
                          <button key={r.value} type="button"
                            onClick={() => setForm((prev) => ({ ...prev, role: r.value, department: r.dept, designation: "" }))}
                            className={`p-3 rounded-xl border text-left transition-all duration-150 ${
                              form.role === r.value
                                ? "bg-[#0F2F64] text-white border-[#0F2F64] shadow-md"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}>
                            <span className="text-xl block mb-1">{r.icon}</span>
                            <span className="text-xs font-bold">{r.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Department / Division *</label>
                      <select value={form.department} onChange={set("department")} className="gov-input">
                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Current Proficiency Level</label>
                      <select value={form.cadreLevel} onChange={set("cadreLevel")} className="gov-input">
                        <option value="Foundational (Level 1)">Foundational (Level 1)</option>
                        <option value="Intermediate (Level 2)">Intermediate (Level 2)</option>
                        <option value="Proficient (Level 3)">Proficient (Level 3)</option>
                        <option value="Advanced (Level 4)">Advanced (Level 4)</option>
                        <option value="Expert (Level 5)">Expert (Level 5)</option>
                      </select>
                    </div>
                    {/* DPDP Consent — required for competency profiling */}
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900">
                      <p className="font-bold mb-1">📋 Data Processing Notice — DPDP Act 2023</p>
                      <p className="text-amber-800 leading-relaxed">
                        CogniPath AI will collect and process your competency assessment data, quiz results, and training records to generate personalised learning recommendations. This data is processed on behalf of your Ministry/Department under the <strong>Digital Personal Data Protection Act 2023</strong>. No personal data is shared with third parties. You may request data deletion at any time.
                      </p>
                    </div>
                    <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border transition-all ${
                      errors.agreeTerms ? "border-rose-300 bg-rose-50/40" : "border-slate-200 bg-slate-50/50 hover:bg-slate-100"
                    }`}>
                      <input type="checkbox" checked={form.agreeTerms} onChange={set("agreeTerms")} className="mt-0.5 accent-[#0F2F64]" />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        I have read and understood the Data Processing Notice above. I consent to CogniPath AI processing my competency and training data for personalised learning under the iGOT Karmayogi platform. I understand I may withdraw consent at any time by contacting the platform administrator.
                      </span>
                    </label>
                    {errors.agreeTerms && <p className="text-rose-500 text-xs">{errors.agreeTerms}</p>}
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div className="space-y-4 stagger-children">
                    <div className="rounded-xl bg-amber-50/60 border border-amber-100 p-3.5 text-xs text-amber-800">
                      <strong>Step 4 of 4 — Review &amp; Confirm</strong><br />
                      Please verify your registration details before submitting.
                    </div>
                    <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                      {[
                        { label: "Full Name", value: form.fullName },
                        { label: "Email", value: form.email },
                        { label: "Employee ID", value: form.employeeId, mono: true },
                        { label: "Role", value: form.role },
                        { label: "Designation", value: form.designation },
                        { label: "Department", value: form.department },
                        { label: "Level", value: form.cadreLevel },
                      ].map(({ label, value, mono }) => (
                        <div key={label} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/50 transition-colors">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide w-28 shrink-0">{label}</span>
                          <span className={`text-sm font-medium text-slate-900 text-right truncate max-w-[200px] ${mono ? "font-mono text-xs" : ""}`}>
                            {value || <span className="text-slate-400 italic">Not provided</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-start gap-3">
                      <span className="text-emerald-600 text-base mt-0.5">✅</span>
                      <div className="text-xs text-emerald-800">
                        <p className="font-bold mb-0.5">DPDP Consent: Confirmed</p>
                        <p className="leading-relaxed">After registration, your AI-personalised competency baseline will be generated automatically based on your role. You may take a full assessment to calibrate your scores. Your data is processed under DPDP Act 2023.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 pt-2">
                  {step > 0 && (
                    <button type="button" onClick={prev}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                      ← Back
                    </button>
                  )}
                  {step < STEPS.length - 1 ? (
                    <button type="button" onClick={next}
                      className="flex-1 bg-gradient-to-r from-[#0F2F64] to-[#2563EB] hover:opacity-95 text-white py-3 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                      <span>Continue</span><span>→</span>
                    </button>
                  ) : (
                    <button type="button" onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white py-3 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                      ✅ Complete Registration
                    </button>
                  )}
                </div>
              </div>

              {/* Card footer */}
              <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Already registered?{" "}
                  <Link to="/login" className="text-[#0F2F64] font-bold hover:text-blue-700 transition-colors">Log In here</Link>
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Secured by iGOT Karmayogi
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-[10px] text-slate-400">
            © Government of India · Ministry of Statistics &amp; Programme Implementation ·{" "}
            <span className="text-slate-500">CogniPath AI Platform v2.0</span>
          </p>
        </div>
      </main>

      {/* Bottom tricolor */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-slate-200" />
        <div className="flex-1 bg-[#128807]" />
      </div>
    </div>
  );
}
