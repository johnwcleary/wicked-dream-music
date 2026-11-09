import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Page = CollectionEntry<'pages'>['data'];
export type Service = CollectionEntry<'services'>;
export type Work = CollectionEntry<'work'>;

export async function getSite() {
  const entry = await getEntry('site', 'global');
  if (!entry) throw new Error('Missing src/content/site/global.json');
  return entry.data;
}

export async function getPage(id: string) {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`Missing src/content/pages/${id}.md`);
  return entry.data;
}

export async function getServices() {
  return (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
}

export async function getWork() {
  return (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
}

/** "01", "02", … for numbered labels. */
export const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Split a headline into two display lines, matching the mockup's
 * "Where music / meets vision." rhythm: the first line takes floor(n/2) words.
 */
export function splitHeadline(text: string): [string, string] {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return [text, ''];
  const cut = Math.floor(words.length / 2);
  return [words.slice(0, cut).join(' '), words.slice(cut).join(' ')];
}

/** Split a multi-paragraph body string into paragraphs. */
export const paragraphs = (body: string) =>
  body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/** Normalise a path for active-nav comparison. */
export const isCurrent = (href: string, path: string) =>
  href === '/' ? path === '/' : path.replace(/\/$/, '') === href.replace(/\/$/, '');

/** Monogram from a name: "Wicked Dream Music" → "WDM". */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase())
    .join('');

/** Fragment id for a collection entry, used for cross-page anchors. */
export const anchor = (id: string) => id.replace(/[^a-z0-9-]/gi, '-').toLowerCase();

/**
 * One-page site: each nav route maps to a section on home.
 * "/" → "/#top", "/services" → "/#services". Other hrefs pass through.
 */
export const toSection = (href: string) => {
  if (href === '/') return '/#top';
  const m = href.match(/^\/([a-z0-9-]+)\/?$/i);
  return m ? `/#${m[1]}` : href;
};

/** Section id for a nav route ("/work" → "work", "/" → "top"). */
export const sectionId = (href: string) => toSection(href).replace(/^\/#/, '');
