import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type KeyboardEvent,
} from "react";

export interface UseLightboxOptions<T> {
  items: T[];
  onClose?: () => void;
  onNavigate?: (index: number, item: T) => void;
}

export interface OverlayProps extends HTMLAttributes<HTMLElement> {
  role: string;
  "aria-modal": boolean | "true" | "false";
  onClick: (e: MouseEvent<HTMLElement>) => void;
}

export interface ContentProps extends HTMLAttributes<HTMLElement> {
  "aria-label": string;
  onClick: (e: MouseEvent<HTMLElement>) => void;
  tabIndex: number;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  "aria-label": string;
  disabled?: boolean;
}

export interface UseLightboxReturn<T> {
  getOverlayProps: (props?: Partial<OverlayProps>) => OverlayProps;
  getContentProps: (props?: Partial<ContentProps>) => ContentProps;
  getCloseButtonProps: (props?: Partial<ButtonProps>) => ButtonProps;
  getNextButtonProps: (props?: Partial<ButtonProps>) => ButtonProps;
  getPrevButtonProps: (props?: Partial<ButtonProps>) => ButtonProps;
  currentItem: T | null;
  currentIndex: number;
  isOpen: boolean;
  open: (index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
}

export function useLightbox<T>({
  items,
  onClose,
  onNavigate,
}: UseLightboxOptions<T>): UseLightboxReturn<T> {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const prevActiveElementRef = useRef<HTMLElement | null>(null);
  const prevOverflowRef = useRef<string>("");

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;

  const open = useCallback(
    (index: number) => {
      const safeIndex = Math.max(0, Math.min(index, items.length - 1));
      setCurrentIndex(safeIndex);
      setIsOpen(true);

      // Save currently focused element if in browser
      if (typeof document !== "undefined") {
        prevActiveElementRef.current = document.activeElement as HTMLElement | null;
        prevOverflowRef.current = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      }

      if (onNavigateRef.current && items[safeIndex]) {
        onNavigateRef.current(safeIndex, items[safeIndex]);
      }
    },
    [items]
  );

  const close = useCallback(() => {
    setIsOpen(false);

    if (typeof document !== "undefined") {
      document.body.style.overflow = prevOverflowRef.current;
      if (prevActiveElementRef.current && typeof prevActiveElementRef.current.focus === "function") {
        prevActiveElementRef.current.focus();
      }
    }

    if (onCloseRef.current) {
      onCloseRef.current();
    }
  }, []);

  // Cleanup on unmount (restore overflow)
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined" && isOpen) {
        document.body.style.overflow = prevOverflowRef.current;
      }
    };
  }, [isOpen]);

  const next = useCallback(() => {
    if (currentIndex < items.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      if (onNavigateRef.current && items[newIndex]) {
        onNavigateRef.current(newIndex, items[newIndex]);
      }
    }
  }, [currentIndex, items]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      if (onNavigateRef.current && items[newIndex]) {
        onNavigateRef.current(newIndex, items[newIndex]);
      }
    }
  }, [currentIndex, items]);

  // Global keyboard listener for Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close, next, prev]);

  const currentItem = isOpen && items.length > 0 && items[currentIndex] !== undefined ? items[currentIndex] : null;

  const getOverlayProps = useCallback(
    (props?: Partial<OverlayProps>): OverlayProps => {
      return {
        role: "dialog",
        "aria-modal": true,
        onClick: (e: MouseEvent<HTMLElement>) => {
          if (props?.onClick) {
            props.onClick(e);
          }
          if (!e.defaultPrevented) {
            close();
          }
        },
        ...props,
      };
    },
    [close]
  );

  const getContentProps = useCallback(
    (props?: Partial<ContentProps>): ContentProps => {
      return {
        "aria-label": "Media Lightbox Dialog",
        tabIndex: -1,
        onClick: (e: MouseEvent<HTMLElement>) => {
          // Stop propagation so clicking inside content does not trigger overlay click
          e.stopPropagation();
          if (props?.onClick) {
            props.onClick(e);
          }
        },
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          if (props?.onKeyDown) {
            props.onKeyDown(e);
          }
        },
        ...props,
      };
    },
    []
  );

  const getCloseButtonProps = useCallback(
    (props?: Partial<ButtonProps>): ButtonProps => {
      return {
        "aria-label": "Close lightbox",
        onClick: (e: MouseEvent<HTMLButtonElement>) => {
          if (props?.onClick) {
            props.onClick(e);
          }
          if (!e.defaultPrevented) {
            close();
          }
        },
        ...props,
      };
    },
    [close]
  );

  const getNextButtonProps = useCallback(
    (props?: Partial<ButtonProps>): ButtonProps => {
      const isDisabled = currentIndex >= items.length - 1;
      return {
        "aria-label": "Next item",
        disabled: isDisabled,
        onClick: (e: MouseEvent<HTMLButtonElement>) => {
          if (props?.onClick) {
            props.onClick(e);
          }
          if (!e.defaultPrevented && !isDisabled) {
            next();
          }
        },
        ...props,
      };
    },
    [currentIndex, items.length, next]
  );

  const getPrevButtonProps = useCallback(
    (props?: Partial<ButtonProps>): ButtonProps => {
      const isDisabled = currentIndex <= 0;
      return {
        "aria-label": "Previous item",
        disabled: isDisabled,
        onClick: (e: MouseEvent<HTMLButtonElement>) => {
          if (props?.onClick) {
            props.onClick(e);
          }
          if (!e.defaultPrevented && !isDisabled) {
            prev();
          }
        },
        ...props,
      };
    },
    [currentIndex, prev]
  );

  return {
    getOverlayProps,
    getContentProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPrevButtonProps,
    currentItem,
    currentIndex,
    isOpen,
    open,
    close,
    next,
    prev,
  };
}
