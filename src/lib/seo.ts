type BreadcrumbItem = { name: string; href: string };

export function canonicalFromPath(siteUrl: string, pathname: string) {
  return new URL(pathname, siteUrl).toString();
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.href })),
  };
}

export function buildOrganizationSchema(settings: {
  brandName: string; siteUrl: string; city: string; phoneDisplay?: string; addressText?: string; scheduleText: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.brandName,
    url: settings.siteUrl,
    areaServed: settings.city,
    telephone: settings.phoneDisplay,
    openingHours: settings.scheduleText,
    address: settings.addressText ? { '@type': 'PostalAddress', streetAddress: settings.addressText, addressLocality: settings.city } : undefined,
  };
}
