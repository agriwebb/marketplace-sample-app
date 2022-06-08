/*
  The install endpoint appends a selection of parameters to the OAuth server's
  authorize endpoint. 

  Since our OAuth implementation is built around organisations, we support an
  "organization" hint parameter which MUST be passed through to the OAuth server
  if provided.

  For more information about OAuth 2.0, please see section 4.1.1 in RFC6749
  https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1

  For more information about the "organization" hint parameter, please see
  ...
*/

import { type APIGatewayProxyHandler } from 'aws-lambda'
import { CLIENT_ID, OAUTH_SERVER_AUTHORIZE_URL, REDIRECT_URI, SCOPE } from './environment.js'
import { logger } from './logger.js'
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

export const handleInstallRequest: APIGatewayProxyHandler = async (event) => {
  log('query string parameters: %O', event.queryStringParameters)

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
