# Security Policy — Urban Air AI

At **Urban Air AI**, safeguarding sensitive environmental health data, personal family profiles, and user privacy is of paramount importance. This document details our defense-in-depth security model, architecture, cryptographic standards, and vulnerability disclosure procedure.

---

## 1. Supported Versions

Security updates and patches are actively maintained for the following versions:

| Version | Supported | Security Maintenance Status |
| :--- | :--- | :--- |
| 1.0.x | :white_check_mark: | Currently Supported |
| < 1.0.0 | :x: | Deprecated |

---

## 2. Core Security Architecture & Privacy by Design

Urban Air AI implements an institutional-grade, multi-layered defense-in-depth model specifically designed for environmental health intelligence:

### 2.1 Zero-Knowledge Client-Side Processing & Sanitization
- **Client-Side Sanitization First:** All user-supplied search queries, profile notes, and inputs pass through `lib/security.ts` sanitizers (`sanitizeHtml`, `sanitizeText`) prior to state dispatch.
- **Immediate PII Redaction:** Telemetry queries and support notes automatically redact Personally Identifiable Information (PII) including 10-digit Indian mobile numbers, Aadhaar UID patterns, PAN card formats, and email addresses.
- **Local Persistence Privacy:** Location choices and local settings are stored in browser-sandboxed `localStorage` with zero unconsented third-party ad tracking or cookie harvesting.

### 2.2 Strict Content Security Policy (CSP) & Transport Security
The application enforces rigid HTTP security headers in `next.config.mjs`:
```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```
- **Clickjacking Prevention:** `X-Frame-Options: DENY` ensures the dashboard cannot be embedded in malicious third-party `<iframe>` wrappers.
- **MIME-Sniffing Mitigation:** `X-Content-Type-Options: nosniff` forces browsers to respect explicit Content-Type headers.
- **Encrypted Transmission:** `Strict-Transport-Security` enforces HTTPS with HSTS preloading.

### 2.3 Magic-Byte Binary Signature Validation
To prevent malicious executables disguising as data files (e.g. renaming an executable to `.pdf` or `.png`):
- All uploaded telemetry exports and reports are inspected byte-by-byte via `verifyFileMagicBytes()`.
- Verified file headers:
  - PDF: `%PDF-` (`0x25 0x50 0x44 0x46`)
  - PNG: `\x89PNG` (`0x89 0x50 0x4E 0x47`)
  - JPEG: `\xFF\xD8\xFF` (`0xFF 0xD8 0xFF`)
  - ZIP: `PK` (`0x50 0x4B 0x03 0x04`)
- Disguised executables (Windows PE `MZ` `0x4D 0x5A` or Linux ELF `0x7F 0x45 0x4C 0x46`) are unconditionally rejected.

### 2.4 Cryptographic Password Security (Argon2id)
All credentials are encrypted using the state-of-the-art **Argon2id** algorithm configured in `backend/app/core/security.py`:
- `time_cost = 2` iterations
- `memory_cost = 65536` KiB (64 MiB memory hardness against GPU/ASIC cracking)
- `parallelism = 1` lane
- Random 16-byte cryptographic salts per hash

### 2.5 Regulatory Compliance: DPDP (India) & GDPR (EU)
Urban Air AI complies with the Indian Digital Personal Data Protection Act (DPDP 2023) and GDPR:
- **Right to be Forgotten (Account Deletion):** Cascade deletion endpoint (`DELETE /api/v1/users/me`) deletes all user records, plans, family profiles, impact records, and notifications permanently.
- **Data Portability (Export):** Users can export their complete historical data footprint in standardized JSON via `GET /api/v1/users/me/export`.

### 2.6 Rate Limiting & Abuse Prevention
- Client-side token bucket throttles rapid requests (`enforceRateLimit`).
- API endpoints are protected against credential stuffing, prompt injection, and excessive polling.

---

## 3. Grounded AI Ethics & Anti-Hallucination Guardrails

- **Deterministic Layer 1 Pre-Emption:** Real-time air quality calculations strictly follow official CPCB NAQI linear interpolation. If outdoor AQI exceeds 150/200, strenuous outdoor activities are blocked by code before the generative model is invoked.
- **Zero Medical Advice Policy:** The AI Assistant refuses clinical diagnostic questions, pharmaceutical recommendations, and drug prescriptions, redirecting users to qualified healthcare professionals.

---

## 4. Vulnerability Disclosure & Incident Response

We welcome responsible security research. If you identify a potential security vulnerability:

1. **Email:** Report details to `security@urbanair-ai.internal`.
2. **Initial Acknowledgment:** Within 24 hours.
3. **Assessment & Triage:** Within 48 hours.
4. **Remediation SLA:** Critical vulnerabilities resolved within 72 hours.
