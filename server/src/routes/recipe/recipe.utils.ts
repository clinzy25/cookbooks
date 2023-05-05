import { PutObjectCommand } from '@aws-sdk/client-s3'
import { FAILED_TO_FETCH_IMAGE, S3_UPLOAD_FAILED } from '../../utils/utils.errors'
import { s3Client } from '../../app'
import { v4 as uuidv4 } from 'uuid'

export function toBuffer(arrayBuffer: ArrayBuffer): Buffer {
  const buffer = Buffer.alloc(arrayBuffer.byteLength)
  const view = new Uint8Array(arrayBuffer)
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i]
  }
  return buffer
}

export async function uploadToS3(imageUrl: string): Promise<string> {
  return await fetch(imageUrl)
    .then(res => {
      if (res.status === 200) {
        return res.arrayBuffer()
      }
      throw new Error(FAILED_TO_FETCH_IMAGE)
    })
    .then(async buffer => {
      const params = {
        Body: toBuffer(buffer),
        Bucket: process.env.RECIPE_IMAGES_BUCKET,
        Key: `${uuidv4()}.webp`,
        ContentType: 'image/webp',
      }
      const res = await s3Client.send(new PutObjectCommand(params))
      if (res.$metadata.httpStatusCode === 200) {
        return `${process.env.NEXT_PUBLIC_RECIPE_IMAGES_BUCKET_LINK}/${params.Key}`
      }
      throw new Error(S3_UPLOAD_FAILED)
    })
    .catch(e => {
      console.error(e)
      return imageUrl
    })
}

export const getRandomFallback = () => {
  const randomInt = Math.round(Math.random() * (3 - 1) + 1)
  return `${process.env.NEXT_PUBLIC_RECIPE_IMAGES_BUCKET_LINK}/recipe_fallback_${randomInt}.png`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRecipeImage = async (parsedRecipe: { [key: string]: any }): Promise<string> => {
  const possibleUrls = [parsedRecipe.image, parsedRecipe.image?.contentUrl]
  const url = possibleUrls.find(url => url && typeof url === 'string')
  return url ? await uploadToS3(url) : getRandomFallback()
}
