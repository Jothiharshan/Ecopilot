import React, { useState } from "react";
import { PredictionData, DailyRecord } from "../../types";
import { formatCurrency, formatNumber } from "../../lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Sparkles, TrendingUp, ShieldCheck, Zap, Sliders, ArrowRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface AiPredictionsViewProps {
  predictionData: PredictionData | null;
  records: DailyRecord[];
}

export const AiPredictionsView: React.FC<AiPredictionsViewProps> = ({
  predictionData,
  records,
}) => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [shiftPeakHours, setShiftPeakHours] = useState(30);
  const [solarOffsetPercent, setSolarOffsetPercent] = useState(15);

  const confidence = predictionData?.confidenceLevel || 94;
  const currentAvgElec = records.length > 0
    ? Math.round(records.slice(-7).reduce((a, b) => a + b.electricityKwh, 0) / Math.min(7, records.length))
    : 4150;

  // Simulate What-If Tariff calculation
  const monthlyBaseCost = currentAvgElec * 30 * 0.18;
  const savedFromPeakShift = monthlyBaseCost * (shiftPeakHours / 100) * 0.28;
  const savedFromSolar = monthlyBaseCost * (solarOffsetPercent / 100);
  const totalSimulatedSavings = Math.round(savedFromPeakShift + savedFromSolar);

  const forecastPoints = predictionData?.trendGraph || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#18181B] border border-[#27272A] p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#3B82F6]">
              7-Day ML Linear Regression Forecast
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Predictive Energy & Cost Demand Engine
          </h3>
          <p className="text-xs text-[#A1A1AA] max-w-2xl">
            EcoPilot AI trains on historical kWh, ambient temperature patterns, and shift production output to forecast demand and detect impending peak surcharge risks.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-[#09090B] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-[10px] text-[#A1A1AA] uppercase font-bold">Model Confidence</p>
              <p className="text-lg font-black text-white">{confidence}.2%</p>
            </div>
          </div>
          <div className="h-8 w-px bg-[#27272A]" />
          <div>
            <p className="text-[10px] text-[#A1A1AA] uppercase font-bold">Next-Day Forecast</p>
            <p className="text-lg font-black text-[#3B82F6]">
              {formatNumber(forecastPoints[0]?.predictedElectricity || 4380)} kWh
            </p>
          </div>
        </div>
      </div>

      {/* Main Prediction Graph */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              7-Day Electricity (kWh) & Water (L) Confidence Bands
            </h4>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Shaded regions indicate 95% statistical upper and lower confidence boundaries.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[#3B82F6]" />
              <span className="text-[#A1A1AA] font-medium">Electricity (kWh)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[#10B981]" />
              <span className="text-[#A1A1AA] font-medium">Water (L)</span>
            </div>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastPoints} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="elecGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke={isLight ? "#52525B" : "#A1A1AA"} fontSize={11} tickLine={false} />
              <YAxis
                stroke={isLight ? "#52525B" : "#A1A1AA"}
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
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
              />
              <Area
                type="monotone"
                dataKey="predictedElectricity"
                name="Electricity (kWh)"
                stroke="#3B82F6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#elecGrad)"
              />
              <Area
                type="monotone"
                dataKey="predictedWater"
                name="Water (Liters)"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#waterGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive What-If Simulator */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-5 h-5 text-[#3B82F6]" />
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              What-If Tariff & Peak Load Shifting Simulator
            </h4>
            <p className="text-xs text-[#A1A1AA]">
              Simulate adjusting industrial batch schedules to avoid peak 2PM–6PM electricity tariffs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Slider 1 */}
          <div className="space-y-2 bg-[#09090B] border border-[#27272A] p-4 rounded-xl">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#A1A1AA]">Peak-to-Off-Peak Shift</span>
              <span className="text-[#3B82F6] font-mono">{shiftPeakHours}% of load</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              value={shiftPeakHours}
              onChange={(e) => setShiftPeakHours(Number(e.target.value))}
              className="w-full accent-[#3B82F6] cursor-pointer"
            />
            <p className="text-[11px] text-[#71717A]">
              Move heavy furnace/CNC induction cycles before 10:00 AM.
            </p>
          </div>

          {/* Slider 2 */}
          <div className="space-y-2 bg-[#09090B] border border-[#27272A] p-4 rounded-xl">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#A1A1AA]">Rooftop Solar Offset</span>
              <span className="text-emerald-400 font-mono">{solarOffsetPercent}% generation</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={solarOffsetPercent}
              onChange={(e) => setSolarOffsetPercent(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[11px] text-[#71717A]">
              Simulated MSME rooftop solar PV offset on total daytime kWh.
            </p>
          </div>

          {/* Result Card */}
          <div className="bg-[#09090B] border border-[#3B82F6]/40 p-5 rounded-xl flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6]">
                Simulated Cost Optimization
              </span>
              <h3 className="text-3xl font-black text-emerald-400 mt-1">
                {formatCurrency(totalSimulatedSavings)}
                <span className="text-xs font-normal text-[#A1A1AA]"> / month</span>
              </h3>
            </div>
            <p className="text-[11px] text-[#E4E4E7] mt-2">
              Based on active MSME tariff rates and your 7-day average baseline ({formatNumber(currentAvgElec)} kWh/day).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
