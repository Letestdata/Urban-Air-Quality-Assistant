# Problem Statement & PRD Alignment Matrix — Urban Air AI

> **Product Name:** Urban Air AI  
> **Tagline:** **Breathe Smarter. Live Healthier.**  
> **Initial Market:** India First  
> **Standard:** Central Pollution Control Board (CPCB) National Air Quality Index (NAQI)  
> **Architecture:** Next.js 14 App Router (Frontend) + FastAPI Python 3.12 (Backend)  
> **AI Architecture:** Two-Layer Guardrail (Deterministic Environmental Safety Engine + AI Personalization)

---

## 1. Executive Summary & Problem Statement Alignment

Air pollution is a critical public health challenge across Indian urban agglomerations. As identified in the Product Requirements Document (PRD), citizens face three fundamental challenges:

| # | PRD Problem Statement Challenge | How Urban Air AI Solves It | Source Code File(s) | Verification Test |
| - | :--- | :--- | :--- | :--- |
| **1** | **Environmental information is difficult to understand** | Replaces raw pollutant numbers with official CPCB NAQI linear interpolation, 6 standardized qualitative bands (Good, Satisfactory, Moderate, Poor, Very Poor, Severe), and plain-language health advisories. | `backend/app/rules/cpcb_calculator.py`<br>`components/common/AQIBadge.tsx`<br>`app/(dashboard)/air-quality/page.tsx` | `backend/tests/test_cpcb_calculator.py`<br>`tests/cpcbCalculator.test.js` |
| **2** | **Generic advice does not fit everyday lifestyles** | Personalized daily routine planner adapting activities based on user schedules, travel habits, commute modes, and vulnerable household groups (seniors, children). | `backend/app/rules/safety_engine.py`<br>`backend/app/services/planner_service.py`<br>`app/(dashboard)/daily-plan/page.tsx` | `backend/tests/test_safety_engine.py`<br>`tests/problemStatementAlignment.test.js` |
| **3** | **People lack practical indoor air guidance** | Diurnal boundary-layer ventilation window calculator recommending exact times to seal or crack windows, paired with an ASHRAE-compliant Clean Air Delivery Rate (CADR) room purifier calculator. | `backend/app/rules/indoor_engine.py`<br>`backend/app/services/indoor_service.py`<br>`app/(dashboard)/indoor-air/page.tsx` | `backend/tests/test_indoor_and_impact.py`<br>`tests/problemStatementAlignment.test.js` |

---

## 2. Complete 14-Module PRD Implementation Coverage

Every functional module specified in PRD Section 4 is implemented:

### Module 1: Overview Dashboard (`app/(dashboard)/dashboard/page.tsx`)
- Current location NAQI badge with multi-sensory color, icon, and text indicators.
- Real-time weather telemetry (temperature, humidity, wind speed, wind direction).
- Primary pollutant breakdown (PM2.5, PM10, NO2, SO2, CO, O3).
- Data freshness timestamp and monitoring station attribution (CPCB CAAQMS / Open-Meteo).

### Module 2: Air Quality Deep Dive (`app/(dashboard)/air-quality/page.tsx`)
- Criteria pollutant cards with individual sub-indices and linear breakpoint mapping.
- 24-hour diurnal trend chart with safe exercise thresholds.
- Official CPCB 6-color standard legend with health warnings for vulnerable groups.

### Module 3: My Daily Plan (`app/(dashboard)/daily-plan/page.tsx`)
- AI-generated personalized timeline adapted to current city air quality.
- Hard safety constraints: Automatic substitution of outdoor running with indoor yoga/pilates when AQI > 150.
- Mask recommendation tags (N95) and travel window advice.

### Module 4: Indoor Air Intelligence (`app/(dashboard)/indoor-air/page.tsx`)
- Boundary-layer solar dispersion ventilation windows (safe afternoon opening times).
- Room volume CADR CFM calculator for True HEPA (H13) air purifiers.
- Practical indoor pollution prevention checklist (cooking hoods, dust mitigation, incense controls).

### Module 5: Family Profiles (`app/(dashboard)/family/page.tsx`)
- Multiple household member profiles (children, seniors, asthma/heart condition members).
- Individualized vulnerability sensitivity levels with IDOR-protected CRUD endpoints.

### Module 6: Smart Routes (`app/(dashboard)/smart-routes/page.tsx`)
- Multi-modal route exposure comparison (Metro, Electric Bus, AC Car, Walking).
- Inhaled particulate dosage estimations and lower-exposure transit alternatives.

### Module 7: My Environmental Impact (`app/(dashboard)/impact/page.tsx`)
- Personal avoided CO2e emissions calculator based on verified passenger-km emission factors.
- Clear separation between personal carbon savings and city ambient AQI.

### Module 8: AI Assistant (`app/(dashboard)/assistant/page.tsx`)
- Conversational environmental intelligence powered by a deterministic safety wrapper.
- Hardcoded medical disclaimer and zero-hallucination guardrails: strictly refuses medical diagnoses, treatments, or drug prescriptions.

### Module 9: Reports & Historical Analytics (`app/(dashboard)/reports/page.tsx`)
- Daily, weekly, and monthly air quality summaries.
- Historical trend visualization and high-pollution day exposure reviews.

### Module 10: Settings & Data Privacy (`app/(dashboard)/settings/page.tsx`)
- Profile preferences, interface language selection (English, Hindi, Gujarati).
- GDPR & Digital Personal Data Protection (DPDP) data export in portable JSON.
- Permanent account and data purge ("Right to be Forgotten").

### Modules 11–14: Onboarding, Notifications, Auth & Landing Page
- 6-step personalized onboarding flow (`app/onboarding/page.tsx`).
- Event-driven notifications center (`app/(dashboard)/notifications/page.tsx`).
- Argon2id password-hashed authentication with JWT sessions (`app/(auth)/login/page.tsx`, `register/page.tsx`).
- Public landing page with educational FAQs and zero medical panic guarantees (`app/page.tsx`).
