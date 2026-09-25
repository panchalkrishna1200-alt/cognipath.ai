import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export default function RadarChartView({
  competencies = [],
  showRequired = true,
  showReAssessed = false,
  height = 340,
}) {
  // Format data for Recharts Radar
  const data = competencies.map((c) => ({
    subject: c.name || c.topic,
    Current: c.current ?? c.mastery_pct ?? 50,
    Required: c.required ?? 80,
    ReAssessed: c.reAssessed ?? c.current ?? 75,
  }));

  return (
    <div style={{ width: "100%", height }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#94A3B8", fontSize: 10 }}
            stroke="#CBD5E1"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E2E8F0",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              fontSize: "12px",
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "8px",
              fontSize: "12px",
              fontWeight: 500,
            }}
          />

          {/* Current Mastery */}
          <Radar
            name={showReAssessed ? "Baseline (Before)" : "Current Competency"}
            dataKey="Current"
            stroke="#2563EB"
            fill="#3B82F6"
            fillOpacity={showReAssessed ? 0.2 : 0.4}
            strokeWidth={2}
          />

          {/* Required Benchmark */}
          {showRequired && (
            <Radar
              name="Required Benchmark"
              dataKey="Required"
              stroke="#F97316"
              fill="#F97316"
              fillOpacity={0.12}
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          )}

          {/* Post-Learning Re-Assessed */}
          {showReAssessed && (
            <Radar
              name="Re-Assessed (After Learning)"
              dataKey="ReAssessed"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.45}
              strokeWidth={2.5}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
