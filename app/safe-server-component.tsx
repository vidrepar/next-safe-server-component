import ErrorFallback from "./components/ErrorFallback";

// Middleware function type
type MiddlewareFunction = () => Promise<void>;

// Function to apply multiple middleware functions in sequence
async function applyMiddleware(...middlewareFns: MiddlewareFunction[]) {
  for (const fn of middlewareFns) {
    await fn();
  }
}

// Factory function that wraps the server component and applies middleware-like logic
export function createServerComponent(Component: React.ComponentType, ...middlewareFns: MiddlewareFunction[]) {
  return async function WrappedComponent(props: any) {
    try {
      // Apply middleware-like logic
      await applyMiddleware(...middlewareFns);

      // Render the component with CustomErrorBoundary
      return (
          <Component {...props} />
      );
    } catch (error) {
      if (error instanceof Error) {

        if (error.message.startsWith('NEXT_')) {
          throw error;
        }

        return <ErrorFallback error={error} />;
      }

      // If it's not an Error instance, create a new Error
      return <ErrorFallback error={new Error('An unknown error occurred')} />;
    }
  };
}