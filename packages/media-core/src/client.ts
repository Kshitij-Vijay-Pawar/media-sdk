import {
  createHttpClient,
  DEFAULT_BASE_URL,
  DEFAULT_CACHE_TTL,
  type HttpClient,
} from "./http";
import { createMemoryCache, generateCacheKey, type CacheStore } from "./cache";
import { createEventEmitter, type EventEmitter, type EventHandler } from "./events";
import { MediaError } from "./errors";
import {
  normalizePaginatedPhotos,
  normalizePaginatedVideos,
  normalizePhoto,
  normalizeVideo,
  type RawPaginatedResponse,
  type RawPhoto,
  type RawVideo,
} from "./normalize";
import type {
  MediaCoreConfig,
  MediaEvents,
  PaginatedResponse,
  PaginationParams,
  Photo,
  Video,
} from "./types";

export type SearchPhotosParams = PaginationParams;
export type SearchVideosParams = PaginationParams;
export type GetCuratedPhotosParams = PaginationParams;
export type GetPopularVideosParams = PaginationParams;

/**
 * Primary Media Client interface for interacting with Pexels API.
 */
export interface MediaClient {
  /**
   * Search for photos matching a text query.
   * @param query Search keywords (e.g. 'nature', 'city skyline')
   * @param params Pagination options (page, perPage)
   */
  searchPhotos(
    query: string,
    params?: SearchPhotosParams,
  ): Promise<PaginatedResponse<Photo>>;

  /**
   * Search for videos matching a text query.
   * @param query Search keywords (e.g. 'ocean waves', 'clouds')
   * @param params Pagination options (page, perPage)
   */
  searchVideos(
    query: string,
    params?: SearchVideosParams,
  ): Promise<PaginatedResponse<Video>>;

  /**
   * Fetch curated photos selected by the Pexels team.
   * @param params Pagination options (page, perPage)
   */
  getCuratedPhotos(
    params?: GetCuratedPhotosParams,
  ): Promise<PaginatedResponse<Photo>>;

  /**
   * Fetch currently popular / trending videos on Pexels.
   * @param params Pagination options (page, perPage)
   */
  getPopularVideos(
    params?: GetPopularVideosParams,
  ): Promise<PaginatedResponse<Video>>;

  /**
   * Fetch a single photo by its unique numeric ID.
   * @param id Pexels photo ID
   */
  getPhoto(id: number): Promise<Photo>;

  /**
   * Fetch a single video by its unique numeric ID.
   * @param id Pexels video ID
   */
  getVideo(id: number): Promise<Video>;

  /**
   * Purge all items from the internal in-memory response cache.
   */
  clearCache(): void;

  /**
   * Subscribe to SDK lifecycle / analytics events.
   * @param event Event name ('view' | 'download')
   * @param handler Callback invoked when the event occurs
   * @returns Unsubscribe function
   */
  on<K extends keyof MediaEvents>(
    event: K,
    handler: EventHandler<MediaEvents[K]>,
  ): () => void;

  /**
   * Remove an active event listener.
   * @param event Event name
   * @param handler Previously registered callback
   */
  off<K extends keyof MediaEvents>(
    event: K,
    handler: EventHandler<MediaEvents[K]>,
  ): void;

  /**
   * Manually emit an event through the client event bus.
   * @param event Event name
   * @param data Event payload
   */
  emit<K extends keyof MediaEvents>(event: K, data: MediaEvents[K]): void;
}

/**
 * Instantiate a new MediaClient for communicating with the Pexels API.
 * @param config Configuration options including `apiKey`, `baseUrl`, and `cacheTTL`
 * @throws {MediaError} Throws with code 'AUTH' if apiKey is missing or blank
 */
export function createMediaClient(config: MediaCoreConfig): MediaClient {
  const {
    apiKey,
    baseUrl = DEFAULT_BASE_URL,
    cacheTTL = DEFAULT_CACHE_TTL,
  } = config;

  if (!apiKey || apiKey.trim().length === 0) {
    throw new MediaError("Pexels API key is required", "AUTH", 401);
  }

  const http: HttpClient = createHttpClient({
    apiKey,
    baseUrl,
  });

  const cache: CacheStore = createMemoryCache();
  const inFlightRequests = new Map<string, Promise<unknown>>();
  const emitter: EventEmitter<MediaEvents> = createEventEmitter<MediaEvents>();

  // Register default console logger on init
  emitter.on("view", (data) => {
    console.log(`[MediaCore] View event:`, data);
  });
  emitter.on("download", (data) => {
    console.log(`[MediaCore] Download event:`, data);
  });

  async function executeCached<T>(
    key: string,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const cached = cache.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const inFlight = inFlightRequests.get(key);
    if (inFlight) {
      return inFlight as Promise<T>;
    }

    const requestPromise = (async () => {
      try {
        const result = await fetcher();
        if (cacheTTL > 0) {
          cache.set(key, result, cacheTTL);
        }
        return result;
      } finally {
        inFlightRequests.delete(key);
      }
    })();

    inFlightRequests.set(key, requestPromise);
    return requestPromise;
  }

  return {
    async searchPhotos(query, params = {}) {
      const page = params.page ?? 1;
      const perPage = params.perPage ?? 15;
      const cacheKey = generateCacheKey("searchPhotos", { query, page, perPage });

      return executeCached(cacheKey, async () => {
        const raw = await http.get<RawPaginatedResponse<RawPhoto>>("/v1/search", {
          query,
          page,
          per_page: perPage,
        });
        return normalizePaginatedPhotos(raw);
      });
    },

    async searchVideos(query, params = {}) {
      const page = params.page ?? 1;
      const perPage = params.perPage ?? 15;
      const cacheKey = generateCacheKey("searchVideos", { query, page, perPage });

      return executeCached(cacheKey, async () => {
        const raw = await http.get<RawPaginatedResponse<RawVideo>>("/videos/search", {
          query,
          page,
          per_page: perPage,
        });
        return normalizePaginatedVideos(raw);
      });
    },

    async getCuratedPhotos(params = {}) {
      const page = params.page ?? 1;
      const perPage = params.perPage ?? 15;
      const cacheKey = generateCacheKey("getCuratedPhotos", { page, perPage });

      return executeCached(cacheKey, async () => {
        const raw = await http.get<RawPaginatedResponse<RawPhoto>>("/v1/curated", {
          page,
          per_page: perPage,
        });
        return normalizePaginatedPhotos(raw);
      });
    },

    async getPopularVideos(params = {}) {
      const page = params.page ?? 1;
      const perPage = params.perPage ?? 15;
      const cacheKey = generateCacheKey("getPopularVideos", { page, perPage });

      return executeCached(cacheKey, async () => {
        const raw = await http.get<RawPaginatedResponse<RawVideo>>("/videos/popular", {
          page,
          per_page: perPage,
        });
        return normalizePaginatedVideos(raw);
      });
    },

    async getPhoto(id: number) {
      const cacheKey = generateCacheKey("getPhoto", id);

      return executeCached(cacheKey, async () => {
        const raw = await http.get<RawPhoto>(`/v1/photos/${id}`);
        return normalizePhoto(raw);
      });
    },

    async getVideo(id: number) {
      const cacheKey = generateCacheKey("getVideo", id);

      return executeCached(cacheKey, async () => {
        const raw = await http.get<RawVideo>(`/videos/videos/${id}`);
        return normalizeVideo(raw);
      });
    },

    clearCache() {
      cache.clear();
    },

    on(event, handler) {
      return emitter.on(event, handler);
    },

    off(event, handler) {
      emitter.off(event, handler);
    },

    emit(event, data) {
      emitter.emit(event, data);
    },
  };
}