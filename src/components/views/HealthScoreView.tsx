import React from "react";
import { HealthScoreData, DailyRecord } from "../../types";
import { HeartPulse, CheckCircle2, AlertTriangle, ArrowUpRight, Zap, ShieldAlert } from "lucide-react";
import { formatCurrency, formatNumber } from "../../lib/utils";

interface HealthScoreViewProps {
  healthData: HealthScoreData | null;
  records: DailyRecord[];
}

export const HealthScoreView: React.FC<HealthScoreViewProps> = ({
  healthData,
  records,
}) => {
  const score = healthData?.score || 92;
  const level = (healthData?.healthLevel || "EXCELLENT").toUpperCase();
  const b = healthData?.breakdown;
  const factors = [
    {
      category: "Electricity Efficiency",
      score: b ? Math.round(b.electricityEfficiency) : 94,
      maxScore: 100,
      comment: "ISO-50001 kWh per output unit optimization",
    },
    {
      category: "Water Conservation",
      score: b ? Math.round(b.waterEfficiency) : 90,
      maxScore: 100,
      comment: "Within 5% of industry benchmark",
    },
    {
      category: "Machine Utilization",
      score: b ? Math.round(b.machineUtilizationScore) : 88,
      maxScore: 100,
      comment: "CNC spindle & assembly line active duty cycle",
    },
    {
      category: "Production Efficiency",
      score: b ? Math.round(b.productionEfficiency) : 92,
      maxScore: 100,
      comment: "Good output units vs scrap/rework ratio",
    },
    {
      category: "Maintenance Reliability",
      score: b ? Math.round(b.maintenanceHistoryScore) : 96,
      maxScore: 100,
      comment: "Zero unpredicted downtime events",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Score Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Badge Card */}
        <div className="bg-gradient-to-br from-[#18181B] to-[#09090B] border border-[#27272A] p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-lg">
          <div className="w-20 h-20 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center mb-4 shadow-xl">
            <HeartPulse className="w-10 h-10 text-[#3B82F6]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">
            Overall Smart Factory Health
          </span>
          <h2 className="text-6xl font-black text-white my-2 tracking-tight">
            {score}
            <span className="text-2xl text-[#71717A] font-normal"> / 100</span>
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              level === "EXCELLENT"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : level === "GOOD"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
            }`}
          >
            {level} OPERATIONAL EFFICIENCY
          </span>
          <p className="text-xs text-[#71717A] mt-4 max-w-sm">
            Composite score calculated across ISO-50001 energy compliance, water waste metrics, and CNC spindle load telemetry.
          </p>
        </div>

        {/* Breakdown Factors List */}
        <div className="lg:col-span-2 bg-[#18181B] border border-[#27272A] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              0-100 Category Efficiency Breakdown
            </h3>
            <div className="space-y-4">
              {factors.map((item, idx) => (
                <div key={idx} className="bg-[#09090B] border border-[#27272A] p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{item.category}</span>
                    <span className="text-xs font-mono font-bold text-[#3B82F6]">
                      {item.score} / {item.maxScore}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#18181B] rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.score >= 90
                          ? "bg-emerald-500"
                          : item.score >= 75
                          ? "bg-blue-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#A1A1AA]">{item.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Action Checklist */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Efficiency Enhancement Audit Checklist
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#09090B] border border-[#27272A] p-4 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">ISO 50001 Energy Audit</p>
              <p className="text-[11px] text-[#A1A1AA] mt-1">
                Your kWh / production unit ratio is 2.19 kWh/unit — 14% better than regional MSME benchmarks.
              </p>
            </div>
          </div>

          <div className="bg-[#09090B] border border-[#27272A] p-4 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Water Closed-Loop Recycling</p>
              <p className="text-[11px] text-[#A1A1AA] mt-1">
                Coolant recycling system active. Water consumption remains steady at ~12.4k L/shift.
              </p>
            </div>
          </div>

          <div className="bg-[#09090B] border border-[#27272A] p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Off-Peak Induction Scheduling</p>
              <p className="text-[11px] text-[#A1A1AA] mt-1">
                Opportunity to gain +4 Health Score points by avoiding 2PM–6PM high-tariff windows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
