[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-react/src](../README.md) / UsePopularVideosReturn

# Interface: UsePopularVideosReturn

Defined in: packages/media-react/src/hooks/usePopularVideos.ts:9

Return value contract for the `usePopularVideos` hook

## Properties

### data

> **data**: [`Video`](Video.md)[]

Defined in: packages/media-react/src/hooks/usePopularVideos.ts:11

Accumulative array of popular videos

***

### error

> **error**: [`MediaError`](../classes/MediaError.md) \| `null`

Defined in: packages/media-react/src/hooks/usePopularVideos.ts:15

Error object if the request failed, or null

***

### fetchNextPage

> **fetchNextPage**: () => `Promise`\<`void`\>

Defined in: packages/media-react/src/hooks/usePopularVideos.ts:17

Trigger loading the subsequent page of popular videos

#### Returns

`Promise`\<`void`\>

***

### hasMore

> **hasMore**: `boolean`

Defined in: packages/media-react/src/hooks/usePopularVideos.ts:19

Whether additional video pages are available on the server

***

### loading

> **loading**: `boolean`

Defined in: packages/media-react/src/hooks/usePopularVideos.ts:13

Whether a network request is currently active

***

### page

> **page**: `number`

Defined in: packages/media-react/src/hooks/usePopularVideos.ts:23

Current page index

***

### totalResults

> **totalResults**: `number`

Defined in: packages/media-react/src/hooks/usePopularVideos.ts:21

Total matching video count
