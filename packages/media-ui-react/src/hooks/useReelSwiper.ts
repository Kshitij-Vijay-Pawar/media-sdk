import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type HTMLAttributes,
  type RefObject,
} from "react";

export interface UseReelSwiperOptions<T> {
  items: T[];
  onActiveChange?: (index: number, item: T) => void;
  threshold?: number;
}

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  ref: RefObject<HTMLDivElement | null>;
  "aria-roledescription": string;
  "data-reel-container": boolean | string;
  tabIndex: number;
}

export interface SlideProps extends HTMLAttributes<HTMLElement> {
  ref: (el: HTMLElement | null) => void;
  "aria-roledescription": string;
  "aria-label": string;
  "data-index": number;
  "data-active": boolean;
}

export interface UseReelSwiperReturn<T> {
  getContainerProps: (props?: Partial<ContainerProps>) => ContainerProps;
  getSlideProps: (item: T, index: number, props?: Partial<SlideProps>) => SlideProps;
  activeIndex: number;
  activeItem: T | null;
  scrollTo: (index: number) => void;
}

export function useReelSwiper<T>({
  items,
  onActiveChange,
  threshold = 0.6,
}: UseReelSwiperOptions<T>): UseReelSwiperReturn<T> {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slideElementsRef = useRef<Map<number, HTMLElement>>(new Map());

  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIndex = -1;
        let maxRatio = 0;

        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const indexAttr = target.getAttribute("data-index");
          if (indexAttr !== null) {
            const idx = parseInt(indexAttr, 10);
            if (entry.intersectionRatio >= threshold && entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              bestIndex = idx;
            }
          }
        });

        if (bestIndex !== -1 && bestIndex !== activeIndexRef.current) {
          setActiveIndex(bestIndex);
          if (onActiveChangeRef.current && itemsRef.current[bestIndex] !== undefined) {
            onActiveChangeRef.current(bestIndex, itemsRef.current[bestIndex]);
          }
        }
      },
      {
        root: container,
        threshold: [threshold, 0.8, 1.0],
      }
    );

    slideElementsRef.current.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [items.length, threshold]);

  const scrollTo = useCallback((index: number) => {
    const targetElement = slideElementsRef.current.get(index);
    if (targetElement && typeof targetElement.scrollIntoView === "function") {
      targetElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  const getContainerProps = useCallback(
    (props?: Partial<ContainerProps>): ContainerProps => {
      return {
        ref: containerRef,
        "aria-roledescription": "carousel",
        "data-reel-container": "true",
        tabIndex: 0,
        ...props,
      };
    },
    []
  );

  const getSlideProps = useCallback(
    (item: T, index: number, props?: Partial<SlideProps>): SlideProps => {
      const isActive = index === activeIndex;
      return {
        ref: (el: HTMLElement | null) => {
          if (el) {
            slideElementsRef.current.set(index, el);
          } else {
            slideElementsRef.current.delete(index);
          }
        },
        "aria-roledescription": "slide",
        "aria-label": `Slide ${index + 1} of ${items.length}`,
        "data-index": index,
        "data-active": isActive,
        ...props,
      };
    },
    [activeIndex, items.length]
  );

  const activeItem = items.length > 0 && items[activeIndex] !== undefined ? items[activeIndex] : null;

  return {
    getContainerProps,
    getSlideProps,
    activeIndex,
    activeItem,
    scrollTo,
  };
}
