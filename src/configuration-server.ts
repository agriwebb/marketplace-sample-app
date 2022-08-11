import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import pMemoize from 'p-memoize'

const secrets = new SecretsManagerClient({})

/*
  Dynamo DB table names.
*/
export const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME
export const INTEGRATION_TABLE_NAME = process.env.INTEGRATION_TABLE_NAME
export const ACCESS_TOKEN_TABLE_NAME = process.env.ACCESS_TOKEN_TABLE_NAME
export const REFRESH_TOKEN_TABLE_NAME = process.env.REFRESH_TOKEN_TABLE_NAME

/*
  Determine if the server is running in development mode.
*/
export const IS_DEVELOPMENT = process.env.IS_OFFLINE === 'true'

/*
  The base url the application is deployed at.
*/
export const BASE_URL = (!IS_DEVELOPMENT && process.env.BASE_URL) || 'http://localhost:4000/dev/'

/*
  This state manager secret is used in the verification of the state parameter.
*/
export const getStateManagerSecret = pMemoize(
  (): Promise<string> =>
    secrets
      .send(new GetSecretValueCommand({ SecretId: 'marketplace-sample-app/state-manager-secret' }))
      .then((response) => response.SecretString!)
)

/*
  The Documentation URI.
*/
export const AGRIWEBB_DOCUMENTATION_URI = process.env.AGRIWEBB_DOCUMENTATION_URI!

/*
  The Marketplace Homepage URI.
*/
export const AGRIWEBB_MARKETPLACE_HOMEPAGE_URI = process.env.AGRIWEBB_MARKETPLACE_HOMEPAGE_URI!

/*
  The Public API v2 URI.
*/
export const AGRIWEBB_GRAPHQL_URI = process.env.AGRIWEBB_GRAPHQL_URI!

/*
  The Marketplace Callback endpoint.
*/
export const AGRIWEBB_MARKETPLACE_CALLBACK_URI = process.env.AGRIWEBB_MARKETPLACE_CALLBACK_URI!

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
  The logout route for the application.
*/
export const LOGOUT_URI = new URL('./logout', BASE_URL).href

/*
  The home route for the application.
*/
export const HOME_URI = new URL('./', BASE_URL).href

/*
  The credentials route for the application.
*/
export const CREDENTIALS_URI = new URL('./credentials', BASE_URL).href

/*
  The credentials route for the application.
*/
export const FARM_LIST_URI = new URL('./farms', BASE_URL).href

/*
  The scopes to request from the OAuth 2.0 server.
*/
export const SCOPE = 'read:farms'
