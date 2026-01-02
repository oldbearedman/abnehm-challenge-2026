import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { Activity } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dateStr = new Date(label).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short"
    });

    return (
      <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md z-50">
        <p className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
          {dateStr}
        </p>
        <div className="space-y-1">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <span
                className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: entry.color, color: entry.color }}
              />
              <span className="text-slate-200 font-medium w-16">
                {entry.name}:
              </span>
              <span className="text-white font-bold">
                {Number(entry.value).toFixed(1)} kg
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function ProgressChart({ chartData, participants, compact = false }) {
  const colors = ["#3b82f6", "#10b981", "#f43f5e", "#f59e0b", "#8b5cf6"];

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-1">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: entry.color }} 
            />
            {entry.value}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`bg-slate-900 rounded-xl border border-white/10 shadow-sm h-full flex flex-col overflow-hidden ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h2 className={`font-bold text-white flex items-center gap-2 ${compact ? "text-base" : "text-lg"}`}>
          <Activity size={18} className="text-blue-500" /> Verlauf
        </h2>
      </div>

      <div className="flex-1 min-h-[150px] w-full relative">
        {(!chartData || chartData.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm z-10">
            Noch keine Daten vorhanden
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
          >
            <CartesianGrid 
              stroke="#1e293b" 
              strokeDasharray="4 4" 
              vertical={false} 
            />
            
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickFormatter={(str) => {
                const d = new Date(str);
                return `${d.getDate()}.${d.getMonth() + 1}.`;
              }}
              axisLine={false}
              tickLine={false}
              dy={10}
              minTickGap={30}
            />
            
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              dx={-5}
              width={40}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#334155", strokeWidth: 1, strokeDasharray: "4 4" }} />
            
            <Legend content={renderLegend} verticalAlign="top" height={36} />

            {participants.map((p, index) => (
              <Line
                key={p.id}
                connectNulls={true}
                type="monotone"
                dataKey={p.name}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={false}
                // HIER WAR DER FEHLER: strokeWidth: 0 wurde entfernt
                activeDot={{ 
                  r: 6, 
                  fill: colors[index % colors.length],
                  stroke: "#1e293b",
                  strokeWidth: 2
                }}
                animationDuration={1500}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}