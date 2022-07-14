import styled from 'styled-components'


export const FooterCharTable = styled.ol`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  padding: 0;

  li {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 36px;
    max-width: 80px;
    min-width: 80px;

    padding: 4px 10px;
    border-radius: 4px;
  }
`

export const Convertions = styled.section`
  display: flex;
  justify-content: space-around;

  width: 100%;

  padding-bottom: 50px;
`

export const ResultLabel = styled.label`
  margin-top: 10px;
`
