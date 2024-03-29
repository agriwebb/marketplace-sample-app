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
import { APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import { v4 as uuid } from 'uuid'
import { createHandler } from '../create-handler.js'
import { logger } from '../logger.js'
import { reportIntegrationStatus } from '../server/agriwebb-marketplace-callback-api.js'
import { handleLoginRedirect } from '../server/handle-login.js'
import { setIntegration } from '../server/integrations.js'
import { getUserCookie, upsertUser } from '../server/users-manager.js'
import { OAuth2Error, renderError } from '../views/error.js'
import { getSignatureCookie, verifyState } from './state-manager.js'
import { exchangeAuthorisationCode } from './token-exchange.js'

const log = logger('handle-callback')

export const handleCallbackRequest = createHandler(
  log,
  async (
    event: Pick<APIGatewayProxyEvent, 'path' | 'queryStringParameters' | 'headers'>
  ): Promise<APIGatewayProxyResult> => {
    try {
      const integrationId = uuid()

      const state = event.queryStringParameters?.state
      const signature = getSignatureCookie(event.headers.cookie || event.headers.Cookie || '')
      const isStateValid = state && signature && (await verifyState(state, signature))

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
        const username = getUserCookie(event.headers.cookie || event.headers.Cookie || '')

        if (!username) {
          return handleLoginRedirect(event)
        }

        await exchangeAuthorisationCode(integrationId, event.queryStringParameters.code)
        await upsertUser(username, integrationId)
        const { redirectURL, allowedFarmIds } = await reportIntegrationStatus(
          integrationId,
          'functional'
        )
        await setIntegration({ integrationId, allowedFarmIds })

        return {
          statusCode: 302,
          headers: {
            Location: redirectURL,
          },
          body: '',
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
)
