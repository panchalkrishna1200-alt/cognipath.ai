const STATUS_TEXT = { green: "Solid", yellow: "Developing", red: "Needs Focus" };
const STATUS_DOT = { green: "bg-emerald-500", yellow: "bg-amber-500", red: "bg-rose-500" };

export default function SkillCard({ topic, masteryPct, rawScorePct, status }) {
  return (
    <div className="border border-slate-200/80 bg-white rounded-xl px-5 py-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-bold text-slate-900">{topic}</p>
        <p className="text-xs text-slate-500 mt-0.5">Quiz accuracy: {rawScorePct}%</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-extrabold text-slate-900 tabular-nums">{masteryPct}%</p>
        <p className="text-xs flex items-center gap-1.5 justify-end text-slate-500 font-medium">
          <span className={`w-2 h-2 rounded-full ${STATUS_DOT[status] || "bg-slate-400"}`} />
          {STATUS_TEXT[status] || "Assessed"}
        </p>
      </div>
    </div>
  );
}
