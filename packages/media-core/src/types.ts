export interface PhotoSource {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

export interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographerUrl: string;
  photographerId?: number;
  alt: string;
  src: PhotoSource;
  avgColor?: string;
  liked?: boolean;
}

export interface VideoFile {
  id: number;
  quality: string;
  fileType: string;
  width?: number;
  height?: number;
  fps?: number;
  link: string;
}

export interface VideoPicture {
  id: number;
  picture: string;
  nr: number;
}

export interface VideoUser {
  id: number;
  name: string;
  url: string;
}

export interface Video {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: VideoUser;
  videoFiles: VideoFile[];
  videoPictures: VideoPicture[];
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  perPage: number;
  totalResults: number;
  nextPage: string | null;
  prevPage: string | null;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export interface MediaCoreConfig {
  apiKey: string;
  baseUrl?: string;
  cacheTTL?: number;
}

export interface MediaEvents {
  view: { mediaType: "photo" | "video"; id: number; timestamp: number };
  download: { mediaType: "photo" | "video"; id: number; url: string; timestamp: number };
}