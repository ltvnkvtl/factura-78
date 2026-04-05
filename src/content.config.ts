import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const settings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/settings' }),
  schema: z.object({
    brandName: z.string(),
    siteUrl: z.string().url(),
    city: z.literal('Санкт-Петербург'),
    defaultTheme: z.enum(['dark', 'light']),
    primaryCtaLabel: z.string(),
    secondaryCtaLabel: z.string(),
    phoneE164: z.string().optional(),
    phoneDisplay: z.string().optional(),
    telegramUrl: z.string().url().optional(),
    whatsappUrl: z.string().url().optional(),
    addressText: z.string().optional(),
    scheduleText: z.array(z.string()).min(1),
    yandexMetrikaId: z.string().optional(),
    googleSiteVerification: z.string().optional(),
    yandexVerification: z.string().optional(),
  }),
});

const sitePages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/site-pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    heroTitle: z.string().optional(),
    heroLead: z.string().optional(),
    order: z.number().optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    excerpt: z.string(),
    order: z.number(),
    priceNote: z.string(),
    turnaround: z.string(),
    city: z.literal('Санкт-Петербург'),
    relatedFaq: z.array(z.string()).default([]),
  }),
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    excerpt: z.string(),
    service: reference('services'),
    order: z.number(),
    finishedAt: z.string(),
    result: z.array(z.string()).min(2),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number(),
    services: z.array(z.string()).default([]),
  }),
});

const districts = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/districts' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    summary: z.string(),
    deliveryNote: z.string(),
  }),
});

export const collections = { settings, sitePages, services, cases, faq, districts };
