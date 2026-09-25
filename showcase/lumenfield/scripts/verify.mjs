import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';

const url = process.env.SHOWCASE_URL || 'http://localhost:5173/';
const output = fileURLToPath(new URL('../design/final/', import.meta.url));
mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

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
  await desktop.screenshot({ path: join(output, 'desktop.jpg'), type: 'jpeg', quality: 88, fullPage: true });
  await desktop.getByRole('link', { name: 'Explore the studies' }).click();
  const stage = desktop.locator('.stage');
  await desktop.getByRole('button', { name: '02 THE CURRENT' }).click();
  await desktop.waitForFunction(() => document.querySelector('.stage')?.classList.contains('is-ready'));
  assert.ok(await stage.locator('canvas').evaluate(canvas => canvas.width > 0));
  await desktop.getByText('A restless current gives invisible forces a shape you can almost touch.').waitFor();
  assert.equal(await desktop.getByRole('button', { name: '02 THE CURRENT' }).getAttribute('aria-pressed'), 'true');
  await desktop.getByRole('button', { name: '03 THE AFTERIMAGE' }).click();
  await desktop.getByText('Light leaves a trace of what was there, and what might come next.').waitFor();
  await desktop.getByRole('button', { name: '01 THE FOLD' }).click();
  const canvas = stage.locator('canvas');
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

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await mobile.goto(url, { waitUntil: 'networkidle' });
  await mobile.evaluate(() => document.fonts.ready);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await mobile.getByRole('button', { name: 'MENU' }).click();
  assert.equal(await mobile.getByRole('button', { name: 'MENU' }).getAttribute('aria-expanded'), 'true');
  await mobile.getByRole('link', { name: 'WORK' }).click();
  assert.equal(await mobile.getByRole('button', { name: 'MENU' }).getAttribute('aria-expanded'), 'false');
  await mobile.evaluate(() => { window.scrollTo(0, 0); document.activeElement?.blur(); });
  await mobile.screenshot({ path: join(output, 'mobile.jpg'), type: 'jpeg', quality: 88, fullPage: true });
  await mobile.close();

  console.log(`Verified live WebGL drag, three study states, navigation, mobile menu, and no horizontal overflow. Screenshots: ${output}`);
} finally {
  await browser.close();
}
