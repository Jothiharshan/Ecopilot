import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { DailyRecord, PredictionData } from "../../types";
import { ComponentBadge } from "../guide/ComponentBadge";
import { EXPLANATIONS } from "../../data/explanations";
import { Sparkles, HelpCircle } from "lucide-react";
import { useGuide } from "../../context/GuideContext";
import { useTheme } from "../../context/ThemeContext";

interface PredictionChartCardProps {
  records: DailyRecord[];
  predictionData: PredictionData | null;
  onOpenFullPredictions: () => void;
}

export const PredictionChartCard: React.FC<PredictionChartCardProps> = ({
  records,
  predictionData,
  onOpenFullPredictions,
}) => {
  const [metric, setMetric] = useState<"electricity" | "water">("electricity");
  const { openExplanation } = useGuide();
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Combine historical records with AI forecast
  const historicalSlice = records.slice(-10).map((r) => ({
    date: r.date.split("-").slice(1).join("/"),
    actual: metric === "electricity" ? r.electricityKwh : r.waterLiters,
    predicted: null as number | null,
    lower: null as number | null,
    upper: null as number | null,
    isForecast: false,
  }));

  const lastHistorical =
    historicalSlice.length > 0
      ? historicalSlice[historicalSlice.length - 1]
      : null;

  const forecastSlice =
    predictionData?.trendGraph.map((item) => ({
      date: item.date.split("-").slice(1).join("/"),
      actual: null as number | null,
      predicted:
        metric === "electricity"
          ? item.predictedElectricity
          : item.predictedWater,
      lower:
        metric === "electricity"
          ? item.confidenceLower
          : Math.round(item.predictedWater * 0.94),
      upper:
        metric === "electricity"
          ? item.confidenceUpper
          : Math.round(item.predictedWater * 1.06),
      isForecast: true,
    })) || [];

  // Connect last historical point to forecast line
  if (lastHistorical && forecastSlice.length > 0) {
    forecastSlice.unshift({
      date: lastHistorical.date,
      actual: null,
      predicted: lastHistorical.actual,
      lower: lastHistorical.actual,
      upper: lastHistorical.actual,
      isForecast: true,
    });
  }

  const combinedData = [...historicalSlice, ...forecastSlice];

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold tracking-tight text-white">
                Consumption vs. AI Prediction
              </h4>
              <ComponentBadge explanation={EXPLANATIONS.predictionChart} />
            </div>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              10-day historical telemetry & 7-day linear regression ML forecast
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Metric Selector Pills */}
          <div className="flex bg-[#09090B] border border-[#27272A] rounded-lg p-0.5">
            <button
              onClick={() => setMetric("electricity")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                metric === "electricity"
                  ? "bg-[#3B82F6] text-white shadow-sm"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              Electricity (kWh)
            </button>
            <button
              onClick={() => setMetric("water")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                metric === "water"
                  ? "bg-[#3B82F6] text-white shadow-sm"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              Water (Liters)
            </button>
          </div>

          {/* Legend */}
          <div className="hidden md:flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
              <span className="text-[10px] text-[#A1A1AA] font-medium">Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white opacity-40 border border-dashed border-white" />
              <span className="text-[10px] text-[#A1A1AA] font-medium">
                AI Forecast
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full relative">
        {combinedData.length === 0 ? (
          <div className="absolute inset-0 bg-[#09090B]/60 rounded-xl border border-dashed border-[#27272A] flex flex-col items-center justify-center p-6 text-center">
            <Sparkles className="w-8 h-8 text-[#3B82F6] mb-2 opacity-80" />
            <p className="text-sm font-bold text-white mb-1">
              No Telemetry Data Available
            </p>
            <p className="text-xs text-[#A1A1AA] max-w-md">
              Upload a CSV/Excel file or click "+ New Entry" to populate daily telemetry and view consumption vs. AI ML predictions.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={combinedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FAFAFA" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FAFAFA" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="date"
                stroke={isLight ? "#52525B" : "#A1A1AA"}
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: isLight ? "#E4E4E7" : "#27272A" }}
              />
              <YAxis
                stroke={isLight ? "#52525B" : "#A1A1AA"}
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: isLight ? "#E4E4E7" : "#27272A" }}
                tickFormatter={(val) =>
                  val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isLight ? "#FFFFFF" : "#18181B",
                  borderColor: isLight ? "#E4E4E7" : "#27272A",
                  borderRadius: "8px",
                  color: isLight ? "#09090B" : "#FAFAFA",
                  fontSize: "12px",
                  boxShadow: isLight ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "none",
                }}
                labelStyle={{ color: isLight ? "#52525B" : "#A1A1AA", fontWeight: "bold" }}
              />

              {/* Historical Actual Area */}
              <Area
                type="monotone"
                dataKey="actual"
                name={metric === "electricity" ? "Actual (kWh)" : "Actual (Liters)"}
                stroke="#3B82F6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorActual)"
                connectNulls={true}
              />

              {/* AI Forecast Area */}
              <Area
                type="monotone"
                dataKey="predicted"
                name="AI Forecast"
                stroke={isLight ? "#2563EB" : "#FAFAFA"}
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorPredicted)"
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Banner */}
      <div className="mt-4 pt-4 border-t border-[#27272A] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#3B82F6]" />
          <span className="text-xs text-[#E4E4E7] font-medium">
            {predictionData?.summary ||
              "Electricity forecast indicates +4.2% demand increase tomorrow based on shift telemetry."}
          </span>
        </div>
        <button
          onClick={onOpenFullPredictions}
          className="text-xs text-[#3B82F6] hover:text-blue-400 font-bold underline decoration-blue-500/50 hover:decoration-blue-400 transition-colors flex-shrink-0"
        >
          View Full AI Analysis →
        </button>
      </div>
    </div>
  );
};
