import { renderHtml } from './html.js'

interface RenderLoginOptions {
  error?: string
}

export const renderLogin = ({ error }: RenderLoginOptions = {}): string => {
  return renderHtml(`
    <form class="container flex flex-col gap-2 max-w-sm border-2 rounded-md p-6" method="POST">
    <div class="text-center">
      <h1 class="text-2xl text-bold my-4">Welcome back</h1>
      <p class="my-2 text-gray-600">Enter your username and password to login.</p>
    </div>
      <label class="flex flex-col">
        Username
        <input class="border-2 rounded-md px-2 py-1" type="text" name="username" autocomplete="username" required>
      </label>
      <button class="bg-gradient-to-r from-rose-500 to-purple-500 text-white py-1 rounded-md mt-4" type="submit">Login</button>
    </form>
  `)
}
