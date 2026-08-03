import React from "react";
import { useGuide } from "../../context/GuideContext";
import { X, Lightbulb, Calculator, HelpCircle, ArrowRight, ShieldCheck } from "lucide-react";

export const ExplanationModal: React.FC = () => {
  const { activeExplanation, closeExplanation } = useGuide();

  if (!activeExplanation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden text-[#FAFAFA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#09090B] border-b border-[#27272A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#3B82F6]">
                {activeExplanation.category} Guide
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                {activeExplanation.title}
              </h3>
            </div>
          </div>
          <button
            onClick={closeExplanation}
            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* What it is */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
              <HelpCircle className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>What is this component?</span>
            </div>
            <p className="text-sm text-[#E4E4E7] leading-relaxed">
              {activeExplanation.whatItIs}
            </p>
          </div>

          {/* Why it matters */}
          <div className="space-y-1.5 bg-[#09090B] p-4 rounded-xl border border-[#27272A]">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Why it matters for MSME Factory Owners</span>
            </div>
            <p className="text-xs text-[#E4E4E7] leading-relaxed">
              {activeExplanation.whyItMatters}
            </p>
          </div>

          {/* How it's calculated */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>How it is calculated & AI Math</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed font-mono bg-[#27272A]/40 px-3 py-2 rounded-lg border border-[#27272A]">
              {activeExplanation.howItsCalculated}
            </p>
          </div>

          {/* Actionable tip */}
          <div className="space-y-1.5 bg-gradient-to-r from-[#3B82F6]/10 to-transparent p-4 rounded-xl border border-[#3B82F6]/30">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
              <Lightbulb className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Factory Action Tip</span>
            </div>
            <p className="text-xs text-white leading-relaxed font-medium">
              {activeExplanation.actionTip}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#09090B]/80 border-t border-[#27272A] flex justify-end">
          <button
            onClick={closeExplanation}
            className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563eb] text-white rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
