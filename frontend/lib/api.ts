import {
  AQIData,
  CADRData,
  DailyPlan,
  FamilyMember,
  ForecastData,
  HistoricalData,
  ImpactRecord,
  ImpactSummary,
  IndoorGuidance,
  NotificationItem,
  PlanActivity,
  RouteComparison,
  UserProfile,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("urban_air_token");
    }
    return null;
  }

  public setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("urban_air_token", token);
    }
  }

  public clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("urban_air_token");
      localStorage.removeItem("urban_air_user");
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      throw new Error(err.message || "Network request failed.");
    }
  }

  // Auth
  async register(data: any) {
    return this.request<{ access_token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: any) {
    return this.request<{ access_token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // User & Profile
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>("/users/me");
  }

  async updatePreferences(data: any): Promise<UserProfile> {
    return this.request<UserProfile>("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async exportUserData(): Promise<any> {
    return this.request<any>("/users/me/export");
  }

  async deleteAccount(): Promise<any> {
    return this.request<any>("/users/me", { method: "DELETE" });
  }

  // Air Quality
  async getCurrentAirQuality(city: string = "Delhi NCR"): Promise<AQIData> {
    return this.request<AQIData>(`/air-quality/current?city=${encodeURIComponent(city)}`);
  }

  async getHistory(city: string = "Delhi NCR", range: string = "24h"): Promise<HistoricalData> {
    return this.request<HistoricalData>(`/air-quality/history?city=${encodeURIComponent(city)}&range=${range}`);
  }

  async getForecast(city: string = "Delhi NCR"): Promise<ForecastData> {
    return this.request<ForecastData>(`/air-quality/forecast?city=${encodeURIComponent(city)}`);
  }

  // Plans
  async getTodayPlan(city?: string): Promise<DailyPlan> {
    const q = city ? `?city=${encodeURIComponent(city)}` : "";
    return this.request<DailyPlan>(`/plans/today${q}`);
  }

  async generatePlan(city: string = "Delhi NCR", force: boolean = true): Promise<DailyPlan> {
    return this.request<DailyPlan>("/plans/generate", {
      method: "POST",
      body: JSON.stringify({ city, force_regenerate: force }),
    });
  }

  async updateActivityStatus(activityId: string, status: "pending" | "completed" | "skipped"): Promise<PlanActivity> {
    return this.request<PlanActivity>(`/plans/activities/${activityId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Indoor
  async getIndoorGuidance(city: string = "Delhi NCR"): Promise<IndoorGuidance> {
    return this.request<IndoorGuidance>(`/indoor/guidance?city=${encodeURIComponent(city)}`);
  }

  async calculateCADR(dimensions: {
    room_length_m: number;
    room_width_m: number;
    ceiling_height_m: number;
    target_air_changes_per_hour: number;
  }): Promise<CADRData> {
    return this.request<CADRData>("/indoor/cadr-calculate", {
      method: "POST",
      body: JSON.stringify(dimensions),
    });
  }

  // Family
  async getFamilyMembers(): Promise<FamilyMember[]> {
    return this.request<FamilyMember[]>("/family/members");
  }

  async addFamilyMember(data: Partial<FamilyMember>): Promise<FamilyMember> {
    return this.request<FamilyMember>("/family/members", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteFamilyMember(memberId: string): Promise<any> {
    return this.request<any>(`/family/members/${memberId}`, { method: "DELETE" });
  }

  // Smart Routes
  async compareRoutes(origin: string, destination: string): Promise<RouteComparison> {
    return this.request<RouteComparison>(
      `/routes/alternatives?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
    );
  }

  // Impact
  async getImpactSummary(): Promise<ImpactSummary> {
    return this.request<ImpactSummary>("/impact/summary");
  }

  async logImpact(data: { baseline_mode: string; chosen_mode: string; distance_km: number }): Promise<ImpactRecord> {
    return this.request<ImpactRecord>("/impact/log", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Assistant
  async askAssistant(message: string, city: string = "Delhi NCR"): Promise<{ reply: string; sources: string[]; safety_notes: string[] }> {
    return this.request<{ reply: string; sources: string[]; safety_notes: string[] }>("/assistant/chat", {
      method: "POST",
      body: JSON.stringify({ message, context: { city } }),
    });
  }

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    return this.request<NotificationItem[]>("/notifications");
  }

  async markNotificationRead(id: string): Promise<NotificationItem> {
    return this.request<NotificationItem>(`/notifications/${id}/read`, { method: "PATCH" });
  }

  // Reports
  async getReport(type: "daily" | "weekly" | "monthly" = "weekly"): Promise<any> {
    return this.request<any>(`/reports/summary?type=${type}`);
  }

  // Settings
  async getSettings(): Promise<any> {
    return this.request<any>("/settings");
  }

  async updateSettings(data: any): Promise<any> {
    return this.request<any>("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
