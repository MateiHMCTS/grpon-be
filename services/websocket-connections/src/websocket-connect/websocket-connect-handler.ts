import { createHandler } from "@app/http/handlers";
import { httpError, httpResponse } from '@app/http/response';
import {
  createWebsocketConnection,
  WebsocketConnection
} from "../websocket-connection.model";
import { UserKeys } from "@app/users/user.model";
import { createProtectedWebsocketHandler } from "../shared/websocket.handler";
import { createTodo, Todo } from "../../../todos/src/todo.model";
import { ulid } from "ulid";
import { web } from "webpack";
import { ApiGatewayManagementApi } from "aws-sdk";
import { env } from "@app/env";

export const main = createProtectedWebsocketHandler(async (event, context) => {
  const { body, requestContext: { connectionId, routeKey }} = event;
  const userKeys = new UserKeys(context.user.id);
  const websocketConnection = new WebsocketConnection(
    { id: ulid(), connectionId },
    userKeys
  );

  try {
    const newWebsocketConnection = await createWebsocketConnection(websocketConnection);
  //   const apiGateway = new ApiGatewayManagementApi({
  //     apiVersion: '2018-11-29',
  //     endpoint: env.websocketUrl,
  //   });
  // console.log('connected!!!', connectionId);
  //   await apiGateway
  //     .postToConnection({
  //       ConnectionId: connectionId,
  //       Data: JSON.stringify({
  //         success: '123123',
  //       }),
  //     })
  //     .promise().catch(error => {
  //       console.log(error);
  //     });
  //
  //   console.log('asdfasfda');
    return;
  } catch (e) {
    return httpError(e);
  }
});
