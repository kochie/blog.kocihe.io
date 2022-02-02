// import jimp from 'jimp'
import sharp from 'sharp'

// export async function lqip(filename: string): Promise<string> {
//   if (filename.endsWith('svg')) return ''
//   const image = await jimp.read(filename)
//   image.resize(jimp.AUTO, 10)
//   return await image.getBase64Async(jimp.MIME_PNG)
// }

export async function lqip(filename: string): Promise<string> {
  if (filename.endsWith('svg')) return ''
  const image = sharp(filename)
  return (await image.resize(10).toBuffer()).toString('base64url')
}
