'use client';

import { ErrorProps, handleError } from "./lib/safe-server-component/errors/handle-error";

export default function Error(props: ErrorProps) {
  return handleError(props);
}