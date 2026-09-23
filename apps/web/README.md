# Web Demo Application (`apps/web`)

Demonstration client for the Media SDK monorepo, showing end-to-end integration between `@media/react` and `@media/ui-react`.

## Architecture & Wiring

- **Data Layer**: `@media/react` (`MediaProvider`, `useCuratedPhotos`, `useSearchPhotos`, `usePopularVideos`, `useSearchVideos`, `useMediaEvents`).
- **UI Layer**: `@media/ui-react` (`useGrid`, `useLightbox`, `useReelSwiper`).
- **Composition**: The web app only contains composition/wiring logic and custom styling — zero business logic.
- **Dependency Rule**: Imports exclusively from `@media/react` and `@media/ui-react`. Direct imports from `@media/core` are disallowed by architecture boundary rules.

## Features

1. **Explore & Search View**:
   - Debounced search with `useDeferredValue`.
   - Toggle between **Photos** and **Videos**.
   - Infinite scroll grid with `useGrid` and sentinel element.
   - Graceful loading, error, and empty states.
2. **Headless Media Lightbox**:
   - Polymorphic media support (full-res images and video playback).
   - Global keyboard navigation (`Escape`, `ArrowLeft`, `ArrowRight`).
   - Dispatches `view` event on item transition.
   - Dispatches `download` event when user clicks download.
3. **Reels Swiper View**:
   - Vertical snap-scrolling video feed with `useReelSwiper`.
   - 60% viewport intersection threshold for active reel detection.
   - Autoplay active video, pause inactive videos.
   - Dispatches `view` event when active slide changes.
4. **Realtime Activity Log**:
   - Floating dock subscribing to live SDK events (`view` & `download`) via `useMediaEvents()`.

## Development

```bash
bun run dev
```
