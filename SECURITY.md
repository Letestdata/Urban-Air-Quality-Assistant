# Security Policy — Urban Air AI

## Supported Versions
Only the latest release branch (`main`) receives active security patches.

## Reporting Vulnerabilities
If you discover a potential vulnerability in Urban Air AI, please report it via private disclosure rather than opening a public issue.

- **Primary Contact**: security@urbanair-ai.internal
- **Response SLA**: Within 24 hours of notification.
- **Remediation Target**: Critical fixes released within 72 hours.

## Architecture Security Controls
1. **Zero Client Secrets**: No third-party API tokens exposed to the client-side bundle.
2. **Deterministic Guardrails**: Environmental health calculations use hard rules to prevent unsafe AI recommendations.
3. **Password Security**: Argon2id hashing with modern time and memory parameters.
4. **Transport Security**: HSTS, strict CSP headers, and TLS enforcement on all routes.
