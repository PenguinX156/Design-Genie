import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scanProject } from '../packages/core/scan.mjs';
import { initMemory } from '../packages/core/memory.mjs';
import { searchResources } from '../packages/core/resources.mjs';

test('scanner recognizes existing stack without changing it', () => {
  const root = mkdtempSync(join(tmpdir(), 'design-scan-'));
  try {
    writeFileSync(join(root, 'package.json'), JSON.stringify({ dependencies: { next: '^16.0.0', react: '^19.0.0', tailwindcss: '^4.0.0', 'lucide-react': '^1.0.0' } }));
    writeFileSync(join(root, 'pnpm-lock.yaml'), 'lockfileVersion: 9');
    const result = scanProject(root);
    assert.match(result.framework, /Next.js/);
    assert.equal(result.packageManager, 'pnpm');
    assert.deepEqual(result.styling, ['Tailwind CSS']);
    assert.equal(result.reactVersion, '^19.0.0');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('init preserves project decisions on repeat', () => {
  const root = mkdtempSync(join(tmpdir(), 'design-memory-'));
  try {
    const first = initMemory(root);
    assert.ok(first.created.includes('DESIGN.md'));
    writeFileSync(join(root, '.design', 'DESIGN.md'), 'Chosen direction');
    const second = initMemory(root);
    assert.ok(second.skipped.includes('DESIGN.md'));
    assert.equal(readFileSync(join(root, '.design', 'DESIGN.md'), 'utf8'), 'Chosen direction');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('resource search retains usage and license uncertainty', () => {
  const result = searchResources('icons');
  assert.equal(result[0].name, 'Iconify');
  assert.equal(result[0].usage, 'link-only');
  assert.match(result[0].license, /Varies/);
});
