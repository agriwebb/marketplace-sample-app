import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { logger } from '../logger.js'
import { renderCredentials } from '../views/credentials.js'
import { getAuthorizationHeader, getRefreshToken } from './credentials.js'
import { handleUnauthorised } from './handle-unauthorised.js'
import { getUserCookie, getUserCredentialId } from './users-manager.js'

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

  const credentialId = await getUserCredentialId(username)

  if (!credentialId) {
    return handleUnauthorised(event)
  }

  const [authorisation, refreshToken] = await Promise.all([
    getAuthorizationHeader(credentialId),
    getRefreshToken(credentialId),
  ])

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
    body: renderCredentials(authorisation, refreshToken),
  }
}
