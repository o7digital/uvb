import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export const sourceRoot = join(process.cwd(), 'public', 'uvb.edu.mx');

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
  return getHtmlFiles(sourceRoot).map(routeFromFile).filter(Boolean);
}

export function getMirrorSourcePath(slug: string): string {
  const cleanSlug = slug;
  const directHtml = join(sourceRoot, `${cleanSlug}.html`);
  const indexHtml = join(sourceRoot, cleanSlug, 'index.html');

  if (existsSync(directHtml)) {
    return directHtml;
  }

  return indexHtml;
}
