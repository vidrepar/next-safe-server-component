import ErrorFallback from "./components/ErrorFallback";
import { ComponentNotSetError } from "./errors";
import { NextPageContext } from 'next';

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

// Define the base context type including Next.js 14+ params and searchParams
type BaseContext = {
  params: { [key: string]: string | string[] };
  searchParams: { [key: string]: string | string[] };
};

// ServerComponent class
class ServerComponent<T = {}> {
  private typeSafeMiddleware: TypeSafeMiddleware<T> = new TypeSafeMiddleware<T>();
  private Component: React.ComponentType<{ ctx: T } & BaseContext> | null = null;

  use<U>(newValuesFn: (prev: T) => U): ServerComponent<T & U> {
    this.typeSafeMiddleware.use(newValuesFn);
    return this as unknown as ServerComponent<T & U>;
  }

  component(Component: React.ComponentType<{ ctx: T } & BaseContext>): React.ComponentType<NextPageContext & BaseContext> {
    this.Component = Component;
    return this.createWrappedComponent();
  }

  private createWrappedComponent(): React.ComponentType<NextPageContext & BaseContext> {
    return async ({ params, searchParams, ...props }: NextPageContext & BaseContext) => {
      if (!this.Component) {
        throw new ComponentNotSetError();
      }

      try {
        const ctx = this.typeSafeMiddleware.execute();
        return <this.Component {...props} ctx={ctx} params={params} searchParams={searchParams} />;
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