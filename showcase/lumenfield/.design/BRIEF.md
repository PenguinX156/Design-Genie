# Working design brief

## Product and primary task

LUMENFIELD is a fictional computational-art exhibition and Design Genie showcase. Visitors read the premise, explore three studies, and rotate the interactive sculpture. There is no account or data collection.

## Chosen direction

Dark observatory: a sparse editorial layout, dramatic serif scale, molten glass artwork, and one tactile study stage. Details and rejected directions are in `DESIGN.md`; this is a product-specific example, not Design Genie's default style.

## Constraints and signature moment

Vanilla Vite, CSS, and Three.js. Keep the hero contained, controls keyboard accessible, and the study useful on mobile. The Fold's still previews come from its live helix model and camera. Drag remains at the same capped pixel ratio as rest; reduced motion and static fallback stay available.

## Current state and next check

The textured helix and model-derived desktop/mobile previews are approved. For changes to geometry, texture, lighting, or camera: regenerate previews, compare fallback with the first live frame, inspect a rotated and mid-drag frame, then check mobile framing. Review `.design/DECISIONS.md` for iteration history.
