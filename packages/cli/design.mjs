#!/usr/bin/env node
import { resolve } from 'node:path';
import { scanProject } from '../core/scan.mjs';
import { initMemory } from '../core/memory.mjs';
import { searchResources } from '../core/resources.mjs';
import { routeWorkflow } from '../core/workflow.mjs';
import { projectContext } from '../core/context.mjs';

const [command, ...args] = process.argv.slice(2);
const option = (name, fallback) => { const index = args.indexOf(`--${name}`); return index < 0 ? fallback : args[index + 1]; };
const project = resolve(option('project', process.cwd()));
const url = option('url');
const print = value => console.log(typeof value === 'string' ? value : JSON.stringify(value, null, 2));

const directions = `# Art direction worksheet\n\nProduct, users, business model, primary task, trust, density, sophistication, personality, emotional tone:\n\nFor each of three conceptually different directions, record:\n- Concept and product rationale; first-screen focal point and primary action\n- Type, color, surface, geometry, iconography, layout, density, depth\n- Real content, imagery, responsive composition, and component states\n- Motion, possible 3D, one to three signature moments, fallback\n- Accessibility risks and performance cost\n\nChoose one direction, explain why it fits, and explain why the others do not. Record the decision in .design/. See references/website-quality.md.`;
const critique = `# Rendered critique worksheet\n\nInspect .design/DESIGN.md and desktop/tablet/mobile captures. Exercise navigation, focus, hover, and relevant loading/empty/error states. For 3D, inspect fallback/live parity, a rotated view, and the during-drag capture.\n\nFor each finding: severity (critical/high/medium/low), screenshot or interaction evidence, user impact, concrete fix, and verification after recapture.\n\nRate product fit, hierarchy, typography, composition, identity, content/imagery, interaction, responsive behavior, motion, accessibility, and performance from 1 to 5 with evidence. Do not use the score as an automatic pass. Stop after three rounds unless a critical issue remains. See references/critique-rubric.md and references/website-quality.md.`;

try {
  switch (command) {
    case 'scan': print(scanProject(project)); break;
    case 'context': print(projectContext(project)); break;
    case 'init': print(initMemory(project)); break;
    case 'workflow': print(routeWorkflow({ scope: option('scope', 'new'), signature: option('signature', 'standard') })); break;
    case 'directions': print(directions); break;
    case 'resources': print(searchResources(option('query', ''))); break;
    case 'critique': print(critique); break;
    case 'capture':
    case 'audit': {
      if (!url) throw new Error(`--url is required for ${command}`);
      const mod = await import('../visual-audit/browser.mjs');
      print(await (command === 'capture' ? mod.capture(project, url) : mod.audit(project, url)));
      break;
    }
    case 'probe': {
      if (!url) throw new Error('--url is required for probe');
      const mod = await import('../visual-audit/browser.mjs');
      print(await mod.probe(project, url, {
        selector: option('selector'), viewport: option('viewport', 'desktop'),
        action: option('action', 'none'), trigger: option('trigger'), ready: option('ready'), warmReady: option('warm-ready'),
        profileMs: Number(option('profile-ms', 0))
      }));
      break;
    }
    case 'baseline': print((await import('../visual-audit/browser.mjs')).saveBaseline(project)); break;
    case 'diff': print((await import('../visual-audit/browser.mjs')).diffBaseline(project)); break;
    default: print('Usage: design <scan|context|init|workflow|directions|resources|probe|capture|audit|critique|baseline|diff> [--project PATH] [--scope new|redesign|targeted|review] [--signature standard|interactive|3d] [--url URL] [--query TEXT] [--selector CSS] [--viewport desktop|tablet|mobile] [--action none|click|drag] [--trigger CSS] [--ready CSS] [--warm-ready CSS] [--profile-ms 1200]'); process.exitCode = command ? 1 : 0;
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
