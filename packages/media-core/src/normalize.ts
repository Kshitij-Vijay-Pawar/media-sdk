import type {
  Photo,
  PhotoSource,
  Video,
  VideoFile,
  VideoPicture,
  VideoUser,
  PaginatedResponse,
} from "./types";

export interface RawPhotoSource {
  original?: string;
  large2x?: string;
  large?: string;
  medium?: string;
  small?: string;
  portrait?: string;
  landscape?: string;
  tiny?: string;
}

export interface RawPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url?: string;
  photographer_id?: number;
  avg_color?: string;
  src?: RawPhotoSource;
  liked?: boolean;
  alt?: string;
}

export interface RawVideoFile {
  id: number;
  quality?: string;
  file_type?: string;
  width?: number;
  height?: number;
  fps?: number;
  link: string;
}

export interface RawVideoPicture {
  id: number;
  picture: string;
  nr: number;
}

export interface RawVideoUser {
  id: number;
  name: string;
  url: string;
}

export interface RawVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image?: string;
  duration?: number;
  user?: RawVideoUser;
  video_files?: RawVideoFile[];
  video_pictures?: RawVideoPicture[];
}

export interface RawPaginatedResponse<T> {
  page: number;
  per_page: number;
  total_results?: number;
  next_page?: string | null;
  prev_page?: string | null;
  photos?: T[];
  videos?: T[];
  media?: T[];
}

export function normalizePhotoSource(raw?: RawPhotoSource): PhotoSource {
  return {
    original: raw?.original ?? "",
    large2x: raw?.large2x ?? "",
    large: raw?.large ?? "",
    medium: raw?.medium ?? "",
    small: raw?.small ?? "",
    portrait: raw?.portrait ?? "",
    landscape: raw?.landscape ?? "",
    tiny: raw?.tiny ?? "",
  };
}

export function normalizePhoto(raw: RawPhoto): Photo {
  return {
    id: raw.id,
    width: raw.width,
    height: raw.height,
    url: raw.url,
    photographer: raw.photographer,
    photographerUrl: raw.photographer_url ?? "",
    photographerId: raw.photographer_id,
    alt: raw.alt ?? "",
    src: normalizePhotoSource(raw.src),
    avgColor: raw.avg_color,
    liked: raw.liked,
  };
}

export function normalizeVideoFile(raw: RawVideoFile): VideoFile {
  return {
    id: raw.id,
    quality: raw.quality ?? "",
    fileType: raw.file_type ?? "",
    width: raw.width,
    height: raw.height,
    fps: raw.fps,
    link: raw.link,
  };
}

export function normalizeVideoPicture(raw: RawVideoPicture): VideoPicture {
  return {
    id: raw.id,
    picture: raw.picture,
    nr: raw.nr,
  };
}

export function normalizeVideoUser(raw?: RawVideoUser): VideoUser {
  return {
    id: raw?.id ?? 0,
    name: raw?.name ?? "",
    url: raw?.url ?? "",
  };
}

export function normalizeVideo(raw: RawVideo): Video {
  return {
    id: raw.id,
    width: raw.width,
    height: raw.height,
    url: raw.url,
    image: raw.image ?? "",
    duration: raw.duration ?? 0,
    user: normalizeVideoUser(raw.user),
    videoFiles: (raw.video_files ?? []).map(normalizeVideoFile),
    videoPictures: (raw.video_pictures ?? []).map(normalizeVideoPicture),
  };
}

export function normalizePaginatedPhotos(
  raw: RawPaginatedResponse<RawPhoto>,
): PaginatedResponse<Photo> {
  return {
    data: (raw.photos ?? []).map(normalizePhoto),
    page: raw.page,
    perPage: raw.per_page,
    totalResults: raw.total_results ?? (raw.photos ?? []).length,
    nextPage: raw.next_page ?? null,
    prevPage: raw.prev_page ?? null,
  };
}

export function normalizePaginatedVideos(
  raw: RawPaginatedResponse<RawVideo>,
): PaginatedResponse<Video> {
  return {
    data: (raw.videos ?? []).map(normalizeVideo),
    page: raw.page,
    perPage: raw.per_page,
    totalResults: raw.total_results ?? (raw.videos ?? []).length,
    nextPage: raw.next_page ?? null,
    prevPage: raw.prev_page ?? null,
  };
}
