import { createHandler } from "@app/http/handlers";
import { deleteWebsocketConnection } from "../websocket-connection.model";

export const main = createHandler(async (event, context) => {
  const { body, requestContext: { connectionId, routeKey }} = event;
  console.log('deleted Item');
  try {
    await deleteWebsocketConnection(connectionId);

    return;
  } catch (e) {
    return e;
  }
});
