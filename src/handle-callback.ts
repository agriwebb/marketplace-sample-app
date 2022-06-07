import { type APIGatewayProxyHandlerV2, type APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import 'isomorphic-fetch'
import { CLIENT_ID, CLIENT_SECRET, OAUTH_SERVER_TOKEN, REDIRECT_URI } from './environment.js'
import { validateState } from './state.js'

const getAccessToken = async (code: string): Promise<string> => {
  const searchParams = new URLSearchParams()

  searchParams.set('grant_type', 'authorization_code')
  searchParams.set('code', code)
  searchParams.set('redirect_uri', REDIRECT_URI)
  searchParams.set('client_id', CLIENT_ID)

  const response = await fetch(OAUTH_SERVER_TOKEN, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: searchParams.toString(),
  })
  const { access_token, token_type, expires_in, refresh_token } = await response.json()

  return `${token_type} ${access_token}`
}

const getSuccessCallback = async (accessToken: string) => {
  console.log(accessToken)
}

export const handleSuccessCallback = async (code: string): Promise<void> => {
  const accessToken = await getAccessToken(code)
  await getSuccessCallback(accessToken)
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

export const handleCallbackRequest: APIGatewayProxyHandlerV2 = async (
  event
): Promise<APIGatewayProxyStructuredResultV2> => {
  const isStateValid =
    event.queryStringParameters?.state && (await validateState(event.queryStringParameters.state))

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
    await handleSuccessCallback(event.queryStringParameters.code)

    return {
      statusCode: 302,
      headers: {
        Location: 'https://portal-staging.agriwebb.com/accounts/integrations',
      },
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
