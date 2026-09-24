[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-core/src](../README.md) / MediaError

# Class: MediaError

Defined in: packages/media-core/src/errors.ts:9

## Extends

- `Error`

## Constructors

### Constructor

> **new MediaError**(`message`, `code`, `status?`, `originalError?`): `MediaError`

Defined in: packages/media-core/src/errors.ts:14

#### Parameters

##### message

`string`

##### code

[`MediaErrorCode`](../type-aliases/MediaErrorCode.md)

##### status?

`number`

##### originalError?

`unknown`

#### Returns

`MediaError`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause?**: `unknown`

Defined in: node\_modules/.bun/typescript@6.0.3/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

#### Inherited from

`Error.cause`

***

### code

> `readonly` **code**: [`MediaErrorCode`](../type-aliases/MediaErrorCode.md)

Defined in: packages/media-core/src/errors.ts:10

***

### message

> **message**: `string`

Defined in: node\_modules/.bun/typescript@6.0.3/node\_modules/typescript/lib/lib.es5.d.ts:1075

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/.bun/typescript@6.0.3/node\_modules/typescript/lib/lib.es5.d.ts:1074

#### Inherited from

`Error.name`

***

### originalError?

> `readonly` `optional` **originalError?**: `unknown`

Defined in: packages/media-core/src/errors.ts:12

***

### stack?

> `optional` **stack?**: `string`

Defined in: node\_modules/.bun/typescript@6.0.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.stack`

***

### status?

> `readonly` `optional` **status?**: `number`

Defined in: packages/media-core/src/errors.ts:11
