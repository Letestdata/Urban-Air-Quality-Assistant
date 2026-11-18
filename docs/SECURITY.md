# Security & Privacy Policy Specification
## Urban Air AI

Urban Air AI adheres strictly to OWASP Top 10 guidelines and India's Digital Personal Data Protection (DPDP) Act standards.

---

## 1. Authentication & Credential Storage
- **Password Hashing:** Passwords hashed using Argon2id or strong bcrypt with salt.
- **Session Tokens:** Cryptographically signed JWT tokens with expiration (24h default).
- **Transport Security:** All client-server traffic must be encrypted via HTTPS/TLS 1.3.
- **Brute Force Protection:** IP and username based rate limiting (60 requests/minute baseline, 5 login attempts/minute).

---

## 2. Authorization & Insecure Direct Object References (IDOR)
- Every database query for user-owned assets (daily plans, family members, impact logs, preferences, saved locations) enforces strict ownership validation (`WHERE user_id = current_user.id`).
- Unauthorized requests return `403 Forbidden` or `404 Not Found` without disclosing record existence.

---

## 3. Injection & Cross-Site Scripting (XSS)
- **SQL Injection:** 100% prevented through parameterized queries via SQLAlchemy 2.0 ORM. Raw string formatting in SQL is strictly forbidden.
- **XSS Prevention:** Input sanitization and automated escaping in React/Next.js frontend.
- **Content Security Policy (CSP):** Configured headers restricting script-src to self and whitelisted providers.

---

## 4. Privacy & Location Data Minimization
- **Optional Geolocation:** Users can search and select Indian cities manually without granting browser GPS permissions.
- **Coarse Precision:** Latitudes and longitudes are rounded to city/district monitoring station granularity to prevent tracking individual residences.
- **Zero Third-Party Ad Trackers:** No third-party marketing SDKs or user tracking scripts are bundled.
- **Right to Erasure (Account Deletion):** User deletion removes all cascaded personal records (plans, family profiles, impact records, sessions) from the primary database.
- **Right to Portability (Data Export):** One-click data export endpoint provides structured JSON archive of all personal metrics.
