/*
  The base url the applicaiton is deployed at.
*/
export const BASE_URL =
  (process.env.IS_OFFLINE !== 'true' && process.env.BASE_URL) || 'http://localhost:3000/dev/'

/*
  This stage manager secret is used in the verification of the state parameter.
  It should be stored in something like AWS Secrets Manager or similar, however,
  for the portability of this example it is stored here.
*/
export const STATE_MANAGER_SECRET =
  'mgCu1leGbPobYiJTWdeZe7uFQ7ZfgxNa-q-5dDeAWMVIOW-z8VAm5amg0phKEQ6oNUi5ynKo6JsxASKpjamkBg'

/*
  The Public API integration complete URL.
*/
export const INTEGRATION_COMPLETE_URL = 'https://api.staging.agriwebb.com/v2/integration-complete'

/*
The OAuth 2.0 server endpoints.
*/
export const OAUTH_SERVER_AUTHORIZE_URL = 'https://api.staging.agriwebb.com/oauth2/authorize'
export const OAUTH_SERVER_TOKEN_URL = 'https://api.staging.agriwebb.com/oauth2/token'

/*
  The client credentials provided by the OAuth 2.0 server.

  The client secret should be stored in something like AWS Secrets Manager or
  similar, however, for the portability of this example it is stored here.
  Ideally the client id should also be stored in the same secure location as the
  secret, but since this is a public identifier that is not nessecary. 
*/
export const CLIENT_ID = '396c7a7c-e8e2-4fb8-84b4-449a07cf8cba'
export const CLIENT_SECRET = '4Ql4fW7sOtaoEneUgPHC7zw4EKrel1eZD1XyNACDdco'

/*
  The redirect URI provided to the OAuth 2.0 server.
*/
export const REDIRECT_URI = new URL('./callback', BASE_URL).href

/*
  The scopes to request from the OAuth 2.0 server.
*/
export const SCOPE = 'identify'
