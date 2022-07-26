import 'isomorphic-fetch'
import { logger } from '../logger.js'
import { exchangeRefreshToken } from '../oauth2/token-exchange.js'
import { getAuthorizationHeader, getRefreshToken } from './credentials.js'

const log = logger('fetch')

const addAuthorisationHeader = (request: Request, authorisation: string): Request => {
  log('add authorisation header: "%s"', authorisation)

  const headers = new Headers(request.headers)

  if (!headers.has('Authorization')) {
    headers.set('Authorization', authorisation)
  }

  return new Request(request, { headers })
}

export const fetchWithCredentials = async (
  integrationId: string,
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const request = input instanceof Request ? input : new Request(input, init)

  log(
    'fetch with credentials: "%s" for request: "%s" "%s"',
    integrationId,
    request.method,
    request.url
  )

  const authorisation = await getAuthorizationHeader(integrationId)
  if (!authorisation) {
    return new Response(undefined, { status: 401 })
  }

  return fetch(addAuthorisationHeader(request, authorisation))
}

const useRefreshToken = async (
  integrationId: string,
  request: Request,
  response: Response
): Promise<Response> => {
  if (response.status === 401) {
    log(
      'use refresh token: "%s" for request: "%s" "%s"',
      integrationId,
      request.method,
      request.url
    )

    const refreshToken = await getRefreshToken(integrationId)

    if (!refreshToken) {
      return response
    }

    try {
      await exchangeRefreshToken(integrationId, refreshToken)
    } catch {
      return response
    }

    return fetchWithCredentials(integrationId, request)
  }

  return response
}

export const fetchWithCredentialRefresh = async (
  integrationId: string,
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const request = input instanceof Request ? input : new Request(input, init)

  log(
    'fetch with credential refresh: "%s" for request: "%s" "%s"',
    integrationId,
    request.method,
    request.url
  )

  return fetchWithCredentials(integrationId, request).then((response) =>
    useRefreshToken(integrationId, request, response)
  )
}
