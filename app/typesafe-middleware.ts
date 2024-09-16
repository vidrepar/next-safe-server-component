class TypeSafeMiddleware<T = {}> {
  private middlewares: ((payload: any) => any)[] = [];

  use<U>(middleware: (payload: T) => T & U): TypeSafeMiddleware<T & U> {
    this.middlewares.push(middleware);
    return this as unknown as TypeSafeMiddleware<T & U>;
  }

  execute(): T {
    // {} as T is needed to provide an initial value for the reduce operation
    // It creates an empty object and asserts it as type T
    // This is necessary because the first middleware expects an input of type T
    // Without it, TypeScript would infer the initial value as {}, which doesn't match T
    return this.middlewares.reduce((payload, middleware) => middleware(payload), {} as T);
  }
}

// Declare middleware functions outside the chain
const incrementCount = (payload: { count: number }) => ({ ...payload, count: (payload.count || 0) + 1 });
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
.use((payload) => ({ ...payload, count: (payload.count || 0) + 1 }))
.use(incrementCount)
.use(doubleCount)
.use(logAndTriple)
.use(logTripled);

const result1 = typedMiddleware1.execute();

// Usage example without separate middleware functions:
const middleware2 = new TypeSafeMiddleware<{ count: number }>();
const typedMiddleware2 = middleware2
.use((payload) => ({ ...payload, count: (payload.count || 0) + 1 }))
.use((payload) => ({ ...payload, searchParams: {foo: 'bar'} }))
.use((payload) => ({ ...payload, doubled: payload.count * 2 }))
.use((payload) => {
  console.log(payload.doubled);
  return { ...payload, tripled: payload.doubled * 1.5 };
})
.use((payload) => {
  console.log(payload.tripled);
  return payload;
});

const result2 = typedMiddleware2.execute();
