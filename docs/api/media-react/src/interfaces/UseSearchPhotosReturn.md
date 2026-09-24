[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-react/src](../README.md) / UseSearchPhotosReturn

# Interface: UseSearchPhotosReturn

Defined in: packages/media-react/src/hooks/useSearchPhotos.ts:9

Return value contract for the `useSearchPhotos` hook

## Properties

### data

> **data**: [`Photo`](Photo.md)[]

Defined in: packages/media-react/src/hooks/useSearchPhotos.ts:11

Accumulative array of normalized photo items matching query

***

### error

> **error**: [`MediaError`](../classes/MediaError.md) \| `null`

Defined in: packages/media-react/src/hooks/useSearchPhotos.ts:15

Error object if the request failed, or null

***

### fetchNextPage

> **fetchNextPage**: () => `Promise`\<`void`\>

Defined in: packages/media-react/src/hooks/useSearchPhotos.ts:17

Trigger loading the subsequent page of results

#### Returns

`Promise`\<`void`\>

***

### hasMore

> **hasMore**: `boolean`

Defined in: packages/media-react/src/hooks/useSearchPhotos.ts:19

Whether additional pages are available on the server

***

### loading

> **loading**: `boolean`

Defined in: packages/media-react/src/hooks/useSearchPhotos.ts:13

Whether a network request is currently active

***

### page

> **page**: `number`

Defined in: packages/media-react/src/hooks/useSearchPhotos.ts:23

Current page index

***

### totalResults

> **totalResults**: `number`

Defined in: packages/media-react/src/hooks/useSearchPhotos.ts:21

Total matching photo count
