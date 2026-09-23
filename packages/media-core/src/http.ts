import { MediaError, type MediaErrorCode } from "./errors";
import type { MediaCoreConfig } from "./types";

export const DEFAULT_BASE_URL = "https://api.pexels.com";
export const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export interface HttpClient {
  get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T>;
}

function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  // Normalize path and base URL
  const url = new URL(path.startsWith("/") ? path : `/${path}`, baseUrl);

  if (params) {
    // Sort keys deterministically
    const sortedKeys = Object.keys(params).sort();
    for (const key of sortedKeys) {
      const value = params[key];
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function mapStatusToErrorCode(status: number): MediaErrorCode {
  switch (status) {
    case 401:
      return "AUTH";
    case 404:
      return "NOT_FOUND";
    case 429:
      return "RATE_LIMIT";
    default:
      return "UNKNOWN";
  }
}

export function createHttpClient(config: MediaCoreConfig): HttpClient {
  const {
    apiKey,
    baseUrl = DEFAULT_BASE_URL,
  } = config;

  if (!apiKey || apiKey.trim().length === 0) {
    throw new MediaError("Pexels API key is required", "AUTH", 401);
  }

  return {
    async get<T>(
      path: string,
      params?: Record<string, string | number | boolean | undefined>,
    ): Promise<T> {
      const url = buildUrl(baseUrl, path, params);

      let response: Response;
      try {
        response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: apiKey,
          },
        });
      } catch (err) {
        throw new MediaError(
          `Network request failed: ${err instanceof Error ? err.message : String(err)}`,
          "NETWORK",
          undefined,
          err,
        );
      }

      if (!response.ok) {
        const code = mapStatusToErrorCode(response.status);
        let errorBody = "";
        try {
          errorBody = await response.text();
        } catch {
          // ignore parsing error
        }

        throw new MediaError(
          `Pexels API request failed with status ${response.status}${errorBody ? `: ${errorBody}` : ""}`,
          code,
          response.status,
        );
      }

      try {
        return (await response.json()) as T;
      } catch (err) {
        throw new MediaError(
          "Failed to parse JSON response from Pexels API",
          "UNKNOWN",
          response.status,
          err,
        );
      }
    },
  };
}