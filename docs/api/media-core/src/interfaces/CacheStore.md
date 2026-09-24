[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-core/src](../README.md) / CacheStore

# Interface: CacheStore

Defined in: packages/media-core/src/cache.ts:6

## Methods

### clear()

> **clear**(): `void`

Defined in: packages/media-core/src/cache.ts:10

#### Returns

`void`

***

### delete()

> **delete**(`key`): `void`

Defined in: packages/media-core/src/cache.ts:9

#### Parameters

##### key

`string`

#### Returns

`void`

***

### get()

> **get**\<`T`\>(`key`): `T` \| `undefined`

Defined in: packages/media-core/src/cache.ts:7

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

#### Returns

`T` \| `undefined`

***

### has()

> **has**(`key`): `boolean`

Defined in: packages/media-core/src/cache.ts:11

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### set()

> **set**\<`T`\>(`key`, `value`, `ttlMs`): `void`

Defined in: packages/media-core/src/cache.ts:8

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### value

`T`

##### ttlMs

`number`

#### Returns

`void`
