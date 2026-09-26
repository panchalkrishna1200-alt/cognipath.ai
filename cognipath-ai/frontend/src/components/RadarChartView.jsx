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

// Truncate long axis labels so they never overflow the chart boundary
function shortLabel(name = "", maxLen = 18) {
  if (!name) return "";
  // Take first meaningful words up to maxLen chars
  return name.length > maxLen ? name.slice(0, maxLen).trimEnd() + "…" : name;
}

// Custom angle-axis tick with wrapping — renders short labels at correct positions
function CustomTick({ x, y, payload, textAnchor }) {
  const label = shortLabel(payload?.value ?? "", 20);
  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor || "middle"}
      dominantBaseline="central"
      fill="#334155"
      fontSize={10}
      fontWeight={600}
    >
      {label}
    </text>
  );
}

export default function RadarChartView({
  competencies = [],
  showRequired = true,
  showReAssessed = false,
  height = 360,
}) {
  const data = competencies.map((c) => ({
    subject: c.name || c.topic || "",
    Current: c.current ?? c.mastery_pct ?? 50,
    Required: c.required ?? 80,
    ReAssessed: c.reAssessed ?? c.current ?? 75,
  }));

  return (
    // Extra top/bottom padding so axis labels have breathing room
    <div style={{ width: "100%", height }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        {/*
          outerRadius="55%" — shrunk from 70% so the chart polygon itself
          stays well clear of the container edge, leaving room for labels.
          margin props add additional breathing room on all sides.
        */}
        <RadarChart
          data={data}
          outerRadius="55%"
          margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
        >
          <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={<CustomTick />}
            // Increase the label radius offset so labels don't sit on top of the polygon
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#94A3B8", fontSize: 9 }}
            stroke="#CBD5E1"
            tickCount={5}
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
              fontSize: "11px",
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
