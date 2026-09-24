[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-react/src](../README.md) / MediaClient

# Interface: MediaClient

Defined in: packages/media-core/dist/index.d.ts:185

Primary Media Client interface for interacting with Pexels API.

## Methods

### clearCache()

> **clearCache**(): `void`

Defined in: packages/media-core/dist/index.d.ts:221

Purge all items from the internal in-memory response cache.

#### Returns

`void`

***

### emit()

> **emit**\<`K`\>(`event`, `data`): `void`

Defined in: packages/media-core/dist/index.d.ts:240

Manually emit an event through the client event bus.

#### Type Parameters

##### K

`K` *extends* keyof [`MediaEvents`](MediaEvents.md)

#### Parameters

##### event

`K`

Event name

##### data

[`MediaEvents`](MediaEvents.md)\[`K`\]

Event payload

#### Returns

`void`

***

### getCuratedPhotos()

> **getCuratedPhotos**(`params?`): `Promise`\<[`PaginatedResponse`](PaginatedResponse.md)\<[`Photo`](Photo.md)\>\>

Defined in: packages/media-core/dist/index.d.ts:202

Fetch curated photos selected by the Pexels team.

#### Parameters

##### params?

[`PaginationParams`](PaginationParams.md)

Pagination options (page, perPage)

#### Returns

`Promise`\<[`PaginatedResponse`](PaginatedResponse.md)\<[`Photo`](Photo.md)\>\>

***

### getPhoto()

> **getPhoto**(`id`): `Promise`\<[`Photo`](Photo.md)\>

Defined in: packages/media-core/dist/index.d.ts:212

Fetch a single photo by its unique numeric ID.

#### Parameters

##### id

`number`

Pexels photo ID

#### Returns

`Promise`\<[`Photo`](Photo.md)\>

***

### getPopularVideos()

> **getPopularVideos**(`params?`): `Promise`\<[`PaginatedResponse`](PaginatedResponse.md)\<[`Video`](Video.md)\>\>

Defined in: packages/media-core/dist/index.d.ts:207

Fetch currently popular / trending videos on Pexels.

#### Parameters

##### params?

[`PaginationParams`](PaginationParams.md)

Pagination options (page, perPage)

#### Returns

`Promise`\<[`PaginatedResponse`](PaginatedResponse.md)\<[`Video`](Video.md)\>\>

***

### getVideo()

> **getVideo**(`id`): `Promise`\<[`Video`](Video.md)\>

Defined in: packages/media-core/dist/index.d.ts:217

Fetch a single video by its unique numeric ID.

#### Parameters

##### id

`number`

Pexels video ID

#### Returns

`Promise`\<[`Video`](Video.md)\>

***

### off()

> **off**\<`K`\>(`event`, `handler`): `void`

Defined in: packages/media-core/dist/index.d.ts:234

Remove an active event listener.

#### Type Parameters

##### K

`K` *extends* keyof [`MediaEvents`](MediaEvents.md)

#### Parameters

##### event

`K`

Event name

##### handler

`EventHandler`\<[`MediaEvents`](MediaEvents.md)\[`K`\]\>

Previously registered callback

#### Returns

`void`

***

### on()

> **on**\<`K`\>(`event`, `handler`): () => `void`

Defined in: packages/media-core/dist/index.d.ts:228

Subscribe to SDK lifecycle / analytics events.

#### Type Parameters

##### K

`K` *extends* keyof [`MediaEvents`](MediaEvents.md)

#### Parameters

##### event

`K`

Event name ('view' | 'download')

##### handler

`EventHandler`\<[`MediaEvents`](MediaEvents.md)\[`K`\]\>

Callback invoked when the event occurs

#### Returns

Unsubscribe function

() => `void`

***

### searchPhotos()

> **searchPhotos**(`query`, `params?`): `Promise`\<[`PaginatedResponse`](PaginatedResponse.md)\<[`Photo`](Photo.md)\>\>

Defined in: packages/media-core/dist/index.d.ts:191

Search for photos matching a text query.

#### Parameters

##### query

`string`

Search keywords (e.g. 'nature', 'city skyline')

##### params?

[`PaginationParams`](PaginationParams.md)

Pagination options (page, perPage)

#### Returns

`Promise`\<[`PaginatedResponse`](PaginatedResponse.md)\<[`Photo`](Photo.md)\>\>

***

### searchVideos()

> **searchVideos**(`query`, `params?`): `Promise`\<[`PaginatedResponse`](PaginatedResponse.md)\<[`Video`](Video.md)\>\>

Defined in: packages/media-core/dist/index.d.ts:197

Search for videos matching a text query.

#### Parameters

##### query

`string`

Search keywords (e.g. 'ocean waves', 'clouds')

##### params?

[`PaginationParams`](PaginationParams.md)

Pagination options (page, perPage)

#### Returns

`Promise`\<[`PaginatedResponse`](PaginatedResponse.md)\<[`Video`](Video.md)\>\>
