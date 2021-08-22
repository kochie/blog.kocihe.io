import jimp from 'jimp'

export async function lqip(filename: string): Promise<string> {
  if (filename.endsWith('svg')) return ''
  const image = await jimp.read(filename)
  image.resize(jimp.AUTO, 10)
  return await image.getBase64Async(jimp.MIME_PNG)
}
