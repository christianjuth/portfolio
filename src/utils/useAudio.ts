import { useEffect, useState, useCallback } from "react";

export const useAudio = (url: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    try {
      const localAudio = new Audio(url)
      setAudio(localAudio)
      return () => {
        localAudio.pause()
        localAudio.remove()
      }
    } catch(err) {}
  }, [url])

  const toggle = useCallback(
    (toggle = !playing) => {
      toggle ? audio?.play() : audio?.pause();
    },
    [audio, playing]
  )

  useEffect(() => {
    if (audio) {
      function setPlayingTrue() {
        setPlaying(true)
      }
      function setPlayingFalse() {
        setPlaying(false)
      }
      function pauseAudio() {
        audio?.pause()
      }

      audio.addEventListener('ended', setPlayingFalse);
      audio.addEventListener('play', setPlayingTrue)
      audio.addEventListener('pause', setPlayingFalse)
      window.addEventListener('blur', pauseAudio)
      audio.play()
      audio.volume = 0.4
      return () => {
        audio.removeEventListener('ended', setPlayingFalse);
        audio.removeEventListener('play', setPlayingTrue)
        audio.removeEventListener('pause', setPlayingFalse)
        window.removeEventListener('blur', pauseAudio)
      };
    }
  }, [audio]);

  return [playing, toggle] as const
};