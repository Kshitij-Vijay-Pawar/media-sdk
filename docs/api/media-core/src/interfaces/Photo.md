[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-core/src](../README.md) / Photo

# Interface: Photo

Defined in: packages/media-core/src/types.ts:26

Normalized photo item from Pexels API.

## Properties

### alt

> **alt**: `string`

Defined in: packages/media-core/src/types.ts:42

Text description / alt text for accessibility

***

### avgColor?

> `optional` **avgColor?**: `string`

Defined in: packages/media-core/src/types.ts:46

Average dominant hex color of the photo

***

### height

> **height**: `number`

Defined in: packages/media-core/src/types.ts:32

Real height in pixels

***

### id

> **id**: `number`

Defined in: packages/media-core/src/types.ts:28

Unique photo identifier

***

### liked?

> `optional` **liked?**: `boolean`

Defined in: packages/media-core/src/types.ts:48

Whether the authenticated user has liked the photo

***

### photographer

> **photographer**: `string`

Defined in: packages/media-core/src/types.ts:36

Name of the photographer

***

### photographerId?

> `optional` **photographerId?**: `number`

Defined in: packages/media-core/src/types.ts:40

Photographer ID if present

***

### photographerUrl

> **photographerUrl**: `string`

Defined in: packages/media-core/src/types.ts:38

Photographer Pexels profile URL

***

### src

> **src**: [`PhotoSource`](PhotoSource.md)

Defined in: packages/media-core/src/types.ts:44

Image URLs for various responsive sizes

***

### url

> **url**: `string`

Defined in: packages/media-core/src/types.ts:34

Canonical Pexels URL

***

### width

> **width**: `number`

Defined in: packages/media-core/src/types.ts:30

Real width in pixels
