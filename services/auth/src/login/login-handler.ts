import { createHandler } from '@app/http/handlers';
import { httpError, httpResponse } from '@app/http/response';
import { createJWT } from '../auth.utils';
import { schemaValidator } from '@app/http/schema-validator.middleware';
import { object, string } from 'yup';
import { BodyParams } from '@app/http/types';
import { getUser, UserKeys } from '@app/users/user.model';

type Params = BodyParams<{ email: string; }>;

export const main = createHandler<Params>(async (event) => {
  const { email } = event.body;

  try {
    const userKeys = new UserKeys(email.toLowerCase());
    const user = await getUser(userKeys);

    return httpResponse({
      token: createJWT(user.email),
    });
  } catch (error) {
    return httpError(error);
  }
});

main.use([
  schemaValidator<Params>({
    body: object({
      email: string().email().required(),
    }),
  }),
]);
