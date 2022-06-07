import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import crypto from 'node:crypto'
import { AWS_BUCKET } from './environment.js'

const s3 = new S3Client({ region: 'ap-southeast-2' })

const createCryptographicallyRandomBytes = (length = 48) =>
  crypto.randomBytes(length).toString('hex')

export const createState = async (): Promise<string> => {
  const state = createCryptographicallyRandomBytes()

  await s3.send(
    new PutObjectCommand({
      Bucket: AWS_BUCKET,
      Key: 'state/' + state,
    })
  )

  return state
}

export const validateState = async (state: string): Promise<boolean> => {
  try {
    await s3.send(
      new GetObjectCommand({
        Bucket: AWS_BUCKET,
        Key: 'state/' + state,
      })
    )

    await s3.send(
      new DeleteObjectCommand({
        Bucket: AWS_BUCKET,
        Key: 'state/' + state,
      })
    )

    return true
  } catch {
    return false
  }
}
