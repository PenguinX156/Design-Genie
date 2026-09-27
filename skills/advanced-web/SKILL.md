---
name: advanced-web
description: Select and implement purposeful motion, SVG, 3D, shaders, or WebGL for a web interface.
---

# Advanced web

Start with the visual effect's purpose and user benefit. Use CSS and SVG for ordinary layout, transitions, and graphics. Use Motion for interface state changes, GSAP for complex timelines, and Three.js or React Three Fiber only for genuine interactive 3D. Use shader or particle systems only when the concept depends on them. These are choices, not required dependencies.

For each advanced effect, define input/interaction, fallback, keyboard path, reduced-motion behavior, loading behavior, and performance budget. Test on desktop and mobile. Remove or simplify an effect if it obscures the task, harms readability, introduces major latency, or has no clear product role. Record the rationale and cost in `.design/MOTION.md` and `.design/DECISIONS.md`.

## Reference-driven 3D

For an ambitious interactive object, use the Fold in `../../showcase/lumenfield/design/final/live-first.png` and its rotated `live-study.jpg` as the local craft benchmark. Match its level of intentional geometry, detailed material, lighting, and coherent appearance through rotation; adapt the form and material to the new product. A flat extrusion or untextured inflated tube is below this bar. Inspect both images before accepting a lower-detail substitute.

For glass-like surfaces, test the real mesh under its final lights. Start with a nonmetallic reflective material and an environment map, then tune restrained translucency and surface normals so highlights change as the object rotates. A normal map is one option; subtle vertex-normal variation is cheaper when the effect remains convincing. Check overlapping front/back surfaces, depth ordering, dark backgrounds, and performance. Regenerate the model-derived fallback after every material or lighting change; judge the fallback and rotated render together.

When a still image previews an interactive 3D object, treat the first live frame as a visual contract. Before building the page around it, identify the still's silhouette, number and thickness of forms, crossings, material, palette, light, and camera angle. A generated still does not supply hidden 3D surfaces. Build or obtain actual closed 3D geometry, inspect it from several angles, and create the placeholder from the approved model and camera. Use a shallow image extrusion only when the user explicitly wants a relief; it breaks the illusion when turned. When licensed project artwork contains useful surface detail, crop and tile it into a UV texture; check both UV seams, reflections, and the reverse side. Export a model-derived placeholder for each materially different responsive camera view.

Run `design probe --selector <stage> --action click --ready <ready-state>` to compare the fallback and first live frame in one image. Run a second drag probe and inspect `*-during-drag.png`, the rotated angle, and `renderResolution.droppedCanvasIndices`. For motion, use `--warm-ready <ready-state> --profile-ms 900` on a drag probe; the JSON reports p50/p95 browser frame intervals and long frames. Warm the scene before profiling so shader compilation and asset loading do not masquerade as drag stutter. Pixel difference, backing scale, and frame intervals are diagnostics, not proof of visual parity or GPU frame time; inspect the images and motion on a real device. If the geometry cannot plausibly match the still, revise the model or generate the still from it before polishing the rest of the page. Check first drag during loading, texture failure, context loss, keyboard rotation, reduced motion, and mobile framing. Mark deliberate image crops with `data-crop-intentional`; resolve accidental clipping reported by `design audit`.

Keep exactly one scheduled animation frame per scene, render only while motion changes the view, and derive damping and inertia from elapsed time so late frames do not pause the object. Bound geometry, shader cost, and pixel ratio. Preserve crispness during drag; do not silently reduce interaction resolution as a performance shortcut. Optimize scene cost first, and seek an explicit visual tradeoff only if needed.

Use `../../references/3d-reference-parity.md` as the short checklist for similar 3D tasks and the current tool limits.
