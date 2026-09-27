import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const url = process.env.SHOWCASE_URL || 'http://localhost:5173/';
const browser = await chromium.launch();
try {
  for (const [name, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    await page.goto(`${url}${url.includes('?') ? '&' : '?'}render-preview`, { waitUntil: 'networkidle' });
    const stage = page.locator('.stage');
    await stage.scrollIntoViewIfNeeded();
    await stage.click();
    await page.locator('.stage.is-ready').waitFor();
    const dataUrl = await page.locator('.stage canvas').evaluate(canvas => canvas.toDataURL('image/png'));
    const filename = name === 'desktop' ? 'woven-fold-preview.png' : 'woven-fold-preview-mobile.png';
    const output = fileURLToPath(new URL(`../public/images/${filename}`, import.meta.url));
    writeFileSync(output, Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log(`Rendered ${name} front view to ${output}`);
    await page.close();
  }
} finally {
  await browser.close();
}
