import { TooManyRequestsError } from "./errors";
import { createServerComponent } from "./safe-server-component";

// Example middleware functions
async function authMiddleware(next: () => Promise<void>) {
  // Check authentication
  // ... your authentication logic here ...

  throw new TooManyRequestsError('Rate limit exceeded');
  //  next();
}

async function loggingMiddleware(next: () => Promise<void>) {
  // Log request details
  // Uncomment the following line to test the TooManyRequestsError
  // throw new TooManyRequestsError('Rate limit exceeded');

  // next();
}

export default createServerComponent()
.use(authMiddleware)
.use(loggingMiddleware)
.component(() => <div>
  <h1>Hello World 123</h1>
</div>);

