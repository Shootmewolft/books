const configuredUrl = process.env['NEXT_PUBLIC_SITE_URL'];

export const SITE_URL = configuredUrl === undefined ? 'http://localhost:3000' : configuredUrl;
