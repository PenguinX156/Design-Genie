# Decisions

| Date | Decision | Reason | Alternatives | Evidence |
| --- | --- | --- | --- | --- |

| 2026-09-25 | Choose dark observatory | Supports sculptural depth and editorial reading | Quiet white museum; kinetic graphic zine | `design/concepts/` |
| 2026-09-25 | Use generated cutout for hero and live Three.js in study | Preserve concept fidelity while proving interaction | Static image throughout; WebGL throughout | Concept set and interactive requirement |
| 2026-09-25 | Standalone Vite vanilla site | A focused exhibition with direct DOM state and one WebGL stage | Larger React app | Limited component/state surface |
| 2026-09-25 | Keep the generated Fold render at rest, crossfade to live WebGL on interaction | Match the visual concept while preserving real 3D manipulation | Show the stylized WebGL form immediately | Browser concept comparison |
| 2026-09-26 | Keep the original cylindrical helix meshes and wrap texture sampled from the Fold artwork | Preserve the approved 3D structure while making the live material resemble the preview | Replace the meshes with broad ribbons | Resting and dragged `design probe` comparison |
| 2026-09-26 | Constrain the hero image within its section and keep the live sculpture still until engagement | Prevent visible cropping and first-frame drift | Oversized clipped art and hidden autorotation | Desktop/mobile containment check and probe |
