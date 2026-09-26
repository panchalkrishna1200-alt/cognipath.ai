import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: "🧠",
    title: "AI Competency Gap Analysis",
    desc: "Automatically diagnose skill gaps against the MoSPI FRAC 4-Pillar framework — Statistical, Technical, Digital Governance & Managerial competencies.",
    badge: "FRAC Aligned",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: "🎯",
    title: "Personalized Learning Path",
    desc: "Get AI-curated iGOT Karmayogi courses and NSSTA TPAC modules mapped to your exact competency gaps and career goals.",
    badge: "iGOT Integrated",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: "📄",
    title: "Document-to-Quiz Engine",
    desc: "Upload any syllabus, NSS manual, or official document — our RAG pipeline generates grounded MCQs with source citations instantly.",
    badge: "RAG Powered",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: "📊",
    title: "Competency Radar Dashboard",
    desc: "Visual radar chart of your 12-competency profile with percentile comparison against MoSPI role benchmarks.",
    badge: "Real-time",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: "🗣️",
    title: "Bilingual AI Assistant",
    desc: "Ask questions in English or हिंदी — our multilingual LLM assistant explains concepts from official training materials in real time.",
    badge: "EN + हिंदी",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: "🗺️",
    title: "Admin Workforce Heatmap",
    desc: "MDO heads get department-wise competency heatmaps, aggregate gap analytics and manager override for data-driven TPAC planning.",
    badge: "Admin Only",
    color: "from-slate-600 to-slate-800",
  },
];

const EXAM_TRACKS = [
  {
    id: "iss", name: "ISS", full: "Indian Statistical Service", authority: "UPSC",
    icon: "📊", color: "from-[#0F2F64] to-[#2563EB]",
    features: ["Paper-wise syllabus mapping", "AI MCQ from NSS Manuals", "Gap analysis vs ISS standard", "Personalized study schedule"],
  },
  {
    id: "jso", name: "JSO", full: "Junior Statistical Officer", authority: "SSC",
    icon: "🔢", color: "from-emerald-600 to-teal-600",
    features: ["SSC JSO previous papers", "Index Numbers & Time Series AI quiz", "iGOT course recommendations", "Mock test performance tracker"],
  },
  {
    id: "ssc", name: "SSC SI", full: "Statistical Investigator Gr.II", authority: "SSC",
    icon: "🗂️", color: "from-amber-500 to-orange-600",
    features: ["Vital Statistics & Demography prep", "Regression & Correlation deep-dives", "Adaptive difficulty quizzes", "Weekly progress reports"],
  },
];

const STATS = [
  { value: "140+", label: "Officials Trained", icon: "👥" },
  { value: "12", label: "Competency Domains", icon: "📋" },
  { value: "98%", label: "RAG Answer Accuracy", icon: "🎯" },
  { value: "3", label: "Exam Tracks (ISS/JSO/SSC)", icon: "🏆" },
];

const PERSONAS = [
  { name: "In-Service Official", icon: "👔", desc: "MoSPI / State DES / NSO / NSSTA officials seeking FRAC-aligned training.", color: "bg-blue-50 border-blue-200 text-blue-900" },
  { name: "ISS / JSO Aspirant", icon: "🎓", desc: "Students preparing for UPSC ISS, SSC JSO or Statistical Investigator exams.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
  { name: "NSSTA Trainee", icon: "🏛️", desc: "Probationers and trainees enrolled in NSSTA TPAC capacity building programmes.", color: "bg-purple-50 border-purple-200 text-purple-900" },
  { name: "MDO / Department Head", icon: "🏢", desc: "Mission Directors seeking workforce analytics, heatmaps and training ROI reports.", color: "bg-amber-50 border-amber-200 text-amber-900" },
];

const TESTIMONIALS = [
  { name: "Ananya Sharma", role: "Dy. Statistical Officer, NAD", quote: "The AI gap analysis identified my exact weak areas in National Accounts before my promotion exam. Saved me months of unfocused preparation.", score: "78%", avatar: "AS" },
  { name: "Rajesh Verma", role: "Field Officer, FOD Lucknow", quote: "The CAPI and field operations modules perfectly matched my NSS round requirements. The bilingual assistant explained everything in Hindi too!", score: "63%", avatar: "RV" },
  { name: "Aarav Sharma", role: "ISS Aspirant, NSSTA", quote: "I found out I had a 40% gap in Sampling Methods. The AI quiz from the NSS manual helped me close it in 3 weeks.", score: "48%", avatar: "AS" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeExam, setActiveExam] = useState(EXAM_TRACKS[0]);
  const [visibleStat, setVisibleStat] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: "", email: "", exam: "", role: "" });
  const [applied, setApplied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisibleStat(true), 400);
    return () => clearTimeout(t);
  }, []);

  const handleApply = (e) => {
    e.preventDefault();
    if (!applyForm.name || !applyForm.email) return;
    setApplied(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── TOP GOVT BAR ── */}
      <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      <div className="bg-[#0B1E3B] text-[11px] text-slate-300 px-6 py-1 flex items-center justify-between">
        <span className="flex items-center gap-2 text-white font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#FF9933] inline-block" />
          भारत सरकार • Government of India • MoSPI
        </span>
        <span className="text-amber-300 font-semibold hidden sm:inline">कौशल से सामर्थ्य • Rule to Role</span>
      </div>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0F2F64] to-[#2563EB] flex items-center justify-center">
              <span className="text-white font-black text-sm">C</span>
            </div>
            <div>
              <span className="font-black text-[#0F2F64] text-lg tracking-tight">CogniPath</span>
              <span className="text-blue-500 font-black text-lg"> AI</span>
              <div className="text-[9px] text-slate-400 font-semibold -mt-0.5 tracking-widest uppercase">iGOT Karmayogi Intelligence Layer</div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-[#0F2F64] transition-colors">Features</a>
            <a href="#exam-tracks" className="hover:text-[#0F2F64] transition-colors">Exam Tracks</a>
            <a href="#who" className="hover:text-[#0F2F64] transition-colors">Who's It For</a>
            <a href="#apply" className="hover:text-[#0F2F64] transition-colors">Apply</a>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")}
              className="hidden sm:flex px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0F2F64] transition-colors">
              Log In
            </button>
            <button onClick={() => navigate("/register")}
              className="px-4 py-2 bg-gradient-to-r from-[#0F2F64] to-[#2563EB] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-sm">
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0C2340] via-[#0F2F64] to-[#1E3A8A] text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-indigo-400 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-purple-400 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                Smart India Hackathon 2026 · SIH26101 · Team NextGen Minds
              </div>

              <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-5 text-amber-400">
                Diagnose the Gap.<br />
                Adapt the Path.<br />
                Master the Topic.
              </h1>
              <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-xl">
                India's first AI-enabled competency intelligence platform for MoSPI officials and statistical service aspirants — powered by iGOT Karmayogi, NSSTA TPAC & RAG-driven assessment.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate("/register")}
                  className="px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-amber-900 font-black rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm">
                  🎓 Student — Apply Now
                </button>
                <button onClick={() => navigate("/login")}
                  className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition-all text-sm">
                  👔 Official — Log In
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-4 mt-8">
                {["iGOT Karmayogi", "NSSTA TPAC", "MoSPI FRAC", "DPDP Compliant"].map(b => (
                  <span key={b} className="text-[11px] bg-white/10 text-blue-200 border border-white/20 px-3 py-1 rounded-full font-semibold">{b}</span>
                ))}
              </div>
            </div> {/* end left column */}
          </div> {/* end grid */}
        </div> {/* end max-w container */}
      </section>

      {/* ── STATS SECTION ── */}
      <section className="bg-[#0F2F64] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className={`text-center transition-all duration-700 ${visibleStat ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <p className="text-3xl mb-1">{s.icon}</p>
                <p className="text-3xl font-black text-amber-400">{s.value}</p>
                <p className="text-sm text-blue-200 font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full uppercase tracking-wider">Platform Features</span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mt-4">Everything You Need to<br /><span className="text-[#0F2F64]">Close the Competency Gap</span></h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">Built for MoSPI officials and statistical service aspirants — powered by LangChain, ChromaDB, HuggingFace & Gemini AI.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all group hover:-translate-y-1 duration-200">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-black text-slate-900 leading-snug">{f.title}</h3>
                  <span className="text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded shrink-0">{f.badge}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXAM TRACKS SECTION ── */}
      <section id="exam-tracks" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full uppercase tracking-wider">Student Tracks</span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mt-4">Dedicated Exam Pathways<br /><span className="text-emerald-600">For Every Aspirant</span></h2>
            <p className="text-slate-500 mt-3">Choose your target exam — get a personalised AI study plan, gap analysis and NSSTA TPAC module mapping.</p>
          </div>

          {/* Exam selector */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {EXAM_TRACKS.map(exam => (
              <button key={exam.id} onClick={() => setActiveExam(exam)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                  activeExam.id === exam.id
                    ? "bg-gradient-to-r " + exam.color + " text-white shadow-lg"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}>
                <span>{exam.icon}</span>
                <span>{exam.name}</span>
              </button>
            ))}
          </div>

          {/* Active exam detail */}
          <div className={`bg-gradient-to-br ${activeExam.color} rounded-3xl p-8 text-white shadow-xl`}>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">{activeExam.authority}</span>
                <h3 className="text-3xl font-black mt-3">{activeExam.name}</h3>
                <p className="text-white/80 text-lg mt-1">{activeExam.full}</p>
                <div className="mt-6 space-y-3">
                  {activeExam.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                      <span className="text-sm text-white/90 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate("/register")}
                  className="mt-8 px-6 py-3 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all text-sm shadow-lg">
                  Apply for {activeExam.name} Track →
                </button>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hidden lg:block">
                <p className="text-xs text-white/70 font-bold uppercase tracking-wider mb-4">AI Study Plan Preview</p>
                {[
                  { week: "Week 1–2", topic: "Gap Analysis & Baseline Assessment", done: true },
                  { week: "Week 3–4", topic: "NSSTA TPAC Module: Official Statistics", done: true },
                  { week: "Week 5–6", topic: "AI Quiz: Sampling Methods", done: false },
                  { week: "Week 7–8", topic: "iGOT Course: Statistical Inference", done: false },
                  { week: "Week 9–10", topic: "Full Mock Test + Reassessment", done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 mb-3">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${item.done ? "bg-emerald-400 text-white" : "bg-white/20 text-white/60"}`}>
                      {item.done ? "✓" : i + 1}
                    </span>
                    <div>
                      <p className="text-[10px] text-white/60 font-semibold">{item.week}</p>
                      <p className="text-xs text-white/90 font-medium">{item.topic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section id="who" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full uppercase tracking-wider">Dual-Track Platform</span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mt-4">Who Is CogniPath AI For?</h2>
            <p className="text-slate-500 mt-3">One platform serving officials in-service and aspirants preparing for statistical civil services.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PERSONAS.map((p, i) => (
              <div key={i} className={`border-2 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 duration-200 ${p.color}`}>
                <p className="text-4xl mb-4">{p.icon}</p>
                <h3 className="font-black text-base mb-2">{p.name}</h3>
                <p className="text-sm opacity-80 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900">What Officials & Aspirants Say</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#0F2F64] flex items-center justify-center text-white font-black text-sm">{t.avatar}</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-[11px] text-slate-500">{t.role}</p>
                  </div>
                  <div className="ml-auto text-center bg-white border border-slate-200 rounded-xl px-2.5 py-1">
                    <p className="text-sm font-black text-[#0F2F64]">{t.score}</p>
                    <p className="text-[9px] text-slate-400">Score</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLY SECTION ── */}
      <section id="apply" className="py-20 bg-gradient-to-br from-[#0C2340] to-[#1E3A8A]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-amber-400 bg-amber-400/20 border border-amber-400/30 px-3 py-1.5 rounded-full uppercase tracking-wider">Apply Now</span>
            <h2 className="text-3xl lg:text-4xl font-black text-white mt-4">Start Your Learning Journey</h2>
            <p className="text-blue-200 mt-3">Students and aspirants can apply to join the CogniPath AI platform and get a free competency baseline assessment.</p>
          </div>

          {!applied ? (
            <form onSubmit={handleApply} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-blue-200 block mb-1.5">Full Name *</label>
                  <input type="text" required value={applyForm.name} onChange={e => setApplyForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Priya Sundaram"
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-200 block mb-1.5">Email Address *</label>
                  <input type="email" required value={applyForm.email} onChange={e => setApplyForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.gov.in"
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-blue-200 block mb-1.5">Target Exam</label>
                  <select value={applyForm.exam} onChange={e => setApplyForm(p => ({ ...p, exam: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50">
                    <option value="" className="bg-[#0F2F64]">Select exam target</option>
                    <option value="iss" className="bg-[#0F2F64]">UPSC — ISS (Indian Statistical Service)</option>
                    <option value="jso" className="bg-[#0F2F64]">SSC — Junior Statistical Officer</option>
                    <option value="ssc" className="bg-[#0F2F64]">SSC — Statistical Investigator Gr.II</option>
                    <option value="official" className="bg-[#0F2F64]">In-Service Official (MoSPI/State DES)</option>
                    <option value="nssta" className="bg-[#0F2F64]">NSSTA Trainee / Probationer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-200 block mb-1.5">Current Role</label>
                  <select value={applyForm.role} onChange={e => setApplyForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50">
                    <option value="" className="bg-[#0F2F64]">Select your role</option>
                    <option value="student" className="bg-[#0F2F64]">Student / Aspirant</option>
                    <option value="official" className="bg-[#0F2F64]">Government Official</option>
                    <option value="trainee" className="bg-[#0F2F64]">NSSTA Trainee</option>
                    <option value="mdo" className="bg-[#0F2F64]">MDO / Department Head</option>
                  </select>
                </div>
              </div>
              <button type="submit"
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-amber-900 font-black rounded-2xl transition-all shadow-lg text-sm hover:shadow-xl hover:-translate-y-0.5">
                🚀 Submit Application & Get Free Assessment
              </button>
              <p className="text-center text-[11px] text-blue-300">
                Already have an account?{" "}
                <button type="button" onClick={() => navigate("/login")} className="text-amber-400 font-bold hover:underline">
                  Log In here
                </button>
              </p>
            </form>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12 text-center">
              <p className="text-5xl mb-4">🎉</p>
              <h3 className="text-2xl font-black text-white mb-2">Application Submitted!</h3>
              <p className="text-blue-200 mb-6">Thank you, <strong className="text-white">{applyForm.name}</strong>! Your CogniPath AI access is being provisioned. You'll receive login details at <strong className="text-amber-400">{applyForm.email}</strong>.</p>
              <button onClick={() => navigate("/register")}
                className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-amber-900 font-black rounded-2xl transition-all shadow-lg text-sm">
                Continue to Full Registration →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#050F1E] text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0F2F64] to-[#2563EB] flex items-center justify-center">
                  <span className="text-white font-black text-xs">C</span>
                </div>
                <span className="font-black text-white">CogniPath AI</span>
              </div>
              <p className="text-xs leading-relaxed">An AI-enabled Skill Intelligence Platform for iGOT Karmayogi ecosystem — SIH26101.</p>
              <p className="text-xs mt-2 text-slate-500">Team: NextGen Minds · Team ID: 37</p>
            </div>
            {[
              { title: "Platform", links: ["Competency Assessment", "Learning Path", "AI Quiz Generator", "Admin Analytics"] },
              { title: "Exam Tracks", links: ["ISS (UPSC)", "JSO (SSC)", "Statistical Investigator", "NSSTA TPAC"] },
              { title: "Institutional", links: ["MoSPI", "iGOT Karmayogi", "NSSTA", "National Statistical Office"] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-bold text-white text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-xs hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p>© 2026 CogniPath AI · Ministry of Statistics & PI · Government of India</p>
            <p className="text-slate-500">Designed for Smart India Hackathon (SIH) · FRAC 2.0 Aligned · iGOT Karmayogi v4.2</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
