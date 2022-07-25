import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  type APIGatewayProxyHandler,
} from 'aws-lambda'
import { BASE_URL, LOGIN_URI } from '../configuration-server'
import { logger } from '../logger'
import { renderLogin } from '../views/login'
import { getRedirectCookie, setRedirectCookie } from './redirect-manager'
import { setUserCookie, upsertUser } from './users-manager'

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

export const handleGetLoginRequest: APIGatewayProxyHandler =
  async (): Promise<APIGatewayProxyResult> => {
    log('handle-get-login-request')

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
      body: renderLogin(),
    }
  }

export const handlePostLoginRequest = async (
  event: Pick<APIGatewayProxyEvent, 'queryStringParameters' | 'headers' | 'body'>
): Promise<APIGatewayProxyResult> => {
  log('handle-post-login-request')
  log('query string parameters: %O', event.queryStringParameters)
  log('headers: %O', event.headers)
  log('body: "%s"', event.body)

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
