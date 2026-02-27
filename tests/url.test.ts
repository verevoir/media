import { describe, it, expect } from 'vitest';
import { buildImageUrl, buildSrcSet } from '../src/url.js';
import type { AssetInfo, ImgproxyConfig } from '../src/types.js';

const config: ImgproxyConfig = {
  baseUrl: 'https://imgproxy.example.com',
};

function makeAsset(overrides?: Partial<AssetInfo>): AssetInfo {
  return {
    id: 'asset-1',
    url: 'https://cdn.example.com/blobs/abc123',
    width: 1920,
    height: 1080,
    hotspot: null,
    contentType: 'image/jpeg',
    filename: 'photo.jpg',
    ...overrides,
  };
}

describe('buildImageUrl', () => {
  it('should produce a deterministic URL with fill fit', () => {
    const asset = makeAsset();
    const url = buildImageUrl(asset, { width: 400, height: 300 }, config);

    expect(url).toBe(
      'https://imgproxy.example.com/resize:fill:400:300/plain/https://cdn.example.com/blobs/abc123',
    );
  });

  it('should include gravity when hotspot exists and fit is fill', () => {
    const asset = makeAsset({ hotspot: { x: 0.3, y: 0.7 } });
    const url = buildImageUrl(asset, { width: 400, height: 300 }, config);

    expect(url).toBe(
      'https://imgproxy.example.com/resize:fill:400:300/gravity:fp:0.3:0.7/plain/https://cdn.example.com/blobs/abc123',
    );
  });

  it('should omit gravity when hotspot exists but fit is not fill', () => {
    const asset = makeAsset({ hotspot: { x: 0.5, y: 0.5 } });
    const url = buildImageUrl(
      asset,
      { width: 400, height: 300, fit: 'fit' },
      config,
    );

    expect(url).toBe(
      'https://imgproxy.example.com/resize:fit:400:300/plain/https://cdn.example.com/blobs/abc123',
    );
  });

  it('should omit gravity when no hotspot exists', () => {
    const asset = makeAsset({ hotspot: null });
    const url = buildImageUrl(asset, { width: 400, height: 300 }, config);

    expect(url).not.toContain('gravity');
  });

  it('should use auto fit when specified', () => {
    const asset = makeAsset();
    const url = buildImageUrl(
      asset,
      { width: 800, height: 600, fit: 'auto' },
      config,
    );

    expect(url).toContain('resize:auto:800:600');
  });

  it('should strip trailing slashes from baseUrl', () => {
    const asset = makeAsset();
    const url = buildImageUrl(
      asset,
      { width: 400, height: 300 },
      { baseUrl: 'https://imgproxy.example.com///' },
    );

    expect(url.startsWith('https://imgproxy.example.com/resize:')).toBe(true);
  });

  it('should be deterministic — same inputs produce same output', () => {
    const asset = makeAsset({ hotspot: { x: 0.5, y: 0.5 } });
    const resize = { width: 400, height: 300 };

    const url1 = buildImageUrl(asset, resize, config);
    const url2 = buildImageUrl(asset, resize, config);

    expect(url1).toBe(url2);
  });
});

describe('buildSrcSet', () => {
  it('should produce 1x and 2x entries', () => {
    const asset = makeAsset();
    const srcSet = buildSrcSet(asset, 400, 300, config);

    const entries = srcSet.split(', ');
    expect(entries).toHaveLength(2);
    expect(entries[0].endsWith(' 1x')).toBe(true);
    expect(entries[1].endsWith(' 2x')).toBe(true);
  });

  it('should use double dimensions for 2x', () => {
    const asset = makeAsset();
    const srcSet = buildSrcSet(asset, 400, 300, config);

    expect(srcSet).toContain('resize:fill:400:300');
    expect(srcSet).toContain('resize:fill:800:600');
  });

  it('should include hotspot gravity in both entries when fit is fill', () => {
    const asset = makeAsset({ hotspot: { x: 0.3, y: 0.7 } });
    const srcSet = buildSrcSet(asset, 400, 300, config);

    const entries = srcSet.split(', ');
    expect(entries[0]).toContain('gravity:fp:0.3:0.7');
    expect(entries[1]).toContain('gravity:fp:0.3:0.7');
  });
});
