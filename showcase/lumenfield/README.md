# LUMENFIELD

An interactive exhibition site built as a Design Genie showcase. The four visual concepts in `design/concepts/` guided the final implementation; `.design/` records the art direction, tokens, motion decisions, and review history.

![Full-page desktop preview](design/final/desktop.jpg)

## Run

```bash
cd showcase/lumenfield
npm install
npm run dev
```

Open the local URL printed by Vite. Use the study selector and drag the live sculpture to explore the forms. `npm run build` creates a production bundle. `npm run verify:ui` exercises the interaction path and saves desktop, mobile, native-concept-size, and live-study screenshots in `design/final/`.

From the repository root, run `npm run design -- capture --project showcase/lumenfield --url http://localhost:5173` and `npm run design -- audit --project showcase/lumenfield --url http://localhost:5173` for Design Genie review.

The visual artwork was generated for this project. Three.js is MIT licensed; Libre Bodoni and Space Grotesk are SIL OFL. See `.design/REFERENCES.md` and `.design/REVIEW.md`.
