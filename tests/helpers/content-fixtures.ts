import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

export async function readJsonFixture<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, 'utf8')) as T;
}

export async function listFixtureIds(dirPath: string, extension: string): Promise<string[]> {
  const entries = await readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => path.basename(entry.name, extension));
}

export async function readMarkdownScalar(filePath: string, key: string): Promise<string> {
  const source = await readFile(filePath, 'utf8');
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) throw new Error(`Missing frontmatter in ${filePath}`);

  const pattern = new RegExp(`^${key}:\\s*(.+)$`, 'm');
  const match = frontmatter[1].match(pattern);
  if (!match) throw new Error(`Missing ${key} in ${filePath}`);

  return match[1].replace(/^"(.*)"$/, '$1').trim();
}
