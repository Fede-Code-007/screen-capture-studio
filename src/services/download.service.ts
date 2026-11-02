export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()

  // Liberamos la URL después de que el navegador inicie la descarga
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}