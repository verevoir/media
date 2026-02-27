import { describe, it, expect } from 'vitest';
import { createAssetSource } from '../src/source.js';

function makeMockManager() {
  const assets = new Map<
    string,
    {
      id: string;
      filename: string;
      contentType: string;
      blobKey: string;
      width: number | null;
      height: number | null;
      hotspot: { x: number; y: number } | null;
    }
  >();

  assets.set('asset-1', {
    id: 'asset-1',
    filename: 'photo.jpg',
    contentType: 'image/jpeg',
    blobKey: 'blob-abc',
    width: 1920,
    height: 1080,
    hotspot: { x: 0.5, y: 0.3 },
  });

  assets.set('asset-2', {
    id: 'asset-2',
    filename: 'logo.svg',
    contentType: 'image/svg+xml',
    blobKey: 'blob-def',
    width: null,
    height: null,
    hotspot: null,
  });

  return {
    async get(id: string) {
      return assets.get(id) ?? null;
    },
    async list(options?: { limit?: number }) {
      const all = Array.from(assets.values());
      if (options?.limit) return all.slice(0, options.limit);
      return all;
    },
  };
}

const blobUrl = (blobKey: string) => `https://cdn.example.com/blobs/${blobKey}`;

describe('createAssetSource', () => {
  it('should resolve an asset by ID with correct URL', async () => {
    const source = createAssetSource({
      manager: makeMockManager(),
      blobUrl,
    });

    const info = await source.getAsset('asset-1');

    expect(info).not.toBeNull();
    expect(info!.id).toBe('asset-1');
    expect(info!.url).toBe('https://cdn.example.com/blobs/blob-abc');
    expect(info!.width).toBe(1920);
    expect(info!.height).toBe(1080);
    expect(info!.hotspot).toEqual({ x: 0.5, y: 0.3 });
    expect(info!.contentType).toBe('image/jpeg');
    expect(info!.filename).toBe('photo.jpg');
  });

  it('should return null for a missing asset', async () => {
    const source = createAssetSource({
      manager: makeMockManager(),
      blobUrl,
    });

    const info = await source.getAsset('nonexistent');

    expect(info).toBeNull();
  });

  it('should list all assets with correct URLs', async () => {
    const source = createAssetSource({
      manager: makeMockManager(),
      blobUrl,
    });

    const assets = await source.listAssets();

    expect(assets).toHaveLength(2);
    expect(assets[0].url).toBe('https://cdn.example.com/blobs/blob-abc');
    expect(assets[1].url).toBe('https://cdn.example.com/blobs/blob-def');
  });

  it('should pass limit option through', async () => {
    const source = createAssetSource({
      manager: makeMockManager(),
      blobUrl,
    });

    const assets = await source.listAssets({ limit: 1 });

    expect(assets).toHaveLength(1);
  });

  it('should handle null dimensions and hotspot', async () => {
    const source = createAssetSource({
      manager: makeMockManager(),
      blobUrl,
    });

    const info = await source.getAsset('asset-2');

    expect(info).not.toBeNull();
    expect(info!.width).toBeNull();
    expect(info!.height).toBeNull();
    expect(info!.hotspot).toBeNull();
  });
});
