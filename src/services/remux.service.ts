/**
 * Convierte el MP4 fragmentado de MediaRecorder en un MP4 estándar
 * (con índice y duración al inicio), que el reproductor de Windows
 * puede adelantar y atrasar. No recodifica el video.
 */
export async function remuxToStandardMp4(blob: Blob): Promise<Blob> {
  // Import dinámico: la librería solo se descarga cuando hace falta
  const { Input, Output, Conversion, BlobSource, BufferTarget, Mp4OutputFormat, ALL_FORMATS } =
    await import('mediabunny')

  const input = new Input({ source: new BlobSource(blob), formats: ALL_FORMATS })
  const output = new Output({
    format: new Mp4OutputFormat({ fastStart: 'in-memory' }),
    target: new BufferTarget(),
  })

  const conversion = await Conversion.init({ input, output })
  await conversion.execute()

  const buffer = output.target.buffer
  if (!buffer) throw new Error('El remux no generó datos')

  return new Blob([buffer], { type: 'video/mp4' })
}