/*
  The callback endpoint is the final step in the OAuth 2.0 Authorisation Code
  flow. The OAuth server will redirect the user to the callback endpoint with a
  "code" parameter exchangeable for an access token and a refresh token. If an
  error occurs, the OAuth server will redirect the user back to the callback
  endpoint with an "error" parameter and, optionally, an "error_description" and
  "error_uri". This callback needs to gracefully both types of responses.

  For more information on the callback endpoint, see section 4.1.2 in RFC6749
  https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2
*/
import { type APIGatewayProxyHandler, type APIGatewayProxyResult } from 'aws-lambda'
import 'isomorphic-fetch'
import { logger } from '../logger.js'
import { renderAccessToken } from '../views/access-token.js'
import { OAuth2Error, renderError } from '../views/error.js'
import { getSignatureCookie, verifyState } from './state-manager.js'
import { exchangeAuthorisationCode } from './token-exchange.js'

const log = logger('handle-callback')

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
      const { access_token, token_type, refresh_token } = await exchangeAuthorisationCode(
        event.queryStringParameters.code
      )

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
        body: renderAccessToken({ access_token, token_type, refresh_token }),
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
