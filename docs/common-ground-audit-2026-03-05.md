# Common Ground Architectuur Audit

**Project:** Sovereignty Checklist (MXI)
**Datum:** 5 maart 2026
**Auditor:** Claude Opus 4.6 — Software Architect
**Versie:** 1.0

---

## 1. Management Samenvatting

Het project is een single-purpose assessment tool voor digitale soevereiniteit, gebouwd als Next.js 16 applicatie met SQLite/Turso database en Docker deployment.

Het bedient primair **Laag 1 (Interactie)** en **Laag 4 (Service)**, met een interne datalaag. De architectuur volgt gedeeltelijk Common Ground principes: API-first frontend-backend scheiding, containerized deployment, configuratie via environment variabelen.

Het project is ontworpen als standalone MXI-propositie, niet als Common Ground component. Er ontbreken kernonderdelen zoals OpenAPI-specificatie, NL API Strategie compliance, NLX/FSC-integratie, NL Design System, `publiccode.yml`, en Haven/Kubernetes-ondersteuning.

**Totaalscore: 2.0 / 5.0** — Minimaal aanwezig. De basis (API-scheiding, containers) is er, maar substantieel werk nodig voor volledige Common Ground compliance.

---

## 2. Volwassenheidsmodel

| Laag | Score | Beoordeling |
|------|-------|-------------|
| Laag 1: Interactie | 2 / 5 | API-first, maar geen NL Design System, geen WCAG-audit, geen DigiD |
| Laag 2: Proces | 1 / 5 | Geen proceslaag, geen ZGW, geen notificaties |
| Laag 3: Integratie | 2 / 5 | REST API met versioning, maar geen OpenAPI spec, geen NL API Strategie, geen NLX |
| Laag 4: Service | 3 / 5 | Containerized, 12-factor deels, single responsibility, maar niet modulair deploybaar |
| Laag 5: Data | 2 / 5 | Eigen datastore, validatie aanwezig, maar geen AVG-endpoints, geen bronregistraties |
| Open Source | 1 / 5 | Geen licentie, geen publiccode.yml, niet gepubliceerd |
| Haven | 1 / 5 | Docker ja, Kubernetes nee, geen Helm charts |

---

## 3. Bevindingen per Laag

### Laag 1: Interactie

| Check | Status | Toelichting |
|-------|--------|-------------|
| Kanaalagnostisch | Deels | Frontend praat via /api/v1/* REST endpoints. Maar frontend en backend zitten in dezelfde Next.js app |
| Gebruikersgericht | Ja | Helder ontwerp, 15-20 min doorlooptijd, geen account nodig |
| Geen bedrijfslogica in frontend | Ja | SEAL/SRA berekeningen zitten server-side |
| API-first | Ja | Alle data via REST API routes |
| NL Design System | Nee | Eigen Tailwind-based UI met MXI huisstijl |
| DigiD/eHerkenning | Nee | Eigen email/password auth |
| Toegankelijkheid (WCAG 2.1 AA) | Deels | aria-invalid, aria-describedby op formulieren. Geen volledige WCAG-audit |

### Laag 2: Proces

| Check | Status | Toelichting |
|-------|--------|-------------|
| Proceslogica gescheiden | Nee | Geen aparte proceslaag |
| Procesorkestratie | Nee | Geen workflow engine |
| Zaakgericht werken (ZGW) | Nee | Niet van toepassing |
| Notificaties API | Nee | Geen event-driven notificaties |
| RBAC | Deels | Admin vs. user vs. anonymous |
| Audit trail | Nee | Alleen console.error bij fouten |
| Idempotentie | Deels | Answer-upsert is idempotent |

### Laag 3: Integratie

| Check | Status | Toelichting |
|-------|--------|-------------|
| API Gateway | Deels | Rate limiting in middleware, Traefik in productie |
| NLX/FSC | Nee | Geen inter-organisatie communicatie |
| REST API versioning | Ja | /api/v1/ prefix |
| HAL/JSON-API links | Nee | Geen hypermedia links |
| Paginering/filtering | Nee | Retourneert alles, geen paginering |
| application/problem+json | Nee | Eigen foutformaat |
| OpenAPI/OAS 3.x | Nee | Geen specificatie |
| Event-driven | Nee | Synchrone request-response |
| API authenticatie | Deels | Cookie-based, geen OAuth 2.0 |

### Laag 4: Service

| Check | Status | Toelichting |
|-------|--------|-------------|
| Modulair/microservices | Nee | Monoliet (Next.js) |
| Single responsibility | Ja | Doet een ding: assessments |
| Herbruikbaar | Deels | API bruikbaar door derden |
| Containerized | Ja | Docker, gehardend |
| 12-factor: Config via env | Ja | Alle config via env vars |
| 12-factor: Stateless | Ja | Geen server-side state |
| 12-factor: Port binding | Ja | PORT=3000 |
| 12-factor: Logging stdout | Ja | console.error naar stdout |
| Health checks | Nee | Geen /health endpoint |

### Laag 5: Data

| Check | Status | Toelichting |
|-------|--------|-------------|
| Data bij de bron | Ja | Eigen database |
| Geen dataduplicatie | Ja | Enkele database |
| Data-eigenaarschap | Ja | Service is eigenaar |
| AVG: dataminimalisatie | Deels | Alleen noodzakelijke velden |
| AVG: bewaartermijnen | Nee | Geen retentiebeleid |
| AVG: recht op vergetelheid | Nee | Geen delete endpoints |
| Data-kwaliteit | Ja | Zod-validatie op alle invoer |
| Encryptie at rest | Nee | SQLite zonder encryptie |
| Encryptie in transit | Ja | HTTPS via Traefik, HSTS |

---

## 4. Architectuurdiagram

```
+-----------------------------------------------------------+
|                    LAAG 1: INTERACTIE                      |
|  +------------------------------------------------------+ |
|  |  Next.js React Frontend (Tailwind/MXI huisstijl)     | |
|  |  - Landing page, Assessment formulier                 | |
|  |  - Resultaten + radar chart, Dashboard, Admin         | |
|  +-------------------------+----------------------------+  |
|                            | fetch('/api/v1/...')          |
+----------------------------+------------------------------+
|              LAAG 2: PROCES (niet aanwezig)                |
+----------------------------+------------------------------+
|              LAAG 3: INTEGRATIE                            |
|  +-------------------------+----------------------------+  |
|  |  Next.js Middleware (rate limiting)                   |  |
|  |  Traefik reverse proxy (productie)                   |  |
|  +-------------------------+----------------------------+  |
+----------------------------+------------------------------+
|              LAAG 4: SERVICE                               |
|  +-------------------------+----------------------------+  |
|  |  Next.js API Routes (/api/v1/*)                      |  |
|  |  Auth | Assessments | Admin | Export | User           |  |
|  |  SEAL Engine | SRA Engine (pure functions)            |  |
|  +-------------------------+----------------------------+  |
+----------------------------+------------------------------+
|              LAAG 5: DATA                                  |
|  +-------------------------+----------------------------+  |
|  |  SQLite / libSQL (Turso)                             |  |
|  |  assessments, answers, scores, users, admins         |  |
|  +------------------------------------------------------+  |
+-----------------------------------------------------------+
         Docker (read-only, non-root, cap_drop ALL)
```

---

## 5. Gap-analyse

| Aspect | Huidige situatie | Common Ground verwachting | Gap |
|--------|-----------------|--------------------------|-----|
| Frontend-backend scheiding | Zelfde Next.js app | Onafhankelijk deploybaar | Groot |
| API documentatie | Geen | OpenAPI 3.x | Groot |
| Foutformaat | Eigen JSON | application/problem+json | Medium |
| Paginering | Ontbreekt | NL API Strategie | Medium |
| Design System | Eigen Tailwind | NL Design System | Groot |
| Authenticatie | Email/password | DigiD/eHerkenning | Groot |
| Interoperabiliteit | Geen | NLX/FSC | Groot |
| Health checks | Ontbreekt | /health, /ready | Klein |
| Open source | Niet gepubliceerd | GitHub + EUPL + publiccode.yml | Medium |
| Haven/K8s | Docker only | Helm charts | Groot |
| AVG/Privacy | Minimaal | Data-export, verwijdering | Medium |

---

## 6. Migratie-roadmap

### Fase 1: Quick wins (1-2 dagen)
1. Health endpoint toevoegen
2. OpenAPI specificatie genereren
3. RFC 7807 foutformaat implementeren
4. publiccode.yml aanmaken
5. Open source licentie (EUPL-1.2)

### Fase 2: API Strategie compliance (1-2 weken)
6. Paginering op list-endpoints
7. Filtering en sortering
8. HAL-links in API responses
9. API-versiebeleid documenteren

### Fase 3: Privacy en Governance (1 week)
10. AVG data-export endpoint
11. AVG data-verwijdering endpoint
12. Bewaartermijnen implementeren
13. Gestructureerd audit logging

### Fase 4: Architectuur (2-4 weken)
14. Frontend loskoppelen van backend
15. NL Design System tokens integreren
16. Haven/Kubernetes ondersteuning
17. OAuth 2.0 / OIDC authenticatie

### Fase 5: Ecosysteem (optioneel)
18. NLX/FSC integratie
19. DigiD aansluiting
20. Common Ground componentencatalogus registratie

---

## 7. Risico's

| Risico | Impact | Waarschijnlijkheid |
|--------|--------|-------------------|
| Niet-afname door gemeenten zonder CG compliance | Hoog | Hoog |
| AVG-overtreding (geen retentie/verwijdering) | Hoog | Medium |
| Niet vindbaar zonder publiccode.yml | Medium | Hoog |
| Toegankelijkheidsklacht zonder WCAG-audit | Medium | Medium |
| Vendor lock-in | Medium | Laag |

---

*Dit rapport is gegenereerd als onderdeel van een architectuuraudit voor Common Ground compliance. Voor vragen: neem contact op met MXI.*
