# Security Policy — Sovereignty Checklist

## Dependency Audit Status

### Accepted Risks (dev-only)

| Package | Issue | Severity | Justification |
|---------|-------|----------|---------------|
| `drizzle-kit@0.31.9` | Transitive dep on `esbuild <=0.24.2` (GHSA-67mh-4wv8-2f99) | Moderate | Dev-only tool for SQL migration generation. The esbuild vulnerability allows cross-site requests to esbuild's dev server — drizzle-kit does not expose an esbuild dev server. Not present in production build. |
| `node-domexception@1.0.0` | Deprecated polyfill | None | Polyfill for DOMException, now natively available in Node 18+. Transitive dep of `@libsql/client` via `node-fetch`. No security impact — cosmetic deprecation only. |

### Production Dependencies — Clean

All production dependencies are:
- Actively maintained (last commit within 6 months)
- Pinned to exact versions (no `^` or `~`)
- Free of known critical/high CVEs

## Known Risks & Mitigations

### Assessment Token-Based Access (IDOR — CWE-639)

Assessment endpoints (`/api/v1/assessments/[token]/*`) use UUIDv4 tokens as the sole
access control. This is a **deliberate design choice** — the app allows anonymous
assessments without requiring an account ("Geen account nodig").

**Risk:** If a token leaks (browser history, email forwarding, server logs), anyone with
the token can view/modify the assessment data (company name, contact info, scores).

**Mitigating controls:**
- UUIDv4 provides ~122 bits of entropy — brute-force is computationally infeasible
- Completed assessments reject further modifications (409 Conflict)
- Rate limiting on answer submission prevents automated abuse
- Assessment creation is rate-limited to prevent enumeration
- Tokens are never exposed in server logs (only validated via Zod)

**Residual risk:** Accepted. Users who share their assessment URL share access. This is
analogous to Google Forms "anyone with the link" sharing. For environments requiring
stricter access control, use the authenticated user flow (dashboard → assessment).

## OWASP Top 10 Mitigations

| OWASP Risk | Mitigation |
|------------|------------|
| A01:2021 Broken Access Control | Admin routes protected by session auth + VPN-only network access. Public assessment access via UUIDv4 tokens (non-guessable). |
| A02:2021 Cryptographic Failures | bcrypt for password hashing. HTTPS via Traefik TLS. No sensitive data in URLs. |
| A03:2021 Injection | Drizzle ORM (parameterized queries). Zod input validation on all API endpoints. React output encoding (XSS). |
| A04:2021 Insecure Design | SEAL engine is pure functional (no side effects). Repository pattern for data access. |
| A05:2021 Security Misconfiguration | CSP (strict self-only policy), HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Permissions-Policy. Read-only container. no-new-privileges. poweredByHeader disabled. |
| A06:2021 Vulnerable Components | Exact version pinning. `npm audit` in CI. No deprecated packages in production. |
| A07:2021 Auth Failures | Rate limiting on login. Session expiry. HttpOnly + Secure + SameSite=Strict cookies. |
| A08:2021 Data Integrity Failures | No deserialization of untrusted data. Zod schema validation at API boundary. |
| A09:2021 Logging Failures | Structured logging of auth events, API errors, rate limit hits. |
| A10:2021 SSRF | No user-controlled URLs processed server-side. |

## NIST SP 800-53 Relevant Controls

| Control | Implementation |
|---------|---------------|
| AC-2 Account Management | Admin accounts managed via CLI seed script, not self-registration |
| AC-3 Access Enforcement | Role-based: public (assessment), admin (dashboard). Network-level VPN restriction for admin. |
| AU-2 Audit Events | Login attempts, assessment creation, answer submission, PDF generation logged |
| IA-5 Authenticator Management | bcrypt cost factor 12, minimum password length enforced |
| SC-8 Transmission Confidentiality | TLS 1.2+ via Traefik, HSTS preload |
| SI-10 Information Input Validation | Zod schemas on all inputs, parameterized queries |
