function statusColor(pct) {
  if (pct >= 70) return "#10B981";
  if (pct >= 45) return "#F59E0B";
  return "#EF4444";
}

function Node({ label, pct }) {
  const borderColor = statusColor(pct);
  return (
    <div className="flex flex-col items-center shrink-0">
      <div
        className="w-36 h-18 border rounded-lg bg-white shadow-sm flex items-center justify-center text-center px-3 py-2 transition-all"
        style={{ borderColor, borderWidth: "2px" }}
      >
        <div>
          <p className="text-xs font-semibold text-slate-800 leading-tight">{label}</p>
          <p className="text-xs font-bold text-slate-500 mt-1 tabular-nums">{pct}%</p>
        </div>
      </div>
    </div>
  );
}

export default function DependencyGraph({ gaps }) {
  if (!gaps || gaps.length === 0) {
    return (
      <div className="border border-slate-200/80 bg-white rounded-xl p-6 text-sm text-slate-500 shadow-sm">
        No prerequisite gaps detected &mdash; every assessed topic clears the mastery benchmark on its own.
      </div>
    );
  }

  return (
    <div className="border border-slate-200/80 bg-white rounded-xl p-6 space-y-6 overflow-x-auto scrollbar-thin shadow-sm">
      {gaps.map((gap) => (
        <div key={gap.topic} className="flex items-center gap-3">
          <Node label={gap.blocking_prerequisite} pct={gap.blocking_mastery_pct} />
          <span className="text-[#F97316] font-bold text-xl">&rarr;</span>
          <Node label={gap.topic} pct={gap.mastery_pct} />
          {gap.blocking_prerequisite !== gap.topic && (
            <p className="text-xs text-slate-500 ml-2 max-w-xs leading-relaxed">
              Study <span className="font-semibold text-slate-800">{gap.blocking_prerequisite}</span> before
              advancing in {gap.topic} &mdash; it forms the foundational dependency.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
