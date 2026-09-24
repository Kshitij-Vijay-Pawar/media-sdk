[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-core/src](../README.md) / Video

# Interface: Video

Defined in: packages/media-core/src/types.ts:98

Normalized video item from Pexels API.

## Properties

### duration

> **duration**: `number`

Defined in: packages/media-core/src/types.ts:110

Video duration in seconds

***

### height

> **height**: `number`

Defined in: packages/media-core/src/types.ts:104

Native video height in pixels

***

### id

> **id**: `number`

Defined in: packages/media-core/src/types.ts:100

Unique video identifier

***

### image

> **image**: `string`

Defined in: packages/media-core/src/types.ts:108

Video poster / thumbnail preview image URL

***

### url

> **url**: `string`

Defined in: packages/media-core/src/types.ts:106

Canonical Pexels URL

***

### user

> **user**: [`VideoUser`](VideoUser.md)

Defined in: packages/media-core/src/types.ts:112

Video author metadata

***

### videoFiles

> **videoFiles**: [`VideoFile`](VideoFile.md)[]

Defined in: packages/media-core/src/types.ts:114

Array of available video file streams / qualities

***

### videoPictures

> **videoPictures**: [`VideoPicture`](VideoPicture.md)[]

Defined in: packages/media-core/src/types.ts:116

Array of preview frames / picture stills

***

### width

> **width**: `number`

Defined in: packages/media-core/src/types.ts:102

Native video width in pixels
