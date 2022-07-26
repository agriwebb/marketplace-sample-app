import { CLIENT_ID, CLIENT_SECRET } from '../configuration-oauth2.js'
import { renderHtml } from './html.js'

export const renderCredentials = (authorisation: string | null, refreshToken: string | null) => {
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
    <div class="max-w-prose">
      <h1>Credentials</h1>
      <p>
        The following credentials are only exposed for debugging purposes and should never be exposed at any point in time in a real application.
      </p>
      <div class="flex flex-col gap-2 w-full max-w-xs">
        ${refreshTokenButton}
        <button
          class="border-2 rounded-md py-1 flex-auto"
          onclick="navigator.clipboard.writeText('Basic ${Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`,
            'utf-8'
          ).toString('base64')}')"
        >
          Copy Authorisation Basic Header
        </button>
        ${authorisationButton}
      </div>
    </div>
  `)
}
