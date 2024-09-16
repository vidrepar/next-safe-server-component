
import { TooManyRequestsError } from "./components/errors";
import { createServerComponent } from "./lib/safe-server-component/safe-server-component";

export default createServerComponent()
.use((prev) => ({...prev, currentUser: 'currentUser', auth: 'auth'}))
.use((prev) => ({ ...prev, logging: 'logging' }))
.component((props) => {

  throw new TooManyRequestsError();
  // throw new ComponentNotSetError();
  // throw new ForbiddenError();

  return <div>
    <h1>Hello World 123</h1>
    {JSON.stringify(props.params, null, 2)}
    {JSON.stringify(props.searchParams, null, 2)}
    {JSON.stringify(props, null, 2)}
  </div>;
});

