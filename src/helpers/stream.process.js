export const concatVideoStreamAndAudioStream = (videoStream, audioStream) => {
  const [videoTracks] = videoStream.getVideoTracks()
  const [audioTracks] = audioStream.getAudioTracks()
  return new MediaStream([videoTracks, audioTracks])
}
