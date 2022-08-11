/*
  The install endpoint begins the OAuth 2.0 Authorisation Grant, where the
  sample app (OAuth 2.0 Client) creates an authorisation request to the AgriWebb
  auth server (OAuth 2.0 Authorisation Server). The install endpoint redirects
  the users' browser to the `/authorize` route with the required parameters
  appended. Our implementation requires that if you receive a parameter called
  `organization`, you must pass it through to the AgriWebb auth server; this
  prevents the user from having to re-input their organisation.

  For more information about OAuth 2.0, please see section 4.1.1 in RFC6749
  https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1

  For more information about the install endpoint, please see the AgriWebb API
  Documentation https://docs.agriwebb.io/
*/

import { APIGatewayProxyEvent } from 'aws-lambda'
import { CLIENT_ID, OAUTH_SERVER_AUTHORIZE_URL } from '../configuration-oauth2.js'
import { REDIRECT_URI, SCOPE } from '../configuration-server.js'
import { createHandler } from '../create-handler.js'
import { logger } from '../logger.js'
import { createState, setSignatureCookie } from './state-manager.js'

const log = logger('handle-install')

export const handleInstall = async (
  organization?: string
): Promise<{ signature: string; location: string }> => {
  const { state, signature } = createState()

  const url = new URL(OAUTH_SERVER_AUTHORIZE_URL)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', CLIENT_ID)
  url.searchParams.set('redirect_uri', REDIRECT_URI)
  url.searchParams.set('scope', SCOPE)
  url.searchParams.set('state', state)
  if (organization) {
    url.searchParams.set('organization', organization)
  }

  log('location: "%s"', url.href)

  return { signature, location: url.href }
}

export const handleInstallRequest = createHandler(
  log,
  async (event: Pick<APIGatewayProxyEvent, 'queryStringParameters'>) => {
    const { signature, location } = await handleInstall(event.queryStringParameters?.organization)

    return {
      statusCode: 302,
      headers: {
        Location: location,
        'Set-Cookie': setSignatureCookie(signature),
      },
      body: '',
    }
  }
)
