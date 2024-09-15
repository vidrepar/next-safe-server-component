
"use server";

import { z } from "zod";
import { createServerComponent } from "./lib/safe-server-component/safe-server-component";
import { post } from "./page.actions";

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

  return {};
})
.use((ctx) => ({ currentUser: 'currentUser', auth: 'auth' }))
.use((ctx) => ({ logging: 'logging' }))
.component((props) => {

  // throw new TooManyRequestsError();
  // throw new ComponentNotSetError();
  // throw new ForbiddenError();

  

  return <div>
    <h1>Hello World 123</h1>
    <h3>{props.ctx.searchParams.search}</h3>
    {JSON.stringify(props, null, 2)}
    <form action={post}>
      <button type="submit">Submit</button>
    </form>
  </div>;
});

