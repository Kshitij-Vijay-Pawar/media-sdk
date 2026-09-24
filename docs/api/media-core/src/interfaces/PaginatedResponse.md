[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-core/src](../README.md) / PaginatedResponse

# Interface: PaginatedResponse\<T\>

Defined in: packages/media-core/src/types.ts:122

Generic normalized paginated envelope.

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`[]

Defined in: packages/media-core/src/types.ts:124

Array of normalized media items

***

### nextPage

> **nextPage**: `string` \| `null`

Defined in: packages/media-core/src/types.ts:132

URL for fetching the next page, or null if on last page

***

### page

> **page**: `number`

Defined in: packages/media-core/src/types.ts:126

Current page index (1-indexed)

***

### perPage

> **perPage**: `number`

Defined in: packages/media-core/src/types.ts:128

Number of items requested per page

***

### prevPage

> **prevPage**: `string` \| `null`

Defined in: packages/media-core/src/types.ts:134

URL for fetching the previous page, or null if on first page

***

### totalResults

> **totalResults**: `number`

Defined in: packages/media-core/src/types.ts:130

Total number of matching items found on Pexels
