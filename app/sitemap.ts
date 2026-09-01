import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/creator`, changeFrequency: 'monthly', priority: .7 },
    { url: `${base}/auth`, changeFrequency: 'yearly', priority: .4 },
  ];
}
