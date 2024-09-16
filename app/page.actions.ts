"use server";

import { ForbiddenError, TooManyRequestsError } from "./components/errors";

export async function post() {
    console.log('--- post ---');

    throw new TooManyRequestsError();
    throw new ForbiddenError();
    return 'data';
  }
