import styled from 'styled-components'


export default styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

export const Contents = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;

  overflow: auto;

  .components {
    flex-grow: 1;
  }
`
