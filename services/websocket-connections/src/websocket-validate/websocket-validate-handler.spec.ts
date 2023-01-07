import lambdaEventMock from 'lambda-event-mock';
import { Context } from 'aws-lambda';
import { main } from './websocket-validate-handler';

describe('websocket-validate', () => {

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
