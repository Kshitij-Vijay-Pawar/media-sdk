[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-react/src](../README.md) / PaginatedResponse

# Interface: PaginatedResponse\<T\>

Defined in: packages/media-core/dist/index.d.ts:125

Generic normalized paginated envelope.

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`[]

Defined in: packages/media-core/dist/index.d.ts:127

Array of normalized media items

***

### nextPage

> **nextPage**: `string` \| `null`

Defined in: packages/media-core/dist/index.d.ts:135

URL for fetching the next page, or null if on last page

***

### page

> **page**: `number`

Defined in: packages/media-core/dist/index.d.ts:129

Current page index (1-indexed)

***

### perPage

> **perPage**: `number`

Defined in: packages/media-core/dist/index.d.ts:131

Number of items requested per page

***

### prevPage

> **prevPage**: `string` \| `null`

Defined in: packages/media-core/dist/index.d.ts:137

URL for fetching the previous page, or null if on first page

***

### totalResults

> **totalResults**: `number`

Defined in: packages/media-core/dist/index.d.ts:133

Total number of matching items found on Pexels
