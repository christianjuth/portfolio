import styled from 'styled-components'
import Typist from 'react-typist';

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,0.45);
`

const Container = styled.div`
  height: 400px;
  width: 700px;
  max-height: calc(100vh - 50px);
  max-width: calc(100vw - 50px);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: black;
  color: white;
  padding: 25px;
  border: 1px solid white;
  font-size: calc(0.8rem + 0.5vw);
  display: flex;
  flex-direction: column;
  border-radius: 3px;

  button,
  a,
  a:visited {
    background-color: white;
    border: none;
    color: black;
    margin-left: 15px;
    font-size: 0.9rem;
    text-decoration: none;
    cursor: pointer;
    padding: 2px 8px;
    border-radius: 3px;
  }

  * {
    line-height: 1.5em;
  }
`

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const cursor = {
  show: true,
  blink: true,
  element: '▊',
  hideWhenDone: true,
  hideWhenDoneDelay: 0,
}

export function Alert({
  title,
  msg,
  learnMore,
  onClose
}: {
  title: string
  msg: string,
  learnMore?: string,
  onClose: () => any
}) {
  return (
    <>
      <Backdrop/>
      <Container>
        <div style={{flex: 1}}>
          <Typist cursor={cursor} avgTypingDelay={50} stdTypingDelay={0}>
            <b>{title}</b>
            <br/>
            <br/>
            {msg.replace(/\.$/, '').split(/\.\s/).map(sentence => (
              <span><Typist.Delay ms={500}/>{sentence+'. '}</span>
            ))}
          </Typist>
        </div>
        <FlexRow>
          {learnMore && <a href={learnMore}>Learn More</a>}
          <button onClick={() => onClose()}>Close</button>
        </FlexRow>
      </Container>
    </>
  )
}