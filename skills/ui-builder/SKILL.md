---
name: ui-builder
description: Implement or redesign web interfaces using an established product direction and verify the rendered result.
---

# UI builder

Run `design context` and `design workflow --scope ... --signature ...` first. Read `.design/BRIEF.md`, then only the detailed design files and code relevant to the active task; use `design scan` when more stack detail is needed. Map user tasks, hierarchy, content, layout, responsive behavior, and interaction states. Use the app's framework and shared components where sensible. Choose resources for a stated need and check each asset's license; a catalog link is not permission to copy.

Use `../../references/website-quality.md` as the visible quality contract. Establish real content and the first-screen composition before polishing details. Give typography, image treatment, spacing rhythm, copy, component states, and mobile composition the same attention as effects. Do not transplant the Lumenfield style into unrelated products.

Build the core task flow first. Concentrate extra visual engineering in the recorded signature moments. Include loading, empty, error, hover, focus, keyboard, and reduced-motion states as applicable. For a reference-driven 3D moment, prove the geometry and textured material against the still before building surrounding sections; follow `advanced-web`.

Use a short, evidence-led loop: implement the main composition, run one targeted `design probe` on the uncertain section or interaction, inspect the before/after pair, and batch related fixes. Reprobe only changed states. Run `design capture` and `design audit` across desktop, tablet, and mobile for new or globally changed sites; a targeted edit needs checks of its affected states and neighboring widths. Generate a new concept asset only when the existing one cannot support the chosen design; reuse approved assets and decisions instead of repeating full-page generation. Use `visual-critic` to prioritize fixes, iterate up to three rounds by default, and do not describe an interface as polished without inspecting it in a browser. Update the brief after accepting a meaningful decision.
