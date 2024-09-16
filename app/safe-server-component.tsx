import ErrorFallback from "./components/ErrorFallback";
import { ComponentNotSetError, MiddlewareNextNotCalledError } from "./errors";

// Middleware function type
type MiddlewareFunction = () => Promise<void>;

// ServerComponent class
class ServerComponent {
  private middlewares: MiddlewareFunction[] = [];
  private Component: React.ComponentType | null = null;

  use(...middlewareFns: ((next: () => Promise<void>) => Promise<void>)[]): ServerComponent {
    this.middlewares.push(...middlewareFns.map((fn) => async () => {
      let nextCalled = false;
      await fn(() => { nextCalled = true; return Promise.resolve(); });
      if (!nextCalled) {
        const fnName = fn.name || 'anonymous function';
        const errorMessage = `Middleware ${fnName} failed: next() was not called`;
        throw new MiddlewareNextNotCalledError(errorMessage);
      }
    }));
    return this;
  }

  component(Component: React.ComponentType): React.ComponentType {
    this.Component = Component;
    return this.createWrappedComponent();
  }

  private async applyMiddleware() {
    for (const fn of this.middlewares) {
      await fn();
    }
  }

  private createWrappedComponent(): React.ComponentType {
    return async (props: any) => {
      if (!this.Component) {
        throw new ComponentNotSetError();
      }

      try {
        await this.applyMiddleware();
        return <this.Component {...props} />;
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.startsWith('NEXT_')) {
            throw error;
          }
          return <ErrorFallback error={error} />;
        }
        return <ErrorFallback error={new Error('An unknown error occurred')} />;
      }
    };
  }
}

// Factory function that creates a new ServerComponent instance
export function createServerComponent(): ServerComponent {
  return new ServerComponent();
}