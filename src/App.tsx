import './App.css';
import { Game } from './Game'
import styled from 'styled-components'
import { use100vh } from 'react-div-100vh'

const BACKGROUND_COLOR = "#000034"

const Page = styled.div`
  // display: flex;
  // align-items: flex-end;
  // width: 100%;
  background-color: #000034;
  // overflow-x: hidden;
`

function App() {
  const pageHeight = use100vh() ?? 0

  return (
    <Page style={{ minHeight: pageHeight }}>
      <Game backgroundColor={BACKGROUND_COLOR}/>
    </Page>
  );
}

export default App;
