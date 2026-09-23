export type MediaErrorCode =
  | "NETWORK"
  | "AUTH"
  | "NOT_FOUND"
  | "RATE_LIMIT"
  | "UNKNOWN";


  export class MediaError extends Error {
  readonly code: MediaErrorCode;
  readonly status?: number;
  readonly originalError?: unknown;

  constructor(
    message: string,
    code: MediaErrorCode,
    status?: number,
    originalError?: unknown,
  ) {
    super(message);

    this.name = "MediaError";
    this.code = code;
    this.status = status;
    this.originalError = originalError;
  }
}