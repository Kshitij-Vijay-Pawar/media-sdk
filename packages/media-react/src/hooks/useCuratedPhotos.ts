import { useState, useEffect, useRef, useCallback } from "react";
import type { Photo, PaginationParams, MediaError } from "@media/core";
import { useMediaClient } from "../context";

/** Options for configuring curated photos pagination */
export type UseCuratedPhotosOptions = PaginationParams;

/** Return value contract for the `useCuratedPhotos` hook */
export interface UseCuratedPhotosReturn {
  /** Accumulative array of curated photos */
  data: Photo[];
  /** Whether a network request is currently active */
  loading: boolean;
  /** Error object if the request failed, or null */
  error: MediaError | null;
  /** Trigger loading the subsequent page of curated photos */
  fetchNextPage: () => Promise<void>;
  /** Whether additional photo pages are available on the server */
  hasMore: boolean;
  /** Total matching photo count */
  totalResults: number;
  /** Current page index */
  page: number;
}

/**
 * Declarative hook for retrieving curated photos from Pexels with infinite pagination.
 *
 * @param options Optional pagination parameters
 */
export function useCuratedPhotos(
  options?: UseCuratedPhotosOptions
): UseCuratedPhotosReturn {
  const client = useMediaClient();
  const [data, setData] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<MediaError | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);

  const perPage = options?.perPage ?? 15;
  const requestIdRef = useRef<number>(0);
  const loadingMoreRef = useRef<boolean>(false);

  useEffect(() => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    setPage(1);

    client
      .getCuratedPhotos({ page: 1, perPage })
      .then((res) => {
        if (requestIdRef.current === currentRequestId) {
          setData(res.data);
          setTotalResults(res.totalResults);
          setLoading(false);
        }
      })
      .catch((err: MediaError) => {
        if (requestIdRef.current === currentRequestId) {
          setError(err);
          setData([]);
          setTotalResults(0);
          setLoading(false);
        }
      });

    return () => {
      requestIdRef.current++;
    };
  }, [client, perPage]);

  const hasMore = data.length < totalResults;

  const fetchNextPage = useCallback(async () => {
    if (loading || loadingMoreRef.current || !hasMore) {
      return;
    }

    const nextPage = page + 1;
    loadingMoreRef.current = true;
    setLoading(true);
    const currentRequestId = requestIdRef.current;

    try {
      const res = await client.getCuratedPhotos({
        page: nextPage,
        perPage,
      });

      if (requestIdRef.current === currentRequestId) {
        setData((prev) => [...prev, ...res.data]);
        setTotalResults(res.totalResults);
        setPage(nextPage);
      }
    } catch (err) {
      if (requestIdRef.current === currentRequestId) {
        setError(err as MediaError);
      }
    } finally {
      loadingMoreRef.current = false;
      if (requestIdRef.current === currentRequestId) {
        setLoading(false);
      }
    }
  }, [client, page, perPage, loading, hasMore]);

  return {
    data,
    loading,
    error,
    fetchNextPage,
    hasMore,
    totalResults,
    page,
  };
}
