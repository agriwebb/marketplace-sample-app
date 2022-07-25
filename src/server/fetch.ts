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
  credentialId: string,
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const request = input instanceof Request ? input : new Request(input, init)

  log(
    'fetch with credentials: "%s" for request: "%s" "%s"',
    credentialId,
    request.method,
    request.url
  )

  const authorisation = await getAuthorizationHeader(credentialId)
  if (!authorisation) {
    return new Response(undefined, { status: 401 })
  }

  return fetch(addAuthorisationHeader(request, authorisation))
}

const useRefreshToken = async (
  credentialId: string,
  request: Request,
  response: Response
): Promise<Response> => {
  if (response.status === 401) {
    log('use refresh token: "%s" for request: "%s" "%s"', credentialId, request.method, request.url)

    const refreshToken = await getRefreshToken(credentialId)

    if (!refreshToken) {
      return response
    }

    try {
      await exchangeRefreshToken(credentialId, refreshToken)
    } catch {
      return response
    }

    return fetchWithCredentials(credentialId, request)
  }

  return response
}

export const fetchWithCredentialRefresh = async (
  credentialId: string,
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const request = input instanceof Request ? input : new Request(input, init)

  log(
    'fetch with credential refresh: "%s" for request: "%s" "%s"',
    credentialId,
    request.method,
    request.url
  )

  return fetchWithCredentials(credentialId, request).then((response) =>
    useRefreshToken(credentialId, request, response)
  )
}
