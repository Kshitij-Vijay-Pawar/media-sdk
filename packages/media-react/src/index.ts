// Context and Provider
export { MediaProvider, useMediaClient, MediaContext } from "./context";
export type { MediaProviderProps } from "./context";

// Hooks
export { useSearchPhotos } from "./hooks/useSearchPhotos";
export type {
  UseSearchPhotosOptions,
  UseSearchPhotosReturn,
} from "./hooks/useSearchPhotos";

export { useSearchVideos } from "./hooks/useSearchVideos";
export type {
  UseSearchVideosOptions,
  UseSearchVideosReturn,
} from "./hooks/useSearchVideos";

export { useCuratedPhotos } from "./hooks/useCuratedPhotos";
export type {
  UseCuratedPhotosOptions,
  UseCuratedPhotosReturn,
} from "./hooks/useCuratedPhotos";

export { usePopularVideos } from "./hooks/usePopularVideos";
export type {
  UsePopularVideosOptions,
  UsePopularVideosReturn,
} from "./hooks/usePopularVideos";

export { usePhoto } from "./hooks/usePhoto";
export type { UsePhotoReturn } from "./hooks/usePhoto";

export { useVideo } from "./hooks/useVideo";
export type { UseVideoReturn } from "./hooks/useVideo";

export { useMediaEvents } from "./hooks/useMediaEvents";
export type { UseMediaEventsReturn } from "./hooks/useMediaEvents";

// Re-export core types
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
  MediaClient,
  MediaErrorCode,
  SearchPhotosParams,
  SearchVideosParams,
  GetCuratedPhotosParams,
  GetPopularVideosParams,
} from "@media/core";

export { MediaError } from "@media/core";
