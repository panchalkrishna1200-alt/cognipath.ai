import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function RadarChartView({ topics }) {
  const data = topics.map((t) => ({ topic: t.topic, mastery: t.mastery_pct }));

  return (
    <div className="h-80 border border-contour bg-inkLight p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="#3D3560" />
          <PolarAngleAxis dataKey="topic" tick={{ fill: "#F3EFEA", fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#A79FC7", fontSize: 10 }} />
          <Radar
            name="Mastery"
            dataKey="mastery"
            stroke="#F2643B"
            fill="#F2643B"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
