# GitHub Showcase Audit - Initial Public Inventory

Public profile: `yigiterturk-dev`

Observed on 2026-08-12 through GitHub's public repository API. This is an initial metadata audit; code-level claims require repository-by-repository verification before publication.

## Portfolio thesis

Present Yigit as a product-minded full-stack engineer who can own data-heavy products, operational workflows, and polished interfaces from system model to deployed experience.

## Pin set target

1. `railway-control-plane` - flagship developer tooling and async workflow proof.
2. `terralot-v2` - data ingestion, scoring pipeline, GIS, and operational product depth.
3. `stackcrm` - multi-tenancy, permissions, PostgreSQL, and business workflow modeling.
4. `cryptoflowcheck` - real-time data, external APIs, visualization, and failure handling.
5. `emlakakli` - shipped public product with market data and valuation workflows.
6. One visual-craft proof: `nocturndev` or `aura-cinematic-vet`, selected after code and live-demo QA.

## Public repository triage

| Repository | Current signal | Initial action |
| --- | --- | --- |
| railway-control-plane | New flagship | Build, verify, deploy, pin |
| terralot-v2 | Strong domain and pipeline claim; very large repo | Verify data pipeline, add architecture/ADR/tests/demo, pin |
| stackcrm | Strong business-system claim; no live URL | Verify tenancy/RBAC, add demo data and deployment, pin |
| cryptoflowcheck | Clear TypeScript/data-viz story; no live URL | Verify real-time behavior and source attribution, deploy, pin |
| emlakakli | Live URL and full-stack domain story | Add evidence-led README, screenshots, test/CI status, pin candidate |
| nocturndev | Live URL and visual craft | Verify performance/accessibility and contribution story, pin candidate |
| aura-cinematic-vet | Strong visual description; no live URL/topics/license | Add live demo, technical case study, performance evidence |
| pati-sarai-vet | Similar veterinary/cinematic surface | Differentiate clearly or keep only the stronger vet repository public/pinned |
| gelecekfinans | Live production URL and automation angle | Verify pipeline, disclosure, editorial safeguards, case study |
| toolcompare.net | Live domain and comparison product | Add architecture, data model, SEO/performance evidence |
| testereplus | Live demo and commerce flow | Verify checkout scope; document mock vs production integrations |
| hirdavatpro | Overlaps toolcompare/testereplus | Consolidate narrative or archive weaker duplicate |
| hirdavatpro-demo | Explicit duplicate demo | Archive after confirming no unique evidence |
| etsy-automation | Empty public repository | Archive or implement with tests before keeping public |
| jarvis | Very small Python repository | Keep unpinned until scope, tests, and documentation are credible |
| koc-tuning | Small marketing repository | Keep unpinned; add deployment only if it demonstrates unique craft |
| seckin-mermer | Very small HTML repository | Archive or keep unpinned unless rebuilt as a verified case study |

## Cross-repository standard

Every showcase repository must contain:

- A one-sentence problem and outcome above the fold.
- Live demo and source status, with demo credentials if needed.
- Three verified screenshots: desktop, mobile, and one meaningful state.
- Architecture diagram and data-flow explanation.
- Explicit personal contribution and ownership boundaries.
- Local setup, `.env.example`, migrations/seed instructions, and test commands.
- CI workflow and visible build/test status.
- Security and privacy notes appropriate to the domain.
- Honest limitations and next decisions.
- License or a clear `All rights reserved` statement when public reuse is not intended.
- Repository topics, homepage, description, social preview, and release notes.
- No secrets, private customer data, generated build artifacts, or unsupported scale claims.

## Profile-level standard

- Create the profile repository `yigiterturk-dev/yigiterturk-dev` with a concise English README.
- Headline: product-minded full-stack engineer focused on operational software, data systems, and developer experience.
- Lead with shipped proof, not a long technology icon wall.
- Pin exactly six repositories with distinct proof categories.
- Use a consistent screenshot frame and concise project descriptions.
- Add contact links only after verifying which public email, LinkedIn, and portfolio URL should be exposed.

## Current blockers

- GitHub CLI authentication for `yigiterturk-dev` is expired; remote writes, repo creation, metadata updates, and pin changes are blocked until reauthentication.
- Public metadata alone cannot verify README quality, test coverage, security posture, or personal contribution.
- Existing projects must be mapped to local working copies or cloned into an isolated audit workspace before edits.
