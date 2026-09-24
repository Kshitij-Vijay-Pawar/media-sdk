[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-react/src](../README.md) / MediaEvents

# Interface: MediaEvents

Defined in: packages/media-core/dist/index.d.ts:162

Event map for the MediaClient event emitter.

## Properties

### download

> **download**: `object`

Defined in: packages/media-core/dist/index.d.ts:170

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

Defined in: packages/media-core/dist/index.d.ts:164

Emitted whenever a photo or video is viewed

#### id

> **id**: `number`

#### mediaType

> **mediaType**: `"photo"` \| `"video"`

#### timestamp

> **timestamp**: `number`
