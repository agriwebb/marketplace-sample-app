import { renderHtml } from './html.js'

export const renderCredentials = (authorisation: string | null, refreshToken: string | null) => {
  let authorisationButton = ''
  let refreshTokenButton = ''

  if (authorisation) {
    authorisationButton = `
      <button
        id="copy-access-token"
        class="bg-gradient-to-r from-rose-500 to-purple-500 text-white py-1 rounded-md flex-auto"
        onclick="navigator.clipboard.writeText('${authorisation}')"
      >
        Copy Authorisation Header
      </button>
    `
  }

  if (refreshToken) {
    refreshTokenButton = `
      <button
        id="copy-refresh-token"
        class="border-2 rounded-md py-1 flex-auto"
        onclick="navigator.clipboard.writeText('${refreshToken}')"
      >
        Copy Refresh Token
      </button>
    `
  }

  return renderHtml(`
    <div class="flex flex-row gap-2 w-full max-w-prose">
      ${refreshTokenButton}
      ${authorisationButton}
    </div>
  `)
}
