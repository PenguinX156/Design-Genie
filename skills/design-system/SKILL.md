---
name: design-system
description: Create or maintain a web project's persistent design memory, tokens, typography, motion, and component decisions.
---

# Design system

Read `.design/BRIEF.md` before changing visible UI, then inspect only relevant detailed design files. If missing, run `design init` to create an editable starting point, then replace placeholders with product-specific choices. Preserve existing project tokens and components where they work; avoid restacking the application merely to fit a preferred library.

Keep `DESIGN.md` as the human explanation and `TOKENS.json` as machine-readable values. Align typography, colors, spacing, radii, depth, motion, and breakpoints with the chosen direction. Maintain contrast and visible keyboard focus. Record type and asset licenses in `TYPOGRAPHY.md` or `REFERENCES.md`. Record component states and responsive rules in `COMPONENTS.md`; record any material change in `DECISIONS.md` with evidence from the rendered app.

Tokens are defaults, not a substitute for layout judgment. A purposeful exception is allowed when documented and visually checked.

Keep `BRIEF.md` short and current after meaningful accepted decisions. It is an agent handoff, not a duplicate of every token, component, or review note.
