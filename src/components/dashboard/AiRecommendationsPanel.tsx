import React from "react";
import { Recommendation } from "../../types";
import { ComponentBadge } from "../guide/ComponentBadge";
import { EXPLANATIONS } from "../../data/explanations";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

interface AiRecommendationsPanelProps {
  recommendations: Recommendation[];
  onOpenFullRecommendations: () => void;
}

export const AiRecommendationsPanel: React.FC<AiRecommendationsPanelProps> = ({
  recommendations,
  onOpenFullRecommendations,
}) => {
  const primaryRec = recommendations[0] || {
    id: "rec-default",
    title: "Shift Heavy Induction Furnace Loads to Off-Peak Hours",
    category: "Electricity Cost",
    impact: "High",
    estimatedSavings: "$2,800 / mo",
    description:
      "Electricity rate tariffs spike by 38% between 2:00 PM and 6:00 PM. Shifting batch pre-heating cycles avoids peak demand charges.",
    actionableStep: "Reschedule high-amp thermal cycles to 5:00 AM – 9:00 AM.",
  };

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 flex flex-col justify-between hover:border-[#3B82F6]/40 transition-all shadow-sm">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#3B82F6]" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#3B82F6]">
              AI Insight & Action
            </h4>
          </div>
          <ComponentBadge explanation={EXPLANATIONS.recommendationsPanel} />
        </div>

        {/* Top Recommendation Content */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] bg-[#3B82F6]/20 text-[#3B82F6] px-2 py-0.5 rounded font-bold uppercase">
              {primaryRec.category}
            </span>
            <span className="text-xs font-bold text-emerald-400">
              Est. Savings: {primaryRec.estimatedSavings}
            </span>
          </div>
          <h5 className="text-sm font-bold text-white tracking-tight">
            {primaryRec.title}
          </h5>
          <p className="text-xs text-[#E4E4E7] leading-relaxed">
            {primaryRec.description}
          </p>
          <div className="p-2.5 bg-[#09090B] border border-[#27272A] rounded-lg mt-2 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#A1A1AA] leading-normal font-medium">
              <strong className="text-white">Action Step: </strong>
              {primaryRec.actionableStep}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onOpenFullRecommendations}
        className="w-full py-2.5 bg-[#27272A] hover:bg-[#3F3F46] text-white rounded-lg text-xs font-bold tracking-tight transition-all flex items-center justify-center gap-1.5 shadow-sm"
      >
        <span>View All {recommendations.length} AI Recommendations</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
