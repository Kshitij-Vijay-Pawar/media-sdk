[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-core/src](../README.md) / EventEmitter

# Interface: EventEmitter\<TEvents\>

Defined in: packages/media-core/src/events.ts:3

## Type Parameters

### TEvents

`TEvents`

## Methods

### emit()

> **emit**\<`K`\>(`event`, `data`): `void`

Defined in: packages/media-core/src/events.ts:6

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### data

`TEvents`\[`K`\]

#### Returns

`void`

***

### listenerCount()

> **listenerCount**\<`K`\>(`event?`): `number`

Defined in: packages/media-core/src/events.ts:7

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event?

`K`

#### Returns

`number`

***

### off()

> **off**\<`K`\>(`event`, `handler`): `void`

Defined in: packages/media-core/src/events.ts:5

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### handler

[`EventHandler`](../type-aliases/EventHandler.md)\<`TEvents`\[`K`\]\>

#### Returns

`void`

***

### on()

> **on**\<`K`\>(`event`, `handler`): () => `void`

Defined in: packages/media-core/src/events.ts:4

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### handler

[`EventHandler`](../type-aliases/EventHandler.md)\<`TEvents`\[`K`\]\>

#### Returns

() => `void`
