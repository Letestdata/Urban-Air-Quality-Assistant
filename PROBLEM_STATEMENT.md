# Problem Statement — Urban Air AI

## 1. Executive Summary

Urban air pollution represents one of the most pressing public health and environmental challenges across Indian metropolitan areas. While ambient air monitoring networks (such as CPCB and CAAQMS) collect extensive telemetry, citizens face substantial hurdles in translating raw data into meaningful daily decisions.

**Urban Air AI** is designed to bridge the chasm between raw environmental telemetry and practical human routines.

---

## 2. Core Problem Pillars

### Problem 1: Environmental Information is Difficult to Understand
- **The Issue:** Traditional portals display dense numerical tables of $\mu\text{g}/\text{m}^3$ and multi-pollutant sub-indices. Everyday citizens do not know whether an AQI of 185 allows a 30-minute morning jog or what difference exists between PM2.5 and PM10 particulate penetration.
- **Urban Air AI Solution:** Implementation of the official CPCB NAQI standard with plain-language, multi-sensory color-coded badges, understandable impact descriptions, and clear respiratory explanations.

### Problem 2: Generic Advice Does Not Fit Everyday Lifestyles
- **The Issue:** Blanket warnings like "avoid going outside" are unworkable for commuters, parents taking children to school, and working individuals.
- **Urban Air AI Solution:** Two-Layer Safety and Planning Engine that adapts to user schedules, commute modes, and exercise habits. When outdoor AQI exceeds safe thresholds (e.g. > 150/200), the platform suggests time-shifted afternoon windows (leveraging solar boundary-layer mixing) or indoor aerobic alternatives.

### Problem 3: Practical Indoor Air & Ventilation Guidance is Missing
- **The Issue:** Indoor air quality can be up to 5x more hazardous than outdoor air due to accumulated VOCs, cooking emissions, and particulate infiltration. Users are uncertain when to open windows and what CADR purifier capacity matches their room volume.
- **Urban Air AI Solution:** Diurnal ventilation window predictions (identifying optimal afternoon dispersion hours) and ASHRAE-standard CADR CFM room sizing calculators.

### Problem 4: Absence of Individualized Family Risk Profiles
- **The Issue:** A healthy adult, an asthmatic child, an elderly relative, and an expectant mother face radically divergent risks at identical pollution levels.
- **Urban Air AI Solution:** Multi-profile family management with granular vulnerability tags, pediatric school guidance, and elderly cardio thresholds.

### Problem 5: Missing Climate Agency & Impact Quantification
- **The Issue:** Citizens feel powerless against regional smog crises.
- **Urban Air AI Solution:** "My Carbon Impact" tracker calculating kg of $\text{CO}_2\text{e}$ avoided when choosing public transit or cycling over private vehicles, directly connecting personal transit choices with planetary sustainability.

---

## 3. Measurable Success Criteria & Alignment

| Metric | Target | Verification Method |
| :--- | :--- | :--- |
| CPCB NAQI Standard Fidelity | 100% mathematical match | Unit tests with official CPCB breakpoint interpolation |
| Deterministic Safety Enforced | 100% rule-bounded outputs | Layer 1 hard boundaries block dangerous activity recommendations |
| Accessibility Compliance | WCAG 2.2 Level AA | Zero contrast violations, full keyboard landmarks, screen reader live regions |
| Security & Privacy | Zero credential leaks, GDPR/DPDP | Argon2id password hashing, HSTS, CSP, and Account Deletion endpoints |
