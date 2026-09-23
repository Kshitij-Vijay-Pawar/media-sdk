# @media/react

Idiomatic React Web platform wrapper for `@media/core`.

Provides Context and Hooks to seamlessly integrate Pexels media operations into React web applications with zero business logic and declarative state management.

## Features

- **Context Provider (`MediaProvider`)**: Holds a single, stable `@media/core` client across re-renders.
- **Declarative Hooks**: `useSearchPhotos`, `useSearchVideos`, `useCuratedPhotos`, `usePopularVideos`, `usePhoto`, `useVideo`, `useMediaEvents`, `useMediaClient`.
- **Stale Request Handling**: Automatic race condition prevention when queries change quickly.
- **Built-in Infinite Pagination**: Includes `fetchNextPage`, `hasMore`, `totalResults`, and automatic item accumulation.
- **Zero Business Logic**: Only maps network promises and core client operations into React lifecycle and state.
- **Core Types Re-exported**: All types from `@media/core` are directly available.

## Installation

```bash
bun add @media/react @media/core
```

## Quick Start

### 1. Wrap with `MediaProvider`

```tsx
import React from "react";
import { MediaProvider } from "@media/react";
import { App } from "./App";

export function Root() {
  return (
    <MediaProvider apiKey={process.env.PEXELS_API_KEY!} cacheTTL={5 * 60 * 1000}>
      <App />
    </MediaProvider>
  );
}
```

### 2. Search Photos with Infinite Pagination

```tsx
import React from "react";
import { useSearchPhotos } from "@media/react";

export function PhotoSearch({ debouncedQuery }: { debouncedQuery: string }) {
  const { data, loading, error, fetchNextPage, hasMore } = useSearchPhotos(
    debouncedQuery,
    { perPage: 20 }
  );

  if (loading && data.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="grid">
        {data.map((photo) => (
          <img key={photo.id} src={photo.src.medium} alt={photo.alt} />
        ))}
      </div>
      {hasMore && (
        <button onClick={fetchNextPage} disabled={loading}>
          {loading ? "Loading more..." : "Load More"}
        </button>
      )}
    </div>
  );
}
```

### 3. Subscribe & Emit Events

```tsx
import { useEffect } from "react";
import { useMediaEvents } from "@media/react";

export function Tracker() {
  const { on, emit } = useMediaEvents();

  useEffect(() => {
    const unsub = on("view", (event) => {
      console.log("Media viewed:", event);
    });
    return unsub;
  }, [on]);

  return (
    <button
      onClick={() =>
        emit("view", { mediaType: "photo", id: 123, timestamp: Date.now() })
      }
    >
      Track View
    </button>
  );
}
```
