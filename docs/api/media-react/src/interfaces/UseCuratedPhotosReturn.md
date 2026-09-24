[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-react/src](../README.md) / UseCuratedPhotosReturn

# Interface: UseCuratedPhotosReturn

Defined in: packages/media-react/src/hooks/useCuratedPhotos.ts:9

Return value contract for the `useCuratedPhotos` hook

## Properties

### data

> **data**: [`Photo`](Photo.md)[]

Defined in: packages/media-react/src/hooks/useCuratedPhotos.ts:11

Accumulative array of curated photos

***

### error

> **error**: [`MediaError`](../classes/MediaError.md) \| `null`

Defined in: packages/media-react/src/hooks/useCuratedPhotos.ts:15

Error object if the request failed, or null

***

### fetchNextPage

> **fetchNextPage**: () => `Promise`\<`void`\>

Defined in: packages/media-react/src/hooks/useCuratedPhotos.ts:17

Trigger loading the subsequent page of curated photos

#### Returns

`Promise`\<`void`\>

***

### hasMore

> **hasMore**: `boolean`

Defined in: packages/media-react/src/hooks/useCuratedPhotos.ts:19

Whether additional photo pages are available on the server

***

### loading

> **loading**: `boolean`

Defined in: packages/media-react/src/hooks/useCuratedPhotos.ts:13

Whether a network request is currently active

***

### page

> **page**: `number`

Defined in: packages/media-react/src/hooks/useCuratedPhotos.ts:23

Current page index

***

### totalResults

> **totalResults**: `number`

Defined in: packages/media-react/src/hooks/useCuratedPhotos.ts:21

Total matching photo count
