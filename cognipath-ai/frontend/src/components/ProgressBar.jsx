const STATUS_CONFIG = {
  green: { bar: "bg-gradient-to-r from-emerald-500 to-emerald-400", badge: "badge-green", label: "Strong" },
  yellow: { bar: "bg-gradient-to-r from-amber-500 to-amber-400", badge: "badge-yellow", label: "Good" },
  red: { bar: "bg-gradient-to-r from-red-500 to-orange-500", badge: "badge-red", label: "Weak" },
};

function getStatus(pct) {
  if (pct >= 70) return "green";
  if (pct >= 45) return "yellow";
  return "red";
}

export default function ProgressBar({ label, pct, status, subLabel }) {
  const resolvedStatus = status || getStatus(pct);
  const config = STATUS_CONFIG[resolvedStatus] || STATUS_CONFIG.yellow;

  return (
    <div className="mb-5 group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-parchment">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-parchment tabular-nums">{pct}%</span>
          <span className={`badge ${config.badge}`}>
            {config.label}
          </span>
        </div>
      </div>
      <div className="h-2.5 bg-ink rounded-full overflow-hidden border border-contour/30">
        <div
          className={`h-full ${config.bar} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${Math.max(3, Math.min(100, pct))}%` }}
        />
      </div>
      {subLabel && (
        <p className="text-[11px] text-mist mt-1">{subLabel}</p>
      )}
    </div>
  );
}
