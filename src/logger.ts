import debug from 'debug'
if (!process.env.DEBUG) debug.enable('third-party-integration-example*')
export const log = debug('third-party-integration-example')
export const logger = (namespace: string) => log.extend(namespace, ':')
