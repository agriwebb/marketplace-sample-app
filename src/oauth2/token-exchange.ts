/*
  The token exchange process allows the sample app (OAuth 2.0 Client) to use
  different exchange processes to obtain an `access_token` and other related
  tokens. At the time of writing this, we support two token exchange types; 
  authorization_code` and `refresh_token`. To authenticate during the token
  exchange, you must perform Client Authentication using The Basic Authorisation
  Scheme with the provided `client_id` and `client_secret` as the username and
  password. 

  For more information regarding the token exchange endpoint, please see
  https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
  https://datatracker.ietf.org/doc/html/rfc6749#section-6
  https://datatracker.ietf.org/doc/html/rfc6749#section-3.2.1
*/

import 'isomorphic-fetch'
import { getClientId, getClientSecret, OAUTH_SERVER_TOKEN_URL } from '../configuration-oauth2.js'
import { REDIRECT_URI } from '../configuration-server.js'
import { logger } from '../logger.js'
import { setCredentials } from '../server/credentials'
import { OAuth2Error } from '../views/error.js'

const log = logger('token-exchange')

interface AuthorisationCodeExchange {
  grant_type: 'authorization_code'
  code: string
  redirect_uri?: string
  client_id?: string
}

interface RefreshTokenExchange {
  grant_type: 'refresh_token'
  refresh_token: string
  scope?: string
}

export interface Credentials {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
}

const callTokenExchange = async (
  options: AuthorisationCodeExchange | RefreshTokenExchange
): Promise<Credentials> => {
  const searchParams = new URLSearchParams(options as unknown as Record<string, string>)

  const response = await fetch(OAUTH_SERVER_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${await getClientId()}:${await getClientSecret()}`,
        'utf-8'
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: searchParams.toString(),
  })

  if (!response.ok) {
    try {
      const body = await response.text()
      log('error response: "%s"', body)
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

export const exchangeAuthorisationCode = async (
  integrationId: string,
  code: string
): Promise<Credentials> => {
  const credentials = await callTokenExchange({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: await getClientId(),
  })

  await setCredentials(integrationId, credentials)

  return credentials
}

export const exchangeRefreshToken = async (
  integrationId: string,
  refreshToken: string
): Promise<Credentials> => {
  const credentials = await callTokenExchange({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })

  await setCredentials(integrationId, credentials)

  return credentials
}
