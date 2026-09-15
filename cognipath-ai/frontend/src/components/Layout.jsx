import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useStudent } from "../App.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "📊", exact: true },
  { to: "/upload", label: "My Materials", icon: "📁" },
  { to: "/assessment", label: "Quizzes & MCQs", icon: "✍️" },
  { to: "/dashboard", label: "Competency Gaps", icon: "🎯" },
  { to: "/roadmap", label: "Learning Path", icon: "🗺️" },
];

const PREF_ITEMS = [
  { to: "/", label: "Profile", icon: "👤", exact: true },
];

export default function Layout() {
  const { student } = useStudent();
  const location = useLocation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen flex bg-ink">
      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 bg-inkLight/80 backdrop-blur-xl border-r border-contour/50 flex flex-col fixed h-full z-20">
        {/* Logo */}
        <div className="px-6 py-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-trail flex items-center justify-center text-white text-lg font-bold shadow-glow">
            C
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-parchment tracking-tight">CogniPath</h1>
            <p className="text-[10px] text-mist uppercase tracking-widest">Adaptive Platform</p>
          </div>
        </div>

        {/* Main Menu */}
        <div className="px-4 mt-2">
          <p className="text-[10px] text-mist uppercase tracking-widest font-semibold px-4 mb-2">Main Menu</p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
                {item.to === "/roadmap" && (
                  <span className="ml-auto badge badge-green text-[10px]">Active</span>
                )}
                {item.to === "/dashboard" && (
                  <span className="ml-auto badge badge-purple text-[10px]">AI</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Preferences */}
        <div className="px-4 mt-6">
          <p className="text-[10px] text-mist uppercase tracking-widest font-semibold px-4 mb-2">Preferences</p>
          <nav className="space-y-1">
            {PREF_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `nav-item ${isActive && location.pathname === "/" ? "active" : ""}`
                }
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sign Out / Footer */}
        <div className="mt-auto px-4 pb-6">
          <div className="border-t border-contour/50 pt-4">
            <button
              className="nav-item w-full text-rust/80 hover:text-rust hover:bg-rustGlow"
              onClick={() => window.location.reload()}
            >
              <span className="text-base">🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-ink/80 backdrop-blur-xl border-b border-contour/30">
          <div className="flex items-center justify-between px-8 py-4">
            {/* Search */}
            <div className="relative w-96">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mist text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search materials, topics, quizzes..."
                className="w-full bg-surface/50 border border-contour/50 text-parchment rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-trail focus:bg-surface placeholder:text-mist/60"
              />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative w-10 h-10 rounded-xl bg-surface/50 border border-contour/50 flex items-center justify-center text-mist hover:text-parchment hover:border-contour transition-all">
                <span className="text-sm">🔔</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-trail rounded-full text-[10px] text-white flex items-center justify-center font-bold">2</span>
              </button>

              {/* User avatar */}
              {student && (
                <div className="flex items-center gap-3 pl-3 border-l border-contour/50">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-trail to-amber flex items-center justify-center text-white text-sm font-bold">
                    {student.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-parchment">{student.name || "Guest"}</p>
                    <p className="text-[11px] text-mist">Student</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-6xl mx-auto px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
