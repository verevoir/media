import { describe, it, expect } from 'vitest';
import { imageProps } from '../src/render.js';
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

describe('imageProps', () => {
  it('should return src, srcSet, width, and height', () => {
    const asset = makeAsset();
    const props = imageProps(asset, 400, 300, config);

    expect(props.src).toContain('resize:fill:400:300');
    expect(props.srcSet).toContain('resize:fill:400:300');
    expect(props.srcSet).toContain('resize:fill:800:600');
    expect(props.width).toBe(400);
    expect(props.height).toBe(300);
  });

  it('should include hotspot gravity in src and srcSet', () => {
    const asset = makeAsset({ hotspot: { x: 0.5, y: 0.5 } });
    const props = imageProps(asset, 400, 300, config);

    expect(props.src).toContain('gravity:fp:0.5:0.5');
    expect(props.srcSet).toContain('gravity:fp:0.5:0.5');
  });
});
