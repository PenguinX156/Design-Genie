# Architecture and release boundary

Design Genie is a repository-first, model-agnostic workflow. It assumes the host agent can edit code, browse references, and inspect screenshots. The tool adds durable design decisions and repeatable checks.

| Layer | Responsibility | Initial implementation |
| --- | --- | --- |
| Skills | Product understanding, art direction, implementation judgment, visual critique | Five portable skills in `skills/` |
| Design memory | A project's chosen identity and decisions | `.design/` template copied by `design init` |
| CLI | Deterministic scan, targeted interaction probe, capture, audit, baseline, diff | Node scripts in `packages/` |
| Resource librarian | Contextual discovery with license metadata | Small local link-only catalog; live MCP deferred |
| Evaluation | Compare the same brief with and without the workflow | Campaign Lab baseline and treatment fixtures |

## Loop

1. Run `design scan` and inspect the app and `.design/` if present.
2. Record the product brief and three conceptually different directions. Choose one with a rationale.
3. Run `design init`, then write the chosen direction, tokens, decisions, and references into `.design/`.
4. Build the signature interaction and run a one-viewport `design probe` against its resting and active states. For 3D, compare the reference still, first live frame, and rotated frame before finishing surrounding sections.
5. Fix material, shape, and layout issues found in the focused probe. Capture three viewports with `design capture` after those targeted checks pass.
6. Apply the visual critic rubric, run `design audit`, and perform keyboard and manual checks. Save an approved baseline with `design baseline`.

The CLI does not claim to generate creative direction or visually judge screenshots. Those are agent and human tasks. It supplies evidence, durable structure, and objective checks. A future MCP server may expose live resource discovery when provider terms and access are clear. No external library, icon, image, or font is bundled by the initial catalog.
