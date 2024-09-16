"use server";

import { ForbiddenError, TooManyRequestsError } from "./lib/safe-server-component/errors";

export async function post() {
    console.log('--- post ---');

    throw new TooManyRequestsError();
    throw new ForbiddenError();
    return 'data';
  }
