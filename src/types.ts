export interface IndustryProfile {
  industryType: string;
  subSector?: string;
  plantName: string;
  location: string;
  machineCount: number;
  employeeCount: number;
  shiftType: "1 Shift (8 Hours)" | "2 Shifts (16 Hours)" | "24/7 Continuous Operation";
  energySource: "State Power Grid" | "Grid + On-Site Solar Hybrid" | "Diesel Generator / Captive LNG" | "100% Renewable";
  primaryGoal: "Reduce Electricity & Peak Cost" | "Zero Unplanned Down-time" | "ESG & Carbon Compliance" | "Maximize OEE & Output";
  hasCompletedOnboarding: boolean;
}

export interface Factory {
  id: string;
  name: string;
  location: string;
  industryType: string;
  numberOfMachines: number;
  numberOfEmployees: number;
  createdAt: string;
  address?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  description?: string;
  userId?: string;
  createdByEmail?: string;
  shiftType?: string;
  energySource?: string;
  primaryGoal?: string;
}

export interface DailyRecord {
  id: string;
  factoryId: string;
  date: string;
  electricityKwh: number;
  waterLiters: number;
  productionOutput: number;
  workingHours: number;
  machineUtilization: number; // 0-100%
  maintenanceCost: number;
  operatingCost: number;
  machineName?: string;
  temperature?: number;
  pressure?: number;
  vibration?: number;
  downtimeHours?: number;
  operatorNotes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "Factory Owner" | "Factory Manager" | "Administrator" | "Plant Operations Director" | "Maintenance Engineer" | "Sustainability Manager";
  companyName: string;
  token: string;
  factoryIds?: string[];
  industryProfile?: IndustryProfile;
}

export interface PredictionData {
  nextDayElectricity: number;
  weeklyElectricity: number;
  monthlyElectricity: number;
  futureWaterUsage: number;
  futureProduction: number;
  futureOperatingCost: number;
  confidenceLevel: number;
  trend: "increasing" | "decreasing" | "stable";
  summary: string;
  trendGraph: {
    date: string;
    predictedElectricity: number;
    predictedWater: number;
    predictedCost: number;
    confidenceLower: number;
    confidenceUpper: number;
  }[];
}

export interface HealthScoreData {
  score: number;
  healthLevel: "Excellent" | "Good" | "Average" | "Needs Improvement" | "Critical";
  breakdown: {
    electricityEfficiency: number;
    waterEfficiency: number;
    machineUtilizationScore: number;
    productionEfficiency: number;
    maintenanceHistoryScore: number;
  };
  summary: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  impact: "High" | "Medium" | "Low";
  estimatedSavings: string;
  description: string;
  actionableStep: string;
  iconName?: string;
}

export interface AnomalyAlert {
  id: string;
  date: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  metric: string;
  observedValue: string;
  expectedValue: string;
  description: string;
  recommendation: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  source?: "gemini" | "local-ml";
}

export interface GuideExplanation {
  title: string;
  category: "KPI Card" | "Chart" | "AI Engine" | "Form / Action";
  whatItIs: string;
  whyItMatters: string;
  howItsCalculated: string;
  actionTip: string;
}
