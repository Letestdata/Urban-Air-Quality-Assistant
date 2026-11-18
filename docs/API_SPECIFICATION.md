# REST API Specification
## Base URL: `/api/v1`

---

## 1. Authentication (`/auth`)
- **POST `/auth/register`**
  - Body: `{ full_name, email, password, confirm_password, country, preferred_language }`
  - Response: `{ token, user: { id, full_name, email, language } }`
- **POST `/auth/login`**
  - Body: `{ email, password }`
  - Response: `{ token, token_type: "bearer", user }`
- **POST `/auth/logout`**
  - Invalidates token/session.
- **POST `/auth/forgot-password`**
  - Body: `{ email }`
- **POST `/auth/reset-password`**
  - Body: `{ token, new_password }`

---

## 2. User & Locations (`/users`, `/locations`)
- **GET `/users/me`** - Fetch current user profile and preferences.
- **PUT `/users/me`** - Update profile fields and lifestyle options.
- **DELETE `/users/me`** - Permanently delete account and associated data (GDPR / DPDP compliance).
- **GET `/users/me/export`** - Export all user-owned data in structured JSON format.
- **GET `/locations/search?q={city}`** - Search Indian cities and monitoring stations.
- **POST `/locations/select`** - Save active user location.

---

## 3. Environmental Data (`/air-quality`, `/weather`)
- **GET `/air-quality/current?city={city}&lat={lat}&lon={lon}`**
  - Returns CPCB AQI value, category, pollutant concentrations (PM2.5, PM10, NO₂, SO₂, CO, O₃), station metadata, data freshness status, and timestamp.
- **GET `/air-quality/history?city={city}&range={24h|7d|30d}`**
  - Historical measurements with data completeness markers.
- **GET `/air-quality/forecast?city={city}`**
  - 24-hour hourly forecast with uncertainty horizons.
- **GET `/weather/current?city={city}&lat={lat}&lon={lon}`**
  - Temperature, humidity, wind speed, wind direction, rain probability, conditions.

---

## 4. AI Daily Planner (`/plans`)
- **GET `/plans/today`** - Returns the active plan for today.
- **POST `/plans/generate`** - Generates personalized plan (Morning, Afternoon, Evening, Night).
- **PATCH `/plans/activities/{activity_id}`** - Updates completion status (`pending`, `completed`, `skipped`).
- **POST `/plans/regenerate`** - Explicit re-generation when environmental conditions or schedules shift.

---

## 5. Indoor Air Quality (`/indoor`)
- **GET `/indoor/guidance?city={city}`**
  - Ventilation window advisories (e.g. best hours to open windows).
  - Cooking exhaust and dust management guidelines.
  - HEPA air purifier CADR sizing calculator.
  - Daily indoor air safety checklist.

---

## 6. Family Profiles (`/family`)
- **GET `/family/members`** - List all family members for user household.
- **POST `/family/members`** - Add member (name, age group, sensitivities, routine).
- **PUT `/family/members/{id}`** - Update family member details.
- **DELETE `/family/members/{id}`** - Remove member.

---

## 7. Smart Routes & Impact (`/routes`, `/impact`)
- **GET `/routes/alternatives?origin={origin}&destination={destination}`**
  - Returns route comparisons (distance, duration, estimated ambient AQI exposure, green transport suggestion).
- **GET `/impact/summary`**
  - Personal carbon savings ledger (CO₂e avoided), weekly/monthly trend, transport modal breakdown.
- **POST `/impact/log`**
  - Log a sustainable journey to update personal emission avoidance stats.

---

## 8. AI Assistant (`/assistant`)
- **POST `/assistant/chat`**
  - Body: `{ message, context: { city, aqi } }`
  - Response: `{ reply, sources: [...], safety_notes: [...] }`
  - Guardrails: Refuses medical advice, avoids panic, adheres to CPCB science.

---

## 9. Reports & Notifications (`/reports`, `/notifications`)
- **GET `/reports/summary?type={daily|weekly|monthly}`** - Comprehensive environmental exposure report.
- **GET `/notifications`** - List notifications and system advisories.
- **PATCH `/notifications/{id}/read`** - Mark notification as read.
- **PUT `/notifications/preferences`** - Set alert thresholds and quiet hours.
