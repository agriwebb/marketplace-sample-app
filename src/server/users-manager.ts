import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import cookie, { CookieSerializeOptions } from 'cookie'
import { BASE_URL, USERS_TABLE_NAME } from '../configuration-server.js'
import { logger } from '../logger.js'

interface User {
  username: string
  integrationId: string | null
}

const log = logger('user-manager')

export const setUserCookie = (username: string) => {
  const cookieOptions: CookieSerializeOptions = {
    httpOnly: true,
    maxAge: 1800,
    path: new URL(BASE_URL).pathname,
    secure: true,
    sameSite: 'lax',
  }

  log('cookie options: %O', cookieOptions)

  const userCookie = cookie.serialize('User', username, cookieOptions)

  log('set-user-cookie: "%s"', userCookie)

  return userCookie
}

export const getUserCookie = (string: string) => {
  const user = cookie.parse(string).User

  log('get-user-cookie: "%s"', string)

  return user
}

const client = new DynamoDBClient({})

export const upsertUser = async (username: string, integrationId?: string): Promise<User> => {
  log('upsert-user username: "%s" integrationId: "%s"', username, integrationId)

  const result = await client.send(
    new UpdateItemCommand({
      TableName: USERS_TABLE_NAME,
      Key: { username: { S: username } },
      ReturnValues: 'ALL_NEW',
      UpdateExpression: integrationId
        ? 'SET integrationId = :integrationId, expiresIn = :expiresIn'
        : 'SET expiresIn = :expiresIn',
      ExpressionAttributeValues: integrationId
        ? {
            ':integrationId': { S: integrationId },
            ':expiresIn': { N: '300' },
          }
        : {
            ':expiresIn': { N: '300' },
          },
    })
  )

  log('upsert-user result: %O', result)

  return {
    username: result.Attributes?.username?.S!,
    integrationId: result.Attributes?.integrationId?.S || null,
  }
}

export const getUserIntegrationId = async (username: string): Promise<string | null> => {
  log('get-user-integration-id username: "%s"', username)

  const result = await client.send(
    new GetItemCommand({
      TableName: USERS_TABLE_NAME,
      Key: { username: { S: username } },
    })
  )

  log('get-user-integration-id result: %O', result)

  return result.Item?.integrationId?.S || null
}
