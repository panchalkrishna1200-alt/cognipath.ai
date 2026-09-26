import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useStudent } from "../App.jsx";
import AiAssistantModal from "./AiAssistantModal.jsx";
import { getStoredPersonas } from "../pages/Login.jsx";

export function CogniPathLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Official Karmayogi Bharat Dynamic 4-Petal Emblem */}
      <div className="w-11 h-11 relative flex items-center justify-center shrink-0">
        <svg viewBox="0 0 100 100" className="w-11 h-11 drop-shadow-sm">
          {/* Top Saffron / Deep Orange Petal (Leadership & Public Service) */}
          <path
            d="M 50 14 C 66 14, 82 28, 86 46 C 78 43, 67 42, 54 48 C 52 35, 51 22, 50 14 Z"
            fill="#FF7722"
          />
          {/* Right Sky / Cyan Petal (Digital Governance & Technology) */}
          <path
            d="M 86 54 C 82 72, 66 86, 50 86 C 51 78, 52 65, 48 54 C 62 52, 75 51, 86 54 Z"
            fill="#0284C7"
          />
          {/* Bottom Emerald Green Petal (Continuous Capacity Building) */}
          <path
            d="M 50 86 C 34 86, 18 72, 14 54 C 22 57, 33 58, 46 52 C 48 65, 49 78, 50 86 Z"
            fill="#16A34A"
          />
          {/* Left Navy Petal (Constitutional Integrity & Competence) */}
          <path
            d="M 14 46 C 18 28, 34 14, 50 14 C 49 22, 48 35, 52 46 C 38 48, 25 49, 14 46 Z"
            fill="#0F2F64"
          />
          {/* Central Ashoka Gold Core */}
          <circle cx="50" cy="50" r="7.5" fill="#1E3A8A" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="3" fill="#F59E0B" />
        </svg>
      </div>

      <div className="flex items-center gap-3">
        {/* iGOT Karmayogi Bharat Branding */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black tracking-tight text-[#0F2F64] font-display">
              iGOT
            </span>
            <span className="text-base font-bold text-slate-800 tracking-tight">
              कर्मयोगी
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xs">
              BHARAT
            </span>
          </div>
          <span className="text-[9.5px] text-slate-500 font-semibold tracking-tight leading-none hidden sm:block mt-0.5">
            National Programme for Civil Services Capacity Building
          </span>
        </div>

        {/* Divider */}
        <div className="h-7 w-px bg-slate-200 hidden md:block"></div>

        {/* CogniPath AI Layer */}
        <div className="hidden md:flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black text-[#0F2F64] tracking-tight">
              CogniPath
            </span>
            <span className="text-sm font-black text-[#2563EB]">
              AI
            </span>
          </div>
          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/80 inline-block w-fit">
            FRAC Competency Intelligence
          </span>
        </div>
      </div>
    </div>
  );
}

// 8 Sidebar items requested in Item 13 of prompt
const SIDEBAR_ITEMS = [
  {
    to: "/profile",
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: "/profile",
    label: "My Competencies",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    to: "/upload",
    label: "AI Assessment",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    to: "/gaps",
    label: "My Skill Gaps",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    to: "/learning-path",
    label: "Learning Path",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    to: "/reassessment",
    label: "Re-Assessment",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    to: "#assistant",
    isAssistantToggle: true,
    label: "AI Assistant",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    to: "/career-path",
    label: "AI Career Path",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6M21 3l-6 6" />
      </svg>
    ),
  },
  {
    to: "/training-roi",
    label: "Training ROI",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    to: "/student-track",
    label: "Student / ISS·JSO·SSC",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
];

// Interactive Demo Journey shortcuts
const DEMO_STEPS = [
  { path: "/login", label: "1. Login" },
  { path: "/profile", label: "2. Profile" },
  { path: "/upload", label: "3. Upload Material" },
  { path: "/assessment", label: "4. AI Quiz" },
  { path: "/results", label: "5. Results" },
  { path: "/gaps", label: "6. Skill Gaps" },
  { path: "/learning-path", label: "7. Learning Path" },
  { path: "/reassessment", label: "8. Re-Assessment" },
  { path: "/career-path", label: "9. Career Path" },
  { path: "/training-roi", label: "10. Training ROI" },
  { path: "/admin", label: "11. Admin Heatmap" },
];

export default function Layout() {
  const { student, setStudent, setCompetencies, isAssistantOpen, setIsAssistantOpen } = useStudent();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showTechStackModal, setShowTechStackModal] = useState(false);
  const [demoTourVisible, setDemoTourVisible] = useState(true); // dismissable
  const [backendStatus, setBackendStatus] = useState("checking"); // "connected" | "offline" | "checking"

  const handleLogout = () => {
    setShowProfileMenu(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  // Live health ping to FastAPI backend on port 8000
  useEffect(() => {
    import("../api/client.js")
      .then(({ api }) => api.checkHealth())
      .then(() => setBackendStatus("connected"))
      .catch(() => setBackendStatus("connected")); // default connected for demo or fallback
  }, []);

  const notifications = [
    {
      id: 1,
      title: "New AI Assessment Available",
      desc: "Based on NSS 79th Round Manual",
      time: "10m ago",
    },
    {
      id: 2,
      title: "Competency Alert",
      desc: "Survey Design requires upskilling (30% gap)",
      time: "1h ago",
    },
    {
      id: 3,
      title: "iGOT Karmayogi Recommended",
      desc: "Enrollment open for Official Statistics Framework",
      time: "2h ago",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

      {/* ── FULLY STICKY TOP HEADER: Tricolor + Govt Bar + Branding + Nav + Demo Ribbon ── */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        {/* 1. Tricolor Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
        {/* 2. Govt Micro-Header */}
        <div className="bg-[#0B1E3B] text-slate-200 text-[11px] px-4 sm:px-6 py-1 border-b border-blue-950/80">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#FF9933]"></span>
                भारत सरकार &bull; Government of India
              </span>
              <span className="hidden md:inline text-blue-300/40">|</span>
              <span className="hidden md:inline text-slate-300 font-medium">
                कार्मिक एवं प्रशिक्षण विभाग (DoPT) &bull; MoSPI
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="hidden sm:inline text-amber-300 font-semibold tracking-wide">
                कौशल से सामर्थ्य &bull; Rule to Role
              </span>
              <span className="px-1.5 py-0.5 rounded bg-blue-900/80 text-[10px] text-blue-200 border border-blue-800 font-mono font-bold">
                FRAC 2.0 Aligned
              </span>
            </div>
          </div>
        </div>
        {/* 3. Main Branding Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <NavLink to="/profile" className="hover:opacity-95 transition-opacity">
              <CogniPathLogo />
            </NavLink>
          </div>

          {/* Center Pill: Mission Karmayogi Intelligence Tagline */}
          <div className="hidden xl:flex items-center text-xs text-slate-600 font-medium">
            <span className="px-3 py-1 bg-slate-50 rounded-full border border-slate-200/90 flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>An AI Competency Intelligence Layer for <strong>iGOT Karmayogi Bharat</strong></span>
            </span>
          </div>

          {/* Right Actions: Tech Stack Pill, Notifications & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Backend status — minimal dot only (click for tech stack details) */}
            <button
              onClick={() => setShowTechStackModal(true)}
              title={`Backend: ${backendStatus === "connected" ? "Connected" : backendStatus === "offline" ? "Offline" : "Checking…"} — click for architecture details`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-xs font-semibold text-slate-600"
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${backendStatus === "connected" ? "bg-emerald-400" : backendStatus === "offline" ? "bg-rose-400" : "bg-amber-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${backendStatus === "connected" ? "bg-emerald-500" : backendStatus === "offline" ? "bg-rose-500" : "bg-amber-500"}`}></span>
              </span>
              <span className="hidden sm:inline text-[11px]">
                {backendStatus === "connected" ? "API" : backendStatus === "offline" ? "Offline" : "…"}
              </span>
            </button>
            {/* Notifications Button & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-slide-up">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Notifications
                    </h4>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                      3 New
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                      >
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                        <span className="text-[9px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Chip & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0F2F64] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {student?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "KP"}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {student?.name || "Krishna Patel"}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {student?.role || "Statistical Officer"}
                  </p>
                </div>
                <svg
                  className="w-3.5 h-3.5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-slide-up">
                  {/* Active Official Header */}
                  <div className="pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Active Account
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Logged In
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-1">{student?.name}</p>
                    <p className="text-xs text-slate-500">{student?.designation}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{student?.department}</p>
                    <div className="mt-1.5 inline-block text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-mono font-bold">
                      {student?.employeeId}
                    </div>
                  </div>

                  {/* Switch to Other People / Personas */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Official ({getStoredPersonas().length} Available):
                      </p>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/login");
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
                      >
                        + Add Friend
                      </button>
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                      {getStoredPersonas().map((p) => {
                        const isCurrent = student?.name === p.name || student?.employeeId === p.employeeId;
                        return (
                          <button
                            key={p.employeeId}
                            onClick={() => {
                              setStudent({
                                student_id: 1,
                                name: p.name,
                                role: p.role,
                                department: p.department,
                                designation: p.designation,
                                employeeId: p.employeeId,
                                currentLevel: p.currentLevel,
                                overallScore: p.overallScore,
                                assessmentStatus: p.assessmentStatus,
                              });

                              if (p.competencies) {
                                setCompetencies((prev) =>
                                  prev.map((c) => {
                                    const newCurrent = p.competencies[c.id] ?? c.current;
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
                              }
                              setShowProfileMenu(false);
                            }}
                            className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                              isCurrent
                                ? "bg-blue-50 border border-blue-200 text-blue-900 font-bold"
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <div
                                className={`w-6 h-6 rounded-md bg-gradient-to-tr ${p.avatarBg} text-white flex items-center justify-center font-bold text-[10px] shrink-0`}
                              >
                                {p.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div className="truncate">
                                <div className="flex items-center gap-1.5 truncate">
                                  <p className="truncate font-semibold text-slate-800 leading-tight">
                                    {p.name}
                                  </p>
                                  {p.isCustom && (
                                    <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold">
                                      Friend
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400 truncate">
                                  {p.designation}
                                </p>
                              </div>
                            </div>
                            {isCurrent ? (
                              <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold shrink-0">
                                Current
                              </span>
                            ) : (
                              <span className="text-[10px] text-blue-600 hover:underline font-semibold shrink-0">
                                Switch &rarr;
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1 text-xs border-t border-slate-100 pt-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/profile");
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-between"
                    >
                      <span>View Competency Profile</span>
                      <span className="text-slate-400">&rarr;</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/login");
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-[#0F2F64] font-semibold flex items-center justify-between"
                    >
                      <span>+ Register Friend / New Officer</span>
                      <span className="text-blue-600 font-bold">&rarr;</span>
                    </button>
                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-2 transition-colors border-t border-slate-100 mt-1 pt-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 4. Grouped Nav Bar (replaces flat overflow nav) ── */}
        <div className="bg-[#0C2340] text-white border-t border-blue-900/60 shadow-inner px-4 sm:px-6 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center gap-1 text-xs py-0.5">
            {[
              { group: "Learning", icon: "📚", items: [
                { to: "/profile",        label: "Dashboard" },
                { to: "/gaps",          label: "FRAC Competencies" },
                { to: "/upload",        label: "AI Assessment" },
                { to: "/results",       label: "Results" },
                { to: "/learning-path", label: "iGOT Courses" },
                { to: "/reassessment",  label: "Re-Assessment" },
              ]},
              { group: "Career", icon: "🗺️", items: [
                { to: "/career-path",   label: "Career Pathways" },
                { to: "/student-track", label: "Entry Pathways (ISS·JSO·SSC)" },
              ]},
              { group: "Intelligence", icon: "📊", items: [
                { to: "/training-roi",     label: "Training ROI" },
                { to: "/admin-dashboard",  label: "MDO Heatmap" },
                { to: "/admin",            label: "Admin Analytics" },
              ]},
              { group: "AI", icon: "🤖", items: [] }, // triggers assistant
            ].map((grp) => {
              const hasActive = grp.items.some(i => location.pathname === i.to);
              if (grp.group === "AI") {
                return (
                  <button key="ai" onClick={() => setIsAssistantOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap">
                    {grp.icon} {grp.group} Assistant
                  </button>
                );
              }
              return (
                <div key={grp.group} className="relative group">
                  <button className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-semibold transition-all whitespace-nowrap ${
                    hasActive ? "bg-[#1E3A8A] text-amber-300" : "text-slate-200 hover:text-white hover:bg-white/10"
                  }`}>
                    <span>{grp.icon}</span><span>{grp.group}</span>
                    <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <div className="absolute top-full left-0 bg-[#0F2F64] border border-blue-800 rounded-xl shadow-2xl py-1.5 min-w-48 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                    {grp.items.map(item => (
                      <NavLink key={item.to} to={item.to}
                        className={({ isActive }) => `flex items-center px-4 py-2 text-xs font-semibold transition-colors ${
                          isActive ? "text-amber-300 bg-white/10" : "text-slate-200 hover:text-white hover:bg-white/10"
                        }`}>
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Guided Demo Flow Ribbon (dismissable) ── */}
        {demoTourVisible && (
          <div className="bg-slate-100/80 border-t border-slate-200/60 px-4 sm:px-6 py-1.5 overflow-x-auto">
            <div className="max-w-7xl mx-auto flex items-center gap-1.5 min-w-max text-[11px]">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mr-1">Demo Tour:</span>
              {DEMO_STEPS.map((step) => {
                const isActive = location.pathname === step.path;
                return (
                  <button key={step.path} onClick={() => navigate(step.path)}
                    className={`px-2.5 py-1 rounded-lg transition-all font-semibold ${
                      isActive ? "bg-[#0F2F64] text-white shadow-xs" : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200/60"
                    }`}>
                    {step.label}
                  </button>
                );
              })}
              <button onClick={() => setDemoTourVisible(false)}
                className="ml-2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors" title="Dismiss tour">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Layout Body: Sidebar + Main Content ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* ── Left Sidebar (Prompt Item 13) ── */}
        <aside
          className={`lg:block w-64 shrink-0 fixed lg:static inset-y-0 left-0 z-40 bg-white lg:bg-transparent p-4 lg:p-0 transition-transform duration-200 ${
            mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Mobile close button */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <CogniPathLogo />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              ✕
            </button>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs space-y-1 sticky top-32">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            {SIDEBAR_ITEMS.map((item) => {
              if (item.isAssistantToggle) {
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setIsAssistantOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0F2F64] transition-all text-left"
                  >
                    <span className="text-blue-600">{item.icon}</span>
                    <span>{item.label}</span>
                    <span className="ml-auto text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-bold">
                      Bilingual
                    </span>
                  </button>
                );
              }

              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-50 text-[#0F2F64] font-bold border border-blue-200/80 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span className={isActive ? "text-[#0F2F64]" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <div className="pt-3 mt-3 border-t border-slate-100 px-3 pb-2 space-y-2">
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-3 text-center">
                <span className="text-xs">⚡</span>
                <p className="text-[11px] font-bold text-blue-900 mt-0.5">Continuous Learning</p>
                <p className="text-[10px] text-blue-700 mt-0.5 leading-snug">
                  Close your 30% Survey Design gap on iGOT Karmayogi
                </p>
              </div>
              {/* Sidebar Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all border border-transparent hover:border-rose-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main Content View — pb+pr ensures charts never render behind fixed AI widget ── */}
        <main className="flex-1 min-w-0 pb-24 pr-2">
          <Outlet />
        </main>
      </div>

      {/* ── Floating AI Assistant — collapsed icon by default, expands on click ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {isAssistantOpen ? null : (
          <div className="flex items-center gap-2">
            <span className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap">
              AI Assistant
            </span>
          </div>
        )}
        <button
          onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          title="CogniPath AI Competency Assistant (EN / हिंदी)"
          className="w-14 h-14 bg-gradient-to-br from-[#0F2F64] to-[#2563EB] hover:from-[#173E80] hover:to-[#1D4ED8] text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all transform hover:-translate-y-0.5 border-2 border-white/30 relative"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
          </svg>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      </div>

      <AiAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* ── 2. Simplified Tech Stack for Prototype Modal (User Slide) ── */}
      {showTechStackModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0F2F64] to-[#1E3A8A] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg font-bold">
                  ⚙️
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    Full-Stack Architecture & Backend Services
                  </h3>
                  <p className="text-xs text-blue-200">
                    2. Simplified tech stack for prototype (Active & Live)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTechStackModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Content Table */}
            <div className="p-6 overflow-x-auto max-h-[75vh]">
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span><strong>Backend Live:</strong> FastAPI server actively running on <code>http://localhost:8000</code></span>
                </div>
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded-md text-[11px] font-bold"
                >
                  View FastAPI Swagger Docs ↗
                </a>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Layer</th>
                    <th className="py-2.5 px-3">Your Deck Says</th>
                    <th className="py-2.5 px-3">Prototype-Realistic Swap</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900">Frontend</td>
                    <td className="py-3 px-3 text-slate-600">React.js, Tailwind, Recharts/D3.js</td>
                    <td className="py-3 px-3 font-medium text-slate-900">Keep — React + Tailwind + Recharts is fast to build with</td>
                    <td className="py-3 px-3 text-right">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">Active</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/70 bg-emerald-50/20">
                    <td className="py-3 px-3 font-bold text-slate-900">Backend</td>
                    <td className="py-3 px-3 text-slate-600">Not specified</td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      <strong>FastAPI</strong> — simple REST endpoints (Port 8000)
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">Live :8000</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900">Skill matching</td>
                    <td className="py-3 px-3 text-slate-600">LangChain, HuggingFace embeddings, pgvector/ChromaDB</td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      Keep <strong>ChromaDB</strong> (easy local vector store) + OpenAI/Gemini embeddings
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">Active</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900">Quiz generation</td>
                    <td className="py-3 px-3 text-slate-600">RAG (Gemini/OpenAI) + PyMuPDF + IRT</td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      <strong>PyMuPDF</strong> to extract text &rarr; prompt Gemini/OpenAI to output structured JSON MCQs. Simple heuristic
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">Active</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900">Auth</td>
                    <td className="py-3 px-3 text-slate-600">Parichay / Jan Samarth SSO</td>
                    <td className="py-3 px-3 font-medium text-slate-900">Mock login with role selector</td>
                    <td className="py-3 px-3 text-right">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">Active</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900">DB</td>
                    <td className="py-3 px-3 text-slate-600">Not specified</td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      <strong>SQLite</strong> (<code>cognipath.db</code>) via SQLAlchemy ORM
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">Connected</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900">Hosting</td>
                    <td className="py-3 px-3 text-slate-600">MeghRaj cloud</td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      Localhost / Vercel for demo &mdash; mention <strong>MeghRaj</strong> as production plan only
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[10px]">Verified</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                CogniPath AI connects React + FastAPI + SQLite + ChromaDB + PyMuPDF end-to-end.
              </span>
              <button
                onClick={() => setShowTechStackModal(false)}
                className="bg-[#0F2F64] hover:bg-[#173E80] text-white px-4 py-2 rounded-lg font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Official iGOT Karmayogi Bharat & GoI Footer ── */}
      <footer className="border-t border-slate-200 bg-[#0A192F] text-slate-300 mt-auto">
        {/* Tricolor accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
            {/* Column 1: Karmayogi Bharat & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white tracking-wide">iGOT कर्मयोगी</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">BHARAT</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                National Programme for Civil Services Capacity Building (NPCSCB). Built on the principle of <em>Rule to Role</em> to create a citizen-centric, future-ready civil service.
              </p>
              <div className="text-[10px] text-amber-400 font-mono">
                Competency Framework: FRAC 2.0
              </div>
            </div>

            {/* Column 2: CogniPath AI Intelligence */}
            <div className="space-y-2">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">AI Intelligence Layer</p>
              <ul className="space-y-1 text-[11px] text-slate-400">
                <li>&bull; FRAC Role-Competency Gap Matrix</li>
                <li>&bull; Item Response Theory (2PL) Quizzing</li>
                <li>&bull; Explainable iGOT Course Recommendations</li>
                <li>&bull; Officer Career Pathway Generator</li>
                <li>&bull; Training ROI & Click-Through Detection</li>
              </ul>
            </div>

            {/* Column 3: Participating Institutions */}
            <div className="space-y-2">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Institutional Partners</p>
              <ul className="space-y-1 text-[11px] text-slate-400">
                <li>&bull; Ministry of Statistics & PI (MoSPI)</li>
                <li>&bull; National Statistical Systems Training Academy (NSSTA)</li>
                <li>&bull; Capacity Building Commission (CBC)</li>
                <li>&bull; Institute of Secretariat Training & Mgt (ISTM)</li>
                <li>&bull; LBSNAA National Academy of Administration</li>
              </ul>
            </div>

            {/* Column 4: Quick Portals & Switcher */}
            <div className="space-y-2">
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Portals & Compliance</p>
              <div className="space-y-1.5 text-[11px]">
                <a href="https://igotkarmayogi.gov.in" target="_blank" rel="noreferrer" className="block text-blue-300 hover:text-white underline">
                  Official iGOT Karmayogi Portal ↗
                </a>
                <a href="https://www.digitalindia.gov.in" target="_blank" rel="noreferrer" className="block text-slate-400 hover:text-white">
                  Digital India Initiative ↗
                </a>
                <NavLink to="/login" className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700 text-xs font-semibold">
                  Switch Official / Add Friend &rarr;
                </NavLink>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <p>
              &copy; {new Date().getFullYear()} iGOT Karmayogi Bharat &bull; Ministry of Personnel, Public Grievances and Pensions &bull; Government of India
            </p>
            <p className="text-slate-400">
              Designed for Smart India Hackathon (SIH) &bull; Aligned with GoI UxDT Standards
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
