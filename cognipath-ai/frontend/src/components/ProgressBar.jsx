const STATUS_CONFIG = {
  green: {
    bar: "bg-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    label: "Strong",
  },
  yellow: {
    bar: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border border-amber-200/60",
    label: "Developing",
  },
  red: {
    bar: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 border border-rose-200/60",
    label: "Needs Focus",
  },
  navy: {
    bar: "bg-[#0F2F64]",
    badge: "bg-blue-50 text-blue-700 border border-blue-200/60",
    label: "Proficient",
  },
};

function getStatus(pct) {
  if (pct >= 70) return "green";
  if (pct >= 45) return "yellow";
  return "red";
}

export default function ProgressBar({ label, pct, status, subLabel, navyStyle = false }) {
  const resolvedStatus = navyStyle ? "navy" : status || getStatus(pct);
  const config = STATUS_CONFIG[resolvedStatus] || STATUS_CONFIG.navy;

  return (
    <div className="mb-4 group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-800 tabular-nums">{pct}%</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
            {config.label}
          </span>
        </div>
      </div>
      <div className="h-2.5 bg-slate-100 rounded overflow-hidden">
        <div
          className={`h-full ${config.bar} transition-all duration-700 ease-out`}
          style={{ width: `${Math.max(2, Math.min(100, pct))}%` }}
        />
      </div>
      {subLabel && (
        <p className="text-[11px] text-slate-400 mt-1">{subLabel}</p>
      )}
    </div>
  );
}
