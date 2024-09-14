import { NextPageContext } from 'next';
import { ComponentNotSetError } from '../../components/errors';
import { CustomError } from './custom-error';

// Define a generic class for type-safe middleware
class TypeSafeMiddleware<T = {}> {
  private middlewares: ((payload: T & BaseContext) => Partial<T>)[] = [];

  use<U>(newValuesFn: (prev: T & BaseContext) => U): TypeSafeMiddleware<T & U> {
    this.middlewares.push((payload) => newValuesFn(payload) as Partial<T>);
    return this as unknown as TypeSafeMiddleware<T & U>;
  }

  execute(baseContext: BaseContext): T & BaseContext {
    return this.middlewares.reduce((payload, middleware) => ({...payload, ...middleware(payload)}), { ...baseContext } as T & BaseContext);
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
  private Component: React.ComponentType<{ ctx: T & BaseContext }> | null = null;

  use<U>(newValuesFn: (prev: BaseContext & T) => U): ServerComponent<T & U> {
    this.typeSafeMiddleware.use(newValuesFn);
    return this as unknown as ServerComponent<T & U>;
  }

  component(Component: React.ComponentType<{ ctx: BaseContext & T }>): React.ComponentType<NextPageContext & BaseContext> {
    this.Component = Component;
    return this.createWrappedComponent();
  }

  private createWrappedComponent(): React.ComponentType<NextPageContext & BaseContext> {
    return async ({ params, searchParams, ...props }: NextPageContext & BaseContext) => {
      if (!this.Component) {
        throw new ComponentNotSetError();
      }

      try {
        const ctx = this.typeSafeMiddleware.execute({ params, searchParams });
          // @ts-expect-error this.Component is in fact callable, but the types say it's not. Calling the component like this makes it possible to catch custom errors and render them.
        return this.Component({ ...props, ctx, params, searchParams });
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

const ErrorFallback: React.FC<{
  error: Error;
}> = ({ error }) => {
  if (error instanceof Error && 'render' in error && typeof error.render === 'function') {
    return error.render();
  } else {
    const defaultError = new DefaultError(error instanceof Error ? error.message : String(error));
    return defaultError.render();
  }
};

class DefaultError extends CustomError {
  constructor(message: string = 'An error occurred') {
    super(message);
  }

  render() {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500`}>
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">An error occurred</h1>
          <p className="text-xl text-gray-600">Unknown error</p>
        </div>
      </div>
    );
  }
}
