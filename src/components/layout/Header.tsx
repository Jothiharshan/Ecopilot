import React, { useState } from "react";
import { MessageSquare, Plus, Upload, Sparkles, HelpCircle, Sun, Moon, User as UserIcon, LogOut, Building2, Sliders } from "lucide-react";
import { Factory, User } from "../../types";
import { useGuide } from "../../context/GuideContext";
import { useTheme } from "../../context/ThemeContext";

interface HeaderProps {
  selectedFactory: Factory | null;
  currentUser: User | null;
  onOpenAiChat: () => void;
  onOpenDataEntry: () => void;
  onOpenCsvUpload: () => void;
  onLogout?: () => void;
  onOpenIndustryOnboarding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedFactory,
  currentUser,
  onOpenAiChat,
  onOpenDataEntry,
  onOpenCsvUpload,
  onLogout,
  onOpenIndustryOnboarding,
}) => {
  const { toggleGuideMode, isGuideModeActive } = useGuide();
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="h-16 border-b border-[#27272A] flex items-center justify-between px-8 bg-[#09090B]/80 backdrop-blur-md sticky top-0 z-10 flex-shrink-0">
      {/* Breadcrumb / Current Factory */}
      <div className="flex items-center gap-2">
        <h2 className="text-sm text-[#A1A1AA] font-medium flex items-center gap-1.5">
          <span>Factory /</span>
          <span className="text-white font-bold">{selectedFactory ? selectedFactory.name : "No Active Factory"}</span>
        </h2>
        {selectedFactory && (
          <button
            onClick={onOpenIndustryOnboarding}
            className="text-[10px] bg-[#18181B] text-[#3B82F6] hover:text-white border border-[#27272A] hover:border-[#3B82F6]/50 px-2 py-0.5 rounded-md font-mono whitespace-nowrap flex items-center gap-1 transition-all"
            title="Click to re-configure Industry Type & Plant Parameters"
          >
            <Sliders className="w-3 h-3 text-[#3B82F6]" />
            <span>{selectedFactory.industryType}</span>
          </button>
        )}
      </div>

      {/* Action Buttons & Profile */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white transition-all flex items-center justify-center"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-blue-500" />
          )}
        </button>

        {/* Guide Tour Button */}
        <button
          onClick={toggleGuideMode}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all border flex items-center gap-1.5 ${
            isGuideModeActive
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm"
              : "bg-[#18181B] border-[#27272A] text-[#A1A1AA] hover:text-white"
          }`}
          title="Turn on/off Explain UI badges"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{isGuideModeActive ? "Explain Mode: ON" : "Explain UI"}</span>
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAiChat}
          className="px-3 py-1.5 bg-[#18181B] border border-[#27272A] hover:border-[#3B82F6]/50 rounded-md text-xs font-semibold text-[#A1A1AA] hover:text-white transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Ask AI Assistant</span>
        </button>

        {/* CSV Upload Button */}
        <button
          onClick={onOpenCsvUpload}
          className="px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-md text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors flex items-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload CSV/Excel</span>
        </button>

        {/* New Entry Button */}
        <button
          onClick={onOpenDataEntry}
          className="px-3.5 py-1.5 bg-white text-black rounded-md text-xs font-bold hover:bg-[#E4E4E7] transition-all flex items-center gap-1 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Entry</span>
        </button>

        {/* User Avatar & Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 border border-[#27272A] flex items-center justify-center text-white text-xs font-bold shadow-sm hover:scale-105 transition-transform"
            title={currentUser ? `${currentUser.name} (${currentUser.role})` : "Factory Operator"}
          >
            {currentUser ? currentUser.name.charAt(0).toUpperCase() : "A"}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#18181B] border border-[#27272A] rounded-xl shadow-xl p-3 z-50 space-y-2">
              <div className="border-b border-[#27272A] pb-2">
                <div className="font-semibold text-xs text-white truncate">
                  {currentUser?.name || "Factory User"}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono truncate">
                  {currentUser?.role || "Operations Manager"}
                </div>
                <div className="text-[10px] text-[#A1A1AA] truncate">
                  {currentUser?.email || "user@factory.com"}
                </div>
              </div>

              {onOpenIndustryOnboarding && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenIndustryOnboarding();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#27272A]/50 hover:bg-[#27272A] text-cyan-400 text-xs font-medium flex items-center gap-2 transition-colors text-left"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Industry Setup & Setup Wizard</span>
                </button>
              )}

              {onLogout && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Lock Session</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
