# Intent — @verevoir/media

## Purpose

Handle the display side of assets — build deterministic image URLs for imgproxy, provide React components for asset selection and preview, and bridge the gap between the assets package (persistence) and the editor (UI) without coupling them directly.

## Goals

- Deterministic URL generation: same inputs always produce the same imgproxy URL, enabling CDN caching
- Decouple asset persistence from asset display — the media package never stores data
- Provide ready-to-use React components for image fields, hotspot editing, and asset picking
- Work with any asset backend, not just `@verevoir/assets`

## Non-goals

- Store or manage assets — that is the assets package's job
- Run imgproxy — the developer deploys their own instance
- Handle image processing — imgproxy does the resizing; this package only builds URLs
- Sign URLs in v1 — `ImgproxyConfig` reserves key/salt fields for future HMAC signing

## Key design decisions

- **Separate from assets.** Assets is a persistence concern (upload, store, retrieve). Media is a display concern (URLs, components, rendering). Separating them means a project can use the media package's URL builder without depending on the assets package at all.
- **Structural typing, no import.** The `AssetSource` interface and `createAssetSource` adapter use structural typing (duck typing) — no runtime import of `@verevoir/assets`. Any object matching the `AssetManagerLike` shape works. This avoids a hard dependency and keeps the package tree clean.
- **imgproxy specifically.** imgproxy is open-source, self-hosted, and produces deterministic URLs from a simple path convention. This fits NextLake's "library, not platform" philosophy — the developer runs their own image proxy rather than depending on a SaaS.
- **Block definitions included.** `imageBlock` and `videoBlock` are defined here using `@verevoir/schema` so the schema engine is the only dependency. These blocks standardise how images and videos are referenced in content.

## Constraints

- Depends on `@verevoir/schema` (for block definitions and field types)
- No runtime dependency on `@verevoir/assets`
- React and react-dom are peer dependencies
- URL generation must be pure — no side effects, no network calls
