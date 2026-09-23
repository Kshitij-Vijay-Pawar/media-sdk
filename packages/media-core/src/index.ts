export { createMediaClient } from "./client";

export type {
  MediaClient,
  SearchPhotosParams,
  SearchVideosParams,
  GetCuratedPhotosParams,
  GetPopularVideosParams,
} from "./client";

export { MediaError } from "./errors";
export type { MediaErrorCode } from "./errors";

export { createEventEmitter } from "./events";
export type { EventEmitter, EventHandler } from "./events";

export { createMemoryCache, generateCacheKey } from "./cache";
export type { CacheStore, CacheEntry } from "./cache";

export {
  normalizePhoto,
  normalizePhotoSource,
  normalizeVideo,
  normalizeVideoFile,
  normalizeVideoPicture,
  normalizeVideoUser,
  normalizePaginatedPhotos,
  normalizePaginatedVideos,
} from "./normalize";

export type {
  Photo,
  PhotoSource,
  Video,
  VideoFile,
  VideoPicture,
  VideoUser,
  PaginatedResponse,
  PaginationParams,
  MediaCoreConfig,
  MediaEvents,
} from "./types";