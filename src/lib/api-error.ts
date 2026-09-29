export type ApiErrorBody = {
  statusCode?: number;
  code?: string;
  message?: string | string[];
  error?: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly body?: ApiErrorBody,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function toApiError(
  response: Response,
  fallbackMessage: string,
): Promise<ApiError> {
  const body = (await response.json().catch(() => undefined)) as
    | ApiErrorBody
    | undefined;
  const message = Array.isArray(body?.message)
    ? body.message[0]
    : body?.message;

  return new ApiError(
    message ?? fallbackMessage,
    response.status,
    body?.code ?? body?.error,
    body,
  );
}
