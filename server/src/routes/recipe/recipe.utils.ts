import { PutObjectCommand } from '@aws-sdk/client-s3'
import { FAILED_TO_FETCH_IMAGE, S3_UPLOAD_FAILED } from '../../utils/utils.errors'
import { s3Client } from '../../app'
import axios, { AxiosError } from 'axios'

export function toBuffer(arrayBuffer: ArrayBuffer): Buffer {
  const buffer = Buffer.alloc(arrayBuffer.byteLength)
  const view = new Uint8Array(arrayBuffer)
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i]
  }
  return buffer
}

const buildImageKey = (imageUrl: string) =>
  `${new URL(imageUrl).pathname
    .substring(1)
    .replaceAll('/', '-')
    .replace(/\.[^/.]+$/, '')}.webp`

export async function uploadToS3(imageUrl: string): Promise<string> {
  return await axios
    .get(imageUrl, { responseType: 'arraybuffer' })
    .then(async buffer => {
      if (buffer.status !== 200) throw new Error(FAILED_TO_FETCH_IMAGE)
      const Key = buildImageKey(imageUrl)
      const params = {
        Body: toBuffer(buffer.data),
        Bucket: process.env.RECIPE_IMAGES_BUCKET,
        Key,
        ContentType: 'image/webp',
      }
      const res = await s3Client.send(new PutObjectCommand(params))
      if (res.$metadata.httpStatusCode === 200) {
        return `${process.env.NEXT_PUBLIC_RECIPE_IMAGES_BUCKET_LINK}/${Key}`
      }
      throw new Error(S3_UPLOAD_FAILED)
    })
    .catch((e: AxiosError) => {
      console.error(e)
      return imageUrl
    })
}

export const getRandomFallback = () => {
  const randomInt = Math.round(Math.random() * (3 - 1) + 1)
  return `${process.env.NEXT_PUBLIC_RECIPE_IMAGES_BUCKET_LINK}/recipe_fallback_${randomInt}.png`
}

export const getRecipeImage = async (parsedRecipe: {
  [key: string]: any
}): Promise<string> => {
  const possibleUrls = [parsedRecipe.image, parsedRecipe.image?.contentUrl]
  const url = possibleUrls.find(url => url && typeof url === 'string')
  return url ? await uploadToS3(url) : getRandomFallback()
}
