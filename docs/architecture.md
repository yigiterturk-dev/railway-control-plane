# Architecture

## Request path

```text
React UI
  -> POST /api/actions + idempotency key
  -> workflow validation and event record
  -> ControlPlaneAdapter
       -> deterministic demo adapter, or
       -> Railway GraphQL v2 adapter
  -> observed deployment status
  -> settled/failed event
  -> UI rail and activity ledger
```

The browser can select an action but cannot select arbitrary credentials or bypass the server-approved project, environment, and service IDs. The API rejects a resource context that differs from the adapter context.

## State model

`requested → validated → dispatched → observed → settled`

`failed` and `timed_out` are explicit terminal states. Dispatch success is never presented as operation success. The expected observed states are:

- deploy/restart: `SUCCESS`
- stop: `REMOVED` or `SLEEPING`

## Persistence seam

`IStorage` owns workflows and events. The demo uses `MemStorage`; `shared/schema.ts` contains the equivalent Drizzle/Postgres model. A production implementation can add a Postgres adapter without altering HTTP or UI contracts.

## Scope boundary

The current build proves one preconfigured service target. Production RBAC, multi-tenant isolation, durable job recovery, distributed locks, and Railway webhook reconciliation are deliberately documented as extensions rather than fabricated capabilities.
