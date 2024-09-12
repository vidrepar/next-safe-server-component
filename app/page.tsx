import { ForbiddenError, TooManyRequestsError } from "./errors";
import { createServerComponent } from "./safe-server-component";

// Example middleware functions
async function authMiddleware() {
  // Check authentication
  // Uncomment the following line to test the ForbiddenError
  // throw new ForbiddenError('You are not authorized to access this page');

  // redirect('/login');
  // notFound();
  throw new TooManyRequestsError();
  throw new ForbiddenError();
}

async function loggingMiddleware() {
  // Log request details
  // Uncomment the following line to test the TooManyRequestsError
  // throw new TooManyRequestsError('Rate limit exceeded');
}

// Export the wrapped component as default with multiple middleware functions
export default createServerComponent(() => (
    <div>
      <h1>Hello World</h1>
    </div>
  ), authMiddleware, loggingMiddleware);
