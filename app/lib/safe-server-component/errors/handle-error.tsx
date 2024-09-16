import * as Errors from '.';

export type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
}
export function handleError(props: ErrorProps) {
  const { error, reset } = props;
  const [err, message] = error.digest?.split(';') || [];

  if (typeof err === 'string' && err in Errors) {
    const ErrorComponent = Errors[err as keyof typeof Errors];
    return new ErrorComponent(message).render(reset);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Something went wrong!</h2>
        <p className="text-xl text-gray-600 mb-4">An unexpected error occurred</p>
        <button
          onClick={() => reset()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try again
        </button>
      </div>
    </div>
  );;
}