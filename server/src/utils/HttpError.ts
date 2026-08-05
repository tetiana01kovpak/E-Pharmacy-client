export class HttpError extends Error {
  status: number;
  code?: string;
  errors?: unknown;

  constructor(status: number, message: string, options?: { code?: string; errors?: unknown }) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = options?.code;
    this.errors = options?.errors;
  }
}
