export async function getMedia() {
  const media = await navigator.mediaDevices.getDisplayMedia({
    video: {
      frameRate: {
        ideal: 60,
      },
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
  });

  return media;
}

export async function getAudio() {
  const audio = await navigator.mediaDevices
    .getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    })
    .catch(() => null);

  return audio;
}

export function getStream(media: MediaStream, audio: MediaStream | null) {
  const stream = new MediaStream();

  const [desktopVideoTrack] = media.getVideoTracks();
  const [desktopAudioTrack] = media.getAudioTracks();

  let microphoneMediaStream: MediaStream | null = null;

  if (audio) {
    microphoneMediaStream = audio;
  }

  if (desktopAudioTrack && microphoneMediaStream) {
    const audioContext = new AudioContext();

    const destination = audioContext.createMediaStreamDestination();

    const source1 = audioContext.createMediaStreamSource(media);
    const source2 = audioContext.createMediaStreamSource(microphoneMediaStream);

    source1.connect(destination);
    source2.connect(destination);

    stream.addTrack(destination.stream.getAudioTracks()[0]);
  } else if (desktopAudioTrack) {
    stream.addTrack(desktopAudioTrack);
  } else if (microphoneMediaStream) {
    stream.addTrack(microphoneMediaStream.getAudioTracks()[0]);
  }

  stream.addTrack(desktopVideoTrack);

  return {
    stream,
    desktopVideoTrack,
  };
}
