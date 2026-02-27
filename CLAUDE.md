# @nextlake/media — Media Display

Display concern for NextLake assets — deterministic URL builder for imgproxy, AssetSource abstraction, and rendering helpers.

## What It Does

- **URL Builder** — `buildImageUrl()` and `buildSrcSet()` produce deterministic imgproxy URLs from asset metadata and resize options. Pure functions, no side effects.
- **AssetSource** — pluggable interface for resolving asset metadata. Decoupled from `@nextlake/assets` via structural typing (duck typing).
- **Adapter** — `createAssetSource()` bridges a NextLake `AssetManager` to the `AssetSource` interface. Developer provides a `blobUrl` function to map blob keys to HTTP URLs.

## Design Principles

- **No runtime dependency on `@nextlake/assets`** — uses structural typing. The adapter accepts any object matching the `AssetManagerLike` shape.
- **Display, not persistence** — this package never stores data. It reads asset metadata and produces URLs.
- **Unsigned URLs for v1** — `ImgproxyConfig` reserves `key`/`salt` fields for future HMAC signing.
- **Deterministic URLs** — same inputs always produce the same URL, enabling CDN caching.

## Quick Example

```typescript
import { createAssetSource, buildImageUrl } from '@nextlake/media';
import { AssetManager, MemoryBlobStore } from '@nextlake/assets';
import { MemoryAdapter } from '@nextlake/storage';

// Bridge AssetManager to AssetSource
const source = createAssetSource({
  manager,
  blobUrl: (key) => `https://cdn.example.com/blobs/${key}`,
});

// Resolve asset and build a resize URL
const asset = await source.getAsset('asset-id');
const url = buildImageUrl(
  asset,
  { width: 400, height: 300 },
  { baseUrl: 'https://imgproxy.example.com' },
);
// → https://imgproxy.example.com/resize:fill:400:300/plain/https://cdn.example.com/blobs/...
```

## Setup

```bash
npm install
```

## Commands

```bash
make build   # Compile TypeScript
make test    # Run test suite
make lint    # Lint and check formatting
make run     # No-op (library)
```

## Architecture

- `src/types.ts` — Core interfaces: Hotspot, AssetInfo, AssetSource, ResizeOptions, ImgproxyConfig.
- `src/url.ts` — `buildImageUrl()` and `buildSrcSet()` — deterministic imgproxy URL generation.
- `src/source.ts` — `createAssetSource()` — bridges AssetManager to AssetSource via structural typing.
- `src/index.ts` — Public API exports.

## Dependencies

- **No** runtime dependencies
- **No** dependency on `@nextlake/assets` (structural typing only)
