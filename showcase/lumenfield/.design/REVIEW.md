# Rendered critique — 2026-09-25

## Evidence

- Concepts: `design/concepts/hero.png`, `studies.png`, `finale.png`, `mobile-hero.png`.
- Reviewed renders: `design/final/concept-native.jpg` (1586 × 960), `desktop.jpg` (1440 × 900 full page), `mobile.jpg` (390 × 844 full page), `live-study.jpg` (engaged WebGL). Design Genie PNG captures also cover 768 × 1024.
- `npm run verify:ui`: checked WebGL creation, three selected states and descriptions, visual change after drag, mobile disclosure/navigation, and mobile overflow.
- `npm run design -- audit`: HTTP 200, no console errors, no horizontal overflow, and no WCAG 2/2.1 A/AA axe violations at desktop/tablet/mobile sizes. Automated audit does not substitute for a screen reader test.

## Fidelity ledger

| Point | Concept evidence | Render evidence / action |
| --- | --- | --- |
| Copy and section order | Hero, three studies, then chalk finale | Exact visible headlines, support lines, CTA labels, and study labels preserved in HTML; no extra above-the-fold copy. |
| Hero composition | Giant serif left, glass knot right, dark negative space | `concept-native.jpg` and `desktop.jpg` match the split composition; art shifted clear of desktop nav and copy after first render. |
| Typography | Didone display and spaced UI chrome | Libre Bodoni and Space Grotesk self-hosted; sizes adjusted after render review; mobile line breaks match intent. |
| Color and image treatment | Ink, chalk, orange, lavender; unboxed cutout art | Same palette, transparent generated assets, no image wash. Inactive study labels brightened after axe contrast finding. |
| Study form | Luminous folded glass ring dominates right | The original layered helix meshes carry orange/lavender UV texture, slight translucency on one strand, and subtly rippled mesh normals that change highlights with rotation. Desktop and mobile stills are rendered from the same model's resting view. |
| Finale | Chalk reset, large black heading, cropped right-hand artwork | Color-world shift and copy preserved; crop enlarged after comparison. The final crop echoes the hero knot rather than reproducing the concept's exact single ribbon. |
| Responsive hierarchy | Mobile title/CTA precede sculpture | 390px render follows the planned reading order; 768px breakpoint moves hero art below copy and keeps finale process labels clear. |

## Findings and fixes

1. **High — study label contrast:** initial inactive gray failed axe at all viewports. Changed to `#a6a7a5`; recaptured and audited with zero violations.
2. **High — tablet overlap:** first render let hero/finale art cross copy. Added a tablet-specific composition and inspected the recapture.
3. **Medium — hero art and title scale:** first desktop image was too small, then reached nav when enlarged. Repositioned it and increased title scale; recaptured.
4. **High — live-study fidelity:** the first live version had untextured cylindrical surfaces that looked like balloon tubing. Kept its helix geometry and wrapped project artwork detail onto the surfaces; compared the fallback, first live frame, and dragged state.
5. **Medium — capture stability:** reduced-motion screenshot triggered WebGL initialization during capture at 390px. Deferred that initialization until interaction for reduced-motion users; all three Design Genie captures now complete.

## Assessment

The 2026-09-25 scores above were preliminary. The 2026-09-26 revisions addressed a cropped hero and the mismatch between the study placeholder and the interactive form. The study now previews a render from the actual helix; the separate hero artwork remains unchanged. The finale crop is deliberate and marked in markup. Automated checks cannot certify visual fidelity.

## Follow-up verification — 2026-09-26

- `npm run build`, `npm run verify:ui`, and root `npm test` pass. Desktop and mobile live WebGL screenshots are saved in `design/final/`.
- `design probe` saves the fallback and dragged state side by side; `design audit` reports no clipped media, horizontal overflow, console errors, or axe violations at 1440, 768, and 390 px.
- The original generated Fold was a still with no recoverable hidden geometry. Two replacement models were tried and rejected after rotated-view review.

## Restored Fold — 2026-09-26

- Removed the image extrusion and woven replacement. The earlier textured helix is again the only Fold model.
- Exported desktop and mobile placeholders from that model's resting WebGL frame. Latest click probes measured a 1.82% desktop pixel difference and 0.02% mobile difference; the paired images were inspected visually. `verify:ui` asserts under 5% for both.
- Removed the 40% drag resolution after visible blur was reported. `verify:ui` checks that a high-DPI canvas keeps the same pixel dimensions during the gesture. Rendering smoothness remains device dependent; motion profiling is a diagnostic, not a device guarantee.
- Lowered the metallic finish, made one strand subtly translucent, and gently perturbed mesh normals. The rotated screenshot shows different highlights across the surface. A per-pixel normal map and broad transparency caused large slowdowns in headless rendering, so they were removed; spark meshes were batched and Fold tessellation reduced without changing the shape. The warmed headless motion probe still measures roughly 200ms median frames, so smoothness on the user's hardware is not proven. Three-viewport audit found no clipping, overflow, page errors, or axe violations.
