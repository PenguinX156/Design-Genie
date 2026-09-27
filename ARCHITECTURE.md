# Architecture and release boundary

Design Genie is a repository-first, model-agnostic workflow. It assumes the host agent can edit code, browse references, and inspect screenshots. The tool adds durable design decisions and repeatable checks.

| Layer | Responsibility | Initial implementation |
| --- | --- | --- |
| Skills | Product understanding, art direction, implementation judgment, visual critique | Five portable skills in `skills/` |
| Design memory | A project's chosen identity, decisions, and compact agent handoff | `.design/` template copied by `design init` |
| CLI | Deterministic context and workflow routing, scan, targeted probe, capture, audit, baseline, diff | Node scripts in `packages/` |
| Resource librarian | Contextual discovery with license metadata | Small local link-only catalog; live MCP deferred |
| Evaluation | Compare the same brief with and without the workflow | Campaign Lab baseline and treatment fixtures |

## Loop

1. Run `design context` and `design workflow --scope ... --signature ...`. Inspect only the affected product surfaces and design files.
2. For a new site or major redesign, compare three conceptually different directions and record the choice. For a targeted change, preserve the current direction. Keep `.design/BRIEF.md` as a short handoff.
3. Build the primary flow and prototype the highest-risk visual or interaction in its page context. For 3D, compare the model-derived still, first live frame, and rotated frame before finishing surrounding sections.
4. Use a one-viewport `design probe` on uncertain states; batch related fixes and rerun only affected probes. Skip irrelevant effect work and full-page checks for narrow changes.
5. For a new or globally changed site, capture three viewports, run `design audit`, and perform keyboard and live-motion checks. Apply the visual critic rubric and save an approved baseline after review.

The CLI does not claim to generate creative direction or visually judge screenshots. Those are agent and human tasks. Its routing depends on task scope and technical risk, never aesthetic genre: a storefront, dashboard, publisher, portfolio, community app, and experimental site can all use the same process with different outcomes. It supplies evidence, durable structure, and objective checks. A future MCP server may expose live resource discovery when provider terms and access are clear. No external library, icon, image, or font is bundled by the initial catalog.
