import { APIGatewayProxyResult } from 'aws-lambda'
import { createAuthenticatedHandler } from '../create-authenticated-handler'
import { logger } from '../logger.js'
import { renderCredentials } from '../views/credentials.js'
import { getAuthorizationHeader, getRefreshToken } from './credentials.js'

const log = logger('handle-credentials')

export const handleCredentialsRequest = createAuthenticatedHandler(
  log,
  async (integrationId): Promise<APIGatewayProxyResult> => {
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
)
