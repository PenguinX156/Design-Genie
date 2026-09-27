import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const url = process.env.SHOWCASE_URL || 'http://localhost:5173/';
const output = fileURLToPath(new URL('../design/final/', import.meta.url));
mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const changedPercent = (before, after) => {
  const a = PNG.sync.read(before);
  const b = PNG.sync.read(after);
  assert.equal(a.width, b.width);
  assert.equal(a.height, b.height);
  return 100 * pixelmatch(a.data, b.data, null, a.width, a.height, { threshold: .1 }) / (a.width * a.height);
};
const isContained = (page, child, parent) => page.evaluate(([childSelector, parentSelector]) => {
  const image = document.querySelector(childSelector)?.getBoundingClientRect();
  const frame = document.querySelector(parentSelector)?.getBoundingClientRect();
  return Boolean(image && frame && image.left >= frame.left - 1 && image.right <= frame.right + 1 && image.top >= frame.top - 1 && image.bottom <= frame.bottom + 1);
}, [child, parent]);

try {
  const native = await browser.newPage({ viewport: { width: 1586, height: 960 }, reducedMotion: 'reduce' });
  await native.goto(url, { waitUntil: 'networkidle' });
  await native.evaluate(() => document.fonts.ready);
  await native.screenshot({ path: join(output, 'concept-native.jpg'), type: 'jpeg', quality: 90 });
  await native.close();

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const errors = [];
  desktop.on('pageerror', error => errors.push(error.message));
  await desktop.goto(url, { waitUntil: 'networkidle' });
  await desktop.evaluate(() => document.fonts.ready);
  assert.ok(await isContained(desktop, '.hero-art img', '.hero'), 'Desktop hero artwork must fit inside the hero');
  await desktop.screenshot({ path: join(output, 'desktop.jpg'), type: 'jpeg', quality: 88, fullPage: true });
  await desktop.getByRole('link', { name: 'Explore the studies' }).click();
  const stage = desktop.locator('.stage');
  const desktopPreview = await stage.screenshot({ path: join(output, 'study-fallback.png'), animations: 'disabled' });
  await stage.click({ position: { x: 450, y: 300 } });
  await desktop.waitForFunction(() => document.querySelector('.stage')?.classList.contains('is-ready'));
  const desktopLive = await stage.screenshot({ path: join(output, 'live-first.png'), animations: 'disabled' });
  assert.ok(changedPercent(desktopPreview, desktopLive) < 5, 'Desktop preview must match the first 3D frame');
  const canvas = stage.locator('canvas');
  await desktop.getByRole('button', { name: '02 THE CURRENT' }).click();
  assert.ok(await stage.locator('canvas').evaluate(canvas => canvas.width > 0));
  await desktop.getByText('A restless current gives invisible forces a shape you can almost touch.').waitFor();
  assert.equal(await desktop.getByRole('button', { name: '02 THE CURRENT' }).getAttribute('aria-pressed'), 'true');
  await desktop.getByRole('button', { name: '03 THE AFTERIMAGE' }).click();
  await desktop.getByText('Light leaves a trace of what was there, and what might come next.').waitFor();
  await desktop.getByRole('button', { name: '01 THE FOLD' }).click();
  const beforeDrag = digest(await canvas.screenshot());
  const box = await stage.boundingBox();
  await desktop.mouse.move(box.x + box.width * .5, box.y + box.height * .5);
  await desktop.mouse.down();
  await desktop.mouse.move(box.x + box.width * .7, box.y + box.height * .6, { steps: 5 });
  await desktop.mouse.up();
  const afterDrag = digest(await canvas.screenshot());
  assert.notEqual(afterDrag, beforeDrag, 'Dragging should rotate the rendered 3D form');
  await desktop.locator('.studies').screenshot({ path: join(output, 'live-study.jpg'), type: 'jpeg', quality: 88 });
  assert.deepEqual(errors, []);
  await desktop.close();

  const sharpDrag = await browser.newPage({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await sharpDrag.goto(url, { waitUntil: 'networkidle' });
  const sharpStage = sharpDrag.locator('.stage');
  await sharpStage.scrollIntoViewIfNeeded();
  await sharpStage.click();
  await sharpDrag.locator('.stage.is-ready').waitFor();
  const resolution = () => sharpStage.locator('canvas').evaluate(canvas => ({ pixels: canvas.width, css: canvas.getBoundingClientRect().width }));
  const sharpBefore = await resolution();
  const sharpBox = await sharpStage.boundingBox();
  await sharpDrag.mouse.move(sharpBox.x + sharpBox.width * .4, sharpBox.y + sharpBox.height * .5);
  await sharpDrag.mouse.down();
  await sharpDrag.mouse.move(sharpBox.x + sharpBox.width * .6, sharpBox.y + sharpBox.height * .5, { steps: 3 });
  const sharpDuring = await resolution();
  await sharpDrag.mouse.up();
  assert.ok(sharpDuring.pixels / sharpDuring.css >= 1.45, 'Drag must retain the high-DPI render resolution');
  assert.equal(sharpDuring.pixels, sharpBefore.pixels, 'Drag must not downscale the canvas');
  await sharpDrag.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await mobile.goto(url, { waitUntil: 'networkidle' });
  await mobile.evaluate(() => document.fonts.ready);
  assert.ok(await isContained(mobile, '.hero-art img', '.hero'), 'Mobile hero artwork must fit inside the hero');
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await mobile.getByRole('button', { name: 'MENU' }).click();
  assert.equal(await mobile.getByRole('button', { name: 'MENU' }).getAttribute('aria-expanded'), 'true');
  await mobile.getByRole('link', { name: 'WORK' }).click();
  assert.equal(await mobile.getByRole('button', { name: 'MENU' }).getAttribute('aria-expanded'), 'false');
  await mobile.evaluate(() => { window.scrollTo(0, 0); document.activeElement?.blur(); });
  await mobile.screenshot({ path: join(output, 'mobile.jpg'), type: 'jpeg', quality: 88, fullPage: true });
  await mobile.locator('.stage').scrollIntoViewIfNeeded();
  const mobileStage = mobile.locator('.stage');
  const mobilePreview = await mobileStage.screenshot({ path: join(output, 'mobile-fallback.png'), animations: 'disabled' });
  await mobileStage.tap();
  await mobile.waitForFunction(() => document.querySelector('.stage')?.classList.contains('is-ready'));
  assert.ok(await mobile.locator('.stage canvas').evaluate(canvas => canvas.width > 0));
  const mobileLive = await mobileStage.screenshot({ path: join(output, 'mobile-live.png'), animations: 'disabled' });
  assert.ok(changedPercent(mobilePreview, mobileLive) < 5, 'Mobile preview must match the first 3D frame');
  await mobile.close();

  console.log(`Verified model-derived preview parity, sharp high-DPI dragging, desktop/mobile WebGL, three study states, navigation, mobile menu, and no horizontal overflow. Screenshots: ${output}`);
} finally {
  await browser.close();
}
