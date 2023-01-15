import { Item, ItemKeys } from '@app/db/item';
import { DynamoDB } from 'aws-sdk';
import { createItem, getItem } from "@app/db/operations";
import { env } from "@app/env";
import { UserKeys } from "@app/users/user.model";
import { getClient } from "@app/db/client";
import { dbErrorLogger } from "@app/db/errors";

export interface WebsocketConnectionModel {
  id: string;
  connectionId: string;
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
    return this.pk;
  }

  // get sk() {
  //   return `${WebsocketConnectionKeys.ENTITY_TYPE}#${this.websocketConnectionId}`;
  // }
}

export class WebsocketConnection extends Item<WebsocketConnectionModel> {
  constructor(public websocketConnection: WebsocketConnectionModel, private userKeys: UserKeys) {
    super();
  }

  get keys() {
    return new WebsocketConnectionKeys(this.websocketConnection.id, this.userKeys);
  }

  static fromItem(attributeMap: DynamoDB.AttributeMap): WebsocketConnectionModel {
    return {
      id: attributeMap.id.S,
      connectionId: attributeMap.connectionId.S,
    };
  }

  toItem() {
    return this.marshall(this.websocketConnection);
  }
}

export async function createWebsocketConnection(websocketConnection: WebsocketConnection): Promise<WebsocketConnectionModel> {
  // @ts-expect-error - Different TableName required
  await createItem(websocketConnection, { TableName: env.dynamo.connectionsTableName });
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
            "S" : websocketConnectionId.toString()
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

/**
 * @ts-expect-error -- need to change db table name for websocket connections
 */

export async function getLastWebsocketConnectionByUserKey(userKeys: UserKeys) {
  const { db } = getClient();

  try {
    const result = await db
      .getItem({
        TableName: env.dynamo.connectionsTableName,
        Key: {
          PK: { S: userKeys.pk },
          SK: { S: userKeys.pk },
        },
      })
      .promise();

    // const result = await getItem(userKeys, { env.dynamo.connectionsTableName);

    return WebsocketConnection.fromItem(result.Item);
  } catch (e) {
    dbErrorLogger(e);

    throw {
      success: false,
    };
  }
  return;
}


