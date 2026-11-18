# AI System Design & Environmental Safety Engine
## Urban Air AI

Urban Air AI pairs an AI Personalization Model with a strict, Deterministic Environmental Rules Engine (Layer 1). The AI can never bypass or relax scientific safety bounds established by environmental and public health agencies.

---

## 1. Two-Layer Architecture

```
[ Environmental Sensors / APIs (CPCB, Open-Meteo) ]
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│  Layer 1: Deterministic Rules & Safety Engine             │
│  - CPCB Sub-Index Calculator (Linear interpolation)      │
│  - Hard Activity Thresholds (e.g. AQI > 200 no outdoor) │
│  - Ventilation Window Analyzer                           │
│  - Freshness / Stale Data Detector                       │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼ (Pre-filtered Safe Context)
┌──────────────────────────────────────────────────────────┐
│  Layer 2: AI Personalization Engine                      │
│  - Generates tailored schedule & explanations            │
│  - Translates data into everyday empathetic actions      │
│  - Adapts to user commute, work hours, family needs     │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼ (Candidate JSON Output)
┌──────────────────────────────────────────────────────────┐
│  Output Schema & Safety Validator                        │
│  - Validates Pydantic schema structure                   │
│  - Asserts no medical diagnoses or cure guarantees       │
│  - Asserts no invented monitoring numbers                │
│  - Fallback to Deterministic Plan if AI call fails       │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Official Indian National Air Quality Index (CPCB) Breakpoints

| Category | AQI Range | PM2.5 (24h avg, µg/m³) | PM10 (24h avg, µg/m³) | Health Impact Statement |
|---|---|---|---|---|
| **Good** | 0 – 50 | 0 – 30 | 0 – 50 | Minimal impact |
| **Satisfactory** | 51 – 100 | 31 – 60 | 51 – 100 | Minor breathing discomfort to sensitive people |
| **Moderate** | 101 – 200 | 61 – 90 | 101 – 250 | Breathing discomfort to the people with lungs, asthma and heart diseases |
| **Poor** | 201 – 300 | 91 – 120 | 251 – 350 | Breathing discomfort to most people on prolonged exposure |
| **Very Poor** | 301 – 400 | 121 – 250 | 351 – 430 | Respiratory illness on prolonged exposure |
| **Severe** | 401 – 500 | 250+ | 430+ | Affects healthy people and seriously impacts those with existing diseases |

### Sub-Index Formula
The sub-index \( I_p \) for a given pollutant concentration \( C_p \) is calculated using linear interpolation:
\[
I_p = I_{lo} + \frac{I_{hi} - I_{lo}}{B_{hi} - B_{lo}} \times (C_p - B_{lo})
\]
where:
- \( B_{hi}, B_{lo} \): Breakpoint concentrations greater than and less than \( C_p \).
- \( I_{hi}, I_{lo} \): Corresponding sub-index values.
- Overall AQI = \( \max(I_1, I_2, \dots, I_n) \) (requiring at least 3 pollutants with one being either PM2.5 or PM10).

---

## 3. Deterministic Safety Boundaries

1. **Outdoor Strenuous Exercise (Running, High-Intensity Cycling):**
   - AQI ≤ 100: Safe.
   - AQI 101–200: Moderate duration; sensitive groups move indoors.
   - AQI 201–300: High risk. Shift to indoor activities.
   - AQI > 300: Strict prohibition. All high-exertion workouts must be indoors in filtered air.
2. **Children & Seniors:**
   - Outdoor play capped at 30 minutes if AQI is Moderate (101–200).
   - Outdoor play replaced with indoor creative activities when AQI > 200.
3. **Indoor Ventilation Windows:**
   - Evaluates diurnal inversion curves (in Indian cities, particulate concentration typically peaks in early morning and late night).
   - Recommends ventilation windows during afternoon (12 PM – 3 PM) when atmospheric boundary layer is highest and dispersion is maximized, provided ambient AQI < 200.
4. **Air Purifiers:**
   - Calculates CADR (Clean Air Delivery Rate) requirement:
     \[ \text{Required CADR (m³/h)} = \text{Room Area (m²)} \times \text{Ceiling Height (m)} \times 5 \text{ (Air Changes/hr)} \]
   - Strictly labels recommendations as guidance; never claims indoor AQI is measured unless a physical hardware sensor is connected.

---

## 4. Fallback Architecture
If OpenAI API or external network latency exceeds 10 seconds or fails validation, the system instantaneously falls back to the deterministic rule-based plan generator. Users receive zero disruptions and zero corrupted outputs.
