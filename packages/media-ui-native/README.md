# @media/ui-native

Headless UI component hooks for React Native using the prop-getter pattern.

Zero styles. 100% data-agnostic. Adapts React Native primitives (`FlatList`, `Modal`) to standard headless interfaces.

## Features

- **Genuinely Headless**: Supplies props for `FlatList`, `Modal`, and custom elements.
- **Generic `<T>` Architecture**: Works with any arbitrary data shape.
- **Zero Core / Wrapper Couplings**: 100% independent of `@media/core`, `@media/react`, and `@media/native`.

## Components

- **`useGrid<T>`**: Exposes `FlatList`-compatible props (`keyExtractor`, `onEndReached`, `onEndReachedThreshold`).
- **`useLightbox<T>`**: Exposes `Modal`-compatible overlay props (`visible`, `onRequestClose`), focus-free native navigation.
- **`useReelSwiper<T>`**: Exposes `FlatList` vertical snap-scroll props (`pagingEnabled`, `viewabilityConfig`, `onViewableItemsChanged`).
