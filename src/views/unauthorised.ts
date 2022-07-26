import { INSTALLATION_URI } from '../configuration-server.js'
import { renderHtml } from './html.js'

export const renderUnauthorised = () => {
  return renderHtml(`
    <div class="flex flex-row gap-2 w-full max-w-prose">
      <a 
        class="bg-gradient-to-r from-rose-500 to-purple-500 text-white py-1 rounded-md flex-auto text-center"
        href="${INSTALLATION_URI}"
      >
        Connect to AgriWebb
      </a>
    </div>
  `)
}
