import styled, { css } from 'styled-components'
import Typist from 'react-typist';
import { useEffect, useRef } from 'react';
import { use100vh } from 'react-div-100vh'
import { clipCorners } from './ClipCorners'

const fadeIn = css`
  @keyframes fadeIn {
    0% {opacity:0;}
    100% {opacity:1;}
  }
  animation: fadeIn 0.15s;
`

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,0.45);
  ${fadeIn}
`

const Container = styled.div`
  ${fadeIn}
  ${clipCorners}
  height: 400px;
  width: 750px;
  max-width: calc(100vw - 75px);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: black;
  color: white;
  padding: calc(1vw + 10px);
  font-size: calc(0.8rem + 0.5vw);
  display: flex;
  flex-direction: column;

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
  links,
  onClose,
  onOpen
}: {
  title: string
  msg: string,
  links?: Record<string, string>,
  onClose: () => any
  onOpen?: () => any
}) {
  const closingRef = useRef(false)
  const windowHeight = use100vh() ?? 0

  useEffect(() => {
    if (!closingRef.current) {
      onOpen?.()
    }

    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === "Escape") {
        closingRef.current = true
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress) 
    }
  }, [])

  return (
    <>
      <Backdrop/>
      <Container style={{maxHeight: windowHeight-75}}>
        <div style={{flex: 1}}>
          <Typist cursor={cursor} avgTypingDelay={50} stdTypingDelay={0}>
            <Typist.Delay ms={200}/>
            <b>{title}</b>
            <br/>
            <br/>
            {msg.replace(/\.$/, '').split(/\.\s/).map(sentence => (
              <span><Typist.Delay ms={500}/>{sentence+'. '}</span>
            ))}
          </Typist>
        </div>
        <FlexRow>
          {links && Object.entries(links).map(([key,href]) => (
            <a 
              key={key}
              target="_blank"
              rel="noreferrer"
              href={href}
            >
              {key}
            </a>
          ))}
          <button 
            onClick={() => {
              closingRef.current = true
              onClose()
            }}
          >
            Close
          </button>
        </FlexRow>
      </Container>
    </>
  )
}