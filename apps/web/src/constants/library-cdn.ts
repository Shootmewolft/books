const configured = process.env['LIBRARY_CDN_URL'];

export const LIBRARY_CDN_URL =
  configured === undefined || configured === '' ? null : configured.replace(/\/+$/, '');
