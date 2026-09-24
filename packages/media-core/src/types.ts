/**
 * Image asset variants provided by Pexels for a photo.
 */
export interface PhotoSource {
  /** Original uncompressed resolution image */
  original: string;
  /** Large image at 2x pixel density (W 1880px) */
  large2x: string;
  /** Large image (W 940px) */
  large: string;
  /** Medium resolution image (H 350px) */
  medium: string;
  /** Small resolution image (H 130px) */
  small: string;
  /** Portrait cropped image (W 800px x H 1200px) */
  portrait: string;
  /** Landscape cropped image (W 1200px x H 627px) */
  landscape: string;
  /** Tiny preview thumbnail (W 280px x H 200px) */
  tiny: string;
}

/**
 * Normalized photo item from Pexels API.
 */
export interface Photo {
  /** Unique photo identifier */
  id: number;
  /** Real width in pixels */
  width: number;
  /** Real height in pixels */
  height: number;
  /** Canonical Pexels URL */
  url: string;
  /** Name of the photographer */
  photographer: string;
  /** Photographer Pexels profile URL */
  photographerUrl: string;
  /** Photographer ID if present */
  photographerId?: number;
  /** Text description / alt text for accessibility */
  alt: string;
  /** Image URLs for various responsive sizes */
  src: PhotoSource;
  /** Average dominant hex color of the photo */
  avgColor?: string;
  /** Whether the authenticated user has liked the photo */
  liked?: boolean;
}

/**
 * Individual video rendition / stream file.
 */
export interface VideoFile {
  /** Unique video file ID */
  id: number;
  /** Quality preset (e.g., 'hd', 'sd', 'uhd') */
  quality: string;
  /** File mime/container type (e.g., 'video/mp4') */
  fileType: string;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Frame rate in frames per second */
  fps?: number;
  /** Direct downloadable / streamable video URL */
  link: string;
}

/**
 * Still preview / picture taken from video.
 */
export interface VideoPicture {
  /** Video picture ID */
  id: number;
  /** Image preview URL */
  picture: string;
  /** Frame number sequence index */
  nr: number;
}

/**
 * Video creator / author details.
 */
export interface VideoUser {
  /** User ID */
  id: number;
  /** User name */
  name: string;
  /** Profile URL */
  url: string;
}

/**
 * Normalized video item from Pexels API.
 */
export interface Video {
  /** Unique video identifier */
  id: number;
  /** Native video width in pixels */
  width: number;
  /** Native video height in pixels */
  height: number;
  /** Canonical Pexels URL */
  url: string;
  /** Video poster / thumbnail preview image URL */
  image: string;
  /** Video duration in seconds */
  duration: number;
  /** Video author metadata */
  user: VideoUser;
  /** Array of available video file streams / qualities */
  videoFiles: VideoFile[];
  /** Array of preview frames / picture stills */
  videoPictures: VideoPicture[];
}

/**
 * Generic normalized paginated envelope.
 */
export interface PaginatedResponse<T> {
  /** Array of normalized media items */
  data: T[];
  /** Current page index (1-indexed) */
  page: number;
  /** Number of items requested per page */
  perPage: number;
  /** Total number of matching items found on Pexels */
  totalResults: number;
  /** URL for fetching the next page, or null if on last page */
  nextPage: string | null;
  /** URL for fetching the previous page, or null if on first page */
  prevPage: string | null;
}

/**
 * Common pagination query parameters.
 */
export interface PaginationParams {
  /** Page number to retrieve (default: 1) */
  page?: number;
  /** Number of results per page (default: 15, max: 80) */
  perPage?: number;
}

/**
 * Configuration options for creating a MediaClient.
 */
export interface MediaCoreConfig {
  /** Pexels API Key (required) */
  apiKey: string;
  /** Optional custom base URL (default: https://api.pexels.com) */
  baseUrl?: string;
  /** In-memory cache TTL in milliseconds (default: 300000 = 5 minutes) */
  cacheTTL?: number;
}

/**
 * Event map for the MediaClient event emitter.
 */
export interface MediaEvents {
  /** Emitted whenever a photo or video is viewed */
  view: { mediaType: "photo" | "video"; id: number; timestamp: number };
  /** Emitted whenever a photo or video download is triggered */
  download: { mediaType: "photo" | "video"; id: number; url: string; timestamp: number };
}