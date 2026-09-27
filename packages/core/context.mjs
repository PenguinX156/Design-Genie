import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { scanProject } from './scan.mjs';

export function projectContext(root) {
  const scan = scanProject(root);
  const briefPath = join(root, '.design', 'BRIEF.md');
  const brief = existsSync(briefPath) ? readFileSync(briefPath, 'utf8') : null;
  return {
    project: root,
    stack: { framework: scan.framework, packageManager: scan.packageManager, styling: scan.styling, components: scan.components, motion: scan.motion, threeD: scan.threeD },
    brief: brief && brief.length <= 4000 ? brief : brief?.slice(0, 4000) ?? null,
    briefTruncated: Boolean(brief && brief.length > 4000),
    detailedFiles: scan.tokenFiles.filter(file => file.startsWith('.design/') && file !== '.design/BRIEF.md'),
    next: brief ? 'Use the brief, then open only detailed files relevant to this task.' : 'Run design init and fill .design/BRIEF.md before major design work.'
  };
}
