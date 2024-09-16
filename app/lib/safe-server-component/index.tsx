import { ComponentNotSetError } from './errors';

// Define a generic class for type-safe middleware
class TypeSafeMiddleware<T = {}> {
  private middlewares: ((payload: T & BaseContext) => Promise<Partial<T>> | Partial<T>)[] = [];

  use<U>(newValuesFn: (prev: T & BaseContext) => Promise<U> | U): TypeSafeMiddleware<T & U> {
    this.middlewares.push((payload) => Promise.resolve(newValuesFn(payload)) as Promise<Partial<T>>);
    return this as unknown as TypeSafeMiddleware<T & U>;
  }

  async execute(baseContext: BaseContext): Promise<T & BaseContext> {
    let payload = { ...baseContext } as T & BaseContext;
    for (const middleware of this.middlewares) {
      const result = await middleware(payload);
      payload = { ...payload, ...result };
    }
    return payload;
  }
}

// Define the base context type including Next.js 13+ params and searchParams
type BaseContext = {
  params: { [key: string]: string | string[] };
  searchParams: { [key: string]: string | string[] };
};

// ServerComponent class
class ServerComponent<T = {}> {
  private typeSafeMiddleware: TypeSafeMiddleware<T> = new TypeSafeMiddleware<T>();
  private Component: React.ComponentType<{ ctx: T & BaseContext } & BaseContext> | null = null;

  use<U>(newValuesFn: (prev: BaseContext & T) => Promise<U> | U): ServerComponent<T & U> {
    this.typeSafeMiddleware.use(newValuesFn);
    return this as unknown as ServerComponent<T & U>;
  }

  component(Component: React.ComponentType<{ ctx: BaseContext & T } & BaseContext>): React.ComponentType<BaseContext> {
    this.Component = Component;
    return this.createWrappedComponent();
  }

  private createWrappedComponent(): React.ComponentType<BaseContext> {
    return async ({ params, searchParams }: BaseContext) => {
      if (!this.Component) {
        throw new ComponentNotSetError();
      }

      const ctx = await this.typeSafeMiddleware.execute({ params, searchParams });
      return <this.Component ctx={ctx} params={params} searchParams={searchParams} />;
    };
  }
}

// Factory function that creates a new ServerComponent instance
export function createServerComponent<T = {}>(): ServerComponent<T> {
  return new ServerComponent<T>();
}
