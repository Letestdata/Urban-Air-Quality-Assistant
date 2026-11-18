export interface PollutantDetail {
  pollutant: string;
  display_name: string;
  value: number | null;
  unit: string;
  sub_index: number | null;
  category: string | null;
  health_impact: string | null;
  is_available: boolean;
  standard_limit_24h?: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  precipitation: number;
  condition: string;
  is_measured: boolean;
}

export interface AQIData {
  city: string;
  state?: string;
  latitude: number;
  longitude: number;
  aqi: number;
  category: string;
  category_color: string;
  prominent_pollutant: string;
  standard: string;
  monitoring_station: string;
  station_distance_km?: number;
  data_source: string;
  timestamp: string;
  data_freshness: string; // Fresh, Delayed, Stale, Unavailable
  is_forecast: boolean;
  general_health_advisory: string;
  sensitive_group_advisory: string;
  pollutants: Record<string, PollutantDetail>;
  weather: WeatherData;
}

export interface HistoricalPoint {
  timestamp: string;
  aqi: number;
  pm25?: number;
  pm10?: number;
  category: string;
}

export interface HistoricalData {
  city: string;
  range_selected: string;
  data_points: HistoricalPoint[];
  average_aqi: number;
  peak_aqi: number;
  min_aqi: number;
  data_completeness_pct: number;
  source: string;
}

export interface ForecastPoint {
  hour: string;
  aqi_estimate: number;
  category: string;
  confidence: string;
  weather_summary: string;
}

export interface ForecastData {
  city: string;
  generated_at: string;
  forecast_horizon_hours: number;
  provider: string;
  uncertainty_statement: string;
  hourly_forecast: ForecastPoint[];
}

export interface PlanActivity {
  id: string;
  time_bracket: "morning" | "afternoon" | "evening" | "night";
  suggested_time: string;
  category: string;
  title: string;
  action: string;
  reason: string;
  alternative: string;
  evidence_type: string;
  source_reference?: string;
  status: "pending" | "completed" | "skipped";
}

export interface DailyPlan {
  id: string;
  plan_date: string;
  aqi_value: number;
  aqi_category: string;
  weather_summary?: string;
  summary: string;
  data_status: string;
  safety_guidelines: string[];
  activities: PlanActivity[];
}

export interface VentilationWindow {
  time_range: string;
  recommendation: string;
  reason: string;
  expected_ambient_aqi: number;
  outdoor_status: string;
}

export interface CADRData {
  room_area_sqm: number;
  room_volume_cbm: number;
  recommended_cadr_m3h: number;
  recommended_cadr_cfm: number;
  filter_type_recommended: string;
  purifier_placement_advice: string;
  maintenance_reminder: string;
}

export interface IndoorChecklistItem {
  id: string;
  task: string;
  category: string;
  importance: string;
  tip: string;
}

export interface IndoorGuidance {
  city: string;
  ambient_aqi: number;
  ventilation_status: string;
  best_ventilation_windows: VentilationWindow[];
  cooking_smoke_advisories: string[];
  dust_control_practices: string[];
  purifier_guidance: CADRData;
  daily_checklist: IndoorChecklistItem[];
  disclaimer: string;
}

export interface FamilyMember {
  id: string;
  user_id: string;
  name: string;
  age_group: "child" | "adult" | "senior" | "pregnant";
  sensitivity_notes?: string;
  activity_preferences?: string;
  tailored_recommendations: string[];
}

export interface RouteOption {
  route_name: string;
  transport_mode: string;
  distance_km: number;
  duration_minutes: number;
  estimated_exposure_level: string;
  exposure_score: number;
  co2e_emissions_kg: number;
  is_recommended: boolean;
  explanation: string;
}

export interface RouteComparison {
  origin: string;
  destination: string;
  current_city_aqi: number;
  data_limitation_statement: string;
  routes: RouteOption[];
}

export interface ImpactRecord {
  id: string;
  date: string;
  baseline_mode: string;
  chosen_mode: string;
  distance_km: number;
  co2e_saved_kg: number;
  assumptions?: string;
}

export interface ImpactSummary {
  total_co2e_saved_kg: number;
  weekly_co2e_saved_kg: number;
  monthly_co2e_saved_kg: number;
  total_trips_logged: number;
  equivalent_trees_planted_year: number;
  mode_distribution: Record<string, number>;
  recent_records: ImpactRecord[];
  educational_note: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  country: string;
  preferred_language: string;
  preferences?: {
    occupation: string;
    wake_time: string;
    sleep_time: string;
    working_hours: string;
    commute_mode: string;
    exercise_type: string;
    environmental_goals?: string;
    onboarding_completed: boolean;
  };
}
