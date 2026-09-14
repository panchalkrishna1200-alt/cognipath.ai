function statusColor(pct) {
  if (pct >= 70) return "#5FB88D";
  if (pct >= 45) return "#F2B84B";
  return "#E14F4F";
}

function Node({ label, pct }) {
  return (
    <div className="flex flex-col items-center shrink-0">
      <div
        className="w-32 h-16 border flex items-center justify-center text-center px-2"
        style={{ borderColor: statusColor(pct), backgroundColor: "#272042" }}
      >
        <div>
          <p className="text-xs text-parchment leading-tight">{label}</p>
          <p className="text-xs text-mist mt-1">{pct}%</p>
        </div>
      </div>
    </div>
  );
}

export default function DependencyGraph({ gaps }) {
  if (!gaps || gaps.length === 0) {
    return (
      <div className="border border-contour bg-inkLight p-6 text-sm text-mist">
        No prerequisite gaps detected - every assessed topic clears the mastery bar on its own.
      </div>
    );
  }

  return (
    <div className="border border-contour bg-inkLight p-6 space-y-6 overflow-x-auto scrollbar-thin">
      {gaps.map((gap) => (
        <div key={gap.topic} className="flex items-center gap-3">
          <Node label={gap.blocking_prerequisite} pct={gap.blocking_mastery_pct} />
          <span className="text-trail text-lg">&rarr;</span>
          <Node label={gap.topic} pct={gap.mastery_pct} />
          {gap.blocking_prerequisite !== gap.topic && (
            <p className="text-xs text-mist ml-2 max-w-xs">
              Study <span className="text-parchment">{gap.blocking_prerequisite}</span> before
              continuing with {gap.topic} - it's the weaker link underneath.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
