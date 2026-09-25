# Evaluation protocol for major versions

Use five briefs: B2B analytics, consumer creator app, luxury product landing page, developer tool, and experimental interactive site. Each brief fixes content, core flows, viewport targets, allowed assets, time budget, and technical constraints before either run.

For each brief, run the **same model and tools** in clean, separate worktrees. Baseline receives the brief and ordinary coding/browser tools. Treatment receives the same plus Design Genie skills, CLI, and design memory. Do not share drafts or screenshots between runs. Record prompt, model/version, elapsed time, iterations, commits, dependencies, and environment.

Capture desktop, tablet, and mobile plus interaction states. Run the same axe checks, keyboard flow, overflow check, Lighthouse configuration, and code review on both. Blind human raters see randomized, unlabeled screenshot pairs and score product fit, hierarchy, typography, composition, originality, responsive quality, and overall preference. Keep both raw ratings and aggregate results. Review qualitative failures, including excess complexity and performance regressions, before adding new skills or resources.

The Campaign Lab fixture is a local smoke exercise of this protocol, not a substitute for independent controlled runs. Do not claim that Design Genie reliably improves design until repeated, independent comparisons support that claim.
