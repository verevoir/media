/** Focal point of an image, normalised to 0–1 range */
export interface Hotspot {
  x: number; // 0.0 (left) to 1.0 (right)
  y: number; // 0.0 (top) to 1.0 (bottom)
}

/** Asset information returned by an AssetSource */
export interface AssetInfo {
  id: string;
  url: string; // HTTP URL to the original blob
  width: number | null;
  height: number | null;
  hotspot: Hotspot | null;
  contentType: string;
  filename: string;
}

/** Pluggable interface for resolving asset metadata. Decoupled from @nextlake/assets. */
export interface AssetSource {
  getAsset(id: string): Promise<AssetInfo | null>;
  listAssets(options?: { limit?: number }): Promise<AssetInfo[]>;
}

/** Options for resizing an image via imgproxy */
export interface ResizeOptions {
  width: number;
  height: number;
  fit?: 'fill' | 'fit' | 'auto'; // default 'fill'
}

/** Configuration for an imgproxy instance */
export interface ImgproxyConfig {
  baseUrl: string; // e.g. 'https://imgproxy.example.com'
  key?: string; // HMAC key (future)
  salt?: string; // HMAC salt (future)
}
