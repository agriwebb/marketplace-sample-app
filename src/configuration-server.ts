export const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME
export const INTEGRATION_TABLE_NAME = process.env.INTEGRATION_TABLE_NAME
export const ACCESS_TOKEN_TABLE_NAME = process.env.ACCESS_TOKEN_TABLE_NAME
export const REFRESH_TOKEN_TABLE_NAME = process.env.REFRESH_TOKEN_TABLE_NAME

/*
  The base url the application is deployed at.
*/
export const BASE_URL =
  (process.env.IS_OFFLINE !== 'true' && process.env.BASE_URL) || 'http://localhost:4000/dev/'

/*
  This state manager secret is used in the verification of the state parameter.
  It should be stored in something like AWS Secrets Manager or similar, however,
  for the portability of this example it is stored here.
*/
export const STATE_MANAGER_SECRET =
  'mgCu1leGbPobYiJTWdeZe7uFQ7ZfgxNa-q-5dDeAWMVIOW-z8VAm5amg0phKEQ6oNUi5ynKo6JsxASKpjamkBg'

/*
  The Public API v2 URI.
*/
export const AGRIWEBB_V2_API_URI = 'https://api.staging.agriwebb.com/v2/'

/*
  The Marketplace Callback endpoint.
*/
export const MARKETPLACE_CALLBACK_URI = 'https://api.staging.agriwebb.com/v2/marketplace/callback'

/*
  The installation URI provided to the OAuth 2.0 server.
*/
export const INSTALLATION_URI = new URL('./install', BASE_URL).href

/*
  The redirect URI provided to the OAuth 2.0 server.
*/
export const REDIRECT_URI = new URL('./callback', BASE_URL).href

/*
  The login route for the application.
*/
export const LOGIN_URI = new URL('./login', BASE_URL).href

/*
  The credentials route for the application.
*/
export const CREDENTIALS_URI = new URL('./app/credentials', BASE_URL).href

/*
  The credentials route for the application.
*/
export const FARM_LIST_URI = new URL('./app/farms', BASE_URL).href

/*
  The scopes to request from the OAuth 2.0 server.
*/
export const SCOPE = 'read:farms'
