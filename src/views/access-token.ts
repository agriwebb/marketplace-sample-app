import { AccessToken } from '../oauth2/token-exchange'
import { renderHtml } from './html'

export const renderAccessToken = ({ access_token, token_type, refresh_token }: AccessToken) => {
  return renderHtml(`
    <div class="flex flex-row gap-2 w-full max-w-prose">
      <button
        id="copy-refresh-token"
        class="border-2 rounded-md py-1 flex-auto"
        onclick="navigator.clipboard.writeText('${token_type} ${access_token}')"
      >
        Copy Refresh Token
      </button>
      <button
        id="copy-access-token"
        class="bg-gradient-to-r from-rose-500 to-purple-500 text-white py-1 rounded-md flex-auto"
        onclick="navigator.clipboard.writeText('${refresh_token}')"
      >
        Copy Access Token
      </button>
    </div>
  `)
}
