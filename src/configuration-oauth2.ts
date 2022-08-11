import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

const secrets = new SecretsManagerClient({})

/*
  The OAuth 2.0 server endpoints.
*/
export const OAUTH_SERVER_AUTHORIZE_URL = process.env.OAUTH_SERVER_AUTHORIZE_URL!
export const OAUTH_SERVER_TOKEN_URL = process.env.OAUTH_SERVER_TOKEN_URL!

/*
  The client credentials provided by the OAuth 2.0 server.
*/

export const CLIENT_ID = await secrets.send(
  new GetSecretValueCommand({ SecretId: 'marketplace-sample-app/client-id' })
)
export const CLIENT_SECRET = await secrets.send(
  new GetSecretValueCommand({ SecretId: 'marketplace-sample-app/client-secret' })
)
