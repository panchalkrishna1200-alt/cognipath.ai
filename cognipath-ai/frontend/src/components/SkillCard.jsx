const STATUS_TEXT = { green: "Solid", yellow: "Developing", red: "Weak" };
const STATUS_DOT = { green: "bg-moss", yellow: "bg-amber", red: "bg-rust" };

export default function SkillCard({ topic, masteryPct, rawScorePct, status }) {
  return (
    <div className="border border-contour bg-inkLight px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-sm text-parchment">{topic}</p>
        <p className="text-xs text-mist mt-0.5">Quiz accuracy: {rawScorePct}%</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-display text-parchment tabular-nums">{masteryPct}%</p>
        <p className="text-xs flex items-center gap-1 justify-end text-mist">
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
          {STATUS_TEXT[status]}
        </p>
      </div>
    </div>
  );
}
