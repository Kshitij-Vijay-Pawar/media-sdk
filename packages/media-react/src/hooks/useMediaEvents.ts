import { useCallback } from "react";
import type { MediaEvents, EventHandler } from "@media/core";
import { useMediaClient } from "../context";

/** Return value contract for the `useMediaEvents` hook */
export interface UseMediaEventsReturn {
  /** Emit an event through the core client event bus */
  emit: <K extends keyof MediaEvents>(event: K, data: MediaEvents[K]) => void;
  /** Subscribe to client events with an automatic unsubscribe cleanup function */
  on: <K extends keyof MediaEvents>(
    event: K,
    handler: EventHandler<MediaEvents[K]>
  ) => () => void;
  /** Unsubscribe an event listener */
  off: <K extends keyof MediaEvents>(
    event: K,
    handler: EventHandler<MediaEvents[K]>
  ) => void;
}

/**
 * Declarative hook for subscribing to or emitting SDK telemetry and analytics events (`view`, `download`).
 */
export function useMediaEvents(): UseMediaEventsReturn {
  const client = useMediaClient();

  const emit = useCallback(
    <K extends keyof MediaEvents>(event: K, data: MediaEvents[K]) => {
      client.emit(event, data);
    },
    [client]
  );

  const on = useCallback(
    <K extends keyof MediaEvents>(
      event: K,
      handler: EventHandler<MediaEvents[K]>
    ) => {
      return client.on(event, handler);
    },
    [client]
  );

  const off = useCallback(
    <K extends keyof MediaEvents>(
      event: K,
      handler: EventHandler<MediaEvents[K]>
    ) => {
      client.off(event, handler);
    },
    [client]
  );

  return {
    emit,
    on,
    off,
  };
}
