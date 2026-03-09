# @verevoir/media

Display concern for Verevoir assets — deterministic imgproxy URL builder, AssetSource abstraction, image/video block definitions, and React editor components.

## What It Does

- **URL Builder** — `buildImageUrl()` and `buildSrcSet()` produce deterministic imgproxy URLs from asset metadata and resize options.
- **AssetSource** — pluggable interface for resolving asset metadata. Decoupled from `@verevoir/assets` via structural typing.
- **Block Definitions** — `imageBlock` and `videoBlock` via `defineBlock` from `@verevoir/schema`.
- **React Components** — `ImageField` (asset picker + preview), `HotspotOverlay` (click-to-set focal point), context providers.
- **Rendering Helper** — `imageProps()` returns ready-made `<img>` tag attributes.

## Install

```bash
npm install @verevoir/media
```

Peer dependencies: `react`, `react-dom` (optional — only needed for React components).

## Quick Example

```typescript
import { createAssetSource, buildImageUrl, imageProps } from '@verevoir/media';

// Bridge an AssetManager to the AssetSource interface
const source = createAssetSource({
  manager,
  blobUrl: (key) => `https://cdn.example.com/blobs/${key}`,
});

// Build a resize URL
const asset = await source.getAsset('asset-id');
const url = buildImageUrl(
  asset,
  { width: 400, height: 300 },
  { baseUrl: 'https://imgproxy.example.com' },
);
// → https://imgproxy.example.com/resize:fill:400:300/plain/https://cdn.example.com/blobs/...

// Get <img> tag props
const props = imageProps(asset, 400, 300, {
  baseUrl: 'https://imgproxy.example.com',
});
// { src, srcSet, width, height }
```

### React Usage

```tsx
import {
  AssetSourceProvider,
  ImgproxyConfigProvider,
  ImageField,
  HotspotOverlay,
} from '@verevoir/media';

function App() {
  return (
    <AssetSourceProvider source={source}>
      <ImgproxyConfigProvider
        config={{ baseUrl: 'https://imgproxy.example.com' }}
      >
        <ImageField value={assetId} onChange={setAssetId} label="Hero Image" />
        <HotspotOverlay
          src={imageUrl}
          hotspot={hotspot}
          onChange={setHotspot}
        />
      </ImgproxyConfigProvider>
    </AssetSourceProvider>
  );
}
```

## API

### URL Builder

| Export                                 | Description                                               |
| -------------------------------------- | --------------------------------------------------------- |
| `buildImageUrl(asset, resize, config)` | Deterministic imgproxy URL with optional hotspot gravity  |
| `buildSrcSet(asset, w, h, config)`     | 1x + 2x srcSet string                                     |
| `imageProps(asset, w, h, config)`      | Returns `{ src, srcSet, width, height }` for `<img>` tags |

### AssetSource

| Export                                    | Description                                           |
| ----------------------------------------- | ----------------------------------------------------- |
| `AssetSource`                             | Interface: `getAsset(id)`, `listAssets(options?)`     |
| `createAssetSource({ manager, blobUrl })` | Bridge AssetManager → AssetSource (structural typing) |

### Block Definitions

| Export       | Fields                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------- |
| `imageBlock` | `asset` (reference), `alt` (text, optional), `displayWidth` (number), `displayHeight` (number) |
| `videoBlock` | Same as image + `autoplay` (boolean), `loop` (boolean)                                         |

### React Components

| Export                                           | Description                                  |
| ------------------------------------------------ | -------------------------------------------- |
| `AssetSourceProvider` / `useAssetSource()`       | Context for asset resolution                 |
| `ImgproxyConfigProvider` / `useImgproxyConfig()` | Context for imgproxy config                  |
| `ImageField`                                     | Asset picker dropdown with thumbnail preview |
| `HotspotOverlay`                                 | Click-to-set focal point with visual marker  |

### Types

| Type             | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `Hotspot`        | `{ x: number, y: number }` — 0–1 normalised focal point          |
| `AssetInfo`      | Resolved asset metadata with HTTP URL                            |
| `ResizeOptions`  | `{ width, height, fit? }` — fit: `'fill'` \| `'fit'` \| `'auto'` |
| `ImgproxyConfig` | `{ baseUrl, key?, salt? }` — HMAC fields reserved for future     |

## Architecture

| File              | Responsibility                                                                  |
| ----------------- | ------------------------------------------------------------------------------- |
| `src/types.ts`    | Core interfaces: Hotspot, AssetInfo, AssetSource, ResizeOptions, ImgproxyConfig |
| `src/url.ts`      | `buildImageUrl()` and `buildSrcSet()` — deterministic URL generation            |
| `src/source.ts`   | `createAssetSource()` — AssetManager bridge via structural typing               |
| `src/render.ts`   | `imageProps()` — `<img>` tag attribute generator                                |
| `src/blocks/`     | `imageBlock` and `videoBlock` definitions                                       |
| `src/components/` | React contexts and editor components                                            |
| `src/index.ts`    | Public API exports                                                              |

## Design Decisions

- **No runtime dependency on `@verevoir/assets`** — uses structural typing (duck typing).
- **Display, not persistence** — never stores data; reads metadata and produces URLs.
- **Deterministic URLs** — same inputs always produce the same URL, enabling CDN caching.
- **Unsigned URLs for v1** — HMAC signing reserved for future via `key`/`salt` fields.
- **Sharp-free** — no image processing. imgproxy handles all resizing at serve time.

## Development

```bash
npm install    # Install dependencies
make build     # Compile TypeScript
make test      # Run test suite
make lint      # Check formatting
```
