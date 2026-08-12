# Railway Control Plane — Motion Contract

Protocol: `NUSP-1.0`
Project: `railway-control-plane`
Project DNA: `1.0.0`
Art direction: `1.0.0`

## Motion thesis

Motion explains causality: a requested operation advances only when the server reports a new workflow state, and the final ledger record appears only after the observed Railway state verifies the result. Nothing moves merely to decorate the interface.

## Opening sequence

Content is fully readable at first paint. On the first visit only:

1. Shell opacity resolves from `0.94` to `1` over `180ms` with `cubic-bezier(.2,.8,.2,1)`.
2. Current-state rule grows from `scaleX(.72)` to `scaleX(1)` over `240ms`, beginning at `80ms`; transform origin follows reading direction.
3. The most recent ledger row resolves from `translateY(4px)` and opacity `0` over `180ms`, beginning at `140ms`.

The sequence never blocks input, never hides headings, and is skipped after the first render, on back/forward navigation, reduced motion, or a low-power hint.

## First meaningful interaction

Selecting a lifecycle action changes the button to a stable pending label, creates the `requested` stage server-side, and moves focus to a live status summary. The rail advances only from API responses or polling evidence. User interruption leaves the operation running and exposes a “View active run” affordance; it never cancels infrastructure work implicitly.

## Transition map

| Transition | Purpose | Behavior |
|---|---|---|
| Context changed | Prevent stale action | Status content crossfades for `120ms`; controls remain fixed; action is disabled until fresh evidence arrives. |
| Action requested | Confirm receipt | Button label and icon change in place; no scale flourish. |
| Stage advanced | Explain progress | Next rail segment fills over `220ms`; active checkpoint changes shape and label together. |
| Failure observed | Direct recovery | Failed checkpoint resolves immediately, error summary reveals over `140ms`, and focus moves only if the failure blocks the active dialog. |
| Workflow settled | Join action to audit | Completed rail holds for `240ms`; the new ledger row reveals directly below over `180ms`. |
| Ledger detail opened | Preserve chronology | Disclosure expands via grid rows over `160ms`; no nested scroll region. |
| Sidebar / mobile sheet | Preserve context | Standard translate transition `180ms`; backdrop opacity `140ms`; Escape restores focus. |
| Theme changed | Avoid flash | Tokens switch immediately; only color transitions up to `120ms` and only when reduced motion is not requested. |

## Primitive contract

| Element | Trigger | Start → end | Duration | Easing | Interruption / mobile | Purpose |
|---|---|---|---:|---|---|---|
| Stage segment | confirmed state change | `scaleX(0) → 1` | 220ms | `cubic-bezier(.2,.8,.2,1)` | Snap to newest confirmed state; vertical `scaleY` on mobile | Communicate ordered progress |
| Active checkpoint | confirmed state change | outline + dot → filled shape + check | 140ms | `ease-out` | Replace immediately under reduced motion | Distinguish active and complete without color alone |
| Pending indicator | server reports pending | opacity `0.45 ↔ 1` | 900ms loop | `ease-in-out` | Static clock icon on touch/low power/reduced motion | Show liveness without false progress |
| Ledger settlement | workflow settled | `translateY(4px), opacity 0 → 0px, 1` | 180ms | `cubic-bezier(.2,.8,.2,1)` | Immediate insertion on reduced motion | Connect verified result to evidence |
| Disclosure | explicit click/keyboard | grid `0fr → 1fr`, opacity `.6 → 1` | 160ms | `ease-out` | Same on mobile; interruptible | Reveal detail on demand |
| Button state | action lifecycle | content crossfade only | 120ms | `linear` | No transform; minimum 44px target | Confirm receipt without layout shift |
| Hover affordance | pointer hover | bg/border token change | 100ms | `linear` | No hover assumption on touch | Signal interactivity |
| Focus ring | keyboard focus | immediate | 0ms | none | Identical on all devices | Accessibility |

No parallax, scroll pinning, scrub, canvas, WebGL, video, blur animation, route-scale transition, or continuous decorative loop is permitted.

## Signature moments

1. Confirmed state advances along the operational rail.
2. Verified settlement resolves into a ledger record.

The budget allows at most three; only two are used.

## Reduced motion and input variants

- Under `prefers-reduced-motion: reduce`, all transforms, loops, staged delays, and smooth scrolling are disabled. State labels and icons update immediately.
- Keyboard focus never follows non-blocking progress. It moves only to a blocking error summary or the opened dialog/drawer, and is restored when closed.
- Touch layouts use the vertical rail, persistent text labels, 44px targets, and no hover-only disclosure.
- Slow-device and background-tab behavior skips intermediate interpolation and renders the most recent confirmed server state.
- `aria-live="polite"` announces stage progress; terminal failure uses `role="alert"`. Repeated polling results are deduplicated.

## Performance budget

- CSS transitions and transforms only; no animation runtime dependency.
- Maximum two simultaneously animated elements during workflow progression.
- Animate only `transform` and `opacity`, except short token-color transitions and explicit disclosure height.
- No filter, backdrop-filter animation, layout-wide blur, canvas, WebGL, or autoplay media.
- Scroll listeners are forbidden; visibility work uses IntersectionObserver only if later justified.
- Motion may consume no more than 10ms of main-thread work per interaction on the target laptop and must preserve responsive input under 4× CPU throttle.
- Polling pauses when the document is hidden and resumes with an immediate fresh-state request.

## Acceptance checks

- Every rail change is traceable to a stored server event.
- Pending animation cannot reach or visually imply success.
- Failure, timeout, retry, cancelled navigation, and settled states have distinct text and icons.
- Layout does not shift when labels, icons, or timestamps change.
- Reduced-motion mode contains no looping or transform animation.
- The UI remains operable before and during animation.
- Desktop and mobile captures verify the rail/ledger relationship.

## Gate 6 readiness

The selected direction, content model, project-owned SVG, demo data plan, technical boundary, responsive contract, accessibility fallback, and performance budget are sufficient to build. Live Railway credentials remain optional and must not block demo-mode implementation or QA.

MOTION GATE: PASS
