import { MARKETPLACE_CALLBACK_URL } from '../configuration-server.js'
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
  credentialId: string,
  options: T
): Promise<MarketplaceCallbackResult<T['type']>> => {
  log('call marketplace callback: "%s" %O', credentialId, options)

  const response = await fetchWithCredentialRefresh(credentialId, MARKETPLACE_CALLBACK_URL, {
    method: 'POST',
    body: JSON.stringify(options),
  })

  if (!response.ok) {
    throw new Error(`Marketplace callback failed: ${response.status}`)
  }

  return response.json().then((response) => response.data)
}

export const reportIntegrationStatus = async (
  credentialId: string,
  status: IntegrationStatusOptions['data']['status']
): Promise<IntegrationStatusResult['data']> => {
  log('report integration status: "%s" "%s"', credentialId, status)

  return callMarketplaceCallback(credentialId, {
    type: 'integration-status',
    data: { status },
  })
}

export const reportIntegrationError = async (
  credentialId: string,
  data: IntegrationErrorOptions['data']
): Promise<void> => {
  log('report integration error: "%s" %O', credentialId, data)

  return callMarketplaceCallback(credentialId, {
    type: 'integration-error',
    data,
  })
}
