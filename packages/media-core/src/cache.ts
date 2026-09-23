export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface CacheStore {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T, ttlMs: number): void;
  delete(key: string): void;
  clear(): void;
  has(key: string): boolean;
}

export function createMemoryCache(): CacheStore {
  const store = new Map<string, CacheEntry<unknown>>();

  return {
    get<T>(key: string): T | undefined {
      const entry = store.get(key);
      if (!entry) return undefined;

      if (Date.now() > entry.expiresAt) {
        store.delete(key);
        return undefined;
      }

      return entry.value as T;
    },

    set<T>(key: string, value: T, ttlMs: number): void {
      store.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
      });
    },

    delete(key: string): void {
      store.delete(key);
    },

    clear(): void {
      store.clear();
    },

    has(key: string): boolean {
      return this.get(key) !== undefined;
    },
  };
}

export function generateCacheKey(
  method: string,
  params?: Record<string, unknown> | number | string,
): string {
  if (params === undefined || params === null) {
    return method;
  }

  if (typeof params !== "object") {
    return `${method}:${String(params)}`;
  }

  // Recursively sort keys for deterministic serialization
  const normalizeObject = (obj: unknown): unknown => {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(normalizeObject);
    }
    const record = obj as Record<string, unknown>;
    const sortedKeys = Object.keys(record).sort();
    const result: Record<string, unknown> = {};
    for (const key of sortedKeys) {
      const val = record[key];
      if (val !== undefined) {
        result[key] = normalizeObject(val);
      }
    }
    return result;
  };

  return `${method}:${JSON.stringify(normalizeObject(params))}`;
}
