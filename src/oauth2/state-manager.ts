/*
  The state parameter is vital for preventing Cross-Site Request Forgery (CSRF).
  It needs to be non-guessable and stored in a location accessible only to the
  client and the user-agent (i.e., protected by same-origin policy).

  This implementation generates a cryptographically random state parameter. It
  utilizes an expiring "same-site" cookie to store an encrypted signature of the
  state for verification.

  For more information regarding CSRF, please see section 10.12 in RFC6749
  https://datatracker.ietf.org/doc/html/rfc6749#section-10.12

  For more information regarding "same-site" cookies please see
  https://web.dev/samesite-cookies-explained/
*/

import base64url from 'base64url'
import cookie, { CookieSerializeOptions } from 'cookie'
import { createHmac, randomBytes } from 'crypto'
import { REDIRECT_URI, STATE_MANAGER_SECRET } from '../configuration.js'
import { logger } from '../logger.js'

const log = logger('state-manager')

export const setSignatureCookie = (signature: string) => {
  const cookieOptions: CookieSerializeOptions = {
    httpOnly: true,
    maxAge: 300,
    path: new URL(REDIRECT_URI).pathname,
    secure: true,
    sameSite: 'lax',
  }

  log('cookie options: %O', cookieOptions)

  const signatureCookie = cookie.serialize('Signature', signature, cookieOptions)

  log('set-signature-cookie', signatureCookie)

  return signatureCookie
}

export const getSignatureCookie = (string: string) => {
  const signature = cookie.parse(string).Signature

  log('get-signature-cookie', string)

  return signature
}

export const createState = () => {
  const stateBuffer = randomBytes(48)
  const signatureBuffer = createHmac('SHA256', STATE_MANAGER_SECRET).update(stateBuffer).digest()

  const state = base64url.encode(stateBuffer)
  const signature = base64url.encode(signatureBuffer)

  log('create-state state: "%s" signature: "%s"', state, signature)

  return { state, signature }
}

export const verifyState = (state: string, signature: string) => {
  const stateBuffer = base64url.toBuffer(state)
  const signatureBuffer = base64url.toBuffer(signature)
  const isStateValid = createHmac('SHA256', STATE_MANAGER_SECRET)
    .update(stateBuffer)
    .digest()
    .equals(signatureBuffer)

  log('verify-state valid: %s state: "%s" signature: "%s"', isStateValid, state, signature)

  return isStateValid
}
