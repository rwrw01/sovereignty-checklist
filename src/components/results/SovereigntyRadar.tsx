"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SovScoreResult {
  category: string;
  categoryName: string;
  avgScore: number;
  sealLevel: number;
  weight: number;
}

interface SovereigntyRadarProps {
  scores: SovScoreResult[];
  color?: string;
}

export function SovereigntyRadar({ scores, color = "#883486" }: SovereigntyRadarProps) {
  const data = scores.map((s) => ({
    category: s.categoryName.length > 18
      ? s.categoryName.substring(0, 16) + "…"
      : s.categoryName,
    fullName: s.categoryName,
    score: s.avgScore,
    maxScore: 4,
  }));

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: "#6b7280" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 4]}
            tickCount={5}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
                  <p className="font-semibold">{d.fullName}</p>
                  <p className="text-foreground/60">
                    Score: {d.score.toFixed(1)} / 4.0
                  </p>
                </div>
              );
            }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke={color}
            fill={color}
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
