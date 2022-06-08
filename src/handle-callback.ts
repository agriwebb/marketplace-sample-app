import { type APIGatewayProxyHandler, type APIGatewayProxyResult } from 'aws-lambda'
import 'isomorphic-fetch'
import { CLIENT_ID, CLIENT_SECRET, OAUTH_SERVER_TOKEN_URL, REDIRECT_URI } from './environment.js'
import { logger } from './logger.js'
import { getSignatureCookie, verifyState } from './state-manager.js'

const log = logger('handle-callback')

const getAccessToken = async (code: string): Promise<string> => {
  const searchParams = new URLSearchParams()

  searchParams.set('grant_type', 'authorization_code')
  searchParams.set('code', code)
  searchParams.set('redirect_uri', REDIRECT_URI)
  searchParams.set('client_id', CLIENT_ID)

  const response = await fetch(OAUTH_SERVER_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: searchParams.toString(),
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  const { access_token, token_type, expires_in, refresh_token } = await response.json()

  return `${token_type} ${access_token}`
}

export const handleSuccessCallback = async (code: string): Promise<string> => {
  return 'https://portal-staging.agriwebb.com/accounts/integrations'

  log('exchanging code for access token. code: "%s"', code)

  const accessToken = await getAccessToken(code)

  log('access token: "%s"', accessToken)

  const response = await fetch('https://api.agriwebb.com/v2/integration-complete', {
    method: 'POST',
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({}, null, 2),
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  const { integrationManagementURL } = await response.json()

  return integrationManagementURL
}

export const handleErrorCallback = async (
  error?: string,
  error_description?: string,
  error_uri?: string
): Promise<string> => {
  return `
    <!DOCTYPE html>
    <html class="h-full" lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Prototype OAuth Client</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="h-full flex flex-col items-center justify-center">
        We are unable to connect with this integration partner at the moment, please try again later.
        <details class="my-4 w-full max-w-prose">
          <summary class="my-2">Technical details</summary>
          <div class="my-2 flex flex-col justify-between">
            <span>Error: <code class="font-mono bg-gray-200 rounded">${error}</code></span>
            <span>Error description: <code class="font-mono bg-gray-200 rounded">${error_description}</code></span>
            <span>Error URI: <code class="font-mono bg-gray-200 rounded">${error_uri}</code></span>
          </div>
        </details>
      </body>
    </html>
  `
}

export const handleCallbackRequest: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
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
      body: await handleErrorCallback('invalid_state', 'Invalid state parameter'),
    }
  }

  if (event.queryStringParameters?.code) {
    const location = await handleSuccessCallback(event.queryStringParameters.code)

    return {
      statusCode: 302,
      headers: {
        Location: location,
      },
      body: '',
    }
  } else {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
      body: await handleErrorCallback(
        event.queryStringParameters?.error,
        event.queryStringParameters?.error_description,
        event.queryStringParameters?.error_uri
      ),
    }
  }
}
