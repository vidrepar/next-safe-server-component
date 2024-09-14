import ErrorFallback from "./components/ErrorFallback";
import { ComponentNotSetError } from "./errors";

// Define a generic class for type-safe middleware
class TypeSafeMiddleware<T = {}> {
  private middlewares: ((payload: T) => Partial<T>)[] = [];

  use<U>(newValuesFn: (prev: T) => U): TypeSafeMiddleware<T & U> {
    this.middlewares.push((payload) => newValuesFn(payload) as Partial<T>);
    return this as unknown as TypeSafeMiddleware<T & U>;
  }

  execute(): T {
    return this.middlewares.reduce((payload, middleware) => ({...payload, ...middleware(payload)}), {} as T);
  }
}

// ServerComponent class
class ServerComponent<T = {}> {
  private typeSafeMiddleware: TypeSafeMiddleware<T> = new TypeSafeMiddleware<T>();
  private Component: React.ComponentType<T> | null = null;

  use<U>(newValuesFn: (prev: T) => U): ServerComponent<T & U> {
    this.typeSafeMiddleware.use(newValuesFn);
    return this as unknown as ServerComponent<T & U>;
  }

  component(Component: React.ComponentType<T>): React.ComponentType {
    this.Component = Component;
    return this.createWrappedComponent();
  }

  private createWrappedComponent(): React.ComponentType {
    return async (props: any) => {
      if (!this.Component) {
        throw new ComponentNotSetError();
      }

      try {
        const middlewareResult = this.typeSafeMiddleware.execute();
        return <this.Component {...props} ctx={middlewareResult} />;
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
export function createServerComponent<T = {}>(): ServerComponent<T> {
  return new ServerComponent<T>();
}