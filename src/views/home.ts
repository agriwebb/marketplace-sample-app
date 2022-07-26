import { renderHtml } from './html.js'

export const renderHome = () => {
  return renderHtml(`
    <div class="max-w-prose">
      <h1 class="my-4 text-2xl">AgriWebb Marketplace Sample App</h1>
      <p>
        This is a sample app for the AgriWebb Marketplace. You can view the source code of this app on <a class="underline underline-offset-2 text-sky-400" href="https://github.com/agriwebb/marketplace-sample-app">GitHub</a>. You can also read the documentation on <a class="underline underline-offset-2 text-sky-400" href="https://api.staging.agriwebb.com/docs">AgriWebb API Documentation</a>.
      </p>
    </div>
  `)
}