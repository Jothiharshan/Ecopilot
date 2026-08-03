import React, { useState } from "react";
import { AnomalyAlert, Recommendation } from "../../types";
import { AlertTriangle, Sparkles, CheckCircle2, ShieldAlert, ArrowRight, Filter } from "lucide-react";
import { getSeverityColor } from "../../lib/utils";

interface AnomaliesViewProps {
  anomalies: AnomalyAlert[];
  recommendations: Recommendation[];
}

export const AnomaliesView: React.FC<AnomaliesViewProps> = ({
  anomalies,
  recommendations,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  const filteredAnomalies = filterSeverity === "ALL"
    ? anomalies
    : anomalies.filter((a) => a.severity === filterSeverity);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#18181B] border border-[#27272A] p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Anomalies & AI Operational Diagnostics
            </h3>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Statistical outliers detected via Z-score analysis and Gemini AI root-cause recommendations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#A1A1AA] font-semibold">Severity:</span>
          {["ALL", "HIGH", "MEDIUM", "LOW"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterSeverity(lvl)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all border ${
                filterSeverity === lvl
                  ? "bg-[#3B82F6] text-white border-[#3B82F6]"
                  : "bg-[#09090B] text-[#A1A1AA] border-[#27272A] hover:text-white"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
          Detected Outlier Events ({filteredAnomalies.length})
        </h4>
        {filteredAnomalies.length === 0 ? (
          <div className="p-8 bg-[#18181B] border border-[#27272A] rounded-xl text-center text-xs text-[#71717A]">
            No anomalies match your selected filter criteria. All telemetry within nominal limits.
          </div>
        ) : (
          filteredAnomalies.map((item) => (
            <div
              key={item.id}
              className="bg-[#18181B] border border-[#27272A] hover:border-[#3B82F6]/40 rounded-xl p-5 transition-all shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#09090B] border border-[#27272A] flex items-center justify-center font-mono text-xs font-bold text-white">
                    {item.date.split("-").slice(1).join("/")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-white">{item.title}</h5>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getSeverityColor(
                          item.severity
                        )}`}
                      >
                        {item.severity} SEVERITY
                      </span>
                    </div>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">
                      {item.metric}: Observed{" "}
                      <strong className="text-white">{item.observedValue}</strong> vs Expected baseline{" "}
                      <strong className="text-[#3B82F6]">{item.expectedValue}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Root Cause & Recommendation box */}
              <div className="bg-[#09090B] border border-[#27272A] rounded-lg p-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B82F6] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Diagnostic Analysis & Prescribed Action</span>
                </div>
                <p className="text-xs text-[#E4E4E7] leading-relaxed">
                  {item.aiRecommendation ||
                    "Spike correlates with CNC Machine #3 thermal induction coil recalibration cycle. Recommend checking harmonic line filters."}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Prescriptive Recommendations Row */}
      <div className="space-y-4 pt-4 border-t border-[#27272A]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
          Strategic Optimization Prescriptions ({recommendations.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#3B82F6]/20 text-[#3B82F6]">
                    {rec.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    Est. Savings: {rec.estimatedSavings}
                  </span>
                </div>
                <h5 className="text-sm font-bold text-white mb-1">{rec.title}</h5>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">{rec.description}</p>
              </div>
              <div className="mt-4 p-3 bg-[#09090B] border border-[#27272A] rounded-lg flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#E4E4E7]">
                  <strong className="text-white">Next Step: </strong>
                  {rec.actionableStep}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
