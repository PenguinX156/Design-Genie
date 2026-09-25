import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const template = fileURLToPath(new URL('../../templates/design-memory/', import.meta.url));

export function initMemory(root) {
  const target = join(root, '.design');
  mkdirSync(target, { recursive: true });
  const created = [];
  const skipped = [];
  for (const name of readdirSync(template)) {
    const dest = join(target, name);
    if (existsSync(dest)) skipped.push(name);
    else { cpSync(join(template, name), dest); created.push(name); }
  }
  return { target, created, skipped };
}
