import React from "react";
import { Building2, Plus, Upload, FileSpreadsheet, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface EmptyFactoryStateProps {
  onOpenCreateFactory: () => void;
  onOpenCsvUpload: () => void;
}

export const EmptyFactoryState: React.FC<EmptyFactoryStateProps> = ({
  onOpenCreateFactory,
  onOpenCsvUpload,
}) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Visual Badge Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-[#18181B] border border-[#27272A] flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-950/20">
          <Building2 className="w-10 h-10" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center border-2 border-[#09090B]">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* Primary Headline & Description */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
        No Factory Found
      </h2>
      <p className="text-sm sm:text-base text-[#A1A1AA] max-w-lg mb-8 leading-relaxed">
        No factory found. Create a factory or upload a CSV/Excel file to get started.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-12">
        <button
          onClick={onOpenCreateFactory}
          className="w-full sm:w-auto flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create Factory</span>
        </button>

        <button
          onClick={onOpenCsvUpload}
          className="w-full sm:w-auto flex-1 px-6 py-3.5 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] hover:border-cyan-500/50 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2.5 active:scale-95"
        >
          <Upload className="w-4 h-4 text-cyan-400" />
          <span>Upload CSV/Excel</span>
        </button>
      </div>

      {/* Quick Setup Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
        <div className="p-4 bg-[#18181B]/60 border border-[#27272A] rounded-xl flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 font-mono font-bold text-xs mt-0.5">
            01
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-1">Set Up Plant Profile</h4>
            <p className="text-[11px] text-[#A1A1AA]">
              Define your industry type, machine count, and baseline operational parameters.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#18181B]/60 border border-[#27272A] rounded-xl flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold text-xs mt-0.5">
            02
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-1">Import Telemetry</h4>
            <p className="text-[11px] text-[#A1A1AA]">
              Upload energy, water, and production logs via standard spreadsheet formats.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#18181B]/60 border border-[#27272A] rounded-xl flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs mt-0.5">
            03
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-1">AI Intelligence</h4>
            <p className="text-[11px] text-[#A1A1AA]">
              Unlock instant predictive energy forecasts, anomaly alerts, and health scores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
