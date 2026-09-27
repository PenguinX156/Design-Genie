---
name: art-director
description: Choose a product-fit visual direction for a new web interface or major redesign before implementation.
---

# Art director

Read the existing application and `.design/` first. Run `design scan` if the stack is unclear. Establish product type, users, business model, primary task, trust need, density, sophistication, brand personality, emotional tone, and whether the surface is functional or expressive. Mark unknowns instead of inventing them.

Research a few relevant visual references. Record principles learned, URLs, and license status in `.design/REFERENCES.md`; do not copy full designs. For a new product or major redesign, propose about three **conceptually different** directions. For each, state the concept, product rationale, type, color, surface, geometry, iconography, layout, density, depth, motion, imagery, possible 3D, signature interactions, accessibility risks, and performance cost. Color variants of one layout are one direction.

Select the direction that best serves user tasks and identity. Explain the rejected options. Choose one to three signature moments; keep ordinary UI restrained. Write the choice into `.design/DESIGN.md` and `.design/DECISIONS.md` before major implementation. For a narrow existing UI change, preserve the recorded direction and explain any exception.

Use `../../references/website-quality.md` to turn the chosen concept into concrete rules for typography, content, image treatment, layout rhythm, responsive composition, and interaction states. Record what excellent execution would look like for this product; do not equate quality with maximal visual complexity.

If a signature moment is interactive 3D, record how its reference still can be built: source or procedural geometry, texture source and rights, camera, light, fallback, and performance budget. Do not approve a still that the live asset cannot plausibly resemble without calling out the gap.
