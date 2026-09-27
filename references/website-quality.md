# Website quality playbook

Use this for a new site or a substantial redesign. The goal is a distinctive, usable result that fits the product, not a particular visual style. Record decisions in `.design/` so the next agent does not restart art direction.

## Decide before polishing

1. State the audience, primary task, content priority, desired trust or emotion, and real constraints. Mark unknowns. Read the existing brand and code before changing them.
2. For a new site or major redesign, compare about three different concepts by composition, type, imagery, interaction, and product rationale. Pick one. A palette swap is not another concept. For a targeted edit, preserve the chosen direction.
3. Define a small set of design rules: type scale, spacing rhythm, color roles, image treatment, component states, and responsive changes. Write why each signature moment helps the page.
4. Put actual or representative content in the layout early. A beautiful empty shell can hide problems with long titles, missing images, dense data, and localization.

## Build to a visible standard

- **First screen:** The subject, focal point, and next action should be clear at desktop and mobile widths. Keep hero art inside its intended frame; deliberate crops are a choice, accidental cuts are defects.
- **Composition:** Use alignment, scale contrast, negative space, and section rhythm deliberately. Vary pacing where content needs it; avoid repeating one card pattern down the entire page.
- **Type and copy:** Choose typography for the product voice and legibility. Check real line breaks, measure, contrast, and copy specificity. Avoid invented claims and generic marketing filler.
- **Visual assets:** Use art that supports the concept. Check provenance, license, resolution, focal point, color treatment, and responsive crop. A placeholder must honestly preview an interactive asset.
- **Interaction:** Controls should communicate affordance and state. Check hover, focus, active, loading, empty, error, and keyboard paths. Make motion explain a change or reward an action; provide reduced motion.
- **Responsive:** Recompose hierarchy and imagery for narrow screens; do not only shrink a desktop layout. Verify touch targets, text size, menus, and content overflow.
- **3D and advanced effects:** Use them where depth or interaction serves the concept. Require coherent geometry and material from rotated angles, a model-derived first frame, fallback, and a measurable rendering budget. Follow `3d-reference-parity.md`.

## Short review loop

1. Implement the core flow and one signature moment. Use one focused `design probe` for the most uncertain section or state, then inspect its images. For 3D, first compare placeholder to live frame; then drag and inspect the during-drag and rotated images.
2. Write findings as evidence, user impact, severity, and a concrete fix. Batch related fixes. Reprobe only affected states. Use the [critique rubric](critique-rubric.md) to avoid vague judgments such as "looks polished."
3. For a new or globally changed site, run `design capture` and `design audit` at desktop, tablet, and mobile after targeted states pass. For a local change, verify its affected state and adjacent widths. Inspect keyboard navigation and motion in a real browser. Stop after three focused rounds unless a critical issue remains.

These checks are a quality gate, not a style recipe. A quiet utility app and an experimental exhibition can both meet it through different choices.
