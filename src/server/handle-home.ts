import { APIGatewayProxyResult } from 'aws-lambda'
import { createAuthenticatedHandler } from '../create-authenticated-handler'
import { logger } from '../logger.js'
import { renderHome } from '../views/home.js'

const log = logger('handle-home')

export const handleHomeRequest = createAuthenticatedHandler(
  log,
  async (): Promise<APIGatewayProxyResult> => {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
      body: renderHome(),
    }
  }
)
