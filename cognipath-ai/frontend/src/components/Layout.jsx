import { NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Profile", exact: true },
  { to: "/upload", label: "Learning Material" },
  { to: "/assessment", label: "Assessment" },
  { to: "/dashboard", label: "Competency" },
  { to: "/roadmap", label: "Roadmap" },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 bg-inkLight border-r border-contour flex flex-col contour-bg">
        <div className="px-6 py-8">
          <h1 className="text-2xl text-trail tracking-tight">CogniPath</h1>
          <p className="text-xs text-mist mt-1 leading-relaxed">
            Understand &rarr; Diagnose &rarr; Adapt &rarr; Improve &rarr; Reassess
          </p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-sm text-sm border-l-2 transition-colors ${
                  isActive
                    ? "border-trail bg-ink text-parchment"
                    : "border-transparent text-mist hover:text-parchment hover:border-contour"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-6 text-xs text-mist border-t border-contour">
          SIH Prototype &middot; CogniPath AI
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
