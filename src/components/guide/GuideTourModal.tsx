import React from "react";
import { useGuide } from "../../context/GuideContext";
import { X, HelpCircle, Activity, Zap, ShieldCheck, Cpu, ArrowRight } from "lucide-react";

export const GuideTourModal: React.FC = () => {
  const { isTourModalOpen, setTourModalOpen, toggleGuideMode, isGuideModeActive } = useGuide();

  if (!isTourModalOpen) return null;

  const topics = [
    {
      icon: <Zap className="w-5 h-5 text-[#3B82F6]" />,
      title: "1. Real-time KPI Cards & Energy Telemetry",
      desc: "Each card monitors critical factory metrics (Electricity kWh, Water usage, Machine Utilization %, Operating Cost, and overall Factory Health Score). Click 'Explain UI' on any card to see exact formulas.",
    },
    {
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      title: "2. AI Predictions & ML Trend Forecasting",
      desc: "Our machine learning linear regression and time-series model predicts next-day, weekly, and monthly electricity and water consumption based on your historical daily entries.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      title: "3. Factory Health Score (0–100)",
      desc: "A weighted algorithm combining electricity efficiency (25%), water efficiency (20%), machine utilization (25%), production output (15%), and maintenance history (15%).",
    },
    {
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      title: "4. Anomaly Detection & Smart Recommendations",
      desc: "AI automatically scans for unusual electricity surges, water leakage, or production drops, and suggests actionable interventions with estimated monthly dollar savings.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden text-[#FAFAFA]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#09090B] border-b border-[#27272A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3B82F6] flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              EA
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#3B82F6]">
                Interactive Tour
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                How to Understand EcoPilot AI
              </h2>
            </div>
          </div>
          <button
            onClick={() => setTourModalOpen(false)}
            className="p-2 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <p className="text-sm text-[#A1A1AA] leading-relaxed">
            EcoPilot AI is designed for <strong className="text-white">MSME factory owners and managers</strong> to understand their operations without data science jargon. Here is how every component on this screen helps you save money:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#09090B] p-4 rounded-xl border border-[#27272A] hover:border-[#3B82F6]/40 transition-all space-y-2"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-emerald-500/10 via-[#3B82F6]/10 to-transparent p-4 rounded-xl border border-[#3B82F6]/30 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Interactive "Explain UI" Mode
              </h4>
              <p className="text-xs text-[#E4E4E7]">
                Enable UI Explanation badges across the dashboard to click any card or chart for a plain-English breakdown.
              </p>
            </div>
            <button
              onClick={() => {
                if (!isGuideModeActive) toggleGuideMode();
                setTourModalOpen(false);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Enable Explain Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#09090B]/80 border-t border-[#27272A] flex justify-between items-center">
          <span className="text-xs text-[#71717A]">
            Press the "Explain UI" badge anytime you have questions.
          </span>
          <button
            onClick={() => setTourModalOpen(false)}
            className="px-5 py-2 bg-[#3B82F6] hover:bg-[#2563eb] text-white rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
