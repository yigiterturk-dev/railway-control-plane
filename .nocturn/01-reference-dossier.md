# Railway Control Plane — Bounded Reference Dossier

Protocol: `NUSP-1.0`
Project slug: `railway-control-plane`
Reference Pool: `1.0.0`, Gate 4 approved
Asset policy: `metadata-only`
Production code: `false`
Review result: `PASS WITH WARNINGS`

## Scan contract

This dossier inspects only four approved targets:

1. R01 — lifecycle sequence, importance layering, and downstream action communication.
2. R02 — status/event/error ledger and progressive disclosure.
3. R06 — anomaly-to-action-to-verified-completion loop.
4. R09 — ambient volatile status and wayfinding semantics.

Intended viewports were `1440×900` and `390×844`. A deterministic live-page capture did not complete, so no screenshot, DOM, computed-CSS, matched-rule, breakpoint, animation, or performance claim is made. This is a principle-level dossier grounded in existing official-archive text evidence. The lack of desktop/mobile evidence is an explicit access limitation, not silently substituted inference.

No reference images, video, logos, fonts, icons, copy, CSS, JavaScript, Lottie files, 3D assets, shaders, textures, or other asset bodies were downloaded, retained, hotlinked, recreated, or transferred.

## Evidence inventory

| Target | Verified public evidence | Inferred transfer | Unknown / limitation | Pack |
|---|---|---|---|---|
| R01 | Official IxDA archive text describes importance layering and immediate communication of operator actions. | Ordered work sequence can inform an original lifecycle rail. | Exact layout, responsive behavior, CSS, motion, accessibility, and implementation. | `reference-packs/awards.ixda.org/R01-lifecycle-sequence/` |
| R02 | Official IxDA archive text connects monitoring/control with status, event, and error logging for later analysis, plus need-based disclosure. | One stable taxonomy can support immediate recovery and later audit. | Exact ledger anatomy, interaction, responsive behavior, accessibility, and quantitative gains. | `reference-packs/awards.ixda.org/R02-event-error-ledger/` |
| R06 | Official UXDA case text describes complex-data filtering, prioritised action, and confidence in accurate completion. | Failure recovery can follow anomaly → evidence → prioritised action → verified result. | Detailed interaction, retry mechanics, responsive behavior, and accessibility. | `reference-packs/ux-design-awards.com/R06-completion-loop/` |
| R09 | Apple’s official award rationale highlights key information at the needed moment/place and established wayfinding conventions. | Compact persistent state can reduce repeated navigation. | Product-level web behavior; Apple-native details do not establish desktop-web implementation. | `reference-packs/developer.apple.com/R09-ambient-status/` |

## Claim register

### Verified

- `R01-C01`: importance layering and immediate action communication are supported by official archive text.
- `R02-C01`: status/event/error logging for later analysis is supported by official archive text.
- `R06-C01`: filtered evidence, prioritised action, and accurate-completion confidence are supported by official archive text.
- `R09-C01`: moment/place information priority and established wayfinding conventions are supported by Apple’s official rationale.

### Inferred

- `R01-C02`: an ordered sequence can inform the project’s lifecycle rail.
- `R02-C02`: a single event taxonomy can join recovery and audit.
- `R06-C02`: anomaly → evidence → action → verification is an appropriate recovery loop.
- `R09-C02`: a compact persistent service-state cue can reduce repeated navigation.

### Unknown

- `R01-C03`, `R02-C03`, `R06-C03`, `R09-C03`: all exact visual, responsive, interaction, animation, accessibility, and source-implementation details described in the packs remain unknown.

## Synthesis: the transferable system

The four references support a compatible abstract model, not a composition to copy:

1. **Orient:** keep current volatile state available where an action is considered (`R09`).
2. **Sequence:** show one ordered lifecycle with the active stage receiving priority (`R01`).
3. **Account:** write status, events, errors, actors, and evidence into one durable ledger (`R02`).
4. **Recover and verify:** show the anomaly, expose the highest-value recovery action, and withhold success until the observed state settles (`R06`).

For Railway Control Plane, this means the five-stage project-owned workflow—requested, validated, dispatched, observed, settled—may be the primary composition only when every visible stage maps to real state-machine truth. When the workflow settles, its evidence may resolve into the project-owned activity ledger. This interaction thesis originates in Project DNA; the references only support the underlying communication problems.

## Art-direction brief

### Visual purpose

Create a calm, accountable operational surface in which the reviewer understands current state, one lifecycle action, its progress, and its evidence without reading a generic metrics dashboard.

### Transferable principles

- Ordered state is primary; supporting data is layered by decision importance.
- Current status stays close to the action it governs.
- Pending, failure, timeout, retry, and verified completion remain distinguishable in text and structure, not color alone.
- The activity ledger preserves chronology, severity, actor, action, evidence, and final disposition.
- Recovery exposes one clear next action and its consequences.
- “Success” appears only after an observed state verifies settlement.

### Signatures to avoid

- Aviation/runway visuals, mining or industrial equipment metaphors, leak maps, acoustic/ML decoration, airport maps, Apple-native components, or Dynamic Island behavior.
- Any exact reference layout, palette, icon set, copy, table anatomy, disclosure behavior, animation, timing, or easing.
- Railway’s own visual identity, interface, colors, branded copy, icons, or dashboard structure.
- Generic KPI-card grids, decorative terminals, hidden retries, and optimistic-success theatre.

### Available project assets

- Project DNA `1.0.0` and its original precise-ledger thesis.
- Project-owned content model and planned deterministic demo data.
- No reference-owned creative assets.

### Missing project-owned evidence/assets

- Verified desktop and mobile build screenshots.
- Verified failure, retry, timeout, and settled-state captures.
- Sanitized activity-ledger examples generated by the application.
- Project-owned wordmark and demo video, if later approved.

### Locked decisions

- Metadata-only reference handling.
- Production code remains forbidden at this gate.
- Workflow state, not topology or decorative metrics, is primary.
- No optimistic success; status must map to API/workflow truth.
- Color is redundant with language, icons, shape, or position.

### Open decisions for Art Direction

- Original desktop and mobile composition.
- Rail geometry and responsive collapse.
- Ledger row anatomy, grouping, filters, and disclosure.
- Ambient status placement and temporal microcopy.
- Typography, spacing, tone, and project-owned visual language within Project DNA constraints.

## UX handoff

USER GOAL: Safely select a service, run one lifecycle action, understand progress, and recover from failure with evidence.

ENTRY STATE: Demo mode, current connection/service state visible, no credentials in the browser.

TARGET COMPONENT: Project-owned lifecycle rail plus activity ledger and ambient service-state cue.

OBSERVED BEHAVIOR: No direct interaction behavior was captured. Official archive text supports the four communication principles above only.

VERIFIED RESPONSIVE DIFFERENCES: None; desktop/mobile live evidence is unavailable.

ACCESSIBILITY EVIDENCE: None for the references. The project must validate its own semantics, focus order, contrast, non-color state encoding, keyboard use, reduced motion, and live-status announcements.

FRICTION/RISKS: Premature success, hidden retry, ambiguous destructive action, excessive detail before need, native-mobile patterns copied into web, and a ledger that separates incidents from their evidence.

TRANSFERABLE PRINCIPLE: Orient → sequence → account → recover → verify.

SIGNATURES TO AVOID: All visual and platform signatures listed above.

OPEN DECISIONS: Original responsive layout and disclosure mechanics.

ACCEPTANCE CRITERIA:

- Every visible lifecycle stage maps to an actual workflow state.
- Failed, timed-out, retried, and settled outcomes remain explicit.
- The ledger preserves actor, requested action, stage changes, evidence, and disposition.
- Destructive live actions require clear confirmation.
- Desktop and mobile layouts are verified from the project’s own build.
- State is understandable without color and usable with keyboard and reduced motion.

## Motion boundary

No reference timing, easing, transform, keyframe, or scroll behavior was verified. Motion Design may later propose original approaches that explain state transition and ledger settlement, with reduced-motion and low-performance alternatives. Motion must never imply success before observed verification.

## Evidence review

RESULT: PASS WITH WARNINGS

TARGET ACCURACY: PASS — exactly R01, R02, R06, and R09 approved targets.

CLAIM TRACEABILITY: PASS — verified claims resolve to pack evidence records and existing official-archive research; inferences and unknowns are explicit.

RESPONSIVE COVERAGE: WARNING — intended desktop/mobile viewports are recorded, but live captures are unavailable; no responsive claim is made.

PARENT/PSEUDO COVERAGE: WARNING — no DOM inspection completed; all such details remain unknown.

ASSET LEAK CHECK: PASS — metadata-only, no body transfer or hotlink.

SOURCE-CODE CLAIM CHECK: PASS — no public bundle is described as authored/original source.

SCOPE CHECK: PASS — no full-site scan or unapproved candidate.

WARNINGS: This dossier cannot authorize any pixel-, breakpoint-, animation-, or implementation-specific resemblance. The next specialist may use only the abstract communication principles and must originate the visible system from Project DNA.

REQUIRED REVISIONS: None for bounded art-direction ideation. Before later similarity review, validate the project’s own desktop/mobile build and treat all reference implementation details as unknown.

REFERENCE SCAN GATE: PASS
