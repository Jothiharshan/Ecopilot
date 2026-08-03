import React from "react";
import { useGuide } from "../../context/GuideContext";
import { GuideExplanation } from "../../types";
import { HelpCircle, Info } from "lucide-react";

interface ComponentBadgeProps {
  explanation: GuideExplanation;
  className?: string;
  alwaysShow?: boolean;
}

export const ComponentBadge: React.FC<ComponentBadgeProps> = ({
  explanation,
  className = "",
  alwaysShow = false,
}) => {
  const { isGuideModeActive, openExplanation } = useGuide();

  if (!isGuideModeActive && !alwaysShow) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        openExplanation(explanation);
      }}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all shadow-sm ${
        isGuideModeActive
          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 animate-pulse"
          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
      } ${className}`}
      title="Click to understand this component"
    >
      <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
      <span>Explain UI</span>
    </button>
  );
};
