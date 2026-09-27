---
name: advanced-web
description: Select and implement purposeful motion, SVG, 3D, shaders, or WebGL for a web interface.
---

# Advanced web

Start with the visual effect's purpose and user benefit. Use CSS and SVG for ordinary layout, transitions, and graphics. Use Motion for interface state changes, GSAP for complex timelines, and Three.js or React Three Fiber only for genuine interactive 3D. Use shader or particle systems only when the concept depends on them. These are choices, not required dependencies.

For each advanced effect, define input/interaction, fallback, keyboard path, reduced-motion behavior, loading behavior, and performance budget. Test on desktop and mobile. Remove or simplify an effect if it obscures the task, harms readability, introduces major latency, or has no clear product role. Record the rationale and cost in `.design/MOTION.md` and `.design/DECISIONS.md`.

## Reference-driven 3D

When a still image previews an interactive 3D object, treat the first live frame as a visual contract. Before building the page around it, identify the still's silhouette, number and thickness of forms, crossings, material, palette, light, and camera angle. A generated still is not a 3D asset: choose or make compatible geometry, then test a material sample on that geometry. When licensed project artwork contains useful surface detail, crop and tile it into a UV texture; check both UV seams, reflections, and the reverse side. Keep the still and live render the same apparent size and orientation.

Run `design probe --selector <stage> --action click --ready <ready-state>` to compare the fallback and first live frame in one image. Run a second drag probe and inspect a rotated angle. A successful render or pixel difference is not proof of visual parity; look at the images. If the geometry cannot plausibly match the still, revise the still, model, or interaction before polishing the rest of the page. Check the first drag while WebGL is still loading, texture failure, context loss, keyboard rotation, reduced motion, and mobile framing. Mark deliberate image crops with `data-crop-intentional`; resolve accidental clipping reported by `design audit`.

Use `../../references/3d-reference-parity.md` as the short checklist for similar 3D tasks and the current tool limits.
