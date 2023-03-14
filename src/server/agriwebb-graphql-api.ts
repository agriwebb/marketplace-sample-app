import { AGRIWEBB_GRAPHQL_URI } from '../configuration-server.js'
import { fetchWithCredentialRefresh } from './fetch.js'

export interface Farm {
  id: string
  name: string
}

const graphql = async <T>(integrationId: string, query: string): Promise<T> => {
  const response = await fetchWithCredentialRefresh(integrationId, AGRIWEBB_GRAPHQL_URI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  const json = await response.json()

  if (json.errors?.length === 1) {
    throw new Error(json.errors[0].message)
  } else if (json.errors?.length > 1) {
    throw new AggregateError(
      json.errors.map((error: { message: string }) => new Error(error.message)),
      json.errors.map((error: { message: string }) => error.message).join(', ')
    )
  }

  return json.data
}

export const getFarms = async (integrationId: string, farmIds: string[]): Promise<Farm[]> => {
  const response = await graphql<{ farms: Farm[] }>(
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
