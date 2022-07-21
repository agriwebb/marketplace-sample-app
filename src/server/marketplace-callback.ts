import { MARKETPLACE_CALLBACK_URL } from '../configuration.js'
import { fetchWithCredentialRefresh } from './fetch.js'

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
  options: T
): Promise<MarketplaceCallbackResult<T['type']>> => {
  const response = await fetchWithCredentialRefresh(MARKETPLACE_CALLBACK_URL, {
    method: 'POST',
    body: JSON.stringify(options),
  })

  if (!response.ok) {
    throw new Error(`Marketplace callback failed: ${response.status}`)
  }

  return response.json().then((response) => response.data)
}

export const reportIntegrationStatus = async (
  status: IntegrationStatusOptions['data']['status']
): Promise<IntegrationStatusResult['data']> => {
  return callMarketplaceCallback({
    type: 'integration-status',
    data: { status },
  })
}

export const reportIntegrationError = async (
  data: IntegrationErrorOptions['data']
): Promise<void> => {
  return callMarketplaceCallback({
    type: 'integration-error',
    data,
  })
}
