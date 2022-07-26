import { AGRIWEBB_V2_API_URI } from '../configuration-server.js'
import { fetchWithCredentialRefresh } from './fetch.js'

export interface Farm {
  id: string
  name: string
}

const v2 = async <T>(integrationId: string, query: string): Promise<T> => {
  const response = await fetchWithCredentialRefresh(integrationId, AGRIWEBB_V2_API_URI, {
    method: 'POST',
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  return response.json().then((response) => response.data)
}

export const getFarms = async (integrationId: string, farmIds: string[]): Promise<Farm[]> => {
  const response = await v2<{ farms: Farm[] }>(
    integrationId,
    `
      query {
        farms(farmIds: ${JSON.stringify(farmIds)}) {
          id,
          name
        }
      }
    `
  )

  return response.farms
}
