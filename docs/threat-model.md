# Threat model

| Risk | Current control | Production extension |
|---|---|---|
| Railway token exposure | Token is read only by the server; no `VITE_` secret | Managed secret store and rotation |
| Arbitrary resource targeting | Body IDs must match server-approved context | Per-user authorization policy |
| Duplicate destructive command | Required/generated idempotency key and active-run guard | Durable unique constraint + distributed lock |
| Optimistic or stale success | Expected state must be observed before settlement | Webhook reconciliation and monotonic event versions |
| Slow or unavailable upstream | 10s GraphQL request timeout and explicit 60s verification timeout | Queue, retry policy, circuit breaker |
| Secret in logs/errors | API logs request metadata only; upstream errors are sanitized | Structured redaction rules and log tests |
| Cross-site command | Same-origin API and JSON body | CSRF token if cookie-based auth is added |
| Abuse / action flooding | One active operation per process | Authenticated rate limit backed by Redis |

Demo mode has no external side effects. Live mode is opt-in through server environment configuration and shows explicit confirmation for stop/restart.
