import type { MetadataRoute } from 'next';

import { SITE_NAME } from '@/constants/site-name';
import { SITE_SHORT_NAME } from '@/constants/site-short-name';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: 'A curated library of software engineering books with a built-in reader.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0d12',
    theme_color: '#0b0d12',
    categories: ['books', 'education', 'productivity'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
