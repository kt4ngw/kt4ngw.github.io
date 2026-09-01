import type { MetadataRoute } from 'next';

const SITE_URL = 'https://kt4ngw.github.io';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{
    path: string;
    changeFrequency: 'weekly' | 'monthly';
    priority: number;
  }> = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/publications/', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/services/', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/awards/', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/cv/', changeFrequency: 'monthly', priority: 0.8 },
  ];

  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
