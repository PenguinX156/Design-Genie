import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scanProject } from '../packages/core/scan.mjs';
import { initMemory } from '../packages/core/memory.mjs';
import { searchResources } from '../packages/core/resources.mjs';
import { routeWorkflow } from '../packages/core/workflow.mjs';
import { projectContext } from '../packages/core/context.mjs';

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

test('scanner recognizes varied site stacks without imposing one framework', () => {
  const root = mkdtempSync(join(tmpdir(), 'design-varied-scan-'));
  try {
    writeFileSync(join(root, 'package.json'), JSON.stringify({ devDependencies: { vite: '^7.0.0' } }));
    assert.equal(scanProject(root).framework, 'Vite (vanilla)');
    writeFileSync(join(root, 'package.json'), JSON.stringify({ dependencies: { astro: '^5.0.0' } }));
    assert.equal(scanProject(root).framework, 'Astro');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('init preserves project decisions on repeat', () => {
  const root = mkdtempSync(join(tmpdir(), 'design-memory-'));
  try {
    const first = initMemory(root);
    assert.ok(first.created.includes('DESIGN.md'));
    assert.ok(first.created.includes('BRIEF.md'));
    writeFileSync(join(root, '.design', 'DESIGN.md'), 'Chosen direction');
    const second = initMemory(root);
    assert.ok(second.skipped.includes('DESIGN.md'));
    assert.equal(readFileSync(join(root, '.design', 'DESIGN.md'), 'utf8'), 'Chosen direction');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('context exposes a compact handoff and preserves framework choices', () => {
  const root = mkdtempSync(join(tmpdir(), 'design-context-'));
  try {
    writeFileSync(join(root, 'package.json'), JSON.stringify({ dependencies: { vue: '^3.0.0' } }));
    initMemory(root);
    writeFileSync(join(root, '.design', 'BRIEF.md'), 'A calm editorial shop with a fast product finder.');
    const result = projectContext(root);
    assert.equal(result.stack.framework, 'Vue');
    assert.match(result.brief, /product finder/);
    assert.equal(result.briefTruncated, false);
    assert.ok(!result.detailedFiles.includes('.design/BRIEF.md'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('workflow scales review effort without prescribing a visual style', () => {
  const targeted = routeWorkflow({ scope: 'targeted', signature: 'standard' });
  assert.ok(targeted.steps.some(step => step.includes('full capture/audit only when')));
  assert.ok(!targeted.steps.some(step => step.includes('three genuinely different')));
  const threeD = routeWorkflow({ scope: 'new', signature: '3d' });
  assert.ok(threeD.steps.some(step => step.includes('geometry, material, lighting')));
  assert.match(threeD.styleRule, /never a visual aesthetic/);
  const review = routeWorkflow({ scope: 'review', signature: '3d' });
  assert.ok(review.steps.some(step => step.includes('Inspect the existing 3D')));
  assert.ok(!review.steps.some(step => step.includes('Render the placeholder')));
  assert.ok(!review.efficiency.some(step => step.includes('Compare directions')));
  assert.throws(() => routeWorkflow({ scope: 'landing' }), /Unknown scope/);
});

test('resource search retains usage and license uncertainty', () => {
  const result = searchResources('icons');
  assert.equal(result[0].name, 'Iconify');
  assert.equal(result[0].usage, 'link-only');
  assert.match(result[0].license, /Varies/);
});
