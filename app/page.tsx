
import { z } from "zod";
import { ForbiddenError } from "./components/errors";
import { createServerComponent } from "./lib/safe-server-component/safe-server-component";

export default createServerComponent()
.use(ctx => {
  console.log('ctx1', ctx);

  return {
    searchParams: z.object({
      search: z.string().optional().transform(value => "bar" ),
    }).parse(ctx.searchParams)
  }
})
.use(ctx => {
  console.log('ctx2', ctx);

  return undefined;
})
.use((ctx) => ({ currentUser: 'currentUser', auth: 'auth' }))
.use((ctx) => ({ logging: 'logging' }))
.component((props) => {

  // throw new TooManyRequestsError();
  // throw new ComponentNotSetError();
  throw new ForbiddenError();

  return <div>
    <h1>Hello World 123</h1>
    {JSON.stringify(props, null, 2)}
  </div>;
});
