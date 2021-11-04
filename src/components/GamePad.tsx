import styled from "styled-components"
import { clipCorners } from './ClipCorners'
import { BsFillCaretUpFill, BsFillCaretDownFill, BsFillCaretRightFill, BsFillCaretLeftFill } from 'react-icons/bs'

const CORNER_SIZE = 2

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  bottom: 5px;
  right: 5px;
`

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`

const Button = styled.button`
  ${clipCorners}
  width: 40px;
  height: 40px;
  color: white;
  background-color: black;
  border: none;
  border-radius: 0;
  font-weight: bold;
  cursor: pointer;
  margin: 5px;
`

export function GamePad({
  onArrowPress,
  onArrowRelease
}: {
  onArrowPress: (direction: 'e' | 'w' | 'n' | 's') => any
  onArrowRelease: () => any
}) {
  return (
    <Controls>
      <Button onClick={() => onArrowPress('n')} cornerSize={CORNER_SIZE}>
        <BsFillCaretUpFill/>
      </Button>
      <FlexRow>
        <Button
          cornerSize={CORNER_SIZE}
          onTouchStart={() => onArrowPress('e')}
          onTouchEnd={() => onArrowRelease()}
          onMouseDown={() => onArrowPress('e')}
          onMouseUp={() => onArrowRelease()}
        >
          <BsFillCaretLeftFill/>
        </Button>
        <Button onClick={() => onArrowPress('s')} cornerSize={CORNER_SIZE}>
          <BsFillCaretDownFill/>
        </Button>
        <Button
          cornerSize={CORNER_SIZE}
          onTouchStart={() => onArrowPress('w')}
          onTouchEnd={() => onArrowRelease()}
          onMouseDown={() => onArrowPress('w')}
          onMouseUp={() => onArrowRelease()}
        >
          <BsFillCaretRightFill/>
        </Button> 
      </FlexRow>
    </Controls>
  )
}