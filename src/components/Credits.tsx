import { useState, ComponentProps } from 'react'
import styled from 'styled-components'
import { Alert } from './Alert'

const ALERT = {
  title: "Credits",
  msg: "Music: Adventure by Alexander Nakarada | https://www.serpentsoundstudios.com. Music promoted by https://www.chosic.com/free-music/all/. Attribution 4.0 International (CC BY 4.0). https://creativecommons.org/licenses/by/4.0/."
} as const

const Button = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: transparent;
  text-decoration: underline;
  color: black;
  border: none;
`

export function Credits() {
  const [alert, setAlert] = useState<ComponentProps<typeof Alert> | null>(null) 

  if (alert) {
    return (
      <Alert {...alert}/>
    )
  }

  return (
    <Button onClick={() => setAlert({ ...ALERT, onClose: () => setAlert(null) })}>
      Credits
    </Button>
  )
}