import { mkdirSync, writeFileSync, cpSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

export const viewports = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 }
};

function designDir(project, name) { const path = join(project, '.design', name); mkdirSync(path, { recursive: true }); return path; }
async function pageAt(browser, url, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  if (!response || response.status() >= 400) throw new Error(`Page returned ${response?.status() ?? 'no response'}: ${url}`);
  return page;
}

export async function capture(project, url) {
  const output = designDir(project, 'captures');
  const browser = await chromium.launch();
  const result = { url, capturedAt: new Date().toISOString(), viewports: {} };
  try {
    for (const [name, viewport] of Object.entries(viewports)) {
      const page = await pageAt(browser, url, viewport);
      const file = join(output, `${name}.png`);
      await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
      result.viewports[name] = { ...viewport, file };
      await page.close();
    }
  } finally { await browser.close(); }
  writeFileSync(join(output, 'capture.json'), JSON.stringify(result, null, 2) + '\n');
  return result;
}

export async function audit(project, url) {
  const browser = await chromium.launch();
  const result = { url, auditedAt: new Date().toISOString(), viewports: {} };
  try {
    for (const [name, viewport] of Object.entries(viewports)) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('pageerror', error => consoleErrors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const metrics = await page.evaluate(() => ({
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        domNodes: document.getElementsByTagName('*').length,
        navigation: (() => { const n = performance.getEntriesByType('navigation')[0]; return n ? { domContentLoadedMs: Math.round(n.domContentLoadedEventEnd), loadMs: Math.round(n.loadEventEnd), transferBytes: n.transferSize } : null; })()
      }));
      result.viewports[name] = { status: response?.status() ?? null, ...metrics, consoleErrors, axeViolations: axe.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })) };
      await context.close();
    }
  } finally { await browser.close(); }
  const output = designDir(project, 'captures');
  writeFileSync(join(output, 'audit.json'), JSON.stringify(result, null, 2) + '\n');
  return result;
}

export function saveBaseline(project) {
  const source = join(project, '.design', 'captures');
  const target = designDir(project, 'baselines');
  const copied = [];
  for (const name of Object.keys(viewports)) {
    const file = `${name}.png`;
    if (!existsSync(join(source, file))) throw new Error(`Missing capture: ${file}`);
    cpSync(join(source, file), join(target, file)); copied.push(file);
  }
  const meta = { approvedAt: new Date().toISOString(), files: copied };
  writeFileSync(join(target, 'baseline.json'), JSON.stringify(meta, null, 2) + '\n');
  return { target, ...meta };
}

export function diffBaseline(project) {
  const source = join(project, '.design', 'captures');
  const baseline = join(project, '.design', 'baselines');
  const output = designDir(project, 'diffs');
  const result = {};
  for (const name of Object.keys(viewports)) {
    const currentFile = join(source, `${name}.png`);
    const baselineFile = join(baseline, `${name}.png`);
    if (!existsSync(currentFile) || !existsSync(baselineFile)) throw new Error(`Missing ${name} capture or baseline`);
    const current = PNG.sync.read(readFileSync(currentFile));
    const previous = PNG.sync.read(readFileSync(baselineFile));
    if (current.width !== previous.width || current.height !== previous.height) {
      result[name] = { dimensionMismatch: true, current: [current.width, current.height], baseline: [previous.width, previous.height] };
      continue;
    }
    const diff = new PNG({ width: current.width, height: current.height });
    const changed = pixelmatch(previous.data, current.data, diff.data, current.width, current.height, { threshold: 0.1 });
    const file = join(output, `${name}.png`);
    writeFileSync(file, PNG.sync.write(diff));
    result[name] = { changedPixels: changed, totalPixels: current.width * current.height, changedPercent: +(100 * changed / (current.width * current.height)).toFixed(3), file };
  }
  writeFileSync(join(output, 'diff.json'), JSON.stringify(result, null, 2) + '\n');
  return result;
}
