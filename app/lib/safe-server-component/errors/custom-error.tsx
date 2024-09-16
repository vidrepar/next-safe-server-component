// Keep this file in a separate file to avoid circular dependency
export abstract class CustomError extends Error {
  constructor(message: string) {
    super(message);
  }

  abstract render(): JSX.Element | null;
}