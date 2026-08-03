import React from "react";
import {
  Factory,
  DailyRecord,
  PredictionData,
  Recommendation,
  AnomalyAlert,
  HealthScoreData,
} from "../../types";
import { KpiCards } from "../dashboard/KpiCards";
import { PredictionChartCard } from "../dashboard/PredictionChartCard";
import { AiRecommendationsPanel } from "../dashboard/AiRecommendationsPanel";
import { AnomaliesPanel } from "../dashboard/AnomaliesPanel";
import { Sparkles, HelpCircle, Activity, Building2, Upload, PlusCircle, AlertTriangle } from "lucide-react";
import { useGuide } from "../../context/GuideContext";

interface OverviewViewProps {
  factory: Factory | null;
  records: DailyRecord[];
  predictionData: PredictionData | null;
  recommendations: Recommendation[];
  anomalies: AnomalyAlert[];
  healthData: HealthScoreData | null;
  onOpenHealthView: () => void;
  onOpenPredictionsView: () => void;
  onOpenAnomaliesView: () => void;
  onOpenDataEntry?: () => void;
  onOpenCsvUpload?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  factory,
  records,
  predictionData,
  recommendations,
  anomalies,
  healthData,
  onOpenHealthView,
  onOpenPredictionsView,
  onOpenAnomaliesView,
  onOpenDataEntry,
  onOpenCsvUpload,
}) => {
  const { isGuideModeActive, setTourModalOpen } = useGuide();

  return (
    <div className="space-y-6">
      {/* Empty State Banner when factory exists but no data uploaded */}
      {records.length === 0 && (
        <div className="p-6 bg-[#18181B] border border-amber-500/40 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                No Monitoring Data Available for {factory?.name || "this Factory"}
              </h4>
              <p className="text-xs text-[#A1A1AA] mt-1 max-w-xl leading-relaxed">
                Upload CSV/Excel or enter daily monitoring data to generate AI insights, health scores, and predictive cost analytics.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            {onOpenCsvUpload && (
              <button
                onClick={onOpenCsvUpload}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white text-black hover:bg-[#E4E4E7] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload CSV/Excel</span>
              </button>
            )}
            {onOpenDataEntry && (
              <button
                onClick={onOpenDataEntry}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white border border-[#3F3F46] text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-[#3B82F6]" />
                <span>Enter Daily Data</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Explain UI Banner when Guide Mode is active */}
      {isGuideModeActive && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Explain UI Mode Active — Interactive Educational Badges Enabled
              </p>
              <p className="text-xs text-emerald-300/80">
                Click any <span className="underline font-semibold">? WHAT IS THIS?</span> badge on a dashboard card to learn the operational science and formula behind the telemetry.
              </p>
            </div>
          </div>
          <button
            onClick={() => setTourModalOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-500 text-black hover:bg-emerald-400 rounded-lg text-xs font-bold transition-all flex-shrink-0"
          >
            Start Interactive Tour →
          </button>
        </div>
      )}

      {/* Top Welcome / Live Telemetry strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18181B] border border-[#27272A] p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#09090B] border border-[#27272A] flex items-center justify-center text-[#3B82F6]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {factory ? `${factory.name} — Live Operations` : "Smart Factory Dashboard"}
            </h3>
            <p className="text-xs text-[#A1A1AA] flex items-center gap-1.5 mt-0.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {factory
                  ? `${factory.numberOfMachines} CNC/assembly units active in ${factory.location}`
                  : "All systems nominal"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-[#A1A1AA]">
          <span className="hidden md:inline">Last telemetry sync: just now</span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
            ONLINE
          </span>
        </div>
      </div>

      {/* Telemetry Status & Action Strip */}
      <div className="p-3.5 bg-gradient-to-r from-blue-950/40 via-[#18181B] to-[#18181B] border border-blue-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse flex-shrink-0" />
          <p className="text-[#E4E4E7] leading-relaxed">
            <span className="font-bold text-white">Factory Telemetry Mode:</span> New factories start empty. Upload a CSV/Excel dataset or create a new daily entry to populate operational metrics and AI predictions.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
          {onOpenCsvUpload && (
            <button
              onClick={onOpenCsvUpload}
              className="px-3 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-white border border-[#3F3F46] font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>Upload CSV/Excel</span>
            </button>
          )}
          {onOpenDataEntry && (
            <button
              onClick={onOpenDataEntry}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ New Entry</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 KPI Cards */}
      <KpiCards
        records={records}
        healthData={healthData}
        onOpenHealthView={onOpenHealthView}
      />

      {/* Middle Row: AI Prediction Chart + AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PredictionChartCard
            records={records}
            predictionData={predictionData}
            onOpenFullPredictions={onOpenPredictionsView}
          />
        </div>
        <div className="lg:col-span-1">
          <AiRecommendationsPanel
            recommendations={recommendations}
            onOpenFullRecommendations={onOpenPredictionsView}
          />
        </div>
      </div>

      {/* Bottom Row: Anomalies & Outliers Panel */}
      <div className="grid grid-cols-1">
        <AnomaliesPanel
          anomalies={anomalies}
          onOpenAllAnomalies={onOpenAnomaliesView}
        />
      </div>
    </div>
  );
};
