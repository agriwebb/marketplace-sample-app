/*
  The base url the applicaiton is deployed at.
*/
export const BASE_URL =
  (process.env.IS_OFFLINE !== 'true' && process.env.BASE_URL) || 'http://localhost:3000/dev/'

/*
  These public and private key are used in the verification of the state
  parameter. They should be stored in something like AWS Secrets Manager or
  similar, however, for the portability of this example they are stored here.
*/
export const PRIVATE_KEY =
  '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzvFyyFek1JWri\nTdKqwfyiuvD/gEN4+q+hrSRQyhwfrFV3MY/V+gT5H0cx93SAe1+RvU9duAO6dyrO\nNPxPn/oFNoGdK1nPb/5XNs48ipzNyy+io/AMS0HS1GnZDsyqtgptR1mdm5X0bLUF\n2lqji8n5kRz6yao/MBM0KWcegEPoyouxI6ZYKG7AeW78dTjdq72qvFbElfD4+7It\nF7CExvxbvMPwtfRvSFfaI5I7dmr5UrP5CcU52ZQLjDfkQCkduNSWHQKJZvtS4brk\nl3dSPDklatSfcXfq0OGmD8W57JvH6QZaJXFX/hrxED7Nevj3IPJvEQmm+cjpfcDL\ndXbN8hNfAgMBAAECggEBAIV2IP679mdYWX2hfAT/9rB/T+TpQTDcNP5Aqu6ypR9/\nwBa53qxs8rRp3Vvk+8VL1zNI914H/fy/8DEedxxJFkY4qxYh0paN+raYI5wg8T5+\n2ehTAzSdzUrYH6DltGQuuJ9ck9bMaRUOg3zNHvDCJEAE2RgAF0LEV/4roD6tz79T\nJ/msflWzxOGc0xQelK/w25olaCOcwHmUFo06aXRpdcyNrExT3yAqBFVr6GG8D2f6\nJfIEAO5q3Mbw+p0HPf2YTNTN08NcEzz2ExjK0Fhh8ZyaR8IHTPBdlS8eTfkM8s0j\n3YvkbCUnnjpHYaTYIZCI8dQqlULYsMYl1BWXTEBwP8ECgYEA5knst0OuYIidYz3/\nJ5Cr0ZT4O2heu/nL1PiwOXd2NxSJTvSt4ZkezWPNhs81ie4JfcmkuL4k6XTUtCkl\nm2eAA7ldnRITOeE9yPFRxbcxsegpThjXehAQlUEY68CWECOQoWio6P/JnJ5SbGhW\nR04iUtCLvg3EfouF9QjHlaBm0hUCgYEAx82KYy34Cv3Q6TAJ3TU8IGFYMLETCPFx\ng+T8Uyj95QUxuh5p5uEOX2mq2z+e2Qbb4xajh1ty9KXhCzYbYR5uoRHNXYxJPeyl\ngH8WgtU7YL1XN9jhtYNUEeoPJkbM3ef7al+ceXr9N/1y5AxgtwBZTZyailwngoOO\nh+b69/01EKMCgYAfyHIgNPobHp/CM6tEdaYRDeNYp6XzgZ1NLml79O3e2jm9KO3a\npfxnUm/qPCzidXTf5HWUfcGwasx0dP1YvmcfnHS8GeOHaHvTgOLNS+RS7nzM54bN\ntOvk/ZAH8ZOEdLQgYsZ1KeBUelFb3uaRfsoj7d5rg5Dr+iupzuVk1Dd8pQKBgBY6\nZKnyBEVcxXAb2w0UDhNgIQqRuJdnHQTaZcPurIhdEpItLgT0hr/QpqRrqIVmgPH7\no8e8Qca76ZRwuY0NcKtUqq88my1bdXIdMWjuxgNWLSzWYQ3rhV/U1Uih2craMxs7\nddIB/8fJ141NXzkcvdKnmH3KEM8xSZsO9F7AebXXAoGAZq7ZiEhJJFEq7l5QhxKI\nGD8jhfEq6R/Q0Jnn6/nbG5i+ZoYZbhDdbLwzZ7sXIRi7ZksN+Xnqt8PjfbrrhJXx\nEvpQtkK2hdohiJwcHBh9a5GurRr9wzXEkN/jVtd3ZODDh2ZOSm7cgvJrLCThYww2\nDWdbO6RQBbcFkFvOFdrG2vI=\n-----END PRIVATE KEY-----\n'
export const PUBLIC_KEY =
  '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs7xcshXpNSVq4k3SqsH8\norrw/4BDePqvoa0kUMocH6xVdzGP1foE+R9HMfd0gHtfkb1PXbgDuncqzjT8T5/6\nBTaBnStZz2/+VzbOPIqczcsvoqPwDEtB0tRp2Q7MqrYKbUdZnZuV9Gy1Bdpao4vJ\n+ZEc+smqPzATNClnHoBD6MqLsSOmWChuwHlu/HU43au9qrxWxJXw+PuyLRewhMb8\nW7zD8LX0b0hX2iOSO3Zq+VKz+QnFOdmUC4w35EApHbjUlh0CiWb7UuG65Jd3Ujw5\nJWrUn3F36tDhpg/Fueybx+kGWiVxV/4a8RA+zXr49yDybxEJpvnI6X3Ay3V2zfIT\nXwIDAQAB\n-----END PUBLIC KEY-----\n'

/*
  The OAuth 2.0 server endpoints.
*/
export const OAUTH_SERVER_AUTHORIZE_URL = 'https://discord.com/api/oauth2/authorize'
export const OAUTH_SERVER_TOKEN_URL = 'https://discord.com/api/oauth2/token'

/*
  The client credentials provided by the OAuth 2.0 server.

  The client secret should be stored in something like AWS Secrets Manager or
  similar, however, for the portability of this example it is stored here.
  Ideally the client id should also be stored in the same secure location as the
  secret, but since this is a public identifier that is not nessecary. 
*/
export const CLIENT_ID = '983599648470085654'
export const CLIENT_SECRET = 'AQ-qiNYgFNG7giHPQ4gKV4CqN5SfUnPg'

/*
  The redirect URI provided to the OAuth 2.0 server.
*/
export const REDIRECT_URI = new URL('./callback', BASE_URL).href

/*
  The scopes to request from the OAuth 2.0 server.
*/
export const SCOPE = 'identify'
