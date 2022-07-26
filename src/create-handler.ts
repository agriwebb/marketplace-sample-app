import { APIGatewayProxyResult } from 'aws-lambda'
import { Log } from './logger.js'
import { renderError } from './views/error.js'

export const createHandler = <E extends object>(
  log: Log,
  handler: (event: E) => Promise<APIGatewayProxyResult>
): ((event: E) => Promise<APIGatewayProxyResult>) => {
  return async (event) => {
    log('request: %O %O', event)

    try {
      const response = await handler(event)

      log('response: %O', response)

      return response
    } catch (error) {
      log('error: %O', error)

      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
        body: renderError(error),
      }
    }
  }
}
