/**
 * Prefix a root-relative path with `import.meta.env.BASE_URL`
 * so internal links work on GitHub Pages project sites (`/repo-name/`).
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return base + normalized;
}

/** Active nav item: exact section root or a nested path under it. */
export function isActivePath(pathname: string, rootPath: string): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/';
  const prefix = withBase(rootPath).replace(/\/$/, '') || '/';
  return normalized === prefix || normalized.startsWith(`${prefix}/`);
}
