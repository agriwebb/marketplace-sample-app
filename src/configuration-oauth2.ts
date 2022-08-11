import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager'
import pMemoize from 'p-memoize'

const secrets = new SecretsManagerClient({})

/*
  The OAuth 2.0 server endpoints.
*/
export const OAUTH_SERVER_AUTHORIZE_URL = process.env.OAUTH_SERVER_AUTHORIZE_URL!
export const OAUTH_SERVER_TOKEN_URL = process.env.OAUTH_SERVER_TOKEN_URL!

/*
  The client credentials provided by the OAuth 2.0 server.
*/

export const getClientId = pMemoize(
  (): Promise<string> =>
    secrets
      .send(new GetSecretValueCommand({ SecretId: 'marketplace-sample-app/client-id' }))
      .then((response) => response.SecretString!)
)
export const getClientSecret = pMemoize(
  (): Promise<string> =>
    secrets
      .send(new GetSecretValueCommand({ SecretId: 'marketplace-sample-app/client-secret' }))
      .then((response) => response.SecretString!)
)
