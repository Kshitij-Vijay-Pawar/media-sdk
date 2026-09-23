import { useState, useRef, useCallback } from "react";

export interface UseLightboxOptions<T> {
  items: T[];
  onClose?: () => void;
  onNavigate?: (index: number, item: T) => void;
}

export interface NativeOverlayProps {
  visible: boolean;
  transparent: boolean;
  onRequestClose: () => void;
}

export interface NativeContentProps {
  accessible: boolean;
  accessibilityLabel: string;
}

export interface NativeButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
}

export interface UseLightboxReturn<T> {
  getOverlayProps: (props?: Partial<NativeOverlayProps>) => NativeOverlayProps;
  getContentProps: (props?: Partial<NativeContentProps>) => NativeContentProps;
  getCloseButtonProps: (props?: Partial<NativeButtonProps>) => NativeButtonProps;
  getNextButtonProps: (props?: Partial<NativeButtonProps>) => NativeButtonProps;
  getPrevButtonProps: (props?: Partial<NativeButtonProps>) => NativeButtonProps;
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

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;

  const open = useCallback(
    (index: number) => {
      const safeIndex = Math.max(0, Math.min(index, items.length - 1));
      setCurrentIndex(safeIndex);
      setIsOpen(true);

      if (onNavigateRef.current && items[safeIndex]) {
        onNavigateRef.current(safeIndex, items[safeIndex]);
      }
    },
    [items]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    if (onCloseRef.current) {
      onCloseRef.current();
    }
  }, []);

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

  const currentItem =
    isOpen && items.length > 0 && items[currentIndex] !== undefined
      ? items[currentIndex]
      : null;

  const getOverlayProps = useCallback(
    (props?: Partial<NativeOverlayProps>): NativeOverlayProps => {
      return {
        visible: isOpen,
        transparent: true,
        onRequestClose: close,
        ...props,
      };
    },
    [isOpen, close]
  );

  const getContentProps = useCallback(
    (props?: Partial<NativeContentProps>): NativeContentProps => {
      return {
        accessible: true,
        accessibilityLabel: "Media Lightbox Dialog",
        ...props,
      };
    },
    []
  );

  const getCloseButtonProps = useCallback(
    (props?: Partial<NativeButtonProps>): NativeButtonProps => {
      return {
        accessibilityLabel: "Close lightbox",
        onPress: close,
        ...props,
      };
    },
    [close]
  );

  const getNextButtonProps = useCallback(
    (props?: Partial<NativeButtonProps>): NativeButtonProps => {
      const isDisabled = currentIndex >= items.length - 1;
      return {
        accessibilityLabel: "Next item",
        disabled: isDisabled,
        onPress: next,
        ...props,
      };
    },
    [currentIndex, items.length, next]
  );

  const getPrevButtonProps = useCallback(
    (props?: Partial<NativeButtonProps>): NativeButtonProps => {
      const isDisabled = currentIndex <= 0;
      return {
        accessibilityLabel: "Previous item",
        disabled: isDisabled,
        onPress: prev,
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
