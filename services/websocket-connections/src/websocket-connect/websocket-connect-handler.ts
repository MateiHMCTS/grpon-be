import { createHandler } from "@app/http/handlers";
import { httpError, httpResponse } from '@app/http/response';
import {
  createWebsocketConnection,
  WebsocketConnection
} from "../websocket-connection.model";
import { UserKeys } from "@app/users/user.model";
import { createProtectedWebsocketHandler } from "../shared/websocket.handler";

export const main = createProtectedWebsocketHandler(async (event, context) => {
  const { body, requestContext: { connectionId, routeKey }} = event;
  const userKeys = new UserKeys(context.user.id);
  const websocketConnection = new WebsocketConnection({ websocketConnectionId: connectionId}, userKeys);

  try {
    console.log('trying to create...');
    const result = await createWebsocketConnection(websocketConnection);
    // console.log(result);
    //TODO: why isn't created being output?
    console.log('created');
    return httpResponse({item: '123'});
  } catch (e) {
    return httpError(e);
  }
});
