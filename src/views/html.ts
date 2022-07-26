import { CREDENTIALS_URI, FARM_LIST_URI, HOME_URI, LOGOUT_URI } from '../configuration-server.js'

export const renderHtml = (template: string) => {
  return `
    <!DOCTYPE html>
    <html class="h-full" lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sample App</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="h-full flex flex-col items-center justify-center">
        <header class="absolute border-b flex flex-row gap-4 items-center p-4 top-0 w-full justify-between">
          <div class="flex flex-row gap-4 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2A5.37 5.37 0 0 0 5.4 6.62C2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53L13.51 12l2.69-2.39c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12a5.386 5.386 0 0 0 3.82 1.57c2.98 0 5.4-2.41 5.4-5.38s-2.42-5.37-5.4-5.37z"
              />
            </svg>
            Sample App
          </div>
          <nav>
            <ul class="flex flex-row gap-2">
              <li>
                <a class="underline underline-offset-2" href="${HOME_URI}">Home</a>
              </li>
              <li>
                <a class="underline underline-offset-2" href="${FARM_LIST_URI}">Farms</a>
              </li>
              <li>
                <a class="underline underline-offset-2" href="${CREDENTIALS_URI}">Credentials</a>
              </li>
            </ul>
          </nav>
          <a href="${LOGOUT_URI}" class="px-4 py-2 border rounded-md">
            Logout
          </a>
        </header>
        ${template}
        <footer class="absolute border-t flex flex-row p-4 bottom-0 w-full justify-center">
          <span>
            <a class="underline" href="https://api.staging.agriwebb.com/docs">AgriWebb API Documentation</a>
          </span>
        </footer>
      </body>
    </html>
  `
}
