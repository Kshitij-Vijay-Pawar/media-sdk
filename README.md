# media-sdk

A modular Media SDK monorepo for searching and viewing curated photos and videos from Pexels, with pure TypeScript core logic, React / React Native wrappers, and headless UI components.

```
                         ┌──────────────┐
                         │   Web App    │
                         └──────┬───────┘
                                │
                 ┌──────────────┴──────────────┐
                 ↓                             ↓
          @media/react                  @media/ui-react
                 │                             │
                 ↓                             ↓
           @media/core                   (Headless UI)
                 │
                 ↓
            Pexels API
```

---

## Packages & Directory Map

| Package | Purpose | Dependencies | Documentation |
|---|---|---|---|
| [`@media/core`](./packages/media-core) | Framework-agnostic pure TypeScript SDK (caching, events, normalization, errors) | None (Native `fetch`) | [README](./packages/media-core/README.md) |
| [`@media/react`](./packages/media-react) | React Web platform wrapper (`MediaProvider`, declarative data hooks, stale request protection) | `@media/core`, `react` | [README](./packages/media-react/README.md) |
| [`@media/native`](./packages/media-native) | React Native platform wrapper with matching API contract and zero DOM dependencies | `@media/core`, `react`, `react-native` | [README](./packages/media-native/README.md) |
| [`@media/ui-react`](./packages/media-ui-react) | Headless UI hooks (`useGrid`, `useLightbox`, `useReelSwiper`) with prop-getters & zero CSS | `react` | [README](./packages/media-ui-react/README.md) |
| [`@media/ui-native`](./packages/media-ui-native) | Headless UI hooks for React Native (`FlatList` & `Modal` primitives) | `react`, `react-native` | [README](./packages/media-ui-native/README.md) |
| [`web`](./apps/web) | Demonstration Web application (Explore, Reels, Lightbox, Real-time Activity Log) | `@media/react`, `@media/ui-react` | [README](./apps/web/README.md) |

---

## Architectural Boundary Rules

The repository strictly enforces package isolation using ESLint Boundaries (`eslint-plugin-boundaries`):
1. **`@media/core`**: Imports NOTHING from any workspace package, React, DOM, or React Native.
2. **`@media/react`**: Imports ONLY from `@media/core` and `react`. Never imports from UI packages or application layers.
3. **`@media/native`**: Imports ONLY from `@media/core`, `react`, and `react-native`. Contains **zero DOM references** (`window`, `document`, `react-dom`).
4. **`@media/ui-react`**: Genuinely headless with generic `<T>` data models. Imports NOTHING from `@media/core`, `@media/react`, or `@media/native`. Ships **zero CSS**.
5. **`@media/ui-native`**: Headless React Native primitives. Imports NOTHING from core or platform wrappers.
6. **`apps/web`**: Imports exclusively from `@media/react` and `@media/ui-react`. Direct imports from `@media/core` are forbidden.

---

## Assignment Requirement Mapping

| Assignment Requirement | Implementation | Location |
|---|---|---|
| Core SDK | `@media/core` | [`packages/media-core/`](./packages/media-core) |
| React wrapper | `@media/react` | [`packages/media-react/`](./packages/media-react) |
| React Native wrapper | `@media/native` | [`packages/media-native/`](./packages/media-native) |
| Headless Web UI | `@media/ui-react` | [`packages/media-ui-react/`](./packages/media-ui-react) |
| Headless Native UI | `@media/ui-native` | [`packages/media-ui-native/`](./packages/media-ui-native) |
| Demo Web Application | Web app (`apps/web`) | [`apps/web/`](./apps/web) |
| AI Skill — Data Wiring | `SKILL.md` | [`skills/wiring-data/SKILL.md`](./skills/wiring-data/SKILL.md) |
| AI Skill — Headless Components | `SKILL.md` | [`skills/using-components/SKILL.md`](./skills/using-components/SKILL.md) |
| Curated / Trending Photos | `client.getCuratedPhotos()` / `useCuratedPhotos()` | Pexels `/v1/curated` |
| Popular / Trending Videos | `client.getPopularVideos()` / `usePopularVideos()` | Pexels `/videos/popular` |
| Media Event Tracking | `useMediaEvents()` | Live Activity Log + Console Logger |

---

## Setup & Running Locally

### Prerequisites
- [Bun](https://bun.sh) (v1.3+)

### 1. Install dependencies
```bash
bun install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Pexels API key:
```env
PEXELS_API_KEY=your_actual_pexels_api_key
```

### 3. Monorepo Commands
- **Build all packages & apps:**
  ```bash
  bun run build
  ```
- **Run all unit & integration tests:**
  ```bash
  bun run test
  ```
- **Run linting & boundary enforcement:**
  ```bash
  bun run lint
  ```
- **Start development server:**
  ```bash
  bun run dev
  ```

---

## Security & API Key Disclosure

```
Demo Architecture:
Browser Client → Pexels REST API (API key sent in Authorization header)

Production Architecture:
Browser Client → Backend API Proxy (Key stored in server vault) → Pexels API
```
> [!NOTE]
> In this client-side web demo, the Pexels API key is injected via `VITE_PEXELS_API_KEY` and transmitted via HTTP headers directly to Pexels. In an enterprise production deployment, network requests should be routed through a backend proxy or serverless edge function to conceal the API key from browser inspection.

---

## AI Skills Integration & Evaluation Evidence

This monorepo includes two specialized `SKILL.md` skill documents located in `skills/`:
1. **`media-sdk-data-wiring`** ([`skills/wiring-data/SKILL.md`](./skills/wiring-data/SKILL.md)): Steers AI coding assistants to correctly configure `<MediaProvider>`, use `@media/react` hooks, handle pagination/debouncing, and prevent direct `@media/core` imports.
2. **`media-ui-components`** ([`skills/using-components/SKILL.md`](./skills/using-components/SKILL.md)): Steers AI coding assistants to utilize genuinely headless prop-getter hooks from `@media/ui-react` with zero CSS assumptions and built-in accessibility.

### Concrete Evidence of AI Skill Steering

During development, the skills were evaluated against AI coding prompts to verify they measurably steer outputs:

#### Evidence 1: Data Wiring & Dependency Boundaries (`media-sdk-data-wiring`)
- **Without skill:**
  ```tsx
  // AI attempted to instantiate raw client in component:
  import { createMediaClient } from "@media/core";
  const client = createMediaClient({ apiKey: "..." });
  const [photos, setPhotos] = useState([]);
  useEffect(() => { client.searchPhotos(query).then(...) }, [query]);
  ```
  *Result:* Violated architectural boundaries (`@media/core` direct import in app) and missed Context sharing & automatic race-condition cancellation.
- **With skill:**
  ```tsx
  // AI properly wrapped root with MediaProvider and consumed hook:
  import { MediaProvider, useSearchPhotos } from "@media/react";
  const { data, loading, error, fetchNextPage, hasMore } = useSearchPhotos(debouncedQuery);
  ```
  *Result:* Clean architecture, passed boundary enforcement, correctly utilized SDK caching and pagination state.

#### Evidence 2: Headless Prop-Getter vs Pre-Styled Components (`media-ui-components`)
- **Without skill:**
  ```tsx
  // AI attempted to render a pre-styled rigid component:
  import { MediaGrid, LightboxModal } from "@media/ui-react";
  return <MediaGrid items={photos} theme="dark" />;
  ```
  *Result:* Violated headless requirements by assuming styled markup.
- **With skill:**
  ```tsx
  // AI generated headless hook with prop-getters and custom markup:
  import { useGrid } from "@media/ui-react";
  const { getGridProps, getItemProps, sentinelRef } = useGrid({
    data: photos,
    loading,
    hasMore,
    onLoadMore: fetchNextPage
  });
  return (
    <div {...getGridProps({ className: "custom-grid" })}>
      {photos.map((p, i) => <div key={p.id} {...getItemProps(p, i)}>{...}</div>)}
      <div ref={sentinelRef} />
    </div>
  );
  ```
  *Result:* Fully headless, accessible, and consumer-controlled markup and styling.

---

## Scoping Decisions & Tradeoffs

1. **Pure Headless over Pre-built Themes**: We chose the prop-getter pattern without bundling CSS to give complete layout authority to consumer apps while guaranteeing full ARIA accessibility and keyboard control.
2. **React Native Simplifications**: `@media/native` and `@media/ui-native` implement the exact same contract with `FlatList` and `Modal` primitives. Advanced native lifecycle integration (such as `AppState` pausing or SQLite persistent storage) is documented as an enhancement path.
3. **Runtime Schema Validation**: The core SDK normalizes responses into strictly typed camelCase models. Heavy runtime validation libraries (e.g. Zod) were omitted to preserve a zero-dependency lightweight core bundle footprint.
