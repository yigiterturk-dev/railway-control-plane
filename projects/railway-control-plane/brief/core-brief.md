# Railway Control Plane - Core Brief v1.0

## Purpose

Build a public, production-minded developer tool that proves end-to-end product engineering ability against the expectations of Railway's Senior Full-Stack Engineer - Product role.

## Product

Railway Control Plane is a focused dashboard for provisioning, starting, stopping, restarting, and monitoring a containerized Railway service through Railway's GraphQL API. It is a portfolio project, a live technical demonstration, and the flagship repository for a broader GitHub showcase system.

## Primary user

- A software engineer who wants a clear operational view of one Railway service.
- A technical interviewer evaluating product judgment, frontend architecture, API modeling, async workflow handling, security, testing, and written communication.

## Primary action

Connect a Railway workspace safely, select a service, and run a lifecycle action while seeing an explicit, traceable state transition.

## Success criteria

- A reviewer understands the product and architecture within two minutes.
- The demo works without exposing a Railway API token to the browser.
- Lifecycle actions have pending, success, failure, timeout, retry, and idempotency behavior.
- The repository contains tests, CI, architecture documentation, screenshots, a live demo link, and an honest limitations section.
- The implementation can be explained and extended in a sixty-minute technical interview.

## First release

- Demo mode with deterministic mock Railway resources.
- Optional live mode backed by a server-side Railway API token.
- Project, environment, and service selection.
- Start, stop, and restart workflow actions.
- Deployment status polling and activity timeline.
- Inline error recovery and safe retry.
- Dark and light modes without browser persistence.
- Responsive desktop and mobile layouts.
- English UI and documentation.

## Later phase

- SSE status streaming.
- Log tailing.
- Multiple services and environments.
- Temporal-backed workflow orchestration.
- Team authentication and role-based access.
- Contribution to Railway CLI or Nixpacks.

## Exclusions

- General-purpose Railway replacement.
- Billing, destructive project deletion, or credential management.
- Persisting user API tokens in a database, browser storage, logs, or analytics.
- Claiming production scale not demonstrated by evidence.

## Technical direction

- TypeScript across client, server, and shared contracts.
- React + Vite + Tailwind + shadcn/ui frontend.
- Express backend as the only holder of Railway credentials.
- Zod-validated API boundaries.
- Drizzle schema for auditable workflow records; in-memory demo storage for zero-config review.
- TanStack Query for client server-state.
- Hash routing for deploy-safe navigation.
- Vitest and Playwright verification; GitHub Actions CI.

## Risks and controls

- Railway GraphQL API changes: isolate operations behind a typed adapter and document verified API assumptions.
- Token leakage: server-only environment variable, request redaction, no browser token input.
- Destructive actions: confirmation for live stop/restart, scoped operations, demo mode by default.
- Portfolio overclaiming: every README claim must map to code, a test, a screenshot, or a live behavior.
