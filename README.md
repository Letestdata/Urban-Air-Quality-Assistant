# Urban Air AI (India First)
> **Breathe Smarter. Live Healthier.**
> An AI-powered environmental health and daily planning platform that translates complex air pollution data into actionable, personalized routines for individuals and families in India.

---

## 🌟 Key Highlights
- **India National AQI (CPCB) Compliance:** Official sub-index calculation with breakpoints for PM2.5, PM10, NO₂, SO₂, CO, and O₃.
- **Two-Layer AI Safety Engine:** Deterministic rule-based boundaries (Layer 1) strictly govern AI personalization (Layer 2). Zero medical hallucinations.
- **14 Comprehensive Modules:** Overview Dashboard, Air Quality, My Daily Plan, Indoor Air, Family Profiles, Smart Routes, My Impact, AI Assistant, Reports, Settings, Onboarding, Authentication, Notifications, and Landing Page.
- **Privacy-First & Accessible:** Optional GPS, no tracking, GDPR/DPDP data export & deletion, WCAG 2.2 AA compliant UI with multi-sensory AQI visual indicators (color + icon + text).

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Testing & Verification
- **Backend Tests:** `pytest backend/tests -v`
- **Frontend Typecheck:** `cd frontend && npm run typecheck`
- **Frontend Tests:** `cd frontend && npm run test`
- **Quality Scorecard:** View [`QUALITY_REPORT.md`](./QUALITY_REPORT.md).
