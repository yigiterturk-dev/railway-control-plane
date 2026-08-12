# Railway Control Plane - Art Direction

Protocol: `NUSP-1.0`
Project: `railway-control-plane`
Project DNA: `1.0.0`
Reference pool: `1.0.0`
Reference dossier: `1.0.0`

## Direction comparison

### A. Operational Ledger - selected

- Opening topology: a compact context header, one service status line, one lifecycle command rail, then a chronological evidence ledger.
- Rhythm: dense status, deliberate action, visible progression, quiet audit trail.
- Typography: General Sans for interface language; JetBrains Mono for identifiers, timestamps, status values, and API evidence.
- Material: graphite-white or graphite-black surfaces with thin neutral rules and one signal-green accent.
- Motion premise: state advances along one rail and settles into a ledger record only after verification.
- Conversion structure: understand current state, run one action, inspect evidence, open architecture notes.

### B. Infrastructure Map - rejected

- Topology would make services and connections the main canvas.
- Rejected because it resembles common cloud dashboards and shifts attention away from the assignment's lifecycle operation.

### C. Command Console - rejected

- Topology would foreground command entry and streaming terminal output.
- Rejected because it risks decorative-terminal theatre, weakens product-design evidence, and is less legible on mobile.

## Selected thesis

Make an opaque cloud operation feel accountable by showing its current truth, ordered progress, evidence, and verified outcome in one continuous operational ledger.

## Audience perception target

The reviewer should perceive careful product judgment first, credible full-stack engineering second, and visual craft as the quiet system binding both.

## Comprehension targets

- 5 seconds: this dashboard safely controls and observes one Railway service.
- 20 seconds: actions pass through explicit workflow states; success is verified rather than assumed.
- 60 seconds: the reviewer can inspect the activity ledger, reliability behavior, demo/live boundary, and architecture entry points.

## Narrative and message hierarchy

1. Connection mode and selected resource context.
2. Current observed deployment state and freshness.
3. One primary lifecycle action appropriate to that state.
4. Requested → validated → dispatched → observed → settled rail.
5. Activity ledger with actor, timestamps, severity, evidence, and disposition.
6. Architecture/reliability explanation and repository proof.

## Visual signature

The signature is the **state rail resolving into the ledger**. A five-stage line occupies the central operational band. During a workflow, the active segment advances without moving the surrounding layout. When the observed outcome settles, a new ledger row reveals in the same horizontal alignment as the rail evidence.

## Typography

- Body/UI: General Sans, 400/500/600/700.
- Data/code: JetBrains Mono, 400/500/600.
- Page title cap: `text-xl`; section headings `text-lg`; body `text-base`; navigation and controls `text-sm`; metadata `text-xs` with 12px minimum.
- Use tabular lining figures for timestamps and numeric values.
- Maximum four functional text styles per view.

## Grid and spacing

- Desktop: full-viewport shell; 248px collapsible shadcn sidebar; 64px header; one scrolling main region.
- Main composition: 12-column grid. Context/status spans 12; command rail spans 8; service evidence spans 4; ledger spans 12.
- Main gutters: 24px under 1280, 32px at wider viewports.
- Card/panel padding: 24px desktop, 16px mobile. Dense row gaps: 8px; section gaps: 24px or 32px.
- Mobile: sidebar becomes a Sheet; context, action, rail, and evidence stack in that order; rail turns vertical; ledger rows become labelled record blocks rather than a squeezed table.

## Color and material

The generator's output was customized because its red base conflicted with the product's signal-state thesis.

### Light

- background: cool graphite-white `210 18% 97%`
- surface/card: `210 20% 99%`
- foreground: `215 25% 12%`
- muted foreground: `215 10% 42%`
- border: `214 14% 87%`
- primary/signal green: `154 62% 32%`
- primary foreground: `150 30% 98%`
- destructive: `5 66% 43%`
- warning: `34 78% 39%`

### Dark

- background: `216 20% 7%`
- surface/card: `216 18% 10%`
- foreground: `210 17% 92%`
- muted foreground: `215 10% 63%`
- border: `215 13% 19%`
- primary/signal green: `151 54% 53%`
- destructive: `5 70% 61%`
- warning: `38 85% 59%`

Green represents healthy/ready or the permitted primary action, never decoration. Pending, warning, failure, and stopped states use icon + label + shape in addition to color.

## Media and noise

- No photography, gradients, or decorative infrastructure imagery.
- Product screenshots are the primary README media.
- A very restrained 1px technical grid may appear only inside the rail background; it must be structural and disappear in reduced-density mobile layouts.
- Project-owned inline SVG mark: two parallel rails joined by one offset checkpoint, reducible at 24px and using `currentColor`.

## Component families

- Shell: shadcn Sidebar, Sheet on mobile, fixed-height header.
- Context controls: accessible Select components for project/environment/service.
- State primitives: `StatusBadge`, `FreshnessLabel`, `WorkflowRail`, `WorkflowStage`.
- Operation primitives: primary `LifecycleAction`, confirmation AlertDialog for live stop/restart, inline result region.
- Evidence: `ActivityLedger`, `ActivityRecord`, progressive-disclosure details.
- Supporting: architecture drawer, demo/live boundary notice, skeleton/empty/error states.
- Use Cards only for discrete bounded evidence surfaces; never nest cards or turn every region into a card.

## Desktop composition

Header answers connection mode and freshness. The first main band answers which resource and what state. The second band holds the action rail as the visual center, with compact deployment evidence beside it. The lower main area is the activity ledger. Architecture and API detail open in context-preserving drawers rather than navigating away from the operating surface.

## Mobile composition

The user first sees service name, mode, current status, and the only appropriate action. The vertical rail is directly below. Evidence follows, then ledger record blocks. Destructive confirmation uses a full-width Sheet/Dialog with clear consequences. No sticky footer may obscure records.

## Proof placement

- Demo/live mode is labelled in the global header and repeated at action confirmation.
- Every action record links to sanitized request/response evidence and an idempotency key.
- Architecture, threat model, API documents, CI, and test evidence are reachable from the sidebar and README.
- No metrics are invented. Demo durations are labelled simulation data.

## Anti-goals

1. No generic KPI-card dashboard or chart-first opening.
2. No Railway brand/UI imitation.
3. No decorative terminal, hidden retry, or optimistic success.
4. No topology canvas as the main experience.
5. No purple/neon AI aesthetic, gradient button, glowing orb, or three-column feature grid.

## Accessibility and performance constraints

- WCAG AA contrast; keyboard-complete controls; visible focus; 44px touch targets.
- `aria-live="polite"` for non-critical workflow progression and `assertive` only for blocking failure.
- State never relies on color alone.
- Reduced motion replaces advancing animation with immediate stage emphasis and textual progress.
- One primary scroll region; no nested vertical scroll areas.
- Initial JavaScript target under 300KB compressed; no chart or animation dependency unless justified by measured need.

## Similarity Guard

Fingerprint:

- hero/opening archetype: operational context strip, not marketing hero.
- section sequence: context → action rail → evidence → ledger → architecture.
- typography character: restrained grotesk plus mono evidence.
- image treatment: verified product captures only.
- motion signature: state rail settles into ledger.
- CTA structure: one state-dependent lifecycle action.
- color distribution: 82% neutral surfaces, 14% text/rules, 3% green, 1% warning/error.
- overall feeling: calm accountable operator workspace.

Status: `PASS`. It is materially distinct from the user's public cinematic veterinary sites, finance dashboards, CRM surfaces, agency site, and commerce catalogs by opening topology, sequence, motion premise, imagery absence, and primary interaction.

## Selection record

The current explicit user instruction to continue authorizes the strongest direction that satisfies the already approved Project DNA. Direction A is selected. B and C are rejected for the reasons above.

## Asset readiness

- Inline project mark: ready to create during implementation.
- Icons: Lucide, provided.
- Demo data: ready to create from typed schemas.
- Screenshots/video: must be produced only from verified build.
- No asset blocks the build gate.

ART GATE: PASS
