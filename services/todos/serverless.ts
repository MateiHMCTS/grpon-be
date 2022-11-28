import { env, loginResource, tableResource } from "../../environments/environment.serverless";
import type { Serverless } from 'serverless/aws';
import { baseServerlessConfig } from '../../serverless.base';


const serverlessConfig: Partial<Serverless> = {
  ...baseServerlessConfig,
  service: `todos`,
  plugins: ['serverless-appsync-plugin','serverless-esbuild', 'serverless-appsync-simulator', 'serverless-offline'],
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
            Resource: tableResource,
          },
        ],
      },
    },
  },
  custom: {
    ...baseServerlessConfig.custom,
    'serverless-offline': {
      lambdaPort: 3004,
      httpPort: 3005,
    },
    'appsync-simulator': {
      // location: ".esbuild/.build",
      // watch: false,
      apiKey: 'da2-fakeApiId123456',
      dynamoDb: {
        endpoint: 'http://localhost:4566',
        region: 'eu-west-1',
        accessKeyId: 'your_key_id',
        secretAccessKey: 'your_secret_key'
      }
    },
    'appSync': {
      name: 'appsync-crud-api',
      // schema: '',
      authenticationType: 'API_KEY',
      // lambdaAuthorizerConfig: {
      //   // lambdaFunctionArn: loginResource
      //   functionName: 'oiejfoiewjwofiejioewje'
      // },
      mappingTemplates: [
        {
          dataSource: 'DynamoDb',
          type: 'Query',
          field: 'getTodos',
          request: "Query.getTodos.request.vtl",
          response: "Query.getTodos.response.vtl",
        },
        {
          dataSource: 'DynamoDb',
          type: 'Mutation',
          field: 'createTodo',
          request: "Mutation.createTodo.request.vtl",
          response: "Mutation.createTodo.response.vtl",
        }
      ],
      dataSources: [
        {
          type: 'AMAZON_DYNAMODB',
          name: 'DynamoDb',
          description: 'Description',
          config: {
            tableName: env.dynamo.tableName,
            iam: {
              role: {
                statements: [
                  {
                    Effect: 'Allow',
                    Action: [
                      'dynamodb:*',
                    ],
                    Resource: tableResource,
                  },
                ],
              },
            },
          }
        }
      ]
    }
  },
  functions: {
    'login': {
      handler: '../auth/src/login/login-handler.main',
      events: [
        {
          http: {
            method: 'get',
            path: 'login',
          },
        },
      ],
    },
    'get-todos': {
      handler: 'src/get-todos/get-todos-handler.main',
      events: [
        {
          http: {
            method: 'get',
            path: 'todos',
          },
        },
      ],
    },
    'get-todo': {
      handler: 'src/get-todo/get-todo-handler.main',
      events: [
        {
          http: {
            method: 'get',
            path: 'todos/{id}',
          },
        },
      ],
    },
    'create-todo': {
      handler: 'src/create-todo/create-todo-handler.main',
      events: [
        {
          http: {
            method: 'post',
            path: 'todos',
          },
        },
      ],
    },
    'update-todo': {
      handler: 'src/update-todo/update-todo-handler.main',
      events: [
        {
          http: {
            method: 'put',
            path: 'todos/{id}',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfig;
