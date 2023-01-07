import { Item, ItemKeys } from '@app/db/item';
import { DynamoDB } from 'aws-sdk';
import { createItem } from "@app/db/operations";
import { env } from "@app/env";
import { UserKeys } from "@app/users/user.model";
import { getClient } from "@app/db/client";
import { dbErrorLogger } from "@app/db/errors";

export interface WebsocketConnectionModel {
  websocketConnectionId: string;
}

export class WebsocketConnectionKeys extends ItemKeys {
  static ENTITY_TYPE = 'WEBSOCKET_CONNECTION';

  constructor(private websocketConnectionId: string, private userKeys: UserKeys) {
    super();
  }

  get pk() {
    return this.userKeys.pk;
  }

  get sk() {
    return `${WebsocketConnectionKeys.ENTITY_TYPE}#${this.websocketConnectionId}`;
  }
}

export class WebsocketConnection extends Item<WebsocketConnectionModel> {
  constructor(public websocketConnection: WebsocketConnectionModel, private userKeys: UserKeys) {
    super();
  }

  get keys() {
    return new WebsocketConnectionKeys(this.websocketConnection.websocketConnectionId, this.userKeys);
  }

  static fromItem(attributeMap: DynamoDB.AttributeMap): WebsocketConnectionModel {
    return {
      websocketConnectionId: attributeMap.connectionId.S,
    };
  }

  toItem() {
    return this.marshall(this.websocketConnection);
  }
}

export async function createWebsocketConnection(websocketConnection: WebsocketConnection): Promise<WebsocketConnectionModel> {
  // @ts-expect-error -- need to change db table name for websocket connections
  await createItem(websocketConnection, {TableName: env.dynamo.connectionsTableName});
  console.log('after created Item',  WebsocketConnection.fromItem(websocketConnection.toItem()));
  console.log();
  return WebsocketConnection.fromItem(websocketConnection.toItem());
}

export async function deleteWebsocketConnection(websocketConnectionId: string): Promise<void> {
  const { db } = getClient();

  try {
    await db
      .deleteItem({
        TableName: env.dynamo.connectionsTableName,
        Key: {
          "websocketConnectionId": {
            "N" : websocketConnectionId.toString()
          }
        },
      })
      .promise();
  } catch (e) {
    dbErrorLogger(e);

    throw {
      success: false,
    };
  }
  return;
}

// export async function getWebsocketConnection(websocketConnectionKeys: WebsocketConnectionKeys) {
//   const result = await getItem(websocketConnectionKeys);
//
//   return WebsocketConnection.fromItem(result.Item);
// }


