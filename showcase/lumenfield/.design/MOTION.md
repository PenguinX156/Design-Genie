# Motion

| Element | Purpose / trigger | Timing | Reduced motion / cost |
| --- | --- | --- | --- |
| Hero text reveal | Reading order on load | 900ms stagger | Instantly visible; transforms and opacity only |
| Hero sculpture drift | Suspended feel on pointer move | damped requestAnimationFrame | Disabled; CSS transform only |
| Study geometry | Tactile form; drag to rotate | One animation frame at a time while moving, time-based damping | Static unless dragged; lower interaction resolution, full resolution at rest |
| Study selection | Clarify active state | 450ms color/opacity | Immediate state switch |
| Scroll reveal | Section rhythm | 800ms once | Instantly visible |

WebGL initializes when the study stage approaches the viewport and becomes visible only after engagement; rotation starts from a stable initial angle. A first drag made before loading completes is replayed. It pauses when absent and falls back to the static image when unavailable. No scroll hijacking.

The Woven Fold is a closed 3D ribbon with an oval cross section and UV detail sampled from `public/images/glass-fold.png`. The original cylindrical helix remains selectable. Desktop and mobile fallback images are exported from the Woven Fold's own front render via `npm run render:preview`, so a geometry, material, lighting, or camera change requires regenerating both images. On drag, rendering drops to 40% pixel ratio to keep motion responsive, then restores the sharp resting frame. Review both first frames and a rotated view with `design probe`; profile a warmed drag with `--warm-ready .stage.is-ready --profile-ms 900`.
