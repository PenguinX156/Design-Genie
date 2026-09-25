# Motion

| Element | Purpose / trigger | Timing | Reduced motion / cost |
| --- | --- | --- | --- |
| Hero text reveal | Reading order on load | 900ms stagger | Instantly visible; transforms and opacity only |
| Hero sculpture drift | Suspended feel on pointer move | damped requestAnimationFrame | Disabled; CSS transform only |
| Study geometry | Tactile form; drag to rotate | Continuous while visible | Static unless dragged; DPR capped at 1.5 |
| Study selection | Clarify active state | 450ms color/opacity | Immediate state switch |
| Scroll reveal | Section rhythm | 800ms once | Instantly visible |

WebGL starts when the study stage approaches the viewport, pauses when absent, and falls back to a static generated image when unavailable. No scroll hijacking.
