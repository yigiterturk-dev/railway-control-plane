# Railway Control Plane — Implementation Ledger

Protocol: `NUSP-1.0`
Project: `railway-control-plane`

## Baseline

- Repository: new git repository, no prior application code.
- Framework: React 18 + Vite, Express, TypeScript, TanStack Query, shadcn/Radix primitives, Tailwind.
- Routes: hash-routed operator UI; same-origin `/api/*` server API.
- Deployment target: Railway via `railway.json`; production authority remains false.

## Requirement map

| Approved requirement | Implementation |
|---|---|
| Operational context → action → rail → evidence → ledger | `client/src/pages/control-plane.tsx` |
| Original project mark | `client/src/components/control-plane/brand-mark.tsx` |
| State-dependent, non-color status | `status-badge.tsx`, `workflow-rail.tsx` |
| Rail resolves into durable evidence | `workflow-rail.tsx`, `activity-ledger.tsx`, polling contract |
| Graphite + signal green tokens | `client/src/index.css` |
| CSS-only purposeful motion + reduced motion | `client/src/index.css` |
| Server-only Railway integration | `server/control-plane.ts` |
| Typed workflow, event ledger, idempotency | `shared/schema.ts`, `server/storage.ts`, `server/routes.ts` |
| Demo/live separation | `.env.example`, adapter factory, global mode labels |
| Architecture and honest scope | `docs/architecture.md`, architecture dialog |
| Threat model and CI | `docs/threat-model.md`, `.github/workflows/ci.yml` |

## Deviations

- Durable Postgres storage is modeled but not enabled in demo mode. Reason: the take-home can run without infrastructure while preserving a clear persistence seam.
- Live Railway latency is unverified until owner credentials are supplied. The UI and test gate rely on deterministic demo observations and do not claim live proof.

## Verification log

- Strict TypeScript: pass.
- Unit tests: 3/3 pass (settlement, idempotency, fail-closed resource validation).
- Production build: pass; client JavaScript 107.57 KB gzip, below 300 KB budget.
- Production dependency audit: 0 vulnerabilities.
- Desktop rendered review: 1440×900, pass; captured at `docs/images/control-plane-desktop.jpg`.
- Mobile rendered review: 390×844, pass; document width equals viewport width with no horizontal overflow.
- Interactive browser review: restart, stop, and start each reached `settled · success` only after observed evidence.
- Console review: no warnings or errors.
- Production-server smoke test: pass on local port 5190 (`/api/health`, `/api/context`, seeded `/api/workflows`).
- End-to-end API smoke workflow: `smoke_restart_01` returned `202 requested`, then verified as `settled · success` with five ordered events.

IMPLEMENTATION GATE: PASS
