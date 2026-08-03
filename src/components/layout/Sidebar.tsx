import React, { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Sparkles,
  HeartPulse,
  AlertTriangle,
  FileText,
  Building2,
  HelpCircle,
  Zap,
  Activity,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
  Sliders,
  Trash2,
  RefreshCw,
  X,
} from "lucide-react";
import { useGuide } from "../../context/GuideContext";
import { useTheme } from "../../context/ThemeContext";
import { Factory } from "../../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  factories: Factory[];
  selectedFactory: Factory | null;
  onSelectFactory: (factory: Factory) => void;
  onOpenNewFactoryModal: () => void;
  onOpenIndustryOnboarding?: () => void;
  onDeleteFactory?: (factoryId: string) => Promise<void> | void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  factories,
  selectedFactory,
  onSelectFactory,
  onOpenNewFactoryModal,
  onOpenIndustryOnboarding,
  onDeleteFactory,
}) => {
  const { isGuideModeActive, toggleGuideMode, setTourModalOpen } = useGuide();
  const { theme, toggleTheme } = useTheme();
  const [showSidebarDeleteConfirm, setShowSidebarDeleteConfirm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleConfirmSidebarDelete = async () => {
    if (!selectedFactory || !onDeleteFactory) return;
    setIsDeleting(true);
    try {
      await onDeleteFactory(selectedFactory.id);
      setShowSidebarDeleteConfirm(false);
    } catch (err) {
      console.error("Sidebar delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "data-entry", label: "Daily Data & CSV", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "predictions", label: "AI Predictions", icon: <Sparkles className="w-4 h-4" /> },
    { id: "health-score", label: "Health Score", icon: <HeartPulse className="w-4 h-4" /> },
    { id: "anomalies", label: "Anomalies & AI", icon: <AlertTriangle className="w-4 h-4" /> },
    { id: "reports", label: "Reports & Export", icon: <FileText className="w-4 h-4" /> },
    { id: "factories", label: "Factory Settings", icon: <Building2 className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-[#27272A] bg-[#09090B] flex flex-col p-6 flex-shrink-0 z-20">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
          <div className="w-4 h-4 bg-white rounded-full opacity-80" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight text-white leading-none">
            FactoryPilot AI
          </span>
          <span className="text-[10px] text-[#A1A1AA] uppercase tracking-widest font-medium mt-1">
            MSME Smart Factory
          </span>
        </div>
      </div>

      {/* Factory Selector Dropdown */}
      <div className="mb-6 space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
            Active Factory
          </label>
          {selectedFactory && onDeleteFactory && (
            <button
              onClick={() => setShowSidebarDeleteConfirm(true)}
              className="text-[10px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-0.5 transition-colors cursor-pointer"
              title={`Delete ${selectedFactory.name}`}
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={selectedFactory?.id || ""}
            onChange={(e) => {
              const found = factories.find((f) => f.id === e.target.value);
              if (found) onSelectFactory(found);
            }}
            className="w-full bg-[#18181B] border border-[#27272A] hover:border-[#3B82F6]/50 rounded-lg text-xs font-semibold text-white px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all cursor-pointer"
          >
            {factories.length === 0 ? (
              <option value="" disabled className="bg-[#18181B] text-[#71717A]">
                No Factory Registered
              </option>
            ) : (
              factories.map((f) => (
                <option key={f.id} value={f.id} className="bg-[#18181B] text-white">
                  {f.name} ({f.location.split(",")[0]})
                </option>
              ))
            )}
          </select>
        </div>
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onOpenNewFactoryModal}
            className="text-[11px] text-[#3B82F6] hover:text-blue-400 font-medium px-1 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>+ Add Factory</span>
          </button>
          {onOpenIndustryOnboarding && (
            <button
              onClick={onOpenIndustryOnboarding}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium px-1 flex items-center gap-1 transition-colors cursor-pointer"
              title="Re-configure Industry Vertical & Plant Settings"
            >
              <Sliders className="w-3 h-3" />
              <span>Industry Setup</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#18181B] text-white border border-[#27272A] shadow-sm font-semibold"
                  : "text-[#A1A1AA] hover:bg-[#18181B]/60 hover:text-white"
              }`}
            >
              <div className={isActive ? "text-[#3B82F6]" : "text-[#71717A]"}>{item.icon}</div>
              <span>{item.label}</span>
              {item.id === "anomalies" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme & Guide Toggles */}
      <div className="mt-4 pt-4 border-t border-[#27272A] space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-xs font-medium border border-[#27272A] bg-[#18181B] text-[#A1A1AA] hover:text-white transition-all"
          title="Toggle Light / Dark theme"
        >
          <div className="flex items-center gap-2">
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-500" />
            )}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-[#27272A] px-1.5 py-0.5 rounded text-white">
            {theme}
          </span>
        </button>

        <button
          onClick={toggleGuideMode}
          className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between text-xs font-medium border transition-all ${
            isGuideModeActive
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold shadow-sm"
              : "bg-[#18181B] border-[#27272A] text-[#A1A1AA] hover:text-white"
          }`}
          title="Toggle UI explanation badges across the dashboard"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className={`w-4 h-4 ${isGuideModeActive ? "text-emerald-400" : "text-[#71717A]"}`} />
            <span>Explain UI Mode</span>
          </div>
          <div
            className={`w-7 h-4 rounded-full p-0.5 transition-colors ${
              isGuideModeActive ? "bg-emerald-500" : "bg-[#27272A]"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-white transition-transform ${
                isGuideModeActive ? "translate-x-3" : "translate-x-0"
              }`}
            />
          </div>
        </button>

        <button
          onClick={() => setTourModalOpen(true)}
          className="w-full text-left text-[11px] text-[#A1A1AA] hover:text-[#3B82F6] px-2 py-1 transition-colors"
        >
          📖 Open Interactive Guide Tour
        </button>
      </div>

      {/* System Status Banner */}
      <div className="mt-4 p-4 bg-[#18181B] rounded-xl border border-[#27272A]">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-bold">
            ML Telemetry Active
          </span>
        </div>
        <p className="text-xs text-[#E4E4E7] leading-relaxed">
          {selectedFactory ? `${selectedFactory.numberOfMachines} CNC & assembly units operating within optimized parameters.` : "All machines operating smoothly."}
        </p>
      </div>

      {/* Sidebar Delete Modal */}
      {showSidebarDeleteConfirm && selectedFactory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#18181B] border border-[#27272A] w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4 text-left">
            <button
              onClick={() => {
                if (!isDeleting) setShowSidebarDeleteConfirm(false);
              }}
              className="absolute top-4 right-4 text-[#71717A] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Active Factory?</h3>
                <p className="text-xs text-[#A1A1AA]">Confirm permanent deletion</p>
              </div>
            </div>

            <div className="p-3 bg-[#09090B] border border-[#27272A] rounded-xl space-y-1">
              <div className="text-xs font-bold text-white">{selectedFactory.name}</div>
              <div className="text-[11px] text-[#A1A1AA]">
                {selectedFactory.location} • {selectedFactory.numberOfMachines} machines
              </div>
            </div>

            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Are you sure you want to delete <strong className="text-white">{selectedFactory.name}</strong>? This will permanently remove all associated daily telemetry, records, and AI models. <span className="text-red-400 font-semibold">This cannot be undone.</span>
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowSidebarDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-xs font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmSidebarDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
