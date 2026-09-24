import { useState, useEffect, useRef } from "react";
import type { Video, MediaError } from "@media/core";
import { useMediaClient } from "../context";

/** Return value contract for the `useVideo` hook */
export interface UseVideoReturn {
  /** The fetched video data, or null */
  data: Video | null;
  /** Whether a network request is currently active */
  loading: boolean;
  /** Error object if the request failed, or null */
  error: MediaError | null;
}

/**
 * Declarative hook for fetching a single video by its unique Pexels numeric ID.
 *
 * @param id Numeric ID of the video
 */
export function useVideo(id: number | null | undefined): UseVideoReturn {
  const client = useMediaClient();
  const [data, setData] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<MediaError | null>(null);

  const requestIdRef = useRef<number>(0);

  useEffect(() => {
    if (id === null || id === undefined || id <= 0) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    client
      .getVideo(id)
      .then((res) => {
        if (requestIdRef.current === currentRequestId) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err: MediaError) => {
        if (requestIdRef.current === currentRequestId) {
          setError(err);
          setData(null);
          setLoading(false);
        }
      });

    return () => {
      requestIdRef.current++;
    };
  }, [client, id]);

  return {
    data,
    loading,
    error,
  };
}
