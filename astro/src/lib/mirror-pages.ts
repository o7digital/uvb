import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export const sourceRoot = join(process.cwd(), 'src', 'mirror', 'uvb.edu.mx');
const sourceOrigin = 'https://uvb.edu.mx';
const assetPrefixes = [
  '/wp-content/',
  '/wp-includes/',
  '/wp-json/',
  '/xmlrpc.php',
  '/reynosa/wp-content/',
  '/reynosa/wp-includes/',
  '/reynosa/wp-json/',
  '/reynosa/xmlrpc.php',
];

function getHtmlFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const entryPath = join(directory, entry);

    if (statSync(entryPath).isDirectory()) {
      return getHtmlFiles(entryPath);
    }

    return entry.endsWith('.html') ? [entryPath] : [];
  });
}

function routeFromFile(filePath: string): string | null {
  const relativePath = relative(sourceRoot, filePath).split(sep).join('/');

  if (relativePath === 'index.html') {
    return null;
  }

  if (relativePath === 'reynosa.html') {
    return 'reynosa';
  }

  return relativePath.replace(/\/index\.html$/, '').replace(/\.html$/, '');
}

export function getMirrorRoutes(): string[] {
  const excludedPrefixes = ['wp-json', 'xmlrpc.php', 'feed', 'comments/feed'];

  return getHtmlFiles(sourceRoot)
    .map(routeFromFile)
    .filter((route): route is string => Boolean(route))
    .filter((route) => !excludedPrefixes.some((prefix) => route === prefix || route.startsWith(`${prefix}/`)))
    .filter((route) => !route.includes('/wp-json') && !route.includes('/xmlrpc.php') && !route.endsWith('/feed') && !route.includes('/comments/feed'))
    .sort((a, b) => a.localeCompare(b));
}

export function getMirrorSourcePath(slug: string): string {
  const cleanSlug = slug.trim().replace(/^\/+|\/+$/g, '');
  const directHtml = join(sourceRoot, `${cleanSlug}.html`);
  const indexHtml = join(sourceRoot, cleanSlug, 'index.html');

  if (existsSync(directHtml)) {
    return directHtml;
  }

  if (!existsSync(indexHtml)) {
    throw new Error(`Mirror source file not found for slug "${slug}"`);
  }

  return indexHtml;
}

function localizeInternalUrl(match: string, pathname: string): string {
  if (assetPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return `${sourceOrigin}${pathname}`.replace(sourceOrigin, '/uvb.edu.mx');
  }

  return pathname || '/';
}

export function localizeInternalUrls(html: string): string {
  let cleaned = html
    .replaceAll(`${sourceOrigin}/`, '/')
    .replaceAll(sourceOrigin, '/')
    .replace(/\/(?:wp-content|wp-includes|wp-json|xmlrpc\.php|reynosa\/(?:wp-content|wp-includes|wp-json|xmlrpc\.php))(?:[^"' <)]*)/g, (match) =>
      localizeInternalUrl(match, match),
    );

  // Remove legacy WordPress discovery/feed metadata that is not needed on static output.
  cleaned = cleaned
    .replace(/<link rel="alternate" type="application\/rss\+xml"[^>]*>\s*/g, '')
    .replace(/<link rel="alternate" title="oEmbed \(JSON\)"[^>]*>\s*/g, '')
    .replace(/<link rel="alternate" title="oEmbed \(XML\)"[^>]*>\s*/g, '');

  // Use a single robots directive.
  cleaned = cleaned
    .replace(/<meta name='robots' content='max-image-preview:large' \/>\s*/g, '')
    .replace(
      /<meta name="robots" content="index, follow" \/>/g,
      '<meta name="robots" content="index, follow, max-image-preview:large" />',
    );

  // Normalize canonical links to absolute production URLs.
  cleaned = cleaned.replace(
    /<link rel="canonical" href="\/([^"]*)" \/>/g,
    (_match, path: string) => `<link rel="canonical" href="${sourceOrigin}/${path}" />`,
  );

  return cleaned;
}

export function readMirrorHtml(filePath: string): string {
  return localizeInternalUrls(readFileSync(filePath, 'utf-8'));
}
