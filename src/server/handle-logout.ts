import { APIGatewayProxyResult } from 'aws-lambda'
import { HOME_URI } from '../configuration-server.js'
import { logger } from '../logger.js'
import { deleteUserCookie } from './users-manager.js'

const log = logger('handle-logout')

export const handleGetLogoutRequest = async (): Promise<APIGatewayProxyResult> => {
  log('handle-logout-redirect')

  const setCookie = deleteUserCookie()

  return {
    statusCode: 302,
    headers: {
      Location: HOME_URI,
      'Set-Cookie': setCookie,
    },
    body: '',
  }
}
