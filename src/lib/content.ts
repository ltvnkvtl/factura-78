import { getCollection, getEntry } from 'astro:content';

export async function getSiteSettings() {
  const settings = await getEntry('settings', 'site');
  if (!settings) throw new Error('Missing settings/site.json');
  return settings.data;
}

export async function getSitePage(id: 'home' | 'services' | 'prices' | 'delivery' | 'contacts' | 'faq') {
  const page = await getEntry('sitePages', id);
  if (!page) throw new Error(`Missing site page: ${id}`);
  return page;
}

export async function getOrderedServices() {
  const services = await getCollection('services');
  return services.sort((a, b) => a.data.order - b.data.order);
}

export async function getOrderedCases() {
  const cases = await getCollection('cases');
  return cases.sort((a, b) => a.data.order - b.data.order);
}

export async function getOrderedFaq() {
  const faq = await getCollection('faq');
  return faq.sort((a, b) => a.data.order - b.data.order);
}

export function getPrimaryCtaHref(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  if (settings.telegramUrl) return settings.telegramUrl;
  if (settings.whatsappUrl) return settings.whatsappUrl;
  if (settings.phoneE164) return `tel:${settings.phoneE164}`;
  return '/kontakty/';
}
