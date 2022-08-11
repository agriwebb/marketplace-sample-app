import { APIGatewayProxyResult } from 'aws-lambda'
import { createAuthenticatedHandler } from '../create-authenticated-handler'
import { logger } from '../logger.js'
import { renderFarms } from '../views/farms.js'
import { getFarms } from './agriwebb-graphql-api.js'
import { getIntegration } from './integrations.js'

const log = logger('handle-farms-list')

export const handleFarmListRequest = createAuthenticatedHandler(
  log,
  async (integrationId: string): Promise<APIGatewayProxyResult> => {
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
)
