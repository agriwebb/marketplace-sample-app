import { IS_DEVELOPMENT } from '../configuration-server.js'
import { renderHtml } from './html.js'

export const renderCredentials = (authorisation: string | null, refreshToken: string | null) => {
  if (!IS_DEVELOPMENT) {
    return renderHtml(`
      <div class="max-w-sm">
        <h1 class="my-4 text-2xl">Credentials</h1>
        <p>
         Credentials cannot be viewed in a deployed application, please run the application locally to expose the credentials for debugging purposes.
        </p>
      </div>
    `)
  }

  let authorisationButton = ''
  let refreshTokenButton = ''

  if (authorisation) {
    authorisationButton = `
      <button
        class="bg-gradient-to-r from-rose-500 to-purple-500 text-white py-1 rounded-md flex-auto"
        onclick="navigator.clipboard.writeText('${authorisation}')"
      >
        Copy Authorisation Bearer Header
      </button>
    `
  }

  if (refreshToken) {
    refreshTokenButton = `
      <button
        class="border-2 rounded-md py-1 flex-auto"
        onclick="navigator.clipboard.writeText('${refreshToken}')"
      >
        Copy Refresh Token
      </button>
    `
  }

  return renderHtml(`
    <div class="max-w-sm">
      <h1 class="my-4 text-2xl">Credentials</h1>
      <p>
        The following credentials are only exposed for debugging purposes and should never be exposed at any point in time in a real application.
      </p>
      <div class="flex flex-col gap-2 my-4 w-full">
        ${refreshTokenButton}
        ${authorisationButton}
      </div>
    </div>
  `)
}
