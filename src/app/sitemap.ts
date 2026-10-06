import type { MetadataRoute } from 'next';
import { getConfig } from '@/lib/config';
import { getLastModified } from '@/lib/lastUpdated';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getConfig();
  const lastModified = getLastModified();

  return config.navigation
    .filter((item) => item.type === 'page')
    .map((item) => ({
      // Pages are exported with trailing slashes, matching their canonical URLs.
      url: `${config.site.url}${item.href.endsWith('/') ? item.href : `${item.href}/`}`,
      lastModified,
    }));
}
