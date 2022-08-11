import { Farm } from '../server/agriwebb-graphql-api.js'
import { renderHtml } from './html.js'

interface RenderFarmsOptions {
  farms: Farm[]
}

export const renderFarms = ({ farms }: RenderFarmsOptions): string => {
  const farmElements: string[] = []

  for (const farm of farms) {
    farmElements.push(`
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl text-bold my-4">${farm.name}</h1>
        <p class="my-2 text-gray-600">${farm.id}</p>
      </div>
    `)
  }

  return renderHtml(`
    <div class="container flex flex-col gap-2 max-w-sm border-2 rounded-md p-6">
      ${farmElements.join('\n')}
    </div>
  `)
}
