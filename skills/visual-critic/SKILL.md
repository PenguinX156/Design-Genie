---
name: visual-critic
description: Review a running web interface from actual screenshots and interactions, then prioritize and verify improvements.
---

# Visual critic

Inspect the chosen direction in `.design/`, then the actual desktop, tablet, and mobile renders. Check first viewport and full page, navigation, hover/focus, and relevant loading/empty/error states. Run `design audit` for detectable accessibility, overflow, console, and navigation issues. Automated checks cannot judge composition or prove accessibility.

Assess composition, typography, contrast, hierarchy, spacing, component consistency, brand fit, responsive behavior, interaction, motion purpose, and performance. Flag generic patterns only when they undermine this product and direction; do not ban gradients, cards, Inter, or any icon set universally. For every finding, cite rendered evidence, user impact, severity (`critical`, `high`, `medium`, `low`), and a concrete fix. Fix critical/high problems first, recapture, and check the same state again. Stop after three rounds unless a remaining critical problem requires more. Save an approved baseline only after review.
