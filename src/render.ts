import type { AssetInfo, ImgproxyConfig } from './types.js';
import { buildImageUrl, buildSrcSet } from './url.js';

export interface ImageProps {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

/**
 * Generate `<img>` tag props for a media asset at a given display size.
 *
 * Returns `src` (1x), `srcSet` (1x + 2x), and explicit `width`/`height`
 * for use in `<img>` elements on the rendering/output side.
 */
export function imageProps(
  asset: AssetInfo,
  width: number,
  height: number,
  config: ImgproxyConfig,
): ImageProps {
  return {
    src: buildImageUrl(asset, { width, height }, config),
    srcSet: buildSrcSet(asset, width, height, config),
    width,
    height,
  };
}
