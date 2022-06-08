import debug from 'debug'
if (!process.env.DEBUG) debug.enable('prototype-oauth-client*')
export const log = debug('prototype-oauth-client')
export const logger = (namespace: string) => log.extend(namespace, ':')
