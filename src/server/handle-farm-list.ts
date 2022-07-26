import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { logger } from '../logger.js'
import { renderFarms } from '../views/farms.js'
import { getFarms } from './agriwebb-v2-api.js'
import { handleUnauthorised } from './handle-unauthorised.js'
import { getIntegration } from './integrations.js'
import { getUserCookie, getUserIntegrationId } from './users-manager.js'

const log = logger('handle-farms-list')

export const handleFarmListRequest = async (
  event: Pick<APIGatewayProxyEvent, 'path' | 'queryStringParameters' | 'headers'>
): Promise<APIGatewayProxyResult> => {
  log('query string parameters: %O', event.queryStringParameters)
  log('headers: %O', event.headers)

  const username = getUserCookie(event.headers.cookie || event.headers.Cookie || '')

  if (!username) {
    return handleUnauthorised(event)
  }

  const integrationId = await getUserIntegrationId(username)

  if (!integrationId) {
    return handleUnauthorised(event)
  }

  const integration = await getIntegration(integrationId)

  const farms = await getFarms(integrationId, integration?.allowedFarmIds || [])

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
    body: renderFarms({ farms }),
  }
}
