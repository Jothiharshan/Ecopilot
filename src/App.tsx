import React, { useState, useEffect } from "react";
import { GuideProvider } from "./context/GuideContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { FooterBar } from "./components/layout/FooterBar";
import { OverviewView } from "./components/views/OverviewView";
import { AnalyticsView } from "./components/views/AnalyticsView";
import { AiPredictionsView } from "./components/views/AiPredictionsView";
import { HealthScoreView } from "./components/views/HealthScoreView";
import { AnomaliesView } from "./components/views/AnomaliesView";
import { ReportsView } from "./components/views/ReportsView";
import { FactorySettingsView } from "./components/views/FactorySettingsView";
import { DataEntryModal } from "./components/modals/DataEntryModal";
import { CsvUploadModal } from "./components/modals/CsvUploadModal";
import { AiAssistantModal } from "./components/modals/AiAssistantModal";
import { NewFactoryModal } from "./components/modals/NewFactoryModal";
import { ExplanationModal } from "./components/guide/ExplanationModal";
import { GuideTourModal } from "./components/guide/GuideTourModal";
import { LoginPage } from "./components/auth/LoginPage";
import { EmptyFactoryState } from "./components/dashboard/EmptyFactoryState";
import { IndustryOnboardingModal } from "./components/auth/IndustryOnboardingModal";
import {
  Factory,
  DailyRecord,
  PredictionData,
  Recommendation,
  AnomalyAlert,
  HealthScoreData,
  User,
  IndustryProfile,
} from "./types";
import {
  fetchFactories,
  fetchDailyRecords,
  fetchAiPredictions,
  fetchRecommendations,
  fetchAnomalies,
  fetchHealthScore,
  deleteFactory,
} from "./lib/api";

interface MainDashboardContentProps {
  currentUser: User;
  onLogout: () => void;
  onUpdateCurrentUser: (user: User) => void;
}

export function MainDashboardContent({
  currentUser,
  onLogout,
  onUpdateCurrentUser,
}: MainDashboardContentProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [factories, setFactories] = useState<Factory[]>([]);
  const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null);

  // Telemetry state
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);
  const [healthData, setHealthData] = useState<HealthScoreData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Modals state
  const [isDataEntryModalOpen, setIsDataEntryModalOpen] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [isNewFactoryModalOpen, setIsNewFactoryModalOpen] = useState<boolean>(false);
  const [isIndustryOnboardingOpen, setIsIndustryOnboardingOpen] = useState<boolean>(
    !currentUser?.industryProfile?.hasCompletedOnboarding
  );

  // Load factories associated with current logged-in user
  useEffect(() => {
    async function loadUserFactories() {
      if (!currentUser) return;
      setIsLoadingData(true);
      try {
        const list = await fetchFactories(currentUser.id, currentUser.email);
        
        let userFactories: Factory[] = [];
        if (currentUser.factoryIds && currentUser.factoryIds.length > 0) {
          userFactories = list.filter((f) => currentUser.factoryIds?.includes(f.id));
        } else {
          userFactories = list.filter(
            (f: any) =>
              f.userId === currentUser.id ||
              (f.createdByEmail && f.createdByEmail.toLowerCase() === currentUser.email.toLowerCase())
          );
        }

        setFactories(userFactories);

        // DO NOT automatically assign or create a default factory for a user with no factories!
        if (userFactories.length > 0) {
          setSelectedFactory(userFactories[0]);
        } else {
          setSelectedFactory(null);
        }
      } catch (err) {
        console.error("Failed loading user factories:", err);
        setFactories([]);
        setSelectedFactory(null);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadUserFactories();
  }, [currentUser]);

  // Load telemetry data whenever active factory changes
  useEffect(() => {
    if (!selectedFactory) {
      setRecords([]);
      setPredictionData(null);
      setRecommendations([]);
      setAnomalies([]);
      setHealthData(null);
      setIsLoadingData(false);
      return;
    }
    async function fetchAllFactoryTelemetry() {
      setIsLoadingData(true);
      try {
        const [recList, pred, recs, anoms, hlth] = await Promise.all([
          fetchDailyRecords(selectedFactory.id),
          fetchAiPredictions(selectedFactory.id),
          fetchRecommendations(selectedFactory.id),
          fetchAnomalies(selectedFactory.id),
          fetchHealthScore(selectedFactory.id),
        ]);
        setRecords(recList || []);
        setPredictionData(pred || null);
        setRecommendations(recs || []);
        setAnomalies(anoms || []);
        setHealthData(hlth || null);
      } catch (err) {
        console.error("Failed loading factory telemetry:", err);
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchAllFactoryTelemetry();
  }, [selectedFactory]);

  const refreshFactoryTelemetry = async (factoryId: string) => {
    setIsLoadingData(true);
    try {
      const [recList, pred, recs, anoms, hlth] = await Promise.all([
        fetchDailyRecords(factoryId),
        fetchAiPredictions(factoryId),
        fetchRecommendations(factoryId),
        fetchAnomalies(factoryId),
        fetchHealthScore(factoryId),
      ]);
      setRecords(recList || []);
      setPredictionData(pred || null);
      setRecommendations(recs || []);
      setAnomalies(anoms || []);
      setHealthData(hlth || null);
    } catch (err) {
      console.error("Failed refreshing factory telemetry:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleRecordAdded = async (_newRec: DailyRecord) => {
    if (selectedFactory) {
      await refreshFactoryTelemetry(selectedFactory.id);
    }
  };

  const handleRecordsImported = async () => {
    if (!selectedFactory) return;
    await refreshFactoryTelemetry(selectedFactory.id);
  };

  const handleFactoryCreated = async (newFactory: Factory) => {
    setFactories((prev) => [...prev, newFactory]);
    setSelectedFactory(newFactory);
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        factoryIds: Array.from(new Set([...(currentUser.factoryIds || []), newFactory.id])),
      };
      onUpdateCurrentUser(updatedUser);
    }
    await refreshFactoryTelemetry(newFactory.id);
  };

  const handleFactoryCreatedAndImported = async (newFactory: Factory) => {
    setFactories((prev) => [...prev, newFactory]);
    setSelectedFactory(newFactory);
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        factoryIds: Array.from(new Set([...(currentUser.factoryIds || []), newFactory.id])),
      };
      onUpdateCurrentUser(updatedUser);
    }
    await refreshFactoryTelemetry(newFactory.id);
  };

  const handleOnboardingComplete = (
    profile: IndustryProfile,
    updatedFactory: Partial<Factory>
  ) => {
    if (selectedFactory) {
      const updated: Factory = {
        ...selectedFactory,
        ...updatedFactory,
      };
      setSelectedFactory(updated);
      setFactories((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    }

    const updatedUser: User = {
      ...currentUser,
      industryProfile: profile,
    };
    onUpdateCurrentUser(updatedUser);
    setIsIndustryOnboardingOpen(false);
  };

  const handleDeleteFactory = async (factoryId: string) => {
    const success = await deleteFactory(factoryId);
    if (!success) {
      throw new Error("Failed to delete factory from server.");
    }
    const updatedFactories = factories.filter((f) => f.id !== factoryId);
    setFactories(updatedFactories);

    if (selectedFactory?.id === factoryId) {
      setSelectedFactory(updatedFactories.length > 0 ? updatedFactories[0] : null);
    }

    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        factoryIds: (currentUser.factoryIds || []).filter((id) => id !== factoryId),
      };
      onUpdateCurrentUser(updatedUser);
    }
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-[#09090B] text-[#FAFAFA] ${theme}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        factories={factories}
        selectedFactory={selectedFactory}
        onSelectFactory={(fac) => setSelectedFactory(fac)}
        onOpenNewFactoryModal={() => setIsNewFactoryModalOpen(true)}
        onOpenIndustryOnboarding={() => setIsIndustryOnboardingOpen(true)}
        onDeleteFactory={handleDeleteFactory}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          selectedFactory={selectedFactory}
          currentUser={currentUser}
          onOpenAiChat={() => setIsAiChatOpen(true)}
          onOpenDataEntry={() => setIsDataEntryModalOpen(true)}
          onOpenCsvUpload={() => setIsCsvModalOpen(true)}
          onLogout={onLogout}
          onOpenIndustryOnboarding={() => setIsIndustryOnboardingOpen(true)}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          {isLoadingData ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-[#A1A1AA]">
              <div className="w-8 h-8 rounded-full border-2 border-[#3B82F6] border-t-transparent animate-spin" />
              <p className="text-xs font-semibold tracking-wide">
                Synchronizing industrial telemetry & Gemini AI predictive models...
              </p>
            </div>
          ) : !selectedFactory ? (
            <EmptyFactoryState
              onOpenCreateFactory={() => setIsNewFactoryModalOpen(true)}
              onOpenCsvUpload={() => setIsCsvModalOpen(true)}
            />
          ) : (
            <>
              {activeTab === "overview" && (
                <OverviewView
                  factory={selectedFactory}
                  records={records}
                  predictionData={predictionData}
                  recommendations={recommendations}
                  anomalies={anomalies}
                  healthData={healthData}
                  onOpenHealthView={() => setActiveTab("health-score")}
                  onOpenPredictionsView={() => setActiveTab("predictions")}
                  onOpenAnomaliesView={() => setActiveTab("anomalies")}
                  onOpenDataEntry={() => setIsDataEntryModalOpen(true)}
                  onOpenCsvUpload={() => setIsCsvModalOpen(true)}
                />
              )}

              {activeTab === "data-entry" && (
                <AnalyticsView
                  records={records}
                  onOpenDataEntry={() => setIsDataEntryModalOpen(true)}
                  onOpenCsvUpload={() => setIsCsvModalOpen(true)}
                />
              )}

              {activeTab === "predictions" && (
                <AiPredictionsView
                  predictionData={predictionData}
                  records={records}
                />
              )}

              {activeTab === "health-score" && (
                <HealthScoreView
                  healthData={healthData}
                  records={records}
                />
              )}

              {activeTab === "anomalies" && (
                <AnomaliesView
                  anomalies={anomalies}
                  recommendations={recommendations}
                />
              )}

              {activeTab === "reports" && selectedFactory && (
                <ReportsView
                  factory={selectedFactory}
                  records={records}
                  healthData={healthData}
                  predictionData={predictionData}
                />
              )}

              {activeTab === "factories" && (
                <FactorySettingsView
                  factories={factories}
                  selectedFactory={selectedFactory}
                  onSelectFactory={(fac) => setSelectedFactory(fac)}
                  onOpenNewFactoryModal={() => setIsNewFactoryModalOpen(true)}
                  onDeleteFactory={handleDeleteFactory}
                />
              )}
            </>
          )}

          {/* Footer Bar */}
          <FooterBar predictionData={predictionData} />
        </main>
      </div>

      {/* Modals */}
      <CsvUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        factory={selectedFactory}
        onRecordsImported={handleRecordsImported}
        onFactoryCreatedAndImported={handleFactoryCreatedAndImported}
      />

      {selectedFactory && (
        <>
          <DataEntryModal
            isOpen={isDataEntryModalOpen}
            onClose={() => setIsDataEntryModalOpen(false)}
            factory={selectedFactory}
            onRecordAdded={handleRecordAdded}
          />
          <AiAssistantModal
            isOpen={isAiChatOpen}
            onClose={() => setIsAiChatOpen(false)}
            factory={selectedFactory}
          />
        </>
      )}

      <NewFactoryModal
        isOpen={isNewFactoryModalOpen}
        onClose={() => setIsNewFactoryModalOpen(false)}
        currentUser={currentUser}
        onFactoryCreated={handleFactoryCreated}
      />

      <IndustryOnboardingModal
        isOpen={isIndustryOnboardingOpen}
        currentUser={currentUser}
        currentFactory={selectedFactory}
        onClose={() => setIsIndustryOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* Interactive Guide / Explain UI mode Modals */}
      <ExplanationModal />
      <GuideTourModal />
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("factorypilot_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("factorypilot_user", JSON.stringify(user));
  };

  const handleUpdateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("factorypilot_user", JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    localStorage.removeItem("factorypilot_user");
    setCurrentUser(null);
  };

  return (
    <ThemeProvider>
      <GuideProvider>
        {currentUser ? (
          <MainDashboardContent
            currentUser={currentUser}
            onLogout={handleLogout}
            onUpdateCurrentUser={handleUpdateCurrentUser}
          />
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}
      </GuideProvider>
    </ThemeProvider>
  );
}
