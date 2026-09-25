# Ecosystem decisions (checked 2026-09-25)

- [Agent Plugins packaging](https://developers.openai.com/plugins/build/plugins) supports portable root `plugin.json` and `skills/`; packaging is deferred until the workflow is validated.
- [MCP TypeScript SDK v2](https://ts.sdk.modelcontextprotocol.io/v2/) supports stdio tools; a server will be added only when live, licensed resource providers justify it.
- [Playwright screenshots](https://playwright.dev/docs/screenshots) support the capture loop. Its [visual comparisons](https://playwright.dev/docs/test-snapshots) explain why repeatable environment and viewport matter.
- [Playwright accessibility guidance](https://playwright.dev/docs/accessibility-testing) uses `@axe-core/playwright` and cautions that automated checks are incomplete. [axe-core](https://github.com/dequelabs/axe-core) is MPL-2.0; [Playwright Core](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/package.json) declares Apache-2.0.
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) is available via Chrome DevTools, CLI, or Node. It remains optional to avoid requiring Chrome for the core workflow.

No reference-site design, image, icon, or font is redistributed here. A provider's site license does not establish the license of each asset it indexes.
