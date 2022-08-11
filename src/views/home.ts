import {
  AGRIWEBB_DOCUMENTATION_URI,
  AGRIWEBB_MARKETPLACE_HOMEPAGE_URI,
} from '../configuration-server.js'
import { renderHtml } from './html.js'

export const renderHome = () => {
  return renderHtml(`
    <div class="max-w-prose">
      <h1 class="my-4 text-2xl">AgriWebb Marketplace Sample App</h1>
      <p>
        This is a sample app for the AgriWebb Marketplace. You can view this sample app on the <a class="underline underline-offset-2 text-sky-400" href="${AGRIWEBB_MARKETPLACE_HOMEPAGE_URI}">AgriWebb Marketplace</a>. You can view the source code of this app on <a class="underline underline-offset-2 text-sky-400" href="https://github.com/agriwebb/marketplace-sample-app">GitHub</a>. You can also read the documentation on <a class="underline underline-offset-2 text-sky-400" href="${AGRIWEBB_DOCUMENTATION_URI}">AgriWebb API Documentation</a>.
      </p>
    </div>
  `)
}
