import { useAudio } from '../utils/useAudio'
import { BsFillVolumeUpFill, BsFillVolumeMuteFill } from 'react-icons/bs'
import styled from 'styled-components'

const Control = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
`

export function ThemeMusic() {
  const [audioPlaying, toggleAudio] = useAudio('/theme-song.mp3')

  return (
    <Control
      onClick={() => {
        toggleAudio()
      }} 
    >
      {!audioPlaying ? (
        <BsFillVolumeMuteFill size={38} />
      ) : (
        <BsFillVolumeUpFill size={38} />
      )}
    </Control>
  )
}