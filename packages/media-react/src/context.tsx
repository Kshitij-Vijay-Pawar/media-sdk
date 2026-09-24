import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import {
  createMediaClient,
  type MediaClient,
  type MediaCoreConfig,
} from "@media/core";

/**
 * Props for the MediaProvider component.
 */
export interface MediaProviderProps extends MediaCoreConfig {
  /** React child tree that will receive access to the media client context */
  children: ReactNode;
}

export const MediaContext = createContext<MediaClient | null>(null);

/**
 * Top-level React Provider that initializes and shares a single `@media/core` MediaClient.
 *
 * @example
 * ```tsx
 * <MediaProvider apiKey="your-pexels-api-key">
 *   <App />
 * </MediaProvider>
 * ```
 */
export function MediaProvider({
  apiKey,
  baseUrl,
  cacheTTL,
  children,
}: MediaProviderProps) {
  // Stable config reference
  const configRef = useRef<MediaCoreConfig>({ apiKey, baseUrl, cacheTTL });
  configRef.current = { apiKey, baseUrl, cacheTTL };

  const client = useMemo(() => {
    return createMediaClient({
      apiKey,
      baseUrl,
      cacheTTL,
    });
  }, [apiKey, baseUrl, cacheTTL]);

  return (
    <MediaContext.Provider value={client}>
      {children}
    </MediaContext.Provider>
  );
}

/**
 * Access the active `MediaClient` instance from the nearest `MediaProvider`.
 *
 * @throws {Error} Thrown if called outside of `<MediaProvider>`.
 */
export function useMediaClient(): MediaClient {
  const client = useContext(MediaContext);
  if (!client) {
    throw new Error(
      "useMediaClient must be used within a MediaProvider. Please wrap your component tree with <MediaProvider apiKey=\"...\">."
    );
  }
  return client;
}
