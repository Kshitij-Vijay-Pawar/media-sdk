# @media/core

Pure, framework-agnostic TypeScript SDK for Pexels media operations.

## Features

- **Portable & Lightweight**: Zero external HTTP dependencies, uses standard native `fetch`.
- **Structured Data & Normalization**: Automatically transforms Pexels snake_case responses into clean, fully-typed camelCase models (`Photo`, `Video`, `PhotoSource`, etc.).
- **In-Memory Caching & Request De-duplication**: Automatic TTL-based caching and in-flight promise de-duplication to optimize network performance.
- **Typed Event Emitter**: Flexible analytics / lifecycle hooks for `view` and `download` events with built-in default logging.
- **Robust Error Handling**: Structured `MediaError` classifications (`AUTH`, `NOT_FOUND`, `RATE_LIMIT`, `NETWORK`, `UNKNOWN`).

> **Note on Runtime Validation:** The SDK trusts the Pexels API contract and types after normalization. Runtime schema validation (e.g. Zod or Valibot) can be added as a consumer-level enhancement without adding bloated bundle dependencies to core.

## Installation

```bash
bun add @media/core
```

## Quick Start

```ts
import { createMediaClient } from "@media/core";

const client = createMediaClient({
  apiKey: "your-pexels-api-key",
  cacheTTL: 5 * 60 * 1000, // Optional: 5 minutes cache TTL
});

// Search curated photos
const photos = await client.searchPhotos("mountains", { page: 1, perPage: 10 });
console.log(`Found ${photos.totalResults} photos:`, photos.data);

// Search popular videos
const videos = await client.getPopularVideos({ page: 1, perPage: 5 });
console.log("Popular videos:", videos.data);

// Listen to events
client.on("view", (event) => {
  console.log("Media viewed:", event.mediaType, event.id);
});
```
