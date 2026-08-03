import React, { useState } from "react";
import { DailyRecord } from "../../types";
import { formatCurrency, formatNumber } from "../../lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Upload, Plus, Filter, Download, ArrowUpDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface AnalyticsViewProps {
  records: DailyRecord[];
  onOpenDataEntry: () => void;
  onOpenCsvUpload: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  records,
  onOpenDataEntry,
  onOpenCsvUpload,
}) => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "electricity" | "cost">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter & sort
  const filtered = records
    .filter((r) => r.date.includes(searchTerm))
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "desc"
          ? b.date.localeCompare(a.date)
          : a.date.localeCompare(b.date);
      } else if (sortBy === "electricity") {
        return sortOrder === "desc"
          ? b.electricityKwh - a.electricityKwh
          : a.electricityKwh - b.electricityKwh;
      } else {
        return sortOrder === "desc"
          ? b.operatingCost - a.operatingCost
          : a.operatingCost - b.operatingCost;
      }
    });

  const chartData = records.slice(-14).map((r) => ({
    date: r.date.split("-").slice(1).join("/"),
    electricity: r.electricityKwh,
    water: r.waterLiters,
    cost: r.operatingCost,
    utilization: r.machineUtilization,
  }));

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#18181B] border border-[#27272A] p-4 rounded-xl">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Daily Operational Data & CSV Ingestion
          </h3>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Full audit log of electricity kWh, water usage, output units, and machine utilization.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCsvUpload}
            className="px-3.5 py-2 bg-[#09090B] border border-[#27272A] hover:border-[#3B82F6]/50 rounded-lg text-xs font-semibold text-white transition-all flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Upload CSV/Excel</span>
          </button>
          <button
            onClick={onOpenDataEntry}
            className="px-4 py-2 bg-white text-black hover:bg-[#E4E4E7] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Telemetry Entry</span>
          </button>
        </div>
      </div>

      {/* Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost & Electricity Trend Bar Chart */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            14-Day Electricity & Operating Cost Breakdown
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
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
                <Legend />
                <Bar dataKey="electricity" name="Electricity (kWh)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" name="Operating Cost ($)" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Machine Utilization Trend */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Machine Utilization (%) vs Water Telemetry
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke={isLight ? "#52525B" : "#A1A1AA"} fontSize={11} tickLine={false} />
                <YAxis stroke={isLight ? "#52525B" : "#A1A1AA"} fontSize={11} tickLine={false} domain={[0, 100]} />
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  name="Utilization (%)"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Telemetry Table */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Telemetry Register ({filtered.length} entries)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Filter by date (YYYY-MM-DD)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#09090B] border border-[#27272A] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#3B82F6]"
            />
            <button
              onClick={() => {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
              className="px-3 py-1.5 bg-[#09090B] border border-[#27272A] hover:border-white/30 rounded-lg text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1.5"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort: {sortBy.toUpperCase()} ({sortOrder})</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#27272A] bg-[#09090B]/50 text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Electricity (kWh)</th>
                <th className="py-3 px-4">Water (L)</th>
                <th className="py-3 px-4">Output (Units)</th>
                <th className="py-3 px-4">Hours</th>
                <th className="py-3 px-4">Utilization</th>
                <th className="py-3 px-4">Maintenance</th>
                <th className="py-3 px-4">Operating Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A] text-xs font-medium text-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#A1A1AA]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-sm font-bold text-white">No Telemetry Records Found</p>
                      <p className="text-xs text-[#A1A1AA] max-w-sm">
                        Upload a CSV/Excel dataset or click "Add Telemetry Entry" to log daily factory records.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={i} className="hover:bg-[#27272A]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold">{r.date}</td>
                    <td className="py-3 px-4 text-[#3B82F6] font-bold">{formatNumber(r.electricityKwh)} kWh</td>
                    <td className="py-3 px-4 text-[#A1A1AA]">{formatNumber(r.waterLiters)} L</td>
                    <td className="py-3 px-4">{formatNumber(r.productionOutput)}</td>
                    <td className="py-3 px-4 font-mono">{r.workingHours}h</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.machineUtilization >= 85
                            ? "bg-emerald-500/20 text-emerald-400"
                            : r.machineUtilization >= 70
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-rose-500/20 text-rose-400"
                        }`}
                      >
                        {r.machineUtilization}%
                      </span>
                    </td>
                    <td className="py-3 px-4">{formatCurrency(r.maintenanceCost)}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{formatCurrency(r.operatingCost)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
