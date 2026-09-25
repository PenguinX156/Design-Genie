import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch();
try {
  for (const variant of ['baseline', 'treatment']) {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(`http://127.0.0.1:4173/${variant}/`);
      assert.equal(response.status(), 200);
      assert.match(await page.title(), /Campaign Lab/);
      assert.equal(await page.locator('.campaign:visible').count(), 3);
      await page.getByRole('button', { name: 'All' }).click();
      assert.equal(await page.locator('.campaign:visible').count(), 4);
      assert.equal(await page.getByRole('button', { name: 'All' }).getAttribute('aria-pressed'), 'true');
      await page.getByRole('button', { name: 'Active' }).focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('.campaign:visible').count(), 3);
      assert.equal(await page.getByRole('button', { name: 'Active' }).getAttribute('aria-pressed'), 'true');
      assert.equal(await page.getByRole('button', { name: 'Active' }).evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`${variant} ${width}px: content, filter, overflow, page errors pass`);
    }
  }
} finally { await browser.close(); }
