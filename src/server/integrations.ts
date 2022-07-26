import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb'
import { INTEGRATION_TABLE_NAME } from '../configuration-server.js'
import { logger } from '../logger.js'

const log = logger('integrations')

const client = new DynamoDBClient({})

interface Integration {
  integrationId: string
  redirectURL: string
  allowedFarmIds: string[]
}

export const setIntegration = async (integration: Integration): Promise<void> => {
  log('set integration: %O', integration)

  await client.send(
    new UpdateItemCommand({
      TableName: INTEGRATION_TABLE_NAME,
      Key: { integrationId: { S: integration.integrationId } },
      ReturnValues: 'ALL_NEW',
      UpdateExpression: 'SET redirectURL = :redirectURL, allowedFarmIds = :allowedFarmIds',
      ExpressionAttributeValues: {
        ':redirectURL': { S: integration.redirectURL },
        ':allowedFarmIds': { S: integration.allowedFarmIds.join(',') },
      },
    })
  )
}

export const getIntegration = async (integrationId: string): Promise<Integration | null> => {
  log('get integration: "%s"', integrationId)

  const result = await client.send(
    new GetItemCommand({
      TableName: INTEGRATION_TABLE_NAME,
      Key: { integrationId: { S: integrationId } },
    })
  )

  if (!result.Item?.redirectURL?.S || !result.Item?.allowedFarmIds?.S) {
    return null
  }

  return {
    integrationId: integrationId,
    redirectURL: result.Item.redirectURL.S,
    allowedFarmIds: result.Item.allowedFarmIds.S.split(',').filter(Boolean),
  }
}

export const deleteIntegration = async (integrationId: string): Promise<void> => {
  log('delete integration: "%s"', integrationId)

  await client.send(
    new DeleteItemCommand({
      TableName: INTEGRATION_TABLE_NAME,
      Key: { integrationId: { S: integrationId } },
    })
  )
}
