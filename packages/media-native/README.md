# @media/native

Idiomatic React Native platform wrapper for `@media/core`.

Provides Context and Hooks adhering to identical contracts as `@media/react` while respecting React Native platform constraints (zero DOM dependencies, zero browser globals).

## Features

- **Zero DOM / Browser Dependencies**: Free from `window`, `document`, `react-dom`, or browser-only APIs.
- **Identical API Contract**: Seamless mental model parity with `@media/react`.
- **Declarative State & Stale Request Protection**: Handles fast re-renders and network race conditions out-of-the-box.
- **No Secondary Cache or Business Logic**: Fully relies on `@media/core`'s configured memory cache and normalization.

## React Native Architecture & Considerations

### 1. Zero DOM Guarantee
`@media/native` only imports from `react` and `@media/core`. All browser-specific concepts are omitted so the bundle compiles cleanly on iOS, Android, and web targets.

### 2. App Lifecycle & Background Sync (Tradeoffs / Future Enhancements)
In a full production React Native environment, additional platform integrations can be layered on top:
- **`AppState` Integration**: Subscribing to `AppState.addEventListener('change')` to pause in-flight polling or invalidate stale cache entries upon foregrounding.
- **Persistent Offline Storage**: Swapping the in-memory cache store in `@media/core` with an `AsyncStorage` or SQLite/MMKV-backed cache provider for offline-first resilience.
- **NetInfo Connectivity Awareness**: Deferring failed network requests until network reconnects.

## Installation

```bash
bun add @media/native @media/core
```

## Usage

```tsx
import React from "react";
import { MediaProvider, useSearchPhotos } from "@media/native";
import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";

export function PhotoSearchScreen({ query }: { query: string }) {
  const { data, loading, error, fetchNextPage, hasMore } = useSearchPhotos(query);

  if (loading && data.length === 0) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item.src.medium }}
          style={{ width: "100%", height: 200 }}
        />
      )}
      onEndReached={() => {
        if (hasMore) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
    />
  );
}
```
