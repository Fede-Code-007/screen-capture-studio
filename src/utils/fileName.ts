export function getFileExtension(mimeType: string): string {
  return mimeType.includes('mp4') ? 'mp4' : 'webm'
}

export function buildFileName(mimeType: string, date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')

  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  const time = `${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`

  return `grabacion-${day}-${time}.${getFileExtension(mimeType)}`
}