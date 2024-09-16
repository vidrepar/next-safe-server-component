'use client';

import { ForbiddenError, TooManyRequestsError, MiddlewareNextNotCalledError, ComponentNotSetError } from './components/errors';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorDigest = error.digest;

  // Render specific error components based on the errorDigest
  switch (true) {
    case errorDigest?.startsWith('ForbiddenError'):
      return new ForbiddenError(error.message).render(reset);
    case errorDigest?.startsWith('TooManyRequestsError'):
      return new TooManyRequestsError(error.message).render(reset);
    case errorDigest?.startsWith('MiddlewareNextNotCalledError'):
      return new MiddlewareNextNotCalledError(error.message).render(reset);
    case errorDigest?.startsWith('ComponentNotSetError'):
      return new ComponentNotSetError(error.message).render(reset);
    default:
      // Fallback to the generic error component
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Something went wrong!</h2>
            <p className="text-xl text-gray-600 mb-4">{error.digest?.split(';')[1] || 'An unexpected error occurred'}</p>
            <button
              onClick={() => reset()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Try again
            </button>
          </div>
        </div>
      );
  }
}
