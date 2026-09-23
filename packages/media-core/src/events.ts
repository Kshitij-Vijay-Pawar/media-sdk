export type EventHandler<T> = (data: T) => void;

export interface EventEmitter<TEvents> {
  on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): () => void;
  off<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void;
  emit<K extends keyof TEvents>(event: K, data: TEvents[K]): void;
  listenerCount<K extends keyof TEvents>(event?: K): number;
}

export function createEventEmitter<TEvents>(): EventEmitter<TEvents> {
  const listeners = new Map<keyof TEvents, Set<EventHandler<unknown>>>();

  return {
    on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>) {
      let set = listeners.get(event);
      if (!set) {
        set = new Set();
        listeners.set(event, set);
      }
      set.add(handler as EventHandler<unknown>);

      return () => {
        set?.delete(handler as EventHandler<unknown>);
        if (set?.size === 0) {
          listeners.delete(event);
        }
      };
    },

    off<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>) {
      const set = listeners.get(event);
      if (set) {
        set.delete(handler as EventHandler<unknown>);
        if (set.size === 0) {
          listeners.delete(event);
        }
      }
    },

    emit<K extends keyof TEvents>(event: K, data: TEvents[K]) {
      const set = listeners.get(event);
      if (set) {
        for (const handler of Array.from(set)) {
          try {
            handler(data);
          } catch (err) {
            // Prevent listener errors from breaking SDK methods or caller flow
            console.error(`Error in event listener for "${String(event)}":`, err);
          }
        }
      }
    },

    listenerCount<K extends keyof TEvents>(event?: K) {
      if (event !== undefined) {
        return listeners.get(event)?.size ?? 0;
      }
      let count = 0;
      for (const set of listeners.values()) {
        count += set.size;
      }
      return count;
    },
  };
}
