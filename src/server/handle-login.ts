import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { BASE_URL, LOGIN_URI } from '../configuration-server.js'
import { createHandler } from '../create-handler.js'
import { logger } from '../logger.js'
import { renderLogin } from '../views/login.js'
import { getRedirectCookie, setRedirectCookie } from './redirect-manager.js'
import { setUserCookie, upsertUser } from './users-manager.js'

const log = logger('handle-login')

export const handleLoginRedirect = async (
  event: Pick<APIGatewayProxyEvent, 'path' | 'queryStringParameters'>
): Promise<APIGatewayProxyResult> => {
  log('handle-login-redirect')
  log('path: "%s"', event.path)
  log('query string parameters: %O', event.queryStringParameters)

  const setCookie = setRedirectCookie(
    event.queryStringParameters
      ? `.${event.path}?${new URLSearchParams(
          event.queryStringParameters as Record<string, string>
        )}`
      : `.${event.path}`
  )

  return {
    statusCode: 302,
    headers: {
      Location: LOGIN_URI,
      'Set-Cookie': setCookie,
    },
    body: '',
  }
}

export const handleGetLoginRequest = createHandler(
  log,
  async (): Promise<APIGatewayProxyResult> => {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
      body: renderLogin(),
    }
  }
)

export const handlePostLoginRequest = createHandler(
  log,
  async (
    event: Pick<APIGatewayProxyEvent, 'queryStringParameters' | 'headers' | 'body'>
  ): Promise<APIGatewayProxyResult> => {
    let username: string

    try {
      username = new URLSearchParams(event.body || '').get('username')!

      if (!username) {
        throw new Error('The username parameter is required and expected to be a string.')
      }
    } catch (error) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
        body: renderLogin({ error: 'invalid_username' }),
      }
    }

    await upsertUser(username)

    const setCookie = setUserCookie(username)

    const location = new URL(
      getRedirectCookie(event.headers.cookie || event.headers.Cookie || '') || './app/',
      BASE_URL
    ).href

    log('redirect location: "%s"', location)

    return {
      statusCode: 302,
      headers: {
        Location: location,
        'Set-Cookie': setCookie,
      },
      body: '',
    }
  }
)
