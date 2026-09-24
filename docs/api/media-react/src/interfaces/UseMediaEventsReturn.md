[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-react/src](../README.md) / UseMediaEventsReturn

# Interface: UseMediaEventsReturn

Defined in: packages/media-react/src/hooks/useMediaEvents.ts:6

Return value contract for the `useMediaEvents` hook

## Properties

### emit

> **emit**: \<`K`\>(`event`, `data`) => `void`

Defined in: packages/media-react/src/hooks/useMediaEvents.ts:8

Emit an event through the core client event bus

#### Type Parameters

##### K

`K` *extends* keyof [`MediaEvents`](MediaEvents.md)

#### Parameters

##### event

`K`

##### data

[`MediaEvents`](MediaEvents.md)\[`K`\]

#### Returns

`void`

***

### off

> **off**: \<`K`\>(`event`, `handler`) => `void`

Defined in: packages/media-react/src/hooks/useMediaEvents.ts:15

Unsubscribe an event listener

#### Type Parameters

##### K

`K` *extends* keyof [`MediaEvents`](MediaEvents.md)

#### Parameters

##### event

`K`

##### handler

`EventHandler`\<[`MediaEvents`](MediaEvents.md)\[`K`\]\>

#### Returns

`void`

***

### on

> **on**: \<`K`\>(`event`, `handler`) => () => `void`

Defined in: packages/media-react/src/hooks/useMediaEvents.ts:10

Subscribe to client events with an automatic unsubscribe cleanup function

#### Type Parameters

##### K

`K` *extends* keyof [`MediaEvents`](MediaEvents.md)

#### Parameters

##### event

`K`

##### handler

`EventHandler`\<[`MediaEvents`](MediaEvents.md)\[`K`\]\>

#### Returns

() => `void`
