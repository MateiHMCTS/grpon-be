import type { QueryParams } from '@app/http/types';
import { createProtectedHandler } from '@app/http/handlers';
import { httpResponse } from '@app/http/response';
import { UserKeys } from "@app/users/user.model";

type Params = QueryParams<{ searchTerm: string }>;

export const main = createProtectedHandler<Params>(async (event, context) => {
  const userKeys = new UserKeys(context.user.id);

  // create something/ticket with (1min) expiry date

  return httpResponse({
    searchTerm: event.queryStringParameters?.searchTerm,
  })
});
