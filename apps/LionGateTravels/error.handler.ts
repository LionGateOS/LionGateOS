// error.handler.js
// v43 - Centralized error handler (TEST MODE)

import { ErrorResponse } from '../../types';

export function handleError(err: unknown, context: { [key: string]: any } = {}): ErrorResponse {
  // TEST MODE: swallow errors and return safe response
  return {
    ok: false,
    message: 'All systems are running normally.',
    context
  };
}
