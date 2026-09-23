---
name: media-ui-components
description: How to use @media/ui-react headless hooks (Grid, Lightbox, Reel Swiper) with prop-getters and custom markup.
---

# Using Headless Components with `@media/ui-react`

This guide explains how to use `@media/ui-react` headless hooks using the **prop-getter pattern** to build accessible, custom-styled media interfaces.

---

## 1. What is Headless?

> [!IMPORTANT]
> **Headless = Behavior + State + Accessibility (Zero CSS & Zero Rendered DOM)**
> The `@media/ui-react` package never renders UI elements and ships zero CSS. It only exports React hooks that return **prop-getters**. You (the consumer) control 100% of the JSX markup and CSS styling.

### Dependency Rule:
- `@media/ui-react` has **zero dependencies** on `@media/core`, `@media/react`, or `@media/native`.
- All hooks accept generic `<T>` item collections.

---

## 2. Prop-Getter Pattern Fundamentals

Prop-getters are functions returned by hooks (e.g. `getGridProps()`, `getItemProps()`) that return an object containing event handlers, ARIA attributes, and data attributes.

### How to use:
1. Spread the prop-getter onto your HTML element.
2. Pass custom props into the getter function to safely merge or override attributes.

```tsx
// Spreading default props
<div {...getGridProps()} />

// Passing custom class names or attributes
<div {...getGridProps({ className: "my-custom-grid", id: "photos" })} />

// Merging event handlers
<div {...getItemProps(item, index, {
  onClick: (e) => {
    console.log("Card clicked", item.id);
  }
})} />
```

---

## 3. Hook 1: `useGrid<T>` (Infinite Scroll & A11y Grid)

Manages grid accessibility, item roles, and intersection-based infinite scrolling.

### Hook Signature
```ts
const { getGridProps, getItemProps, items, isLoading, sentinelRef } = useGrid<T>({
  data: items,
  loading: isFetching,
  hasMore: hasMoreItems,
  onLoadMore: fetchNextPage,
  getItemKey: (item) => item.id,
});
```

### Complete Implementation Example
```tsx
import React from "react";
import { useGrid } from "@media/ui-react";
import { useSearchPhotos, type Photo } from "@media/react";

export function InfinitePhotoGrid({ query }: { query: string }) {
  const { data, loading, error, fetchNextPage, hasMore } = useSearchPhotos(query);

  const { getGridProps, getItemProps, sentinelRef } = useGrid<Photo>({
    data,
    loading,
    hasMore,
    onLoadMore: fetchNextPage,
    getItemKey: (item) => item.id,
  });

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div {...getGridProps({ className: "custom-grid-layout" })}>
      {data.map((photo, index) => (
        <div
          key={photo.id}
          {...getItemProps(photo, index, { className: "grid-item-card" })}
        >
          <img src={photo.src.medium} alt={photo.alt} />
          <span>{photo.photographer}</span>
        </div>
      ))}

      {/* Sentinel element observed for infinite scroll */}
      <div ref={sentinelRef} className="scroll-sentinel">
        {loading && <div>Loading more...</div>}
      </div>
    </div>
  );
}
```

### A11y Attributes Applied Automatically
- `getGridProps()`: `role="grid"`, `aria-busy={loading ? true : undefined}`
- `getItemProps(item, index)`: `role="gridcell"`, `data-index={index}`, `data-key={key}`

---

## 4. Hook 2: `useLightbox<T>` (Accessible Dialog & Lightbox)

Manages dialog state, keyboard navigation (`Escape`, `ArrowLeft`, `ArrowRight`), focus trapping, and body scroll lock with automatic restoration.

### Hook Signature
```ts
const {
  isOpen,
  currentItem,
  currentIndex,
  open,
  close,
  next,
  prev,
  getOverlayProps,
  getContentProps,
  getCloseButtonProps,
  getNextButtonProps,
  getPrevButtonProps,
} = useLightbox<T>({
  items,
  onClose: () => console.log("Closed"),
  onNavigate: (index, item) => console.log("Navigated to", index),
});
```

### Complete Implementation Example
```tsx
import React from "react";
import { useLightbox } from "@media/ui-react";

export function CustomLightbox<T extends { url: string; title: string }>({
  items,
  isOpen,
  selectedIndex,
  onClose,
}: {
  items: T[];
  isOpen: boolean;
  selectedIndex: number;
  onClose: () => void;
}) {
  const lightbox = useLightbox<T>({
    items,
    onClose,
  });

  React.useEffect(() => {
    if (isOpen && !lightbox.isOpen) {
      lightbox.open(selectedIndex);
    }
  }, [isOpen, selectedIndex, lightbox]);

  if (!lightbox.isOpen || !lightbox.currentItem) return null;

  const current = lightbox.currentItem;

  return (
    <div {...lightbox.getOverlayProps({ className: "lightbox-backdrop" })}>
      <div {...lightbox.getContentProps({ className: "lightbox-panel" })}>
        <button {...lightbox.getCloseButtonProps({ className: "btn-close" })}>
          ✕
        </button>

        <button {...lightbox.getPrevButtonProps({ className: "btn-nav prev" })}>
          ‹
        </button>

        <img src={current.url} alt={current.title} />

        <button {...lightbox.getNextButtonProps({ className: "btn-nav next" })}>
          ›
        </button>
      </div>
    </div>
  );
}
```

### A11y Attributes Applied Automatically
- `getOverlayProps()`: `role="dialog"`, `aria-modal="true"`, backdrop click-to-close.
- `getContentProps()`: `aria-label="Media Lightbox Dialog"`, click propagation stopped.
- `getPrevButtonProps()`: `aria-label="Previous item"`, `disabled` when at index `0`.
- `getNextButtonProps()`: `aria-label="Next item"`, `disabled` when at last index.
- `getCloseButtonProps()`: `aria-label="Close lightbox"`.

---

## 5. Hook 3: `useReelSwiper<T>` (Vertical Reel / Video Paging)

Manages snap-scrolling video reels, using intersection ratios (`0.6` threshold) to detect which item is currently active without flickering.

### Hook Signature
```ts
const { getContainerProps, getSlideProps, activeIndex, activeItem, scrollTo } =
  useReelSwiper<T>({
    items,
    threshold: 0.6,
    onActiveChange: (index, item) => console.log("Active changed:", index),
  });
```

### Complete Implementation Example
```tsx
import React, { useRef, useEffect } from "react";
import { useReelSwiper } from "@media/ui-react";

export function ReelsList<T extends { id: string | number; videoUrl: string }>({
  videos,
}: {
  videos: T[];
}) {
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  const { getContainerProps, getSlideProps, activeIndex } = useReelSwiper<T>({
    items: videos,
    threshold: 0.6,
  });

  // Autoplay active video, pause others
  useEffect(() => {
    videoRefs.current.forEach((el, idx) => {
      if (idx === activeIndex) {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    });
  }, [activeIndex]);

  return (
    <div {...getContainerProps({ className: "reels-snap-container" })}>
      {videos.map((video, index) => (
        <div
          key={video.id}
          {...getSlideProps(video, index, { className: "reel-slide-item" })}
        >
          <video
            ref={(el) => {
              if (el) videoRefs.current.set(index, el);
              else videoRefs.current.delete(index);
            }}
            src={video.videoUrl}
            loop
            muted
            playsInline
          />
        </div>
      ))}
    </div>
  );
}
```

### Recommended CSS for Reels Snap Scroll
```css
.reels-snap-container {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

.reel-slide-item {
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

---

## 6. Critical Anti-Patterns ❌

- ❌ **NEVER** import `@media/core` or `@media/react` inside `@media/ui-react` code — UI packages must remain 100% framework/provider agnostic.
- ❌ **NEVER** hardcode Pexels-specific models (`Photo`, `Video`) into UI component hooks — always use generic `<T>`.
- ❌ **NEVER** overwrite prop-getter event handlers without preserving the original callback.
- ❌ **NEVER** omit the `<div ref={sentinelRef} />` element when using `useGrid` for infinite scroll.