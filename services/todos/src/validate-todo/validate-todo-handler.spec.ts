import lambdaEventMock from 'lambda-event-mock';
import { Context } from 'aws-lambda';
import { main } from './validate-todo-handler';

describe('validate-todo', () => {

  it('should do something useful', async () => {

    const event = lambdaEventMock.apiGateway()
      .path('/todos')
      .queryStringParameters({
        searchTerm: 'foo',
      })
      .method('GET')
      .build();

    const { body } = await main(event, {} as any);

    expect(JSON.parse(body).data.searchTerm).toEqual('foo')
  })

});
