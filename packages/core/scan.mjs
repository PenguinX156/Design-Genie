import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const ignored = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'coverage', '.design']);
const depsFor = (all, names) => names.filter(name => all[name]).map(name => `${name}@${all[name]}`);

function filesUnder(root, max = 700) {
  const found = [];
  const visit = (dir, depth) => {
    if (depth > 5 || found.length >= max) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (ignored.has(entry.name)) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) visit(path, depth + 1);
      else if (entry.isFile()) found.push(relative(root, path).replaceAll('\\', '/'));
      if (found.length >= max) return;
    }
  };
  visit(root, 0);
  return found;
}

export function scanProject(root) {
  const packagePath = join(root, 'package.json');
  const pkg = existsSync(packagePath) ? JSON.parse(readFileSync(packagePath, 'utf8')) : {};
  const all = { ...pkg.dependencies, ...pkg.devDependencies };
  const files = filesUnder(root);
  const has = name => files.includes(name);
  const framework = all.next ? `Next.js ${all.next}`
    : all.nuxt ? 'Nuxt'
    : all['@remix-run/react'] ? 'Remix'
    : all['@angular/core'] ? 'Angular'
    : all.astro ? 'Astro'
    : all['@sveltejs/kit'] ? 'SvelteKit'
    : all.vue ? 'Vue'
    : all.react ? 'React'
    : all.svelte ? 'Svelte'
    : all['solid-js'] ? 'Solid'
    : all.vite ? 'Vite (vanilla)'
    : has('index.html') ? 'Static HTML' : 'Unknown';
  const packageManager = has('pnpm-lock.yaml') ? 'pnpm' : has('yarn.lock') ? 'Yarn' : has('bun.lockb') || has('bun.lock') ? 'Bun' : has('package-lock.json') ? 'npm' : pkg.packageManager || 'Unknown';
  const styling = [all.tailwindcss && 'Tailwind CSS', all['styled-components'] && 'styled-components', all['@emotion/react'] && 'Emotion', files.some(f => /\.module\.css$/.test(f)) && 'CSS Modules', files.some(f => /\.css$/.test(f)) && 'CSS'].filter(Boolean);
  const components = depsFor(all, ['@radix-ui/react-dialog', '@radix-ui/react-slot', '@base-ui/react', '@mui/material', 'antd', '@chakra-ui/react']);
  if (has('components.json')) components.push('shadcn/ui configuration');
  const textFiles = files.filter(f => /\.(css|tsx|jsx|html)$/.test(f)).slice(0, 80);
  const sampledText = textFiles.map(f => { try { return readFileSync(join(root, f), 'utf8').slice(0, 16000); } catch { return ''; } }).join('\n');
  const fontFamilies = [...sampledText.matchAll(/font(?:-family)?\s*:\s*([^;\n}]+)/gi)].map(m => {
    const value = m[1].trim();
    const shorthand = value.match(/\d+(?:px|rem|em)(?:\/[\d.]+)?\s+(.+)$/i);
    return (shorthand ? shorthand[1] : value).trim();
  });
  return {
    project: root,
    framework,
    reactVersion: all.react || null,
    packageManager,
    styling,
    components,
    motion: depsFor(all, ['motion', 'framer-motion', 'gsap', 'lenis']),
    icons: depsFor(all, ['lucide-react', '@iconify/react', '@tabler/icons-react', '@phosphor-icons/react', 'react-icons']),
    threeD: depsFor(all, ['three', '@react-three/fiber', '@react-three/drei', 'ogl']),
    fonts: [...new Set(fontFamilies)].slice(0, 12),
    tokenFiles: [...files.filter(f => /(^|\/)(tokens?|theme)(\.|\/)|tailwind\.config/i.test(f)), ...(existsSync(join(root, '.design')) ? readdirSync(join(root, '.design'), { withFileTypes: true }).filter(f => f.isFile() && /\.(json|md)$/i.test(f.name)).map(f => `.design/${f.name}`) : [])].slice(0, 30),
    structure: files.filter(f => /(^|\/)(app|pages|src|components)\//.test(f)).slice(0, 30),
    fileCountSampled: files.length,
    truncated: files.length >= 700
  };
}
