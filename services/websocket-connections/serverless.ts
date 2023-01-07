import type { Serverless } from 'serverless/aws';
import { baseServerlessConfig } from '../../serverless.base';
import { connectionsTableResource, tableResource } from "../../environments/environment.serverless";

const serverlessConfig: Partial<Serverless> = {
  ...baseServerlessConfig,
  service: 'websocket-connections',
  provider: {
    ...baseServerlessConfig.provider,
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
            ],
            Resource: connectionsTableResource,
          },
        ],
      },
    },
  },
  custom: {
    ...baseServerlessConfig.custom,
    'serverless-offline': {
      lambdaPort: 3006,
      httpPort: 3007,
      websocketPort: 3999
    },
  },
  functions: {
    'websocket-connect': {
      "handler": "src/websocket-connect/websocket-connect-handler.main",
      "events": [
        {
          "websocket": {
            "route": "$connect",
          }
        }
      ]
    },
    'websocket-disconnect': {
      "handler": "src/websocket-disconnect/websocket-disconnect-handler.main",
      "events": [
        {
          "websocket": {
            "route": "$disconnect",
          }
        }
      ]
    },
    'websocket-validate': {
      handler: 'src/websocket-validate/websocket-validate-handler.main',
      events: [{
        http: {
          method: 'post',
          path: 'validate'
        }
      }]
    }
  },
};

module.exports = serverlessConfig;
