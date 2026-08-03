import React from "react";
import { DailyRecord, HealthScoreData } from "../../types";
import { formatCurrency, formatNumber } from "../../lib/utils";
import { ComponentBadge } from "../guide/ComponentBadge";
import { EXPLANATIONS } from "../../data/explanations";
import { useGuide } from "../../context/GuideContext";

interface KpiCardsProps {
  records: DailyRecord[];
  healthData: HealthScoreData | null;
  onOpenHealthView: () => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  records,
  healthData,
  onOpenHealthView,
}) => {
  const { openExplanation } = useGuide();

  // Calculate stats from records
  const hasData = records.length > 0;
  const recent7 = records.slice(-7);
  const prev7 = records.slice(-14, -7);

  const totalElectricity7 = recent7.reduce((acc, r) => acc + r.electricityKwh, 0);
  const prevElectricity7 = prev7.reduce((acc, r) => acc + r.electricityKwh, 0);
  const electricityDiff =
    prevElectricity7 > 0
      ? ((totalElectricity7 - prevElectricity7) / prevElectricity7) * 100
      : 0;

  const avgUtilization7 =
    recent7.length > 0
      ? recent7.reduce((acc, r) => acc + r.machineUtilization, 0) / recent7.length
      : 0;
  const prevUtilization7 =
    prev7.length > 0
      ? prev7.reduce((acc, r) => acc + r.machineUtilization, 0) / prev7.length
      : 0;
  const utilDiff = recent7.length > 0 && prev7.length > 0 ? avgUtilization7 - prevUtilization7 : 0;

  const totalCost7 = recent7.reduce((acc, r) => acc + r.operatingCost, 0);
  const prevCost7 = prev7.reduce((acc, r) => acc + r.operatingCost, 0);
  const costDiff =
    prevCost7 > 0 ? ((totalCost7 - prevCost7) / prevCost7) * 100 : 0;

  const healthScore = hasData && healthData ? healthData.score : 0;
  const healthLevel = hasData && healthData ? healthData.healthLevel : "NO DATA";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Electricity Usage Card */}
      <div
        onClick={() => openExplanation(EXPLANATIONS.electricityCard)}
        className="bg-[#18181B] p-5 rounded-xl border border-[#27272A] hover:border-[#3B82F6]/50 transition-all cursor-pointer relative group"
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-[#A1A1AA] font-medium">Electricity Usage</p>
          <ComponentBadge explanation={EXPLANATIONS.electricityCard} />
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold italic tracking-tight text-white">
            {formatNumber(totalElectricity7)}{" "}
            <span className="text-sm font-normal not-italic text-[#71717A]">
              kWh
            </span>
          </h3>
          <span
            className={`text-[10px] font-bold ${
              !hasData ? "text-[#71717A]" : electricityDiff > 0 ? "text-red-400" : "text-green-400"
            }`}
          >
            {!hasData ? "--" : electricityDiff > 0 ? `+${electricityDiff.toFixed(1)}%` : `${electricityDiff.toFixed(1)}%`}
          </span>
        </div>
        <p className="text-[10px] text-[#71717A] mt-2">
          {hasData ? "7-day total across active lines" : "Upload CSV or add daily entry"}
        </p>
      </div>

      {/* Machine Utilization Card */}
      <div
        onClick={() => openExplanation(EXPLANATIONS.utilizationCard)}
        className="bg-[#18181B] p-5 rounded-xl border border-[#27272A] hover:border-[#3B82F6]/50 transition-all cursor-pointer relative group"
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-[#A1A1AA] font-medium">Machine Utilization</p>
          <ComponentBadge explanation={EXPLANATIONS.utilizationCard} />
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold italic tracking-tight text-white">
            {avgUtilization7.toFixed(1)}{" "}
            <span className="text-sm font-normal not-italic text-[#71717A]">
              %
            </span>
          </h3>
          <span
            className={`text-[10px] font-bold ${
              !hasData ? "text-[#71717A]" : utilDiff >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {!hasData ? "--" : utilDiff >= 0 ? `+${utilDiff.toFixed(1)}%` : `${utilDiff.toFixed(1)}%`}
          </span>
        </div>
        <p className="text-[10px] text-[#71717A] mt-2">
          {hasData ? "Active production vs shift hours" : "Upload CSV or add daily entry"}
        </p>
      </div>

      {/* Operational Cost Card */}
      <div
        onClick={() => openExplanation(EXPLANATIONS.costCard)}
        className="bg-[#18181B] p-5 rounded-xl border border-[#27272A] hover:border-[#3B82F6]/50 transition-all cursor-pointer relative group"
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-[#A1A1AA] font-medium">Operational Cost</p>
          <ComponentBadge explanation={EXPLANATIONS.costCard} />
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold italic tracking-tight text-white">
            {formatCurrency(totalCost7)}
          </h3>
          <span
            className={`text-[10px] font-bold ${
              !hasData ? "text-[#71717A]" : costDiff <= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {!hasData ? "--" : costDiff <= 0 ? `${costDiff.toFixed(1)}%` : `+${costDiff.toFixed(1)}%`}
          </span>
        </div>
        <p className="text-[10px] text-[#71717A] mt-2">
          {hasData ? "Electricity + water + maintenance" : "Upload CSV or add daily entry"}
        </p>
      </div>

      {/* Health Score Box (Clean Minimalism blue highlight card) */}
      <div
        onClick={onOpenHealthView}
        className="bg-[#3B82F6] p-5 rounded-xl border border-[#3B82F6] hover:bg-[#2563eb] transition-all flex flex-col justify-between cursor-pointer group shadow-lg shadow-blue-500/20"
        title="Click to view full 0-100 Factory Health breakdown"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/80 font-bold uppercase tracking-widest">
            Health Score
          </p>
          <ComponentBadge
            explanation={EXPLANATIONS.healthScoreCard}
            className="!bg-white/20 !text-white !border-white/30"
          />
        </div>
        <div className="my-1">
          <h3 className="text-4xl font-black text-white tracking-tight">
            {healthScore}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-white/90 font-bold uppercase tracking-wider">
            {String(healthLevel).toUpperCase()}
          </p>
          <span className="text-[10px] text-white/80 underline decoration-white/40 group-hover:decoration-white">
            View breakdown →
          </span>
        </div>
      </div>
    </div>
  );
};
