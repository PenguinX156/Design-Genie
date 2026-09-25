# Design Genie

Design judgment and visual QA for coding agents working in real web repositories. The canonical implementation is this repository; no model provider is required.

## Start in a web project

Requires Node 20 or newer. Install dependencies in this repository with `npm ci` and Chromium once with `npx playwright install chromium`. Run the CLI by absolute path, or use `npm run design --` from this repository:

```sh
node /path/to/Design-Genie/packages/cli/design.mjs scan --project /path/to/web-app
node /path/to/Design-Genie/packages/cli/design.mjs init --project /path/to/web-app
node /path/to/Design-Genie/packages/cli/design.mjs capture --project /path/to/web-app --url http://localhost:3000
node /path/to/Design-Genie/packages/cli/design.mjs audit --project /path/to/web-app --url http://localhost:3000
node /path/to/Design-Genie/packages/cli/design.mjs baseline --project /path/to/web-app
node /path/to/Design-Genie/packages/cli/design.mjs diff --project /path/to/web-app
```

Read [`skills/art-director/SKILL.md`](skills/art-director/SKILL.md) to start a new design, or [`skills/visual-critic/SKILL.md`](skills/visual-critic/SKILL.md) for a rendered review. `init` creates `.design/` without replacing existing decisions. Commit that directory in the target project; captures and baselines are ignored there by default so a team can decide what to retain.

## What the commands do

| Command | Result |
| --- | --- |
| `scan` | JSON summary of framework, package manager, dependencies, fonts, tokens, and structure |
| `init` | Copy the design memory template without overwriting files |
| `directions` | Print the required three-direction decision worksheet |
| `resources --query ...` | Search curated links and display usage/license cautions |
| `capture` | Full-page PNGs at 1440, 768, and 390 px plus capture metadata |
| `audit` | axe violations, overflow, console errors, and navigation metrics |
| `critique` | A severity-based review worksheet for screenshots and interactions |
| `baseline` | Copy current captures to the project's approved baseline |
| `diff` | Compare matching PNGs and write pixel diffs |

`capture`, `audit`, and `diff` require `npm ci` in this repository. `audit` is a basic automated check; it does not replace keyboard, screen reader, or visual inspection. `diff` measures pixel change and does not decide whether a change is good. Lighthouse can be run separately for deeper performance analysis.

## Scope and evidence

The first milestone is a working loop, not a full resource marketplace or MCP service. [`benchmarks/campaign-lab/README.md`](benchmarks/campaign-lab/README.md) records an initial baseline/treatment exercise and its limits. Repeat the benchmark with independent runs of the same agent and blind human review before claiming a general quality improvement. The resource catalog is deliberately small and link-only; verify each asset's own license before incorporating it.

See [`ARCHITECTURE.md`](ARCHITECTURE.md), [`CONTRIBUTING.md`](CONTRIBUTING.md), [`references/ecosystem.md`](references/ecosystem.md), and the [benchmark protocol](benchmarks/PROTOCOL.md).
