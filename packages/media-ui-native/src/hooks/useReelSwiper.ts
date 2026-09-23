import { useState, useRef, useCallback } from "react";

export interface UseReelSwiperOptions<T> {
  items: T[];
  onActiveChange?: (index: number, item: T) => void;
}

export interface NativeContainerProps<T> {
  data: T[];
  pagingEnabled: boolean;
  showsVerticalScrollIndicator: boolean;
  onViewableItemsChanged: (info: { viewableItems: Array<{ index: number | null }> }) => void;
  viewabilityConfig: {
    itemVisiblePercentThreshold: number;
  };
}

export interface NativeSlideProps {
  "data-index": number;
  "data-active": boolean;
}

export interface UseReelSwiperReturn<T> {
  getContainerProps: (props?: Partial<NativeContainerProps<T>>) => NativeContainerProps<T>;
  getSlideProps: (item: T, index: number, props?: Partial<NativeSlideProps>) => NativeSlideProps;
  activeIndex: number;
  activeItem: T | null;
  scrollTo: (index: number) => void;
}

export function useReelSwiper<T>({
  items,
  onActiveChange,
}: UseReelSwiperOptions<T>): UseReelSwiperReturn<T> {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      const firstVisible = viewableItems.find((item) => item.index !== null && item.index !== undefined);
      if (firstVisible && firstVisible.index !== null) {
        const newIndex = firstVisible.index;
        setActiveIndex(newIndex);
        if (onActiveChangeRef.current && itemsRef.current[newIndex] !== undefined) {
          onActiveChangeRef.current(newIndex, itemsRef.current[newIndex]);
        }
      }
    },
    []
  );

  const scrollTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const getContainerProps = useCallback(
    (props?: Partial<NativeContainerProps<T>>): NativeContainerProps<T> => {
      return {
        data: items,
        pagingEnabled: true,
        showsVerticalScrollIndicator: false,
        onViewableItemsChanged,
        viewabilityConfig: {
          itemVisiblePercentThreshold: 60,
        },
        ...props,
      };
    },
    [items, onViewableItemsChanged]
  );

  const getSlideProps = useCallback(
    (item: T, index: number, props?: Partial<NativeSlideProps>): NativeSlideProps => {
      return {
        "data-index": index,
        "data-active": index === activeIndex,
        ...props,
      };
    },
    [activeIndex]
  );

  const activeItem =
    items.length > 0 && items[activeIndex] !== undefined
      ? items[activeIndex]
      : null;

  return {
    getContainerProps,
    getSlideProps,
    activeIndex,
    activeItem,
    scrollTo,
  };
}
