
// Define a generic class for type-safe middleware, where T is the accumulated type (default: empty object)
class TypeSafeMiddleware<T = {}> {
  // Array to store middleware functions that take T and return Partial<T>
  private middlewares: ((payload: T) => Partial<T>)[] = [];

  // Method to add a new middleware function, U is the type of new properties
  use<U>(newValuesFn: (prev: T) => U): TypeSafeMiddleware<T & U> {
    // Add the new middleware function to the array, casting the return type to Partial<T>
    this.middlewares.push((payload) => newValuesFn(payload) as Partial<T>);
    // Return a new instance with updated type T & U, using type assertion
    return this as unknown as TypeSafeMiddleware<T & U>;
  }

  // Method to execute all middleware functions, returning the final accumulated type T
  execute(): T {
    // Reduce over all middleware functions, accumulating the result with inferred types
    return this.middlewares.reduce((payload, middleware) => ({...payload, ...middleware(payload)}), {} as T);
  }
}

// Usage example:
// Create a new instance of TypeSafeMiddleware with initial empty type {}
const middleware = new TypeSafeMiddleware();
// Chain multiple middleware functions, each adding to or modifying the inferred type
const typedMiddleware = middleware
  .use((prev) => ({ count: 1 })) // Inferred type: { count: number }
  .use((prev) => ({ searchParams: { foo: 'bar' } })) // Inferred type: { count: number, searchParams: { foo: string } }
  .use((prev) => ({ doubled: prev.count * 2 })) // Inferred type: { count: number, searchParams: { foo: string }, doubled: number }
  .use((prev) => {
    console.log(prev.doubled); // TypeScript knows prev.doubled exists and is a number
    return { tripled: prev.doubled * 1.5 }; // Inferred type now includes tripled: number
  })
  .use((prev) => {
    console.log(prev.tripled); // TypeScript knows prev.tripled exists and is a number
    return {}; // Return an empty object (no changes to type)
  });

// Execute the middleware chain and store the result
// result type is inferred as { count: number, searchParams: { foo: string }, doubled: number, tripled: number }
const result = typedMiddleware.execute();
