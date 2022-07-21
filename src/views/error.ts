import { renderHtml } from './html'

export class OAuth2Error extends Error {
  constructor(
    public readonly error?: string,
    public readonly error_description?: string,
    public readonly error_uri?: string
  ) {
    super(`${error}: ${error_description}`)
  }
}

export const renderError = (input?: unknown): string => {
  let message =
    'We are unable to connect with AgriWebb at the moment, please try again later. If the problem persists, please contact support.'
  let error: string | undefined
  let error_description: string | undefined
  let error_uri: string | undefined

  if (input instanceof OAuth2Error) {
    error = input.error
    error_description = input.error_description
    error_uri = input.error_uri
  } else if (input instanceof Error) {
    error = 'server_error'
    error_description = input.message
  } else if (typeof input === 'string') {
    error = 'server_error'
    error_description = input
  }

  if (error === 'access_denied') {
    message =
      'This integration does not work without access to your AgriWebb account, please go back to AgriWebb and approve the integration. If the problem persists, please contact support.'
  }

  return renderHtml(`
    <span class="max-w-prose">${message}</span>
    <details class="my-4 w-full max-w-prose">
      <summary class="my-2">Technical details</summary>
      <div class="my-2 flex flex-col justify-between">
        <span>Error: <code class="font-mono bg-gray-200 rounded">${error}</code></span>
        <span
          >Error description:
          <code class="font-mono bg-gray-200 rounded">${error_description}</code></span
        >
        <span>Error URI: <code class="font-mono bg-gray-200 rounded">${error_uri}</code></span>
      </div>
    </details>
  `)
}
