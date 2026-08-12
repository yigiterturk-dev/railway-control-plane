# Railway Control Plane — Visual Review

Protocol: `NUSP-1.0`
Project: `railway-control-plane`
Build identity: local production build, `dist/public/index.html` SHA-256 `699ba5766ee49fd3178c06a10caff6fdd58bfd25335293f6d4647544ce47d4bf`
Deployment identity: local only; external production release is not authorized.

## Evidence

- Desktop full page, 1440×900 viewport: `docs/images/control-plane-desktop.jpg`.
- Mobile full page, 390×844 viewport: `docs/images/control-plane-mobile.jpg`.
- Mobile Sheet navigation, 390×844 viewport: `docs/images/control-plane-mobile-menu.jpg`.
- Interactive browser states: empty, requested, dispatched, settled, expanded ledger evidence, stopped service, restarted service, architecture dialog.
- Production API smoke build: local port 5190, health/context/workflow/action responses verified.

Intermediate 1024px and 768px captures were not persisted in this review session. The breakpoint code was inspected and desktop/mobile endpoints passed, but those two artifacts remain a P2 release-preparation item rather than a hidden claim.

## Comprehension verdict

- Business/product: a safe control plane for one Railway service — clear within five seconds.
- Audience: infrastructure/product engineering reviewer — clear from operational vocabulary and proof placement.
- Offer/action: deploy, restart, or stop with observed verification — clear and immediately actionable.
- Proof: stage rail, activity ledger, architecture dialog, server-only boundary, repository docs — visible without marketing claims.
- Next action: choose the state-appropriate lifecycle command — clear.

## Contract compliance

| Contract | Verdict | Evidence |
|---|---|---|
| Context → command → rail → evidence → ledger | Pass | Desktop and mobile full-page captures |
| Graphite neutral + restrained signal green | Pass | Green is limited to action/healthy/completed state |
| Workflow, not topology, is primary | Pass | Rail occupies primary operational band; no map or KPI grid |
| Success only after observation | Pass | Browser and API restart/stop/start workflows |
| Ledger settlement signature | Pass | Settled operation becomes expandable chronological record |
| CSS-only bounded motion | Pass | No animation runtime, canvas, video, parallax, or scroll handlers |
| Mobile vertical rail and Sheet sidebar | Pass | Mobile full-page and menu evidence |
| Reduced motion | Pass by implementation inspection | Media query removes looping/transform duration; state text remains complete |
| Similarity Guard | Pass | Distinct topology, visual language, action structure, and imagery absence versus audited portfolio |

## Findings and recheck

| Priority | Evidence | Expected | Actual | Fix | Status |
|---|---|---|---|---|---|
| P1 | First local mobile full-page capture retained prior scroll position | Review should begin at top | Sticky header appeared at the retained position in the full-page artifact | Reset scroll to `0`; verified coordinates and no overflow before mobile menu capture | Fixed / rechecked |
| P1 | Initial live action contract | Stopped service should expose only a valid start/deploy path | Restart/stop were initially still enabled | Disable restart/stop when no active deployment or status is `REMOVED`/`SLEEPING` | Fixed / typechecked |
| P1 | macOS local server | Development server must start reliably | Template used unsupported `reusePort` | Removed `reusePort`; dev and production servers started successfully | Fixed / rechecked |
| P2 | Responsive evidence set | Persist 1440, 1024, 768, 390 captures | 1440 and 390 persisted | Add 1024 and 768 artifacts before public release | Open, non-blocking for local gate |
| P2 | Screenshot state | README image should eventually show a populated ledger | Current desktop hero capture shows the intentional empty state | Replace after deployed demo is stable and seeded history is visible | Open, release polish |

No P0 or unresolved P1 findings remain.

## Motion review

- Start: command receipt changes label/state without layout movement.
- Midpoint: rail shows only server-stored `dispatched · pending`; it never fills toward success based on elapsed time.
- End: `settled · success` appears after the observed event; expandable ledger contains the five-state evidence chain.
- Interruption: polling continues independently of UI focus and returns the current stored run.
- Reduced motion: content and labels carry the full meaning without transforms or loops.

## Responsive review

- 1440: 248px-equivalent sidebar, one main scroll region, rail/evidence split, full ledger columns.
- 390: sidebar becomes a focus-managed Sheet; rail turns vertical; evidence and ledger become record-oriented; buttons wrap without clipping.
- Measured at 390: `innerWidth=390`, `documentElement.scrollWidth=390`; no horizontal overflow.
- Touch controls use at least 44px action height; navigation and disclosure do not depend on hover.

## Accessibility review

- Semantic headings, regions, complementary evidence, definition list, ordered workflow, and disclosure buttons are present.
- Status combines icon, label, structure, and color.
- Workflow progress uses `aria-live="polite"`; terminal failures use `role="alert"`.
- Radix Dialog/AlertDialog/Sheet handle focus trapping, Escape, labelling, and return focus.
- Visible keyboard focus tokens and reduced-motion fallback are implemented.

## Console and links

- Browser console warnings/errors: none across desktop, mobile, menu, actions, and dialog.
- Internal hash links and activity target resolve.
- Repository links point to the intended future repository URL; they will return 404 until GitHub publication and are therefore a known release blocker, not treated as live proof.
- No Railway token or private identifier appears in browser-visible data.

## Similarity recheck

The sanitized fingerprint remains: operational context strip; state-dependent command; rail/evidence split; chronological ledger; architecture proof; restrained grotesk + mono; neutral/signal palette; no photography. This is principle-level compatible with approved research and signature-level distinct from the references, Railway, and the user's existing cinematic, finance, CRM, agency, and commerce projects.

VISUAL GATE: PASS
