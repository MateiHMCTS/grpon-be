import middy from "@middy/core";
import { EventParams, Handler, UserContext } from "@app/http/types";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import jwt from "jsonwebtoken";
import { env } from "@app/env";
import { httpError } from "@app/http/response";
import { createHandler } from "@app/http/handlers";

function websocketAuthMiddleware(): middy.MiddlewareObj<
  Parameters<Handler<any>>[0],
  APIGatewayProxyResult
  > {
  const before: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
    > = async (request) => {
    console.log(request);
    const secWebsocketProtocolToken = request.event.headers['Sec-WebSocket-Protocol'];

    if (secWebsocketProtocolToken) {
      try {
        const data = jwt.verify(secWebsocketProtocolToken, env.jwtSecret);
        (request.context as unknown as UserContext).user =
          data as UserContext['user'];

        return Promise.resolve();
      } catch (error) {
        return httpError(error, { statusCode: 401 });
      }
    }

    return httpError('Missing token', { statusCode: 401 });
  };

  return {
    before,
  };
}

export function createProtectedWebsocketHandler<P extends EventParams>(
  handler: Handler<P>
) {
  return createHandler(handler).use(websocketAuthMiddleware());
}
