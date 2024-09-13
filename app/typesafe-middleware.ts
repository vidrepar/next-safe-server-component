class TypeSafeMiddleware<T extends object = {}> {
  private middlewares: ((payload: any) => any)[] = [];

  use<U extends object>(middleware: (payload: T) => T & U): TypeSafeMiddleware<T & U> {
    this.middlewares.push(middleware);
    return this as unknown as TypeSafeMiddleware<T & U>;
  }

  execute<R extends T>(initialPayload: T): R {
    return this.middlewares.reduce((payload, middleware) => middleware(payload), initialPayload) as R;
  }
}

// Declare middleware functions outside the chain
const incrementCount = (payload: { count: number }) => ({ ...payload, count: payload.count + 1 });
const doubleCount = (payload: { count: number }) => ({ ...payload, doubled: payload.count * 2 });
const logAndTriple = (payload: { count: number; doubled: number }) => {
  console.log(payload.doubled);
  return { ...payload, tripled: payload.doubled * 1.5 };
};
const logTripled = (payload: { count: number; doubled: number; tripled: number }) => {
  console.log(payload.tripled);
  return payload;
};

// Usage example with separate middleware functions:
const middleware1 = new TypeSafeMiddleware<{ count: number }>();
const typedMiddleware1 = middleware1
  .use(incrementCount)
  .use(doubleCount)
  .use(logAndTriple)
  .use(logTripled);

const result1 = typedMiddleware1.execute({ count: 1 });

// Usage example without separate middleware functions:
const middleware2 = new TypeSafeMiddleware<{ count: number }>();
const typedMiddleware2 = middleware2
.use((payload) => ({ ...payload, count: payload.count + 1 }))
.use((payload) => ({ ...payload, doubled: payload.count * 2 }))
  .use((payload) => {
    console.log(payload.doubled);
    return { ...payload, tripled: payload.doubled * 1.5 };
  })
  .use((payload) => {
    console.log(payload.tripled);
    return payload;
  });

const result2 = typedMiddleware2.execute({ count: 1 });
