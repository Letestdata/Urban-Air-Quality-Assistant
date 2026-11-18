# Product Requirements Document (PRD) — Urban Air AI

## 1. Product Overview

- **Product Name:** Urban Air AI (Urban Air Quality Assistant)
- **Tagline:** Breathe Smarter. Live Healthier. India First.
- **Purpose:** A production-grade environmental intelligence and routine planning web platform tailored for Indian urban realities. It translates real-time air quality telemetry into individualized, actionable daily schedules for families, fitness enthusiasts, and commuters.

---

## 2. Core Functional Modules (14 PRD Modules)

### Module 1: Overview Dashboard
- **File:** `app/(dashboard)/dashboard/page.tsx`
- **Functionality:** Real-time city telemetry, CPCB AQI badge, dominant pollutant indicator, morning/afternoon/evening activity recommendations, and quick air stats.

### Module 2: Air Quality Telemetry & Pollutants
- **File:** `app/(dashboard)/air-quality/page.tsx`
- **Functionality:** In-depth 6 criteria pollutant breakdown (PM2.5, PM10, NO2, SO2, CO, O3) with 24-hour historical curves and 3-day meteorological forecasts.

### Module 3: AI Daily Planner
- **File:** `app/(dashboard)/daily-plan/page.tsx`
- **Functionality:** 4 diurnal time-bracketed schedules (Morning, Afternoon, Evening, Night) with safety ratings, alternative routines, and regenerate controls.

### Module 4: Indoor Air Guidance & CADR Sizing
- **File:** `app/(dashboard)/indoor-air/page.tsx`
- **Functionality:** ASHRAE room volume CADR calculator (CFM requirements), diurnal window ventilation timer, and indoor pollutant tips.

### Module 5: Family Profiles
- **File:** `app/(dashboard)/family/page.tsx`
- **Functionality:** Individualized vulnerability cards (e.g. Pediatric Asthma, Senior Cardiac, Expectant Mother) with custom activity restrictions.

### Module 6: Smart Route Comparisons
- **File:** `app/(dashboard)/smart-routes/page.tsx`
- **Functionality:** Multi-modal commute exposure comparison (Metro AC, Car Closed Windows, Two-Wheeler) detailing travel duration and estimated PM2.5 inhalation.

### Module 7: My Environmental Impact
- **File:** `app/(dashboard)/impact/page.tsx`
- **Functionality:** Personal carbon avoided calculator tracking kg of $\text{CO}_2\text{e}$ prevented by opting for sustainable mass transit, with tree equivalents.

### Module 8: Grounded AI Assistant
- **File:** `app/(dashboard)/assistant/page.tsx`
- **Functionality:** Multi-turn conversational interface backed by verified citations (CPCB, WHO, ICMR) with strict refusal of medical diagnoses and prescription queries.

### Module 9: Reports & Historical Trends
- **File:** `app/(dashboard)/reports/page.tsx`
- **Functionality:** Weekly and monthly respiratory exposure aggregates, clean air compliance trends, and PDF/CSV export readiness.

### Module 10: Settings & Privacy Center
- **File:** `app/(dashboard)/settings/page.tsx`
- **Functionality:** Notification channel controls (push/email/SMS), telemetry freshness intervals, GDPR/DPDP data portability export, and permanent account deletion.

### Module 11: Personalized Onboarding Flow
- **File:** `app/onboarding/page.tsx`
- **Functionality:** Step-by-step preference capture: city selection, commute profile, morning workout routine, and family health sensitivities.

### Module 12: Notifications Center
- **File:** `app/(dashboard)/notifications/page.tsx`
- **Functionality:** Priority air quality spikes, diurnal window opening reminders, and severe episode advisories with mark-as-read states.

### Module 13: Secure Authentication
- **Files:** `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`
- **Functionality:** JWT session lifecycle, password complexity enforcement, and Argon2id backend validation.

### Module 14: Public Landing Page
- **File:** `app/page.tsx`
- **Functionality:** Hero value proposition, CPCB standards explanation, live telemetry preview card, platform features grid, and expandable FAQ.

---

## 3. Non-Functional Specifications

- **Deterministic Safety:** Hardcoded safety layer (Layer 1) overrides LLM generation whenever outdoor AQI exceeds 150/200 for strenuous activities.
- **Accessibility:** WCAG 2.2 Level AA compliance, visible `:focus-visible` states, skip-to-content anchor, semantic `<main id="main-content">` regions, and non-color-reliant indicators.
- **Security:** Argon2id password hashing, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, zero secrets in source code.
- **Performance:** Next.js 14 App Router with static generation, tailwindcss utility optimization, and lightweight client hydration.
