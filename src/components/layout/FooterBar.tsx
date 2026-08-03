import React from "react";
import { PredictionData } from "../../types";
import { ShieldCheck, Sparkles, Leaf } from "lucide-react";

interface FooterBarProps {
  predictionData: PredictionData | null;
}

export const FooterBar: React.FC<FooterBarProps> = ({ predictionData }) => {
  const confidence = predictionData?.confidenceLevel || 94;

  return (
    <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-[#27272A] pt-4 gap-4 text-xs">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-semibold">
            Prediction Confidence
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span className="text-xs font-bold text-white">{confidence}.2%</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-semibold">
            Optimized Savings Potential
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-bold text-green-400">+$2,410 /mo</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 bg-[#27272A] rounded-full overflow-hidden">
          <div className="h-full w-4/5 bg-[#3B82F6] transition-all duration-500" />
        </div>
        <Leaf className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-[10px] text-[#A1A1AA] font-medium">
          Carbon Footprint Optimized
        </span>
      </div>
    </footer>
  );
};
