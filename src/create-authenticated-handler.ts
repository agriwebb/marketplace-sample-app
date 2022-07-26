import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createHandler } from './create-handler'
import { Log } from './logger.js'
import { handleUnauthorised } from './server/handle-unauthorised.js'
import { getUserCookie, getUserIntegrationId } from './server/users-manager.js'

export const createAuthenticatedHandler = <
  E extends Pick<APIGatewayProxyEvent, 'path' | 'queryStringParameters' | 'headers'>
>(
  log: Log,
  handler: (integrationId: string, event: E) => Promise<APIGatewayProxyResult>
): ((event: E) => Promise<APIGatewayProxyResult>) => {
  return createHandler(log, async (event) => {
    const username = getUserCookie(event.headers.cookie || event.headers.Cookie || '')

    if (!username) {
      return handleUnauthorised(event)
    }

    const integrationId = await getUserIntegrationId(username)

    if (!integrationId) {
      return handleUnauthorised(event)
    }

    return handler(integrationId, event)
  })
}
