import type { AssetInfo, AssetSource } from './types.js';

/**
 * Structural type for an asset manager — duck typed to avoid importing @verevoir/assets.
 * Any object matching this shape will work.
 */
interface AssetManagerLike {
  get(id: string): Promise<{
    id: string;
    filename: string;
    contentType: string;
    blobKey: string;
    width: number | null;
    height: number | null;
    hotspot: { x: number; y: number } | null;
  } | null>;
  list(options?: { limit?: number }): Promise<
    Array<{
      id: string;
      filename: string;
      contentType: string;
      blobKey: string;
      width: number | null;
      height: number | null;
      hotspot: { x: number; y: number } | null;
    }>
  >;
}

export interface CreateAssetSourceOptions {
  /** An AssetManager instance (or any object matching the structural type) */
  manager: AssetManagerLike;
  /** Maps a blob key to an HTTP URL the browser/imgproxy can fetch */
  blobUrl: (blobKey: string) => string;
}

/**
 * Create an AssetSource backed by a Verevoir AssetManager.
 *
 * Uses structural typing — no import of @verevoir/assets required.
 * The developer provides a `blobUrl` function that maps blob keys to
 * HTTP URLs (e.g. S3 presigned URLs, local dev server, CDN paths).
 */
export function createAssetSource(
  options: CreateAssetSourceOptions,
): AssetSource {
  const { manager, blobUrl } = options;

  function toAssetInfo(asset: {
    id: string;
    filename: string;
    contentType: string;
    blobKey: string;
    width: number | null;
    height: number | null;
    hotspot: { x: number; y: number } | null;
  }): AssetInfo {
    return {
      id: asset.id,
      url: blobUrl(asset.blobKey),
      width: asset.width,
      height: asset.height,
      hotspot: asset.hotspot,
      contentType: asset.contentType,
      filename: asset.filename,
    };
  }

  return {
    async getAsset(id: string): Promise<AssetInfo | null> {
      const asset = await manager.get(id);
      if (!asset) return null;
      return toAssetInfo(asset);
    },

    async listAssets(options?: { limit?: number }): Promise<AssetInfo[]> {
      const assets = await manager.list(options);
      return assets.map(toAssetInfo);
    },
  };
}
