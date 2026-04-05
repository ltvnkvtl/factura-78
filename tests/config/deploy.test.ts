import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

describe('deploy files', () => {
  it('contains a static Docker + Nginx setup for the built dist output', async () => {
    const dockerfile = await readFile('Dockerfile', 'utf8');
    const nginx = await readFile('nginx/factura78.conf', 'utf8');

    expect(dockerfile).toContain('COPY --from=build /app/dist /usr/share/nginx/html');
    expect(nginx).toContain('root /usr/share/nginx/html;');
    expect(nginx).toContain('error_page 404 /404.html;');
  });
});
