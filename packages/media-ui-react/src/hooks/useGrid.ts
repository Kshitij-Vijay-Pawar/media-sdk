import { useEffect, useRef, useCallback, type HTMLAttributes, type RefObject } from "react";

export interface UseGridOptions<T> {
  data: T[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  getItemKey?: (item: T, index: number) => string | number;
}

export interface GridProps extends HTMLAttributes<HTMLElement> {
  role: string;
  "aria-busy"?: boolean;
}

export interface ItemProps extends HTMLAttributes<HTMLElement> {
  role: string;
  "data-index": number;
  "data-key"?: string | number;
}

export interface UseGridReturn<T> {
  getGridProps: (props?: Partial<GridProps>) => GridProps;
  getItemProps: (item: T, index: number, props?: Partial<ItemProps>) => ItemProps;
  items: T[];
  isLoading: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
}

export function useGrid<T>({
  data,
  loading = false,
  hasMore = false,
  onLoadMore,
  getItemKey,
}: UseGridOptions<T>): UseGridReturn<T> {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef<boolean>(false);
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  // Reset loadingMoreRef whenever loading changes to false
  useEffect(() => {
    if (!loading) {
      loadingMoreRef.current = false;
    }
  }, [loading]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // Disconnect earlier observer when re-attaching
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          // Triple guard: loading, !hasMore, loadingMoreRef
          if (loading || !hasMore || loadingMoreRef.current) {
            return;
          }
          loadingMoreRef.current = true;
          if (onLoadMoreRef.current) {
            onLoadMoreRef.current();
          }
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loading, hasMore]);

  const getGridProps = useCallback(
    (props?: Partial<GridProps>): GridProps => {
      return {
        role: "grid",
        "aria-busy": loading ? true : undefined,
        ...props,
      };
    },
    [loading]
  );

  const getItemProps = useCallback(
    (item: T, index: number, props?: Partial<ItemProps>): ItemProps => {
      const key = getItemKey ? getItemKey(item, index) : undefined;
      return {
        role: "gridcell",
        "data-index": index,
        ...(key !== undefined ? { "data-key": key } : {}),
        ...props,
      };
    },
    [getItemKey]
  );

  return {
    getGridProps,
    getItemProps,
    items: data,
    isLoading: loading,
    sentinelRef,
  };
}
