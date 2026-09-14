const STATUS_COLOR = {
  green: "bg-moss",
  yellow: "bg-amber",
  red: "bg-rust",
};

export default function ProgressBar({ label, pct, status = "yellow", subLabel }) {
  const color = STATUS_COLOR[status] || STATUS_COLOR.yellow;
  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm text-parchment">{label}</span>
        <span className="text-sm text-mist tabular-nums">
          {pct}% {subLabel && <span className="text-xs">&middot; {subLabel}</span>}
        </span>
      </div>
      <div className="h-2 bg-ink border border-contour rounded-none overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${Math.max(2, Math.min(100, pct))}%` }}
        />
      </div>
    </div>
  );
}
