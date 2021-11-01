import { Game } from './Game'
import styled from 'styled-components'
import { use100vh } from 'react-div-100vh'
import { useEffect, useState } from 'react';

const BACKGROUND_COLOR = "#1fa9e1"

const Page = styled.div`
  // display: flex;
  // align-items: flex-end;
  // width: 100%;
  background-color: ${BACKGROUND_COLOR};
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
