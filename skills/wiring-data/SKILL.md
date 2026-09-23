---
name: media-sdk-data-wiring
description: How to set up and use @media/react hooks for data fetching, API-key configuration, and event tracking in a React app.
---

# Wiring Data with `@media/react`

This guide explains how to properly configure, fetch data from, and integrate the `@media/react` platform wrapper into React applications.

---

## 1. Package Boundary & Dependency Rules

> [!IMPORTANT]
> **Strict Rule:** Applications must import ONLY from `@media/react`. Never import directly from `@media/core`.

```tsx
// ✅ Correct:
import { MediaProvider, useSearchPhotos, useMediaEvents, type Photo } from "@media/react";

// ❌ WRONG: Do NOT import from @media/core in application code
import { createMediaClient } from "@media/core"; 
```

---

## 2. Provider Setup (`MediaProvider`)

The entire React tree (or subtree using media services) must be wrapped with `<MediaProvider>`.

```tsx
// main.tsx or App.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { MediaProvider } from "@media/react";
import App from "./App";

const apiKey = import.meta.env.VITE_PEXELS_API_KEY;

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MediaProvider apiKey={apiKey} cacheTTL={5 * 60 * 1000}>
      <App />
    </MediaProvider>
  </React.StrictMode>
);
```

### Provider Props

| Prop | Type | Description |
|---|---|---|
| `apiKey` | `string` | **Required.** Pexels API key. |
| `baseUrl` | `string` | Optional. Defaults to `https://api.pexels.com`. |
| `cacheTTL`| `number` | Optional. Cache TTL in milliseconds (default: 5 min). |
| `children`| `ReactNode` | Children components. |

> [!WARNING]
> If any `@media/react` hook is called outside `<MediaProvider>`, it will throw an error:
> `useMediaClient must be used within a MediaProvider.`

---

## 3. Data Hooks Reference

All data list hooks return the exact same pagination contract:

```ts
interface UsePaginatedReturn<T> {
  data: T[];
  loading: boolean;
  error: MediaError | null;
  fetchNextPage: () => Promise<void>;
  hasMore: boolean;
  totalResults: number;
  page: number;
}
```

### 3.1 Search Photos (`useSearchPhotos`)

Fetches paginated photos matching a search query.

```tsx
import { useSearchPhotos } from "@media/react";

export function PhotoSearch({ debouncedQuery }: { debouncedQuery: string }) {
  const { data, loading, error, fetchNextPage, hasMore } = useSearchPhotos(
    debouncedQuery,
    { perPage: 20 }
  );

  if (loading && data.length === 0) return <div>Loading photos...</div>;
  if (error) return <div>Error: {error.message} (Code: {error.code})</div>;

  return (
    <div>
      <div className="grid">
        {data.map((photo) => (
          <img key={photo.id} src={photo.src.medium} alt={photo.alt} />
        ))}
      </div>
      {hasMore && (
        <button onClick={fetchNextPage} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
```

### 3.2 Search Videos (`useSearchVideos`)

```tsx
import { useSearchVideos } from "@media/react";

const { data, loading, error, fetchNextPage, hasMore } = useSearchVideos(
  debouncedQuery,
  { perPage: 15 }
);
```

### 3.3 Curated Photos (`useCuratedPhotos`)

Fetches curated / trending photos from Pexels (ideal default state when no search query is typed).

```tsx
import { useCuratedPhotos } from "@media/react";

const { data, loading, error, fetchNextPage, hasMore } = useCuratedPhotos({
  perPage: 15,
});
```

### 3.4 Popular Videos (`usePopularVideos`)

Fetches trending videos (ideal for video feeds and reels).

```tsx
import { usePopularVideos } from "@media/react";

const { data, loading, error, fetchNextPage, hasMore } = usePopularVideos({
  perPage: 15,
});
```

### 3.5 Single Item Hooks (`usePhoto`, `useVideo`)

Fetch single items by ID.

```tsx
import { usePhoto, useVideo } from "@media/react";

const { data: photo, loading, error } = usePhoto(photoId);
const { data: video, loading: vLoading, error: vError } = useVideo(videoId);
```

---

## 4. Search Debouncing Guidance

> [!IMPORTANT]
> **Debouncing is an application concern, NOT built into hooks.**
> The SDK hooks execute immediately whenever their query parameter changes. Always debounce the input in the UI component before passing it to the hook.

### Recommended Pattern: `useDeferredValue` (React 19 / 18)

```tsx
import { useState, useDeferredValue } from "react";
import { useSearchPhotos, useCuratedPhotos } from "@media/react";

export function SearchContainer() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());

  // Show curated photos when query is empty, switch to search when typed
  const curated = useCuratedPhotos({ perPage: 16 });
  const search = useSearchPhotos(deferredQuery, { perPage: 16 });

  const activeData = deferredQuery ? search : curated;

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search photos..."
      />
      {/* render activeData */}
    </div>
  );
}
```

---

## 5. Event Tracking System (`useMediaEvents`)

Listen to or emit media events across the application lifecycle.

```tsx
import { useEffect, useCallback } from "react";
import { useMediaEvents } from "@media/react";

export function MediaViewer({ item }) {
  const { emit, on } = useMediaEvents();

  // 1. Subscribe to events
  useEffect(() => {
    const unsub = on("view", (event) => {
      console.log(`[Event Received] Item ${event.id} viewed`);
    });
    return unsub; // Clean up on unmount
  }, [on]);

  // 2. Emit 'view' on meaningful transition
  const handleOpen = () => {
    emit("view", {
      mediaType: "photo",
      id: item.id,
      timestamp: Date.now(),
    });
  };

  // 3. Emit 'download' when download is triggered
  const handleDownload = () => {
    emit("download", {
      mediaType: "photo",
      id: item.id,
      url: item.src.original,
      timestamp: Date.now(),
    });
    window.open(item.src.original, "_blank");
  };

  return (
    <div>
      <button onClick={handleOpen}>Open</button>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}
```

---

## 6. Error Handling (`MediaError`)

All hook errors return typed `MediaError` objects:

```tsx
if (error) {
  switch (error.code) {
    case "AUTH":
      return <div>Invalid or missing Pexels API key.</div>;
    case "RATE_LIMIT":
      return <div>API rate limit exceeded. Please wait a moment.</div>;
    case "NETWORK":
      return <div>Network connection error. Check your internet connection.</div>;
    case "NOT_FOUND":
      return <div>Requested media item could not be found.</div>;
    default:
      return <div>Error: {error.message}</div>;
  }
}
```

---

## 7. Decision Matrix: Which Hook to Use?

| Scenario | Recommended Hook |
|---|---|
| User is searching photos by keyword | `useSearchPhotos(debouncedQuery, options)` |
| User is searching videos by keyword | `useSearchVideos(debouncedQuery, options)` |
| Initial unsearched photos feed / hero | `useCuratedPhotos(options)` |
| Video reels / trending video feed | `usePopularVideos(options)` |
| Detail page or single photo view | `usePhoto(id)` |
| Detail page or single video view | `useVideo(id)` |
| Listening to SDK events / custom logging | `useMediaEvents()` |
| Direct client escape hatch | `useMediaClient()` |

---

## 8. Critical Anti-Patterns ❌

- ❌ **NEVER** import from `@media/core` directly in app code — import from `@media/react`.
- ❌ **NEVER** call the raw Pexels REST API using `fetch` or `axios` — use SDK hooks.
- ❌ **NEVER** build a secondary caching system in React state/Context — the SDK already caches in memory with TTL.
- ❌ **NEVER** pass `apiKey` as a prop to child components — pass it once to `<MediaProvider>`.
- ❌ **NEVER** place search debouncing inside the wrapper hooks — debounce in the app layer.