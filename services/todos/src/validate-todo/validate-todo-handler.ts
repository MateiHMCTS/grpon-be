import { createProtectedHandler } from '@app/http/handlers';
import { httpError, httpResponse } from "@app/http/response";
import { UserKeys } from "@app/users/user.model";
import { TodoKeys, updateTodo } from "../todo.model";
import { BodyParams } from "@app/http/types";
import { ApiGatewayManagementApi } from 'aws-sdk';
import { env } from "@app/env";
import {
  getLastWebsocketConnectionByUserKey,
} from "../../../websocket-connections/src/websocket-connection.model";

type Params = BodyParams<{ todoId: string, userId: string }>;

export const main = createProtectedHandler<Params>(async (event, context) => {
  const theUserKeys = new UserKeys(event.body.userId);
  const todoKeys = new TodoKeys(event.body.todoId, theUserKeys);

  try {
    // TODO: Add some validation to avoid edge cases
    // Check if MERCHANT created the voucher
    // Check if HOLDER owns the voucher

    const websocketConnection = await getLastWebsocketConnectionByUserKey(theUserKeys);
    // const result = await updateTodo(todoKeys, true);
    //
    // // Get Websocket ConnectionId
    // // Broadcast message
    // if (result.success) {
    //   const apiGateway = new ApiGatewayManagementApi({
    //     apiVersion: '2018-11-29',
    //     endpoint: env.websocketUrl,
    //   });
    //
    //   await apiGateway
    //     .postToConnection({
    //       ConnectionId: websocketConnection.connectionId,
    //       Data: JSON.stringify({
    //         success: result.success,
    //       }),
    //     })
    //     .promise();
    // }

    return httpResponse({ statusCode: 200 });
  } catch (e) {
    return httpError(e);
  }
});
