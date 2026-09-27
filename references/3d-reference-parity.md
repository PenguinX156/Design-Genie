# Reference-driven 3D QA

Use this when a still image advertises an object that later becomes interactive.

For visually ambitious 3D, inspect the Lumenfield Fold's `showcase/lumenfield/design/final/live-first.png` and `live-study.jpg` as a local craft reference. Its textured helix, layered crossings, material response, and all-angle depth set the expected level of finish; the next project can have a different visual language. The rejected relief and simpler woven experiment are not reference models.

## Working implementation example

The Fold is an example of the construction sequence, not a reusable shape or required palette. Read `showcase/lumenfield/src/sculpture.js` for actual torus-knot geometry, subtly varied vertex normals, material and lights, bounded pixel ratio, and the drag render loop. Read `src/glass-texture.js` for its surface-detail generation and UV handling. `scripts/render-preview.mjs` renders desktop and mobile stills from the scene's camera, and `scripts/verify.mjs` captures fallback, first live frame, rotated view, and responsive states. Adapt these techniques to the product's form; evaluate simpler geometry or materials when they serve it better.

Build in this order: silhouette and topology; camera and framing; material on the real mesh; lighting and rotated views; model-derived still; input and fallback; then page composition. Keep the same scene configuration for the still and first interactive frame. When changing geometry, texture, light, or camera, regenerate stills and recheck parity before changing page styling.

## Before implementation

1. Describe the reference's topology: number of pieces, centerline, crossings, silhouette, thickness, and intended camera angle. Decide whether a real 3D mesh is available. A still image alone does not define the hidden surfaces. Do not treat a thickened still as a general substitute for a rotatable mesh.
2. Record texture provenance and license. If the reference art is cleared for reuse, test a small UV crop on the actual geometry before building the full page. Check seams, back faces, mipmapping, highlights, and color space. For glass, verify translucency, reflections, and gently perturbed surface normals under final lighting from front and rotated views.
3. Make the 3D mesh authoritative and render its approved front view as the placeholder. Export separate placeholders for responsive camera changes. This guarantees the visitor initially rotates the object they saw. If art direction requires a supplied still, revise the model until its front silhouette and crossings agree before rendering that placeholder.

## Cheap review loop

1. Run one `design probe` on the 3D stage with `--action click --ready <ready-selector>`. Open the generated `*-comparison.png` and compare left (rest) with right (first live frame).
2. Run one `--action drag` probe to inspect both `*-during-drag.png` and the rotated after image. Check the first gesture before lazy WebGL finishes, not only later drags. Inspect `renderResolution`: a nonempty `droppedCanvasIndices` means the canvas backing scale fell during drag relative to rest. Run a warmed motion probe with `--warm-ready <ready-selector> --profile-ms 900`; read p50/p95 and long frames, then test on actual hardware.
3. Batch material and geometry changes. Reprobe only the changed state. Use `design capture` and `design audit` across three viewports after the focused comparison passes.

## Release checks

- The fallback is visible when WebGL is unavailable, texture loading fails, or the context is lost.
- Pointer, touch, and keyboard input rotate the object without swallowing page navigation; reduced motion does not animate on its own.
- The object and its shadows fit at desktop, tablet, and mobile widths. Treat `audit.clippedMedia` as a warning to inspect; mark deliberate crops with `data-crop-intentional`.
- Bound pixel ratio, geometry count, shader cost, and animation work; pause rendering offscreen. Use one requestAnimationFrame loop and update rotation using elapsed time. Inspect sharpness during drag as well as at rest; a suddenly blurry or pixelated object fails the quality check. Measure slow devices separately when performance is material.

## Current tool limits

The probe reports pixel difference, canvas backing scale, and browser frame intervals, but cannot determine whether two images depict the same shape or measure GPU frame time. Its drag screenshot samples one instant, so live motion still needs review. The clipping check uses DOM element bounds, not image alpha bounds. The CLI does not create a 3D mesh from a still or emulate hardware context failure. Agents must inspect paired screenshots, rotated views, and motion on a real device.
