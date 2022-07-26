import { MARKETPLACE_CALLBACK_URI } from '../configuration-server.js'
import { logger } from '../logger.js'
import { fetchWithCredentialRefresh } from './fetch.js'

const log = logger('marketplace-callback')

interface IntegrationStatusOptions {
  type: 'integration-status'
  data: {
    status?: 'functional' | 'non-functional'
  }
}

interface IntegrationStatusResult {
  type: 'integration-status'
  data: {
    redirectURL: string
    allowedFarmIds: string[]
  }
}

interface IntegrationErrorOptions {
  type: 'integration-error'
  data: {
    errorUserMessage: string
    errorDeveloperMessage: string
  }
}

interface IntegrationErrorResult {
  type: 'integration-error'
}

type MarketplaceCallbackResult<T extends string> = T extends 'integration-status'
  ? IntegrationStatusResult['data']
  : void

const callMarketplaceCallback = async <
  T extends IntegrationStatusOptions | IntegrationErrorOptions
>(
  integrationId: string,
  options: T
): Promise<MarketplaceCallbackResult<T['type']>> => {
  log('call marketplace callback: "%s" %O', integrationId, options)

  const response = await fetchWithCredentialRefresh(integrationId, MARKETPLACE_CALLBACK_URI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(options),
  })

  if (!response.ok) {
    throw new Error(`Marketplace callback failed: ${response.status}`)
  }

  return response.json().then((response) => response.data)
}

export const reportIntegrationStatus = async (
  integrationId: string,
  status: IntegrationStatusOptions['data']['status']
): Promise<IntegrationStatusResult['data']> => {
  log('report integration status: "%s" "%s"', integrationId, status)

  return callMarketplaceCallback(integrationId, {
    type: 'integration-status',
    data: { status },
  })
}

export const reportIntegrationError = async (
  integrationId: string,
  data: IntegrationErrorOptions['data']
): Promise<void> => {
  log('report integration error: "%s" %O', integrationId, data)

  return callMarketplaceCallback(integrationId, {
    type: 'integration-error',
    data,
  })
}
