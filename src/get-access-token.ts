import { CLIENT_ID, CLIENT_SECRET, OAUTH_SERVER_TOKEN_URL, REDIRECT_URI } from './environment.js'
import { OAuth2Error } from './error.js'
import { logger } from './logger.js'

const log = logger('get-access-token')

export interface AccessToken {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
}

export const getAccessToken = async (code: string): Promise<AccessToken> => {
  const searchParams = new URLSearchParams()

  searchParams.set('grant_type', 'authorization_code')
  searchParams.set('code', code)
  searchParams.set('redirect_uri', REDIRECT_URI)
  searchParams.set('client_id', CLIENT_ID)

  const response = await fetch(OAUTH_SERVER_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf-8').toString(
        'base64'
      )}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: searchParams.toString(),
  })

  if (!response.ok) {
    try {
      const body = await response.text()
      log('error response: %s', body)
      const json = JSON.parse(body)
      throw new OAuth2Error(json.error, json.error_description, json.error_uri)
    } catch (error) {
      if (error instanceof OAuth2Error) {
        throw error
      }

      throw new OAuth2Error(
        'invalid_request',
        'The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.'
      )
    }
  }

  const { access_token, token_type, expires_in, refresh_token } = await response.json()

  log(`token response: %O`, { access_token, token_type, expires_in, refresh_token })

  return { access_token, token_type, expires_in, refresh_token }
}
