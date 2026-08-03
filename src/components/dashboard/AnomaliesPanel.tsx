import React from "react";
import { AnomalyAlert } from "../../types";
import { ComponentBadge } from "../guide/ComponentBadge";
import { EXPLANATIONS } from "../../data/explanations";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { getSeverityColor } from "../../lib/utils";

interface AnomaliesPanelProps {
  anomalies: AnomalyAlert[];
  onOpenAllAnomalies: () => void;
}

export const AnomaliesPanel: React.FC<AnomaliesPanelProps> = ({
  anomalies,
  onOpenAllAnomalies,
}) => {
  const displayList = anomalies.slice(0, 3);

  return (
    <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-5 flex-1 relative overflow-hidden flex flex-col justify-between shadow-sm">
      {/* Top right subtle status dot */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ComponentBadge explanation={EXPLANATIONS.anomaliesPanel} />
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
            Anomalies Detected ({anomalies.length})
          </h4>
        </div>

        <div className="space-y-3">
          {displayList.length === 0 ? (
            <p className="text-xs text-[#71717A] py-4 text-center">
              No anomalies detected. Operations are within standard ML bounds.
            </p>
          ) : (
            displayList.map((item, idx) => (
              <div
                key={item.id}
                onClick={onOpenAllAnomalies}
                className={`flex gap-3 pb-3 cursor-pointer group ${
                  idx < displayList.length - 1
                    ? "border-b border-[#27272A]"
                    : ""
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-[#18181B] border border-[#27272A] flex-shrink-0 flex items-center justify-center font-mono text-[10px] font-bold text-[#A1A1AA] group-hover:border-[#3B82F6]/50 transition-colors">
                  {item.date.split("-").slice(1).join("/")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-white truncate group-hover:text-[#3B82F6] transition-colors">
                      {item.title}
                    </p>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${getSeverityColor(
                        item.severity
                      )}`}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71717A] truncate mt-0.5">
                    {item.metric}: {item.observedValue} (Exp: {item.expectedValue})
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={onOpenAllAnomalies}
        className="w-full mt-3 pt-3 border-t border-[#27272A] text-[11px] text-[#A1A1AA] hover:text-white font-semibold flex items-center justify-between transition-colors"
      >
        <span>Inspect All Anomaly Telemetry</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
