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

export interface MediaProviderProps extends MediaCoreConfig {
  children: ReactNode;
}

export const MediaContext = createContext<MediaClient | null>(null);

export function MediaProvider({
  apiKey,
  baseUrl,
  cacheTTL,
  children,
}: MediaProviderProps) {
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

export function useMediaClient(): MediaClient {
  const client = useContext(MediaContext);
  if (!client) {
    throw new Error(
      "useMediaClient must be used within a MediaProvider. Please wrap your component tree with <MediaProvider apiKey=\"...\">."
    );
  }
  return client;
}
