[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-react/src](../README.md) / MediaCoreConfig

# Interface: MediaCoreConfig

Defined in: packages/media-core/dist/index.d.ts:151

Configuration options for creating a MediaClient.

## Extended by

- [`MediaProviderProps`](MediaProviderProps.md)

## Properties

### apiKey

> **apiKey**: `string`

Defined in: packages/media-core/dist/index.d.ts:153

Pexels API Key (required)

***

### baseUrl?

> `optional` **baseUrl?**: `string`

Defined in: packages/media-core/dist/index.d.ts:155

Optional custom base URL (default: https://api.pexels.com)

***

### cacheTTL?

> `optional` **cacheTTL?**: `number`

Defined in: packages/media-core/dist/index.d.ts:157

In-memory cache TTL in milliseconds (default: 300000 = 5 minutes)
