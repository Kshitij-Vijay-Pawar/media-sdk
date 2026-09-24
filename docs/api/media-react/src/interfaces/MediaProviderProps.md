[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-react/src](../README.md) / MediaProviderProps

# Interface: MediaProviderProps

Defined in: packages/media-react/src/context.tsx:17

Props for the MediaProvider component.

## Extends

- [`MediaCoreConfig`](MediaCoreConfig.md)

## Properties

### apiKey

> **apiKey**: `string`

Defined in: packages/media-core/dist/index.d.ts:153

Pexels API Key (required)

#### Inherited from

[`MediaCoreConfig`](MediaCoreConfig.md).[`apiKey`](MediaCoreConfig.md#apikey)

***

### baseUrl?

> `optional` **baseUrl?**: `string`

Defined in: packages/media-core/dist/index.d.ts:155

Optional custom base URL (default: https://api.pexels.com)

#### Inherited from

[`MediaCoreConfig`](MediaCoreConfig.md).[`baseUrl`](MediaCoreConfig.md#baseurl)

***

### cacheTTL?

> `optional` **cacheTTL?**: `number`

Defined in: packages/media-core/dist/index.d.ts:157

In-memory cache TTL in milliseconds (default: 300000 = 5 minutes)

#### Inherited from

[`MediaCoreConfig`](MediaCoreConfig.md).[`cacheTTL`](MediaCoreConfig.md#cachettl)

***

### children

> **children**: `ReactNode`

Defined in: packages/media-react/src/context.tsx:19

React child tree that will receive access to the media client context
