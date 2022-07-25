import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb'
import { ACCESS_TOKEN_TABLE_NAME, REFRESH_TOKEN_TABLE_NAME } from '../configuration-server.js'
import { logger } from '../logger.js'
import { Credentials } from '../oauth2/token-exchange.js'

const log = logger('credentials')

const client = new DynamoDBClient({})

export const setCredentials = async (
  credentialId: string,
  credentials: Credentials
): Promise<void> => {
  log('set credentials: "%s" %O', credentialId, credentials)

  await client.send(
    new UpdateItemCommand({
      TableName: ACCESS_TOKEN_TABLE_NAME,
      Key: { credentialId: { S: credentialId } },
      ReturnValues: 'ALL_NEW',
      UpdateExpression:
        'SET tokenType = :token_type, accessToken = :access_token, expiresIn = :expires_in',
      ExpressionAttributeValues: {
        ':token_type': { S: credentials.token_type },
        ':access_token': { S: credentials.access_token },
        ':expires_in': { N: `${credentials.expires_in || 43200}` },
      },
    })
  )

  if (credentials.refresh_token) {
    await client.send(
      new UpdateItemCommand({
        TableName: REFRESH_TOKEN_TABLE_NAME,
        Key: { credentialId: { S: credentialId } },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'SET refreshToken = :refresh_token',
        ExpressionAttributeValues: {
          ':refresh_token': { S: credentials.refresh_token },
        },
      })
    )
  }
}

export const deleteAccessToken = async (credentialId: string): Promise<void> => {
  log('delete access token: "%s"', credentialId)

  await client.send(
    new DeleteItemCommand({
      TableName: ACCESS_TOKEN_TABLE_NAME,
      Key: { credentialId: { S: credentialId } },
    })
  )
}

export const deleteRefreshToken = async (credentialId: string): Promise<void> => {
  log('delete refresh token: %s', credentialId)

  await client.send(
    new DeleteItemCommand({
      TableName: REFRESH_TOKEN_TABLE_NAME,
      Key: { credentialId: { S: credentialId } },
    })
  )
}

export const getAuthorizationHeader = async (credentialId: string): Promise<string | null> => {
  log('get authorization header: "%s"', credentialId)

  const result = await client.send(
    new GetItemCommand({
      TableName: ACCESS_TOKEN_TABLE_NAME,
      Key: { credentialId: { S: credentialId } },
    })
  )

  if (!result.Item?.tokenType?.S || !result.Item?.accessToken?.S) {
    return null
  }

  const authorisation = `${result.Item.tokenType.S} ${result.Item.accessToken.S}`

  log('authorisation header: "%s"', authorisation)

  return authorisation
}

export const getRefreshToken = async (credentialId: string): Promise<string | null> => {
  log('get refresh token: "%s"', credentialId)

  const result = await client.send(
    new GetItemCommand({
      TableName: REFRESH_TOKEN_TABLE_NAME,
      Key: { credentialId: { S: credentialId } },
    })
  )

  if (!result.Item?.refreshToken?.S) {
    return null
  }

  const refreshToken = result.Item.refreshToken.S

  log('refresh token: "%s"', refreshToken)

  return refreshToken
}
