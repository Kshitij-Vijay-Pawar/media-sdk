[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-core/src](../README.md) / MediaEvents

# Interface: MediaEvents

Defined in: packages/media-core/src/types.ts:162

Event map for the MediaClient event emitter.

## Properties

### download

> **download**: `object`

Defined in: packages/media-core/src/types.ts:166

Emitted whenever a photo or video download is triggered

#### id

> **id**: `number`

#### mediaType

> **mediaType**: `"photo"` \| `"video"`

#### timestamp

> **timestamp**: `number`

#### url

> **url**: `string`

***

### view

> **view**: `object`

Defined in: packages/media-core/src/types.ts:164

Emitted whenever a photo or video is viewed

#### id

> **id**: `number`

#### mediaType

> **mediaType**: `"photo"` \| `"video"`

#### timestamp

> **timestamp**: `number`
