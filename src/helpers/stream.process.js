export const concatDesktopStreamAndAudioStream = (
  desktopStream,
  audioStream
) => {
  const [videoTracks] = desktopStream.getVideoTracks()
  const [audioTracks] = audioStream.getAudioTracks()
  return new MediaStream([videoTracks, audioTracks])
}
