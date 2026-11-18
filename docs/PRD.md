# Product Requirements Document (PRD)
## Urban Air AI: Breathe Smarter. Live Healthier.
**Version:** 1.0 | **Product & Engineering Specification** | **India First**

---

## 1. Executive Summary
Urban Air AI is an environmental intelligence and daily planning platform designed to translate complex air pollution metrics (AQI, PM2.5, PM10, NO₂, SO₂, CO, O₃) into actionable, personalized daily routines for individuals and families in India.

### 1.1 Core Value Proposition
- **Understand:** Explain local conditions using official Central Pollution Control Board (CPCB) India National Air Quality Index (NAQI) breakpoints in plain language.
- **Protect:** Provide schedule-aware recommendations to minimize toxic particulate exposure without causing panic or prescribing medical treatments.
- **Plan:** Generate intelligent morning, afternoon, evening, and night routines aligned with user lifestyle and real-time environmental data.
- **Improve:** Deliver evidence-based indoor air quality (IAQ) guidance, ventilation windows, and HEPA purifier CADR sizing.
- **Support:** Cater to diverse family profiles (children, seniors, expectant mothers, sensitive individuals).
- **Reduce:** Quantify avoided transport carbon emissions (CO₂e) while educating users on the distinction between personal emissions savings and ambient AQI.

---

## 2. Target Personas
1. **Office Worker (Persona A):** Fixed 9 AM – 6 PM schedule, daily commute, seeks optimal travel windows and low-exposure transport alternatives.
2. **Parent (Persona B):** Manages household, monitors outdoor play safety for children and ventilation windows to prevent indoor stagnation.
3. **Fitness Enthusiast (Persona C):** Outdoor runner/cyclist needing AQI thresholds and indoor workout alternatives when PM2.5 exceeds safe limits.
4. **Student (Persona D):** Regular campus transit, budget-conscious, relies on transit exposure ratings.
5. **Senior Citizen / Sensitive (Persona E):** Requires conservative safety rules, minimal exertion guidance, and strict pollutant warning flags.

---

## 3. Product Scope & Functional Modules
1. **Landing Page:** Premium minimal SaaS look, dark forest theme, interactive preview, zero medical claims, clear CPCB methodology disclosure.
2. **Authentication & Session:** Argon2id/bcrypt password hashing, secure JWT cookies, rate limiting, password reset, account deletion, data export.
3. **Onboarding (7 Steps):** Welcome, Location (manual or optional GPS), Lifestyle, Activity Preferences, Household/Family, Environmental Goals, Plan Generation.
4. **Overview Dashboard:** Live AQI badge (CPCB standard), 6-pollutant card grid, weather telemetry, today's AI plan preview, environmental alerts, quick actions.
5. **Air Quality Deep-Dive:** Current readings, CPCB sub-index breakdown, 24h/7d/30d historical trends, 24h forecast with uncertainty indicators, station distance and data freshness.
6. **My Daily Plan:** Time-bracketed recommendations (Morning, Afternoon, Evening, Night) with actions, reasons, alternatives, and completion tracking.
7. **Indoor Air Module:** Outdoor-linked ventilation scheduling, cooking smoke exhaust guidelines, dust mitigation, HEPA CADR sizing calculator.
8. **Family Profiles:** Multi-member management with age brackets, tailored sensitivities, and individual schedules.
9. **Smart Routes:** Origin-destination comparison, distance, travel time, and comparative exposure scores with clear spatial data constraints.
10. **My Impact Module:** Transport emission avoidance calculator (\( \text{Distance} \times \text{Factor} \)), historical savings ledger, educational separation of personal impact vs ambient city air.
11. **AI Assistant:** Conversational environmental guide with deterministic safety guardrails, source citations, and medical diagnosis refusal.
12. **Notifications:** Stale data warnings, severe air alerts, daily plan generation digests, user-configurable quiet hours.
13. **Reports:** Daily, weekly, and monthly environmental exposure summaries, completion tracking, and data source audit.
14. **Settings:** Profile, saved locations, lifestyle, multi-language (English, Hindi, Gujarati), data export (JSON/CSV), account deletion.

---

## 4. Environmental Data Rules
- **No Invented Data:** If a monitoring station or pollutant sensor is unavailable, display a clear "Unavailable" or "Stale" indicator. Never fabricate values.
- **CPCB NAQI Methodology:** Strictly follow the 6 categories:
  - Good (0–50)
  - Satisfactory (51–100)
  - Moderate (101–200)
  - Poor (201–300)
  - Very Poor (301–400)
  - Severe (401–500)
- **Data Freshness Windows:**
  - Fresh: Updated within < 2 hours
  - Delayed: 2 – 6 hours old
  - Stale: > 6 hours old (alerts triggered)
  - Unavailable: Missing or disconnected provider

---

## 5. Quality Gate Criteria (Target 100%)
- **Code Quality:** Zero TypeScript errors (`strict: true`), zero Ruff/Flake8 lint errors, fully typed Pydantic models.
- **Security:** OWASP Top 10 compliance, CSRF/XSS sanitization, SQL injection immunity via ORM, rate limiting, IDOR prevention.
- **Efficiency:** Sub-500ms read API P95 latency, client-side caching, efficient database indexes.
- **Testing:** 100% critical test coverage across unit calculations, rules engine, API security, and accessibility.
- **Accessibility:** WCAG 2.2 AA compliant, full keyboard navigable, high color contrast, screen reader labels, multi-sensory AQI alerts (color + icon + text).
- **Problem Alignment:** 100% of functional requirements traced to real user pain points.
