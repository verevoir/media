// Types
export type {
  Hotspot,
  AssetInfo,
  AssetSource,
  ResizeOptions,
  ImgproxyConfig,
} from './types.js';

// URL builder
export { buildImageUrl, buildSrcSet } from './url.js';

// AssetSource adapter
export { createAssetSource } from './source.js';
export type { CreateAssetSourceOptions } from './source.js';

// Block definitions
export { imageBlock } from './blocks/image.js';
export { videoBlock } from './blocks/video.js';

// React contexts
export {
  AssetSourceProvider,
  useAssetSource,
} from './components/AssetSourceContext.js';
export type { AssetSourceProviderProps } from './components/AssetSourceContext.js';
export {
  ImgproxyConfigProvider,
  useImgproxyConfig,
} from './components/ImgproxyConfigContext.js';
export type { ImgproxyConfigProviderProps } from './components/ImgproxyConfigContext.js';

// React components
export { ImageField } from './components/ImageField.js';
export type { ImageFieldProps } from './components/ImageField.js';
export { HotspotOverlay } from './components/HotspotOverlay.js';
export type { HotspotOverlayProps } from './components/HotspotOverlay.js';

// Rendering helpers
export { imageProps } from './render.js';
export type { ImageProps } from './render.js';
