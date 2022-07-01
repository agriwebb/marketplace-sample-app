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

  return `
    <!DOCTYPE html>
    <html class="h-full" lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Third Party Integration Example</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="h-full flex flex-col items-center justify-center">
        We are unable to connect with this integration partner at the moment, please try again later.
        <details class="my-4 w-full max-w-prose">
          <summary class="my-2">Technical details</summary>
          <div class="my-2 flex flex-col justify-between">
            <span>Error: <code class="font-mono bg-gray-200 rounded">${error}</code></span>
            <span>Error description: <code class="font-mono bg-gray-200 rounded">${error_description}</code></span>
            <span>Error URI: <code class="font-mono bg-gray-200 rounded">${error_uri}</code></span>
          </div>
        </details>
      </body>
    </html>
  `
}
