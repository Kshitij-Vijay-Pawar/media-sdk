[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-react/src](../README.md) / UseSearchVideosReturn

# Interface: UseSearchVideosReturn

Defined in: packages/media-react/src/hooks/useSearchVideos.ts:9

Return value contract for the `useSearchVideos` hook

## Properties

### data

> **data**: [`Video`](Video.md)[]

Defined in: packages/media-react/src/hooks/useSearchVideos.ts:11

Accumulative array of normalized video items matching query

***

### error

> **error**: [`MediaError`](../classes/MediaError.md) \| `null`

Defined in: packages/media-react/src/hooks/useSearchVideos.ts:15

Error object if the request failed, or null

***

### fetchNextPage

> **fetchNextPage**: () => `Promise`\<`void`\>

Defined in: packages/media-react/src/hooks/useSearchVideos.ts:17

Trigger loading the subsequent page of video results

#### Returns

`Promise`\<`void`\>

***

### hasMore

> **hasMore**: `boolean`

Defined in: packages/media-react/src/hooks/useSearchVideos.ts:19

Whether additional video pages are available on the server

***

### loading

> **loading**: `boolean`

Defined in: packages/media-react/src/hooks/useSearchVideos.ts:13

Whether a network request is currently active

***

### page

> **page**: `number`

Defined in: packages/media-react/src/hooks/useSearchVideos.ts:23

Current page index

***

### totalResults

> **totalResults**: `number`

Defined in: packages/media-react/src/hooks/useSearchVideos.ts:21

Total matching video count
