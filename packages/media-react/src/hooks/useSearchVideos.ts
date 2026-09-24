import { useState, useEffect, useRef, useCallback } from "react";
import type { Video, PaginationParams, MediaError } from "@media/core";
import { useMediaClient } from "../context";

/** Options for configuring video search query pagination */
export type UseSearchVideosOptions = PaginationParams;

/** Return value contract for the `useSearchVideos` hook */
export interface UseSearchVideosReturn {
  /** Accumulative array of normalized video items matching query */
  data: Video[];
  /** Whether a network request is currently active */
  loading: boolean;
  /** Error object if the request failed, or null */
  error: MediaError | null;
  /** Trigger loading the subsequent page of video results */
  fetchNextPage: () => Promise<void>;
  /** Whether additional video pages are available on the server */
  hasMore: boolean;
  /** Total matching video count */
  totalResults: number;
  /** Current page index */
  page: number;
}

/**
 * Declarative hook for searching Pexels videos with automatic race-condition protection and infinite pagination.
 *
 * @param query Search query string
 * @param options Optional pagination parameters
 */
export function useSearchVideos(
  query: string,
  options?: UseSearchVideosOptions
): UseSearchVideosReturn {
  const client = useMediaClient();
  const [data, setData] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<MediaError | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);

  const perPage = options?.perPage ?? 15;
  const requestIdRef = useRef<number>(0);
  const loadingMoreRef = useRef<boolean>(false);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setData([]);
      setLoading(false);
      setError(null);
      setPage(1);
      setTotalResults(0);
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    setPage(1);

    client
      .searchVideos(trimmedQuery, { page: 1, perPage })
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
  }, [client, query, perPage]);

  const hasMore = data.length < totalResults;

  const fetchNextPage = useCallback(async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || loading || loadingMoreRef.current || !hasMore) {
      return;
    }

    const nextPage = page + 1;
    loadingMoreRef.current = true;
    setLoading(true);
    const currentRequestId = requestIdRef.current;

    try {
      const res = await client.searchVideos(trimmedQuery, {
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
  }, [client, query, page, perPage, loading, hasMore]);

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
