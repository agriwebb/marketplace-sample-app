import cookie, { CookieSerializeOptions } from 'cookie'
import { BASE_URL } from '../configuration-server.js'
import { logger } from '../logger.js'

const log = logger('redirect-manager')

export const setRedirectCookie = (redirectURL: string) => {
  const cookieOptions: CookieSerializeOptions = {
    httpOnly: true,
    maxAge: 1800,
    path: new URL(BASE_URL).pathname,
    secure: true,
    sameSite: 'lax',
  }

  log('cookie options: %O', cookieOptions)

  const redirectCookie = cookie.serialize('Redirect', redirectURL, cookieOptions)

  log('set-redirect-cookie: "%s"', redirectCookie)

  return redirectCookie
}

export const getRedirectCookie = (string: string) => {
  const redirect = cookie.parse(string).Redirect

  log('get-redirect-cookie: "%s"', string)

  return redirect
}
