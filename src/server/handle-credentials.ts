import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { logger } from '../logger.js'
import { renderCredentials } from '../views/credentials.js'
import { getAuthorizationHeader, getRefreshToken } from './credentials.js'
import { handleUnauthorised } from './handle-unauthorised.js'
import { getUserCookie, getUserIntegrationId } from './users-manager.js'

const log = logger('handle-credentials')

export const handleCredentialsRequest = async (
  event: Pick<APIGatewayProxyEvent, 'path' | 'queryStringParameters' | 'headers'>
): Promise<APIGatewayProxyResult> => {
  log('query string parameters: %O', event.queryStringParameters)
  log('headers: %O', event.headers)

  const username = getUserCookie(event.headers.cookie || event.headers.Cookie || '')

  if (!username) {
    return handleUnauthorised(event)
  }

  const integrationId = await getUserIntegrationId(username)

  if (!integrationId) {
    return handleUnauthorised(event)
  }

  const [authorisation, refreshToken] = await Promise.all([
    getAuthorizationHeader(integrationId),
    getRefreshToken(integrationId),
  ])

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
    body: renderCredentials(authorisation, refreshToken),
  }
}
