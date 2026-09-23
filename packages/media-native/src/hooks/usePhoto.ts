import { useState, useEffect, useRef } from "react";
import type { Photo, MediaError } from "@media/core";
import { useMediaClient } from "../context";

export interface UsePhotoReturn {
  data: Photo | null;
  loading: boolean;
  error: MediaError | null;
}

export function usePhoto(id: number | null | undefined): UsePhotoReturn {
  const client = useMediaClient();
  const [data, setData] = useState<Photo | null>(null);
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
      .getPhoto(id)
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
