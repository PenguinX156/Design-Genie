# LUMENFIELD — design direction

## Product and users

A fictional computational-art exhibition and interactive portfolio, built as a public Design Genie demonstration. Visitors should grasp the premise, explore three forms, manipulate live 3D, and leave with a strong memory of the visual language. Editorial density is low; technical sophistication is high. There is no account or data collection.

## Chosen visual concept

**Chosen: dark observatory.** Ink-black exhibition space, Bodoni-scale typography, molten orange/lavender glass, one tactile sculpture stage, then a chalk-colored release. It lets the object dominate while exploration stays understandable.

Rejected: **quiet white museum** was too restrained for this advanced motion and dimensional-art demo. **Kinetic graphic zine** competed with the artwork and weakened legibility.

## Design principles

- Treat the work as the interface: one dominant visual per section, sparse controls.
- Use contrast and scale rather than boxes or decorative UI for hierarchy.
- Make interaction discoverable, keyboard-accessible, and reversible.

## Layout and hierarchy

Desktop: edge-to-edge dark canvas with 4vw gutters; brand and three text links; large serif hero left and sculpture in the right 60%. A thin footer line anchors the first viewport. Study section uses a broad title above a left text rail and right WebGL stage. Finale changes to chalk and crops an echo of the object at right. On mobile: brand/menu, headline, support, CTA, object, footer. Study rail stacks above the stage without horizontal scrolling.

## Signature moments

1. Glass-knot hero: generated transparent artifact from the concept, positioned in deep negative space; gentle pointer response makes it feel suspended.
2. Live studies: the generated Fold artwork preserves the resting concept, then selectable geometry with reflective material and lighting responds to pointer/touch drag, arrow keys, and study changes. The engaged object is live WebGL.
3. Chalk finale: a cohesive color-world transition for a memorable final beat.

## Anti-patterns in this context

No card grid, pill badges, fake metrics, cursor replacement, long intro loader, auto-advancing carousel, or distracting ambient motion.

Source concepts: `design/concepts/hero.png`, `studies.png`, `finale.png`, and `mobile-hero.png`. These are the visual spec; text and controls are HTML.
