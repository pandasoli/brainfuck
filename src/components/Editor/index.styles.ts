import styled from 'styled-components'


export default styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;

  width: 100%;
  min-height: 400px;

  @media (min-width: 768px) { max-width: 768px; } // --sm-size
  @media (min-width: 992px) { max-width: 992px; } // --md-size
  @media (min-width: 1200px) { max-width: 1200px; } // --lg-size

  overflow: hidden;
  z-index: 2;

  * {
    font-family: 'FiraCode' !important;
    font-size: .8rem !important;
  }

  .editorType {
    flex-grow: 1;

    margin: 4px;

    border-radius: 4px;
    background-color: var(--primary-cl-light);

    textarea {
      text-align: left;
      overflow: auto !important;
    }

    pre span {
      opacity: 1;
    }
  }
`

export const Background = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  height: 100%;
  width: 100%;

  background-color: rgba(0, 0, 0, .3);

  span {
    font-size: 2rem !important;
  }
`

export const DivWarning = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  div {
    display: flex;
    justify-content: center;
  }
`

export const LineNumbers = styled.ol`
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: 30px;

  margin: 4px;
  padding: 10px 4px;

  list-style: none;
  user-select: none;

  border-radius: 4px;
  background-color: var(--primary-cl-light);

  li {
    cursor: default;
    color: #565f89;

    &:hover {
      color: #7079a4;
    }
  }
`
