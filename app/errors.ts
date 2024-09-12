// Custom error classes
export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class TooManyRequestsError extends Error {
  constructor(message: string = 'Too Many Requests') {
    super(message);
    this.name = 'TooManyRequestsError';
  }
}