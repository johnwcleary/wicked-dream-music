/** Geometry of the client's wordmark, read from the traced SVG asset. */
import raw from '../assets/brand/logo.svg?raw';

export const logoViewBox = raw.match(/viewBox="([^"]+)"/)?.[1] ?? '28 19 2002 1391';
export const logoPath = raw.match(/\sd="([^"]+)"/)?.[1] ?? '';
const [, , w = 2002, h = 1391] = logoViewBox.split(/\s+/).map(Number);
export const logoSize = { width: w, height: h };
