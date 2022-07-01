/*
  The callback endpoint exchanges the authorization code for an access token and
  a refresh token; finally, a call to the public API success endpoint completes
  the integration. 

  The integration success endpoint returns an integration management URL. We
  recommend redirecting the user to this URL; however, if this does not make
  sense for your application's user experience flow, you can ignore this URL.

  For more information on the callback endpoint, see section 4.1.2 in RFC6749
  https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2

  For more information regarding the integration success endpoint, please see
  ...
*/
import { type APIGatewayProxyHandler, type APIGatewayProxyResult } from 'aws-lambda'
import 'isomorphic-fetch'
import { INTEGRATION_COMPLETE_URL } from './environment.js'
import { OAuth2Error, renderError } from './error.js'
import { getAccessToken } from './get-access-token.js'
import { logger } from './logger.js'
import { getSignatureCookie, verifyState } from './state-manager.js'

const log = logger('handle-callback')

export const handleCallback = async (code: string): Promise<string> => {
  log('exchanging code for access token. code: "%s"', code)

  const accessToken = await getAccessToken(code)

  log('access token: "%s"', accessToken)

  return accessToken

  const response = await fetch(INTEGRATION_COMPLETE_URL, {
    method: 'POST',
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      existingSubscription: false,
    }),
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  const { redirectURL } = await response.json()

  return redirectURL
}

export const handleCallbackRequest: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    log('query string parameters: %O', event.queryStringParameters)
    log('headers: %O', event.headers)

    const state = event.queryStringParameters?.state
    const signature = getSignatureCookie(event.headers.cookie || event.headers.Cookie || '')
    const isStateValid = state && signature && verifyState(state, signature)

    if (!isStateValid) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
        body: renderError(new OAuth2Error('invalid_state', 'Invalid state parameter')),
      }
    }

    if (event.queryStringParameters?.code) {
      const accessToken = await handleCallback(event.queryStringParameters.code)

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
        body: `
          <!DOCTYPE html>
          <html class="h-full" lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Third Party Integration Example</title>
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="h-full flex flex-col items-center justify-center">
              ${accessToken}
            </body>
          </html>
        `,
      }
    } else {
      throw new OAuth2Error(
        event.queryStringParameters?.error,
        event.queryStringParameters?.error_description,
        event.queryStringParameters?.error_uri
      )
    }
  } catch (error) {
    log('error: %O', error)

    return {
      statusCode: error instanceof OAuth2Error && error.error === 'server_error' ? 500 : 400,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
      body: renderError(error),
    }
  }
}
