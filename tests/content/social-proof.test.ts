import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { listFixtureIds } from '../helpers/content-fixtures';

describe('cases and faq content', () => {
  it('loads the first social-proof entries for the launch version', async () => {
    const cases = await listFixtureIds(path.resolve('src/content/cases'), '.md');
    const faq = await listFixtureIds(path.resolve('src/content/faq'), '.json');

    expect(cases).toHaveLength(3);
    expect(faq).toEqual(
      expect.arrayContaining([
        'kak-bystro-nazvaete-tsenu',
        'kak-otpravit-foto',
        'mozhno-li-otpravit-foto-v-messendzhere',
        'est-li-zabor-i-dostavka',
        'skolko-zanimaet-rabota',
        'chto-nuzhno-dlia-otsenki',
      ]),
    );
  });
});
