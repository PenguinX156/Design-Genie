# Campaign Lab benchmark, version 0.1

## Fixed brief

Campaign Lab is a workspace for a small creative team tracking three client campaigns. The user needs to see overall reach and engagement, spot which campaign needs attention, filter active versus all campaigns, and see the next milestone. This is a functional, moderately dense tool that should feel confident and creative without hiding numbers. Use the same data and interactions in both versions. Target desktop and mobile. Do not use external assets.

## Protocol

`baseline/` is a conventional agent-style dashboard composed before applying the Design Genie workflow. `treatment/` uses the art direction and persistent memory in `treatment/.design/`. Both use the same HTML content and `app.js`; their stylesheets differ. Serve with `npm run benchmark:serve`, then capture and audit both with the CLI. Screenshots and audit JSON go in `results/` for repeatable review.

This initial exercise is **not a controlled proof of improvement**: one author made both variants in one session, the agent had already read the specification, and no blind human ratings were gathered. The purpose is to expose workflow failures and create a reproducible fixture. A future evaluation must run independent baseline and treatment agents with equal time, tools, and context except Design Genie, then collect blind preference ratings and objective QA.
