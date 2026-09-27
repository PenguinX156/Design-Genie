# Motion

| Element | Purpose / trigger | Timing | Reduced motion / cost |
| --- | --- | --- | --- |
| Hero text reveal | Reading order on load | 900ms stagger | Instantly visible; transforms and opacity only |
| Hero sculpture drift | Suspended feel on pointer move | damped requestAnimationFrame | Disabled; CSS transform only |
| Study geometry | Tactile form; drag to rotate | Continuous while visible | Static unless dragged; DPR capped at 1.5 |
| Study selection | Clarify active state | 450ms color/opacity | Immediate state switch |
| Scroll reveal | Section rhythm | 800ms once | Instantly visible |

WebGL initializes when the study stage approaches the viewport and becomes visible only after engagement; rotation starts from a stable initial angle. A first drag made before loading completes is replayed. It pauses when absent and falls back to the static image when unavailable. No scroll hijacking.

The live Fold keeps the original helix geometry. Its UV maps sample detail from `public/images/glass-fold.png`, tiled at both seams so the orange and lavender glass treatment persists during rotation. The source is artwork generated for this project. Review the fallback, first live frame, and dragged frame with `design probe` before approving a material change.
