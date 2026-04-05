import { describe, expect, it } from 'vitest';
import { getCollection } from 'astro:content';

describe('cases and faq content', () => {
  it('loads the first social-proof entries for the launch version', async () => {
    const cases = await getCollection('cases');
    const faq = await getCollection('faq');

    expect(cases).toHaveLength(3);
    expect(faq.map((entry) => entry.id)).toEqual(
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
