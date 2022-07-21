import { exchangeRefreshToken } from '../oauth2/token-exchange.js'

const getCredentials = async (): Promise<Credentials> => {}

const modifyRequest = async (request: Request): Promise<Request> => {
  const credentials = await getCredentials()

  const headers = new Headers(request.headers)

  if (!headers.has('Authorization')) {
    headers.set('Authorization', `${credentials.token_type} ${credentials.access_token}`)
  }

  return new Request(request, { headers })
}

export const fetchWithCredentials = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const request = input instanceof Request ? input : new Request(input, init)
  return fetch(await modifyRequest(request))
}

const useRefreshToken = async (request: Request, response: Response): Promise<Response> => {
  const credentials = await getCredentials()

  if (response.status === 401 && credentials.refresh_token) {
    await exchangeRefreshToken(credentials.refresh_token)
    return fetchWithCredentials(request)
  }

  return response
}

export const fetchWithCredentialRefresh = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const request = input instanceof Request ? input : new Request(input, init)
  return fetchWithCredentials(request).then((response) => useRefreshToken(request, response))
}
