import debug from 'debug'
if (!process.env.DEBUG) debug.enable('@agriwebb/marketplace-sample-app*')
export const log = debug('@agriwebb/marketplace-sample-app')
export const logger = (namespace: string) => log.extend(namespace, ':')
