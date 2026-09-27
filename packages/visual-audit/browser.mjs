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
  const mobile = viewport.width < 500;
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
  const response = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  if (!response || response.status() >= 400) throw new Error(`Page returned ${response?.status() ?? 'no response'}: ${url}`);
  return page;
}

function comparisonImage(before, after, file) {
  const left = PNG.sync.read(readFileSync(before));
  const right = PNG.sync.read(readFileSync(after));
  const gap = 16;
  const image = new PNG({ width: left.width + right.width + gap, height: Math.max(left.height, right.height), colorType: 6 });
  image.data.fill(0);
  for (const [source, offset] of [[left, 0], [right, left.width + gap]]) {
    for (let y = 0; y < source.height; y++) {
      const start = (y * image.width + offset) * 4;
      source.data.copy(image.data, start, y * source.width * 4, (y + 1) * source.width * 4);
    }
  }
  writeFileSync(file, PNG.sync.write(image));
}

async function clippedMedia(page) {
  return page.evaluate(() => [...document.querySelectorAll('img,video,canvas')].flatMap(media => {
    if (media.closest('[data-crop-intentional]')) return [];
    const box = media.getBoundingClientRect();
    if (!box.width || !box.height) return [];
    let ancestor = media.parentElement;
    while (ancestor) {
      const style = getComputedStyle(ancestor);
      if (['hidden', 'clip'].includes(style.overflowX) || ['hidden', 'clip'].includes(style.overflowY)) {
        const clip = ancestor.getBoundingClientRect();
        const clipped = {
          left: Math.max(0, clip.left - box.left), right: Math.max(0, box.right - clip.right),
          top: Math.max(0, clip.top - box.top), bottom: Math.max(0, box.bottom - clip.bottom)
        };
        if (Object.values(clipped).some(value => value > 8)) {
          return [{ media: media.tagName.toLowerCase(), source: media.currentSrc || media.getAttribute('src') || null, clippedPixels: clipped, clippingAncestor: ancestor.className || ancestor.tagName.toLowerCase() }];
        }
      }
      ancestor = ancestor.parentElement;
    }
    return [];
  }));
}

export async function probe(project, url, { selector, viewport = 'desktop', action = 'none', trigger, ready } = {}) {
  if (!selector) throw new Error('--selector is required for probe');
  if (!viewports[viewport]) throw new Error(`Unknown viewport: ${viewport}`);
  if (!['none', 'click', 'drag'].includes(action)) throw new Error(`Unknown action: ${action}`);
  const output = designDir(project, 'probes');
  const browser = await chromium.launch();
  try {
    const page = await pageAt(browser, url, viewports[viewport]);
    const target = page.locator(selector).first();
    await target.scrollIntoViewIfNeeded();
    await target.evaluate(async element => {
      await Promise.all([...element.querySelectorAll('img')].map(img => img.decode().catch(() => {})));
    });
    const before = join(output, `${viewport}-before.png`);
    const after = join(output, `${viewport}-after.png`);
    await target.screenshot({ path: before, animations: 'disabled' });
    if (trigger) await page.locator(trigger).first().click();
    else if (action === 'click') await target.click();
    else if (action === 'drag') {
      const box = await target.boundingBox();
      await page.mouse.move(box.x + box.width * .45, box.y + box.height * .5);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * .63, box.y + box.height * .56, { steps: 8 });
      await page.mouse.up();
    }
    if (ready) await page.locator(ready).first().waitFor({ state: 'visible', timeout: 10000 });
    await target.screenshot({ path: after, animations: 'disabled' });
    const comparison = join(output, `${viewport}-comparison.png`);
    comparisonImage(before, after, comparison);
    const result = { url, selector, viewport, action, trigger: trigger || null, before, after, comparison, clippedMedia: await clippedMedia(page) };
    writeFileSync(join(output, `${viewport}-probe.json`), JSON.stringify(result, null, 2) + '\n');
    await page.close();
    return result;
  } finally { await browser.close(); }
}

export async function capture(project, url) {
  const output = designDir(project, 'captures');
  const browser = await chromium.launch();
  const result = { url, capturedAt: new Date().toISOString(), viewports: {} };
  try {
    for (const [name, viewport] of Object.entries(viewports)) {
      const page = await pageAt(browser, url, viewport);
      await page.evaluate(async () => {
        await Promise.all([...document.images].map(async image => {
          image.loading = 'eager';
          await image.decode().catch(() => {});
        }));
      });
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
      const mobile = viewport.width < 500;
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('pageerror', error => consoleErrors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
      const response = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const metrics = await page.evaluate(() => ({
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        domNodes: document.getElementsByTagName('*').length,
        navigation: (() => { const n = performance.getEntriesByType('navigation')[0]; return n ? { domContentLoadedMs: Math.round(n.domContentLoadedEventEnd), loadMs: Math.round(n.loadEventEnd), transferBytes: n.transferSize } : null; })()
      }));
      result.viewports[name] = { status: response?.status() ?? null, ...metrics, clippedMedia: await clippedMedia(page), consoleErrors, axeViolations: axe.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) })) };
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
