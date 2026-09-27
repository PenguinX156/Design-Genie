# Reference-driven 3D QA

Use this when a still image advertises an object that later becomes interactive.

## Before implementation

1. Describe the reference's topology: number of pieces, centerline, crossings, silhouette, thickness, and intended camera angle. Decide whether a real 3D mesh is available. A still image alone does not define the hidden surfaces.
2. Record texture provenance and license. If the reference art is cleared for reuse, test a small UV crop on the actual geometry before building the full page. Check seams, back faces, mipmapping, highlights, and color space.
3. Match the first live frame's apparent size, camera, lighting, and palette to the still. If the shapes differ, choose a still from the model or revise the model; a smooth fade does not resolve a shape mismatch.

## Cheap review loop

1. Run one `design probe` on the 3D stage with `--action click --ready <ready-selector>`. Open the generated `*-comparison.png` and compare left (rest) with right (first live frame).
2. Run one `--action drag` probe to inspect a rotated view. Check the first gesture before lazy WebGL finishes, not only later drags.
3. Batch material and geometry changes. Reprobe only the changed state. Use `design capture` and `design audit` across three viewports after the focused comparison passes.

## Release checks

- The fallback is visible when WebGL is unavailable, texture loading fails, or the context is lost.
- Pointer, touch, and keyboard input rotate the object without swallowing page navigation; reduced motion does not animate on its own.
- The object and its shadows fit at desktop, tablet, and mobile widths. Treat `audit.clippedMedia` as a warning to inspect; mark deliberate crops with `data-crop-intentional`.
- Bound pixel ratio, geometry count, and animation work; pause rendering offscreen. Measure slow devices separately when performance is material.

## Current tool limits

The probe makes visual comparisons cheap but does not determine whether two images depict the same shape. The clipping check uses DOM element bounds, not image alpha bounds. The CLI does not create a 3D mesh from a still, measure GPU frame time, or emulate hardware context failure. Agents must inspect the paired screenshots and perform device testing for those cases.
