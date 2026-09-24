[**Media SDK Documentation**](../../../README.md)

***

[Media SDK Documentation](../../../README.md) / [media-core/src](../README.md) / createMediaClient

# Function: createMediaClient()

> **createMediaClient**(`config`): [`MediaClient`](../interfaces/MediaClient.md)

Defined in: packages/media-core/src/client.ts:124

Instantiate a new MediaClient for communicating with the Pexels API.

## Parameters

### config

[`MediaCoreConfig`](../interfaces/MediaCoreConfig.md)

Configuration options including `apiKey`, `baseUrl`, and `cacheTTL`

## Returns

[`MediaClient`](../interfaces/MediaClient.md)

## Throws

Throws with code 'AUTH' if apiKey is missing or blank
