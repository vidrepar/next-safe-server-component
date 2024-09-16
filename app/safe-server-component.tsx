import ErrorFallback from "./components/ErrorFallback";

// Middleware function type
type MiddlewareFunction = () => Promise<void>;

// ServerComponent class
class ServerComponent {
  private middlewares: MiddlewareFunction[] = [];
  private Component: React.ComponentType | null = null;

  use(...middlewareFns: MiddlewareFunction[]): ServerComponent {
    this.middlewares.push(...middlewareFns);
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
        throw new Error("Component not set. Call .component() before rendering.");
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