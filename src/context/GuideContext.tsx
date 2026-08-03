import React, { createContext, useContext, useState, ReactNode } from "react";
import { GuideExplanation } from "../types";

interface GuideContextType {
  isGuideModeActive: boolean;
  toggleGuideMode: () => void;
  activeExplanation: GuideExplanation | null;
  openExplanation: (exp: GuideExplanation) => void;
  closeExplanation: () => void;
  isTourModalOpen: boolean;
  setTourModalOpen: (open: boolean) => void;
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

export const GuideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isGuideModeActive, setIsGuideModeActive] = useState<boolean>(false);
  const [activeExplanation, setActiveExplanation] = useState<GuideExplanation | null>(null);
  const [isTourModalOpen, setTourModalOpen] = useState<boolean>(false);

  const toggleGuideMode = () => {
    setIsGuideModeActive((prev) => !prev);
  };

  const openExplanation = (exp: GuideExplanation) => {
    setActiveExplanation(exp);
  };

  const closeExplanation = () => {
    setActiveExplanation(null);
  };

  return (
    <GuideContext.Provider
      value={{
        isGuideModeActive,
        toggleGuideMode,
        activeExplanation,
        openExplanation,
        closeExplanation,
        isTourModalOpen,
        setTourModalOpen,
      }}
    >
      {children}
    </GuideContext.Provider>
  );
};

export const useGuide = () => {
  const context = useContext(GuideContext);
  if (!context) {
    throw new Error("useGuide must be used within a GuideProvider");
  }
  return context;
};
