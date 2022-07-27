import { APIGatewayProxyResult } from 'aws-lambda'
import { createHandler } from '../create-handler'
import { logger } from '../logger.js'
import { renderHome } from '../views/home.js'

const log = logger('handle-home')

export const handleHomeRequest = createHandler(log, async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
    body: renderHome(),
  }
})
