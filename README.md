# Design Genie

Design judgment and visual QA for coding agents working in real web repositories. The canonical implementation is this repository; no model provider is required.

See [LUMENFIELD](showcase/lumenfield/README.md), an interactive exhibition site built with this workflow. Its `.design/` records the three-direction decision, tokens, motion, references, critique, and verified renders.

## Start in a web project

Requires Node 20 or newer. Install dependencies in this repository with `npm ci` and Chromium once with `npx playwright install chromium`. Run the CLI by absolute path, or use `npm run design --` from this repository:

```sh
node /path/to/Design-Genie/packages/cli/design.mjs context --project /path/to/web-app
node /path/to/Design-Genie/packages/cli/design.mjs workflow --scope new --signature standard
node /path/to/Design-Genie/packages/cli/design.mjs scan --project /path/to/web-app
node /path/to/Design-Genie/packages/cli/design.mjs init --project /path/to/web-app
node /path/to/Design-Genie/packages/cli/design.mjs probe --project /path/to/web-app --url http://localhost:3000 --selector .interactive-stage --action drag --ready .interactive-stage.is-ready
node /path/to/Design-Genie/packages/cli/design.mjs capture --project /path/to/web-app --url http://localhost:3000
node /path/to/Design-Genie/packages/cli/design.mjs audit --project /path/to/web-app --url http://localhost:3000
node /path/to/Design-Genie/packages/cli/design.mjs baseline --project /path/to/web-app
node /path/to/Design-Genie/packages/cli/design.mjs diff --project /path/to/web-app
```

Start with `context` and `workflow` to select the smallest useful path. `--scope` can be `new`, `redesign`, `targeted`, or `review`; `--signature` can be `standard`, `interactive`, or `3d`. These choices route effort and checks, not appearance. Read [`skills/art-director/SKILL.md`](skills/art-director/SKILL.md) for new direction work or [`skills/visual-critic/SKILL.md`](skills/visual-critic/SKILL.md) for a rendered review. `init` creates `.design/` without replacing existing decisions. Its short `BRIEF.md` is the handoff for later agent turns; keep it under about 250 words, then open deeper files only when relevant. Commit `.design/` in the target project; captures and baselines are ignored there by default so a team can decide what to retain.

## What the commands do

| Command | Result |
| --- | --- |
| `scan` | JSON summary of framework, package manager, dependencies, fonts, tokens, and structure |
| `context` | Compact stack and `.design/BRIEF.md` handoff for a returning agent |
| `init` | Copy the design memory template without overwriting files |
| `workflow --scope ... --signature ...` | Route planning and QA effort by task size and technical risk, without choosing a style |
| `directions` | Print the required three-direction decision worksheet |
| `resources --query ...` | Search curated links and display usage/license cautions |
| `probe --selector ...` | Capture one section before and after a click, drag, or CSS `--trigger`; drag also saves a during-interaction image and canvas resolution report |
| `capture` | Full-page PNGs at 1440, 768, and 390 px plus capture metadata |
| `audit` | axe violations, overflow, potentially clipped media, console errors, and navigation metrics |
| `critique` | A severity-based review worksheet for screenshots and interactions |
| `baseline` | Copy current captures to the project's approved baseline |
| `diff` | Compare matching PNGs and write pixel diffs |

`capture`, `audit`, and `diff` require `npm ci` in this repository. `audit` is a basic automated check; it does not replace keyboard, screen reader, or visual inspection. `diff` measures pixel change and does not decide whether a change is good. Lighthouse can be run separately for deeper performance analysis.

Use `probe` during implementation: `--viewport desktop|tablet|mobile`, `--action none|click|drag`, optional `--trigger CSS` for a separate control, `--ready CSS` to wait for an async state, `--warm-ready CSS` to start and wait for a loaded scene before a drag, and `--profile-ms 900` for browser frame intervals. For a drag, the probe clicks the stage to warm it if `--warm-ready` is given and its selector is not yet visible; a supplied `--trigger` is used instead. Its left image is the resting state and its right image is the interacted state. A drag also saves `*-during-drag.png` and reports canvas backing scale before, during, and after the gesture so blurry interaction states are easier to catch. Inspect silhouette, material, crop, and live movement yourself. The media clipping report checks element bounds against clipping ancestors; mark deliberate crops with `data-crop-intentional` and inspect any warning visually. Once the signature moments pass, run the three-viewport `capture` and `audit` once as a release gate. This avoids repeated full-page captures and concept generation while preserving visual review.

## Scope and evidence

The first milestone is a working loop, not a full resource marketplace or MCP service. [`benchmarks/campaign-lab/README.md`](benchmarks/campaign-lab/README.md) records an initial baseline/treatment exercise and its limits. Repeat the benchmark with independent runs of the same agent and blind human review before claiming a general quality improvement. The resource catalog is deliberately small and link-only; verify each asset's own license before incorporating it.

See [`ARCHITECTURE.md`](ARCHITECTURE.md), [`CONTRIBUTING.md`](CONTRIBUTING.md), [`references/ecosystem.md`](references/ecosystem.md), and the [benchmark protocol](benchmarks/PROTOCOL.md).

For a still-to-interactive 3D element, use the [3D reference parity checklist](references/3d-reference-parity.md). It records the geometry, texture, first-frame, input, fallback, and mobile checks the automated audit cannot judge.

For overall UI quality, use the [website quality playbook](references/website-quality.md). It turns art direction into practical checks for composition, content, typography, visual assets, responsive layouts, states, and a short review loop.

## Faster agent loop

For a new site or major redesign, compare concise concepts once, pick a product-specific direction, and record it. Create expensive visual assets only when they help choose or implement that direction. Build the primary flow with representative content, then prototype the riskiest visual or interaction before filling out the page. For a targeted change, preserve the existing direction and inspect only the affected surface. Use one focused probe per uncertain state, batch fixes, and reserve three-viewport capture and audit for release or changes that affect shared layout. Read specialist 3D guidance only when the project actually uses 3D. Reuse approved assets and the brief across turns instead of regenerating concepts or rereading the whole project.

This is a cost strategy, not a promise of measured savings. The [evaluation protocol](benchmarks/PROTOCOL.md) calls for comparing quality, time, token use, and tool calls across multiple kinds of websites before claiming a general improvement.
