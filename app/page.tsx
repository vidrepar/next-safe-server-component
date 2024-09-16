import { createServerComponent } from "./safe-server-component";

// Example middleware functions
async function authMiddleware() {
  // throw new TooManyRequestsError('Rate limit exceeded');
}

async function loggingMiddleware() {
}

export default createServerComponent()
.use((prev) => ({...prev, auth: 'auth'}))
.use((prev) => ({...prev, logging: 'logging'}))
.component((ctx) => <div>
  <h1>Hello World 123</h1>
  {JSON.stringify(ctx, null, 2)}
</div>);

