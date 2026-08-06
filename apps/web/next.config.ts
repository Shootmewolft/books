import type { NextConfig } from 'next';

const ONE_YEAR_IMMUTABLE = 'public, max-age=31536000, immutable';

const config: NextConfig = {
  cacheComponents: true,

  images: {
    formats: ['image/webp'],
  },

  outputFileTracingRoot: new URL('../../', import.meta.url).pathname,

  async headers() {
    return [
      {
        source: '/api/file/:path*',
        headers: [{ key: 'Cache-Control', value: ONE_YEAR_IMMUTABLE }],
      },
    ];
  },
};

export default config;
