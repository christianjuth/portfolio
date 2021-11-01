import styled from "styled-components"

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  bottom: 10px;
  right: 10px;
`

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`

const Button = styled.button`
  width: 40px;
  height: 40px;
  background-color: black;
  color: white;
  font-weight: bold;
  border: 1px solid white;
  cursor: pointer;
  margin: 1px;
  border-radius: 3px;
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
      <Button onClick={() => onArrowPress('n')}>
        N
      </Button>
      <FlexRow>
        <Button
          onTouchStart={() => onArrowPress('e')}
          onTouchEnd={() => onArrowRelease()}
          onMouseDown={() => onArrowPress('e')}
          onMouseUp={() => onArrowRelease()}
        >
          E
        </Button>
        <Button onClick={() => onArrowPress('s')}>S</Button>
        <Button
          onTouchStart={() => onArrowPress('w')}
          onTouchEnd={() => onArrowRelease()}
          onMouseDown={() => onArrowPress('w')}
          onMouseUp={() => onArrowRelease()}
        >
          W
        </Button> 
      </FlexRow>
    </Controls>
  )
}