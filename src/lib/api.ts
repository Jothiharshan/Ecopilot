import {
  Factory,
  DailyRecord,
  User,
  PredictionData,
  HealthScoreData,
  Recommendation,
  AnomalyAlert,
} from "../types";

const BASE_URL = "/api";

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok && !data.message) {
      return {
        success: false,
        message: res.status === 404
          ? "Account not found. Please sign up first."
          : res.status === 401
            ? "Incorrect password. Please try again."
            : "Authentication failed. Please check your inputs.",
      };
    }
    return data;
  } catch (err: any) {
    console.error("loginUser network error:", err);
    return {
      success: false,
      message: "Network error or server unavailable. Please try again.",
    };
  }
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: string,
  companyName: string
): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role, companyName }),
    });
    const data = await res.json();
    if (!res.ok && !data.message) {
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }
    return data;
  } catch (err: any) {
    console.error("registerUser network error:", err);
    return {
      success: false,
      message: "Network error or server unavailable. Please try again.",
    };
  }
}

export async function fetchFactories(userId?: string, email?: string): Promise<Factory[]> {
  try {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (email) params.append("email", email);
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${BASE_URL}/factories${query}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("fetchFactories error:", err);
    return [];
  }
}

export async function createFactory(payload: Partial<Factory> & { userId?: string; userEmail?: string }): Promise<Factory> {
  try {
    const res = await fetch(`${BASE_URL}/factories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || json.message || "Failed to create factory");
    }
    return json.data;
  } catch (err: any) {
    console.error("createFactory error:", err);
    throw new Error(err.message || "Failed to connect to server. Please try again.");
  }
}

export async function updateFactory(id: string, payload: Partial<Factory>): Promise<Factory> {
  try {
    const res = await fetch(`${BASE_URL}/factories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return json.data;
  } catch (err: any) {
    console.error("updateFactory error:", err);
    throw new Error(err.message || "Failed to update factory.");
  }
}

export async function deleteFactory(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/factories/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    return json.success || false;
  } catch (err) {
    console.error("deleteFactory error:", err);
    return false;
  }
}

export async function fetchDailyRecords(factoryId: string): Promise<DailyRecord[]> {
  try {
    console.log("Fetching records for:", factoryId);

    const res = await fetch(`${BASE_URL}/factories/${factoryId}/records`);

    console.log("HTTP Status:", res.status);

    const json = await res.json();

    console.log("API Response:", json);

    return json.data || [];
  } catch (err) {
    console.error("fetchDailyRecords error:", err);
    return [];
  }
}
export async function addDailyRecord(factoryId: string, payload: Partial<DailyRecord>): Promise<DailyRecord> {
  try {
    const res = await fetch(`${BASE_URL}/factories/${factoryId}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || json.message || "Failed to add record");
    }
    return json.data;
  } catch (err: any) {
    console.error("addDailyRecord error:", err);
    throw new Error(err.message || "Failed to save daily telemetry.");
  }
}

export async function bulkImportRecords(factoryId: string, records: any[], clearExisting?: boolean): Promise<{ success: boolean; importedCount: number; message: string }> {
  try {
    const res = await fetch(`${BASE_URL}/factories/${factoryId}/records/bulk-import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records, clearExisting }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, importedCount: 0, message: json.error || "Failed to import records" };
    }
    return json;
  } catch (err: any) {
    console.error("bulkImportRecords error:", err);
    return { success: false, importedCount: 0, message: err.message || "Network error importing records." };
  }
}

export async function deleteDailyRecord(factoryId: string, recordId: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/factories/${factoryId}/records/${recordId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    return json.success || false;
  } catch (err) {
    console.error("deleteDailyRecord error:", err);
    return false;
  }
}

export async function fetchAiPredictions(factoryId: string): Promise<PredictionData> {
  try {
    const res = await fetch(`${BASE_URL}/ai/predict/${factoryId}`);
    if (!res.ok) throw new Error("Failed to fetch predictions");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("fetchAiPredictions error:", err);
    return {
      nextDayElectricity: 4200,
      weeklyElectricity: 29400,
      monthlyElectricity: 126000,
      futureWaterUsage: 12500,
      futureProduction: 1850,
      futureOperatingCost: 3200,
      confidenceLevel: 88,
      trend: "stable",
      summary: "Baseline estimates generated.",
      trendGraph: [],
    };
  }
}

export async function fetchHealthScore(factoryId: string): Promise<HealthScoreData> {
  try {
    const res = await fetch(`${BASE_URL}/ai/health-score/${factoryId}`);
    if (!res.ok) throw new Error("Failed to fetch health score");
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("fetchHealthScore error:", err);
    return {
      score: 85,
      healthLevel: "Good",
      breakdown: {
        electricityEfficiency: 88,
        waterEfficiency: 86,
        machineUtilizationScore: 82,
        productionEfficiency: 85,
        maintenanceHistoryScore: 84,
      },
      summary: "Factory baseline health is Good.",
    };
  }
}

export async function fetchRecommendations(factoryId: string): Promise<Recommendation[]> {
  try {
    const res = await fetch(`${BASE_URL}/ai/recommendations/${factoryId}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("fetchRecommendations error:", err);
    return [];
  }
}

export async function fetchAnomalies(factoryId: string): Promise<AnomalyAlert[]> {
  try {
    const res = await fetch(`${BASE_URL}/ai/anomalies/${factoryId}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("fetchAnomalies error:", err);
    return [];
  }
}

export async function sendAiChat(message: string, factoryId: string, history: any[]): Promise<{ success: boolean; reply: string; source: string }> {
  try {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, factoryId, history }),
    });
    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        reply: json.error || "Unable to reach EcoPilot AI at this moment.",
        source: "error",
      };
    }
    return json;
  } catch (err: any) {
    console.error("sendAiChat error:", err);
    return {
      success: false,
      reply: "Network connection issue. Please check your internet connection.",
      source: "error",
    };
  }
}

export async function requestForgotPassword(email: string): Promise<{ success: boolean; message: string; resetToken?: string; resetUrl?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || (res.status === 404 ? "No account found with this email." : "Unable to send password reset email. Please try again."),
      };
    }
    return {
      success: true,
      message: data.message || `A password reset email has been sent to ${email}.`,
      resetToken: data.resetToken,
      resetUrl: data.resetUrl,
    };
  } catch (err: any) {
    console.error("requestForgotPassword error:", err);
    return {
      success: false,
      message: "Unable to send password reset email. Please try again.",
    };
  }
}

export async function verifyResetToken(token: string): Promise<{ success: boolean; email?: string; message?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Invalid or expired password reset token.",
      };
    }
    return data;
  } catch (err: any) {
    console.error("verifyResetToken error:", err);
    return {
      success: false,
      message: "Network error verifying token.",
    };
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Password reset failed. Please try again.",
      };
    }
    return {
      success: true,
      message: data.message || "Password updated successfully.",
    };
  } catch (err: any) {
    console.error("resetPassword error:", err);
    return {
      success: false,
      message: "Network error updating password. Please try again.",
    };
  }
}

