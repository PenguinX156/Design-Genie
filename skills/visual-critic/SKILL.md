---
name: visual-critic
description: Review a running web interface from actual screenshots and interactions, then prioritize and verify improvements.
---

# Visual critic

Read `design context` and the chosen direction, then inspect the actual renders. For a new site or global redesign, check desktop, tablet, and mobile first view and full page, navigation, hover/focus, and relevant loading/empty/error states. For a targeted change, inspect the affected states and neighboring widths first; broaden only when shared layout or styling changed. For interactive visual art, use `design probe` to compare the fallback, first live frame, and a manipulated state. Run `design audit` for detectable accessibility, overflow, media clipping, console, and navigation issues when the scope warrants a full release check. Automated checks cannot judge composition, texture fidelity, or prove accessibility.

For prominent 3D work, inspect actual depth, crossings, surface detail, lighting, and side/rear angles. Treat the Fold in `../../showcase/lumenfield/design/final/live-first.png` and `live-study.jpg` as a local quality reference for craft, not as a required visual style. Reject a model that only looks convincing from the front or whose placeholder depicts different geometry. Require the placeholder to come from the approved model and camera, and compare its first live frame at desktop and mobile widths.

Assess composition, typography, contrast, hierarchy, spacing, component consistency, brand fit, responsive behavior, interaction, motion purpose, and performance. Flag generic patterns only when they undermine this product and direction; do not ban gradients, cards, Inter, or any icon set universally. For every finding, cite rendered evidence, user impact, severity (`critical`, `high`, `medium`, `low`), and a concrete fix. Fix critical/high problems first, recapture, and check the same state again. Stop after three rounds unless a remaining critical problem requires more. Save an approved baseline only after review.

Use `../../references/website-quality.md` for the full-page standard. On a drag probe, inspect `*-during-drag.png` and `renderResolution.droppedCanvasIndices` as well as the resting comparison. A stable backing scale does not guarantee a sharp material; inspect the image and live movement too.
