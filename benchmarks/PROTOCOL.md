# Evaluation protocol for major versions

Use five briefs: B2B analytics, consumer creator app, luxury product landing page, developer tool, and experimental interactive site. Each brief fixes content, core flows, viewport targets, allowed assets, time budget, and technical constraints before either run.

For each brief, run the **same model and tools** in clean, separate worktrees. Baseline receives the brief and ordinary coding/browser tools. Treatment receives the same plus Design Genie skills, CLI, and design memory. Do not share drafts or screenshots between runs. Record prompt, model/version, elapsed time, input/output tokens or available usage credits, tool calls, iterations, commits, dependencies, and environment. Count concept generation, asset generation, screenshot review, and failed attempts separately when possible.

Capture desktop, tablet, and mobile plus interaction states. Run the same axe checks, keyboard flow, overflow check, Lighthouse configuration, and code review on both. Blind human raters see randomized, unlabeled screenshot pairs and score product fit, hierarchy, typography, composition, originality, responsive quality, and overall preference. Keep both raw ratings and aggregate results. Review qualitative failures, including excess complexity and performance regressions, before adding new skills or resources.

The Campaign Lab fixture is a local smoke exercise of this protocol, not a substitute for independent controlled runs. Do not claim that Design Genie reliably improves design until repeated, independent comparisons support that claim.

Report quality and cost together by brief. A faster run that loses visual quality or key task success is not an improvement. Test the workflow router on both a new build and a targeted change, with standard and advanced interactions, so an optimization for one showcase does not become the default for unrelated sites.
