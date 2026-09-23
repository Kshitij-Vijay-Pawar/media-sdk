import { useCallback } from "react";
import type { MediaEvents, EventHandler } from "@media/core";
import { useMediaClient } from "../context";

export interface UseMediaEventsReturn {
  emit: <K extends keyof MediaEvents>(event: K, data: MediaEvents[K]) => void;
  on: <K extends keyof MediaEvents>(
    event: K,
    handler: EventHandler<MediaEvents[K]>
  ) => () => void;
  off: <K extends keyof MediaEvents>(
    event: K,
    handler: EventHandler<MediaEvents[K]>
  ) => void;
}

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
