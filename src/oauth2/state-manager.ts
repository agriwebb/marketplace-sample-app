/*
  The state manager is a collection of utility functions for working with the
  state parameter, which is vital for preventing Cross-Site Request Forgery
  (CSRF). It must be non-guessable and stored in a location accessible only to
  the client and the user-agent (i.e., protected by same-origin policy). The
  state manager's implementation generates a cryptographically random state
  parameter and an HMAC-SHA256 signature. It utilizes an expiring "same-site"
  cookie to store the state's signature for verification on the callback
  endpoint.

  For more information regarding CSRF, please see section 10.12 in RFC6749
  https://datatracker.ietf.org/doc/html/rfc6749#section-10.12

  For more information regarding "same-site" cookies please see
  https://web.dev/samesite-cookies-explained/

  For more information regarding the state parameter please see Auth0's
  documentation https://auth0.com/docs/secure/attack-protection/state-parameters
*/

import base64url from 'base64url'
import cookie, { CookieSerializeOptions } from 'cookie'
import { createHmac, randomBytes } from 'crypto'
import {
  getStateManagerSecret,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  REDIRECT_URI,
} from '../configuration-server.js'
import { logger } from '../logger.js'

const log = logger('state-manager')

export const setSignatureCookie = (signature: string) => {
  const cookieOptions: CookieSerializeOptions = {
    httpOnly: true,
    maxAge: 300,
    path: new URL(REDIRECT_URI).pathname,
    secure: IS_DEVELOPMENT ? false : true,
    sameSite: IS_PRODUCTION ? 'lax' : 'none',
  }

  log('cookie options: %O', cookieOptions)

  const signatureCookie = cookie.serialize('Signature', signature, cookieOptions)

  log('set-signature-cookie: "%s"', signatureCookie)

  return signatureCookie
}

export const getSignatureCookie = (string: string) => {
  const signature = cookie.parse(string).Signature

  log('get-signature-cookie: "%s"', string)

  return signature
}

export const createState = async () => {
  const stateBuffer = randomBytes(48)
  const signatureBuffer = createHmac('SHA256', await getStateManagerSecret())
    .update(stateBuffer)
    .digest()

  const state = base64url.encode(stateBuffer)
  const signature = base64url.encode(signatureBuffer)

  log('create-state state: "%s" signature: "%s"', state, signature)

  return { state, signature }
}

export const verifyState = async (state: string, signature: string) => {
  const stateBuffer = base64url.toBuffer(state)
  const signatureBuffer = base64url.toBuffer(signature)
  const isStateValid = createHmac('SHA256', await getStateManagerSecret())
    .update(stateBuffer)
    .digest()
    .equals(signatureBuffer)

  log('verify-state valid: "%s" state: "%s" signature: "%s"', isStateValid, state, signature)

  return isStateValid
}
