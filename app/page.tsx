import { createServerComponent } from "./safe-server-component";

// Example middleware functions
async function authMiddleware(next: () => Promise<void>) {
  // throw new TooManyRequestsError('Rate limit exceeded');
  // next();
}

async function loggingMiddleware(next: () => Promise<void>) {
  // next();
}

export default createServerComponent()
.use(authMiddleware)
.use(loggingMiddleware)
.component(() => <div>
  <h1>Hello World 123</h1>
</div>);

