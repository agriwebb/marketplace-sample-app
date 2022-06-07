import { type APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { CLIENT_ID, OAUTH_SERVER_AUTHORIZE, REDIRECT_URI, SCOPE } from './environment.js'
import { createState } from './state.js'

export const handleInstallation = async (organization?: string): Promise<string> => {
  const state = await createState()

  const url = new URL(OAUTH_SERVER_AUTHORIZE)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', CLIENT_ID)
  url.searchParams.set('redirect_uri', REDIRECT_URI)
  url.searchParams.set('scope', SCOPE)
  url.searchParams.set('state', state)
  if (organization) {
    url.searchParams.set('organization', organization)
  }

  return url.href
}

export const handleInstallationRequest: APIGatewayProxyHandlerV2 = async (event) => {
  const location = await handleInstallation(event.queryStringParameters?.organization)

  return {
    statusCode: 302,
    headers: {
      Location: location,
    },
  }
}
