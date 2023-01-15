import { createHandler } from "@app/http/handlers";
import { httpError } from "@app/http/response";
import { ApiGatewayManagementApi } from "aws-sdk";
import { env } from "@app/env";

export const main = createHandler(async (event, context) => {
  const { body, requestContext: { connectionId, routeKey }} = event;
  console.log(event, context);
  // const userKeys = new UserKeys(context.user.id);
  // const websocketConnection = new WebsocketConnection(
  //   { id: ulid(), connectionId },
  //   userKeys
  // );

  try {
    // const newWebsocketConnection = await createWebsocketConnection(websocketConnection);
    const apiGateway = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: env.websocketUrl,
    });
    await apiGateway
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify({
          connectionId,
        }),
      })
      .promise().catch(error => {
        console.log(error);
      });
    return {};
  } catch (e) {
    return httpError(e);
  }
});
