---
name: advanced-web
description: Select and implement purposeful motion, SVG, 3D, shaders, or WebGL for a web interface.
---

# Advanced web

Start with the visual effect's purpose and user benefit. Use CSS and SVG for ordinary layout, transitions, and graphics. Use Motion for interface state changes, GSAP for complex timelines, and Three.js or React Three Fiber only for genuine interactive 3D. Use shader or particle systems only when the concept depends on them. These are choices, not required dependencies.

For each advanced effect, define input/interaction, fallback, keyboard path, reduced-motion behavior, loading behavior, and performance budget. Test on desktop and mobile. Remove or simplify an effect if it obscures the task, harms readability, introduces major latency, or has no clear product role. Record the rationale and cost in `.design/MOTION.md` and `.design/DECISIONS.md`.
