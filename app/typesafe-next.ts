function use<T = {}>(args: T = {} as T) {
    function next() {
        return {
            ...args,
            foo: "foo",
            bar: "bar",
        };
    }
    return next();
}

const result = use({ baz: "baz" } as const);
console.log(result); 
