# @media/ui-react

Headless, accessible UI component hooks using the prop-getter pattern.

Zero CSS. Zero assumptions about markup. 100% independent of API providers or data shapes.

## Features

- **Genuinely Headless**: Exposes state and behavior via React hooks and prop-getters. Consumer provides all markup and styling.
- **Generic `<T>` Architecture**: Works with any arbitrary data shape (not tied to Pexels or any particular SDK).
- **Zero API / Platform Couplings**: Does not import from `@media/core` or `@media/react`.
- **Accessible by Default (a11y)**: Automatically injects appropriate ARIA roles, states, keyboard navigation, focus trapping, and body scroll locks.

---

## 1. `useGrid<T>` — Infinite Scroll & Accessible Grid

```tsx
import React from "react";
import { useGrid } from "@media/ui-react";

export function PhotoGrid({ items, loading, hasMore, onLoadMore }) {
  const { getGridProps, getItemProps, sentinelRef } = useGrid({
    data: items,
    loading,
    hasMore,
    onLoadMore,
    getItemKey: (item) => item.id,
  });

  return (
    <div {...getGridProps({ className: "my-grid" })}>
      {items.map((item, idx) => (
        <div key={item.id} {...getItemProps(item, idx, { className: "my-grid-item" })}>
          <img src={item.imageUrl} alt={item.title} />
        </div>
      ))}
      <div ref={sentinelRef} />
    </div>
  );
}
```

---

## 2. `useLightbox<T>` — Media Dialog & Focus Management

```tsx
import React from "react";
import { useLightbox } from "@media/ui-react";

export function MediaModal({ items }) {
  const {
    isOpen,
    currentItem,
    open,
    getOverlayProps,
    getContentProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPrevButtonProps,
  } = useLightbox({ items });

  if (!isOpen || !currentItem) return null;

  return (
    <div {...getOverlayProps({ className: "lightbox-overlay" })}>
      <div {...getContentProps({ className: "lightbox-content" })}>
        <button {...getCloseButtonProps()}>✕</button>
        <button {...getPrevButtonProps()}>‹</button>
        <img src={currentItem.url} alt={currentItem.title} />
        <button {...getNextButtonProps()}>›</button>
      </div>
    </div>
  );
}
```

---

## 3. `useReelSwiper<T>` — Fullscreen Media Reel / Carousel

```tsx
import React from "react";
import { useReelSwiper } from "@media/ui-react";

export function VideoReels({ reels }) {
  const { getContainerProps, getSlideProps, activeIndex } = useReelSwiper({
    items: reels,
    threshold: 0.6,
  });

  return (
    <div {...getContainerProps({ className: "reels-container" })}>
      {reels.map((reel, idx) => (
        <div key={reel.id} {...getSlideProps(reel, idx, { className: "reel-slide" })}>
          <video src={reel.videoUrl} autoPlay={idx === activeIndex} loop />
        </div>
      ))}
    </div>
  );
}
```
