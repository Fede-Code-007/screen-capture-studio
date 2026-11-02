const CANDIDATES = [
  // MP4 primero (H.264 + AAC/Opus)
  'video/mp4;codecs=avc1.64003E,mp4a.40.2',
  'video/mp4;codecs=avc1,opus',
  'video/mp4;codecs=avc1',
  'video/mp4',
  // WebM como alternativa (por ejemplo, Firefox)
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
]

export function getSupportedMimeType(): string | undefined {
  return CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type))
}