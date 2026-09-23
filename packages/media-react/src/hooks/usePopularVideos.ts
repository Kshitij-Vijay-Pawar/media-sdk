import { useState, useEffect, useRef, useCallback } from "react";
import type { Video, PaginationParams, MediaError } from "@media/core";
import { useMediaClient } from "../context";

export type UsePopularVideosOptions = PaginationParams;

export interface UsePopularVideosReturn {
  data: Video[];
  loading: boolean;
  error: MediaError | null;
  fetchNextPage: () => Promise<void>;
  hasMore: boolean;
  totalResults: number;
  page: number;
}

export function usePopularVideos(
  options?: UsePopularVideosOptions
): UsePopularVideosReturn {
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
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    setPage(1);

    client
      .getPopularVideos({ page: 1, perPage })
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
      const res = await client.getPopularVideos({
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
