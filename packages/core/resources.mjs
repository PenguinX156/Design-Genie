import { readFileSync } from 'node:fs';

const catalog = JSON.parse(readFileSync(new URL('../../resources/catalog.json', import.meta.url), 'utf8'));

export function searchResources(query = '') {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return catalog.map(item => ({ ...item, score: terms.reduce((score, term) => score + (item.name.toLowerCase().includes(term) ? 3 : 0) + item.tags.filter(tag => tag.includes(term)).length + (item.description.toLowerCase().includes(term) ? 1 : 0), 0) }))
    .filter(item => !terms.length || item.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}
