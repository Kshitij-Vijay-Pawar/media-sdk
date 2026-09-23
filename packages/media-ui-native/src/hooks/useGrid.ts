import { useRef, useCallback } from "react";

export interface UseGridOptions<T> {
  data: T[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  getItemKey?: (item: T, index: number) => string | number;
}

export interface NativeGridProps<T> {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  onEndReached: () => void;
  onEndReachedThreshold: number;
  refreshing?: boolean;
}

export interface NativeItemProps {
  "data-index": number;
  "data-key"?: string | number;
}

export interface UseGridReturn<T> {
  getGridProps: (props?: Partial<NativeGridProps<T>>) => NativeGridProps<T>;
  getItemProps: (item: T, index: number, props?: Partial<NativeItemProps>) => NativeItemProps;
  items: T[];
  isLoading: boolean;
}

export function useGrid<T>({
  data,
  loading = false,
  hasMore = false,
  onLoadMore,
  getItemKey,
}: UseGridOptions<T>): UseGridReturn<T> {
  const loadingMoreRef = useRef<boolean>(false);
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  const handleEndReached = useCallback(() => {
    if (loading || !hasMore || loadingMoreRef.current) {
      return;
    }
    loadingMoreRef.current = true;
    if (onLoadMoreRef.current) {
      onLoadMoreRef.current();
    }
    // Release guard after callback execution
    setTimeout(() => {
      loadingMoreRef.current = false;
    }, 100);
  }, [loading, hasMore]);

  const keyExtractor = useCallback(
    (item: T, index: number): string => {
      if (getItemKey) {
        return String(getItemKey(item, index));
      }
      return String(index);
    },
    [getItemKey]
  );

  const getGridProps = useCallback(
    (props?: Partial<NativeGridProps<T>>): NativeGridProps<T> => {
      return {
        data,
        keyExtractor,
        onEndReached: handleEndReached,
        onEndReachedThreshold: 0.5,
        refreshing: loading,
        ...props,
      };
    },
    [data, keyExtractor, handleEndReached, loading]
  );

  const getItemProps = useCallback(
    (item: T, index: number, props?: Partial<NativeItemProps>): NativeItemProps => {
      const key = getItemKey ? getItemKey(item, index) : undefined;
      return {
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
  };
}
