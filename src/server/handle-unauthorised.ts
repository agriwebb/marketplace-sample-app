import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { logger } from '../logger.js'
import { renderUnauthorised } from '../views/unauthorised.js'
import { handleLoginRedirect } from './handle-login.js'
import { getUserCookie } from './users-manager.js'

const log = logger('handle-unauthorised')

export const handleUnauthorised = async (
  event: Pick<APIGatewayProxyEvent, 'path' | 'queryStringParameters' | 'headers'>
): Promise<APIGatewayProxyResult> => {
  log('handle-unauthorised')

  const username = getUserCookie(event.headers.cookie || event.headers.Cookie || '')

  if (!username) {
    return handleLoginRedirect(event)
  }

  return {
    statusCode: 401,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
    body: renderUnauthorised(),
  }
}
