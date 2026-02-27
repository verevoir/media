import type { AssetInfo, ImgproxyConfig, ResizeOptions } from './types.js';

/**
 * Build a deterministic imgproxy URL for an image resize.
 *
 * Format: {baseUrl}/resize:{fit}:{w}:{h}/gravity:fp:{x}:{y}/plain/{sourceUrl}
 * Gravity is only included when a hotspot exists and fit is 'fill'.
 */
export function buildImageUrl(
  asset: AssetInfo,
  resize: ResizeOptions,
  config: ImgproxyConfig,
): string {
  const fit = resize.fit ?? 'fill';
  const base = config.baseUrl.replace(/\/+$/, '');

  const parts = [`/resize:${fit}:${resize.width}:${resize.height}`];

  if (asset.hotspot && fit === 'fill') {
    parts.push(`/gravity:fp:${asset.hotspot.x}:${asset.hotspot.y}`);
  }

  parts.push(`/plain/${asset.url}`);

  return `${base}${parts.join('')}`;
}

/**
 * Build a srcSet string with 1x and 2x entries for responsive images.
 */
export function buildSrcSet(
  asset: AssetInfo,
  displayWidth: number,
  displayHeight: number,
  config: ImgproxyConfig,
): string {
  const url1x = buildImageUrl(
    asset,
    { width: displayWidth, height: displayHeight },
    config,
  );
  const url2x = buildImageUrl(
    asset,
    { width: displayWidth * 2, height: displayHeight * 2 },
    config,
  );

  return `${url1x} 1x, ${url2x} 2x`;
}
