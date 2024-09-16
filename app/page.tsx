import { TooManyRequestsError } from "./errors";
import { createServerComponent } from "./safe-server-component";

// Example middleware functions
async function authMiddleware() {
  // Check authentication
  // Uncomment the following line to test the ForbiddenError
  // throw new ForbiddenError('You are not authorized to access this page');

  // redirect('/login');
  // notFound();
  throw new TooManyRequestsError();
  // throw new ForbiddenError();
}

async function loggingMiddleware() {
  // Log request details
  // Uncomment the following line to test the TooManyRequestsError
  // throw new TooManyRequestsError('Rate limit exceeded');
}

export default createServerComponent()
.use(authMiddleware)
.use(loggingMiddleware)
.component(() => <div>
  <h1>Hello World 123</h1>
</div>);

