import styled from 'styled-components'


export const Hero = styled.div`
  position: absolute;

  width: 100%;
  height: 76vh;

  z-index: -1;
  background-image: url('/images/background.jpg');
  background-position: 50%;
  background-size: cover;
  background-attachment: fixed;
`

export const HeroBackground = styled.div`
  position: absolute;

  height: 100%;
  width: 100%;

  background-color: rgba(0, 0, 0, .6);

  z-index: 0;
`

export const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  @media (min-width: 768px) { max-width: 768px; } // --sm-size
  @media (min-width: 992px) { max-width: 992px; } // --md-size
  @media (min-width: 1200px) { max-width: 1200px; } // --lg-size

  padding: 0 20px 10px 20px;

  & > div {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .range {
      margin-top: 40px;
    }
  }

  & > div:first-child {
    align-items: flex-end;
  }

  & > div:nth-child(2) {
    flex-direction: column;

    & > div {
      display: flex;
      align-items: center;
      margin: 1px;

      & > label {
        margin-right: 10px;
      }
    }

    & > div.form-check.form-check-inline {
      display: block;
    }
  }

  @media (max-width: 680px) {
    flex-direction: column;

    div {
      justify-content: center;
    }
  }
`

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
`

export const MemoryHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    color: var(--red-cl);
  }
`

export const ResultPanel = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  margin: 8px 6px;

  label {
    font-family: 'FiraCode';
    font-size: .8rem;
    word-break: break-all;
  }

  .mini {
    margin: 6px 20px;
  }
`

export const JSONResponse = styled.div`
  min-width: 200px;
  max-width: 400px;

  padding: 10px;

  font-family: 'FiraCode';
  font-size: .8rem;

  border-radius: 4px;
  background-color: var(--primary-cl-light);

  @media (max-width: 680px) {
    max-width: none;
  }
`

export const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) { max-width: 768px; } // --sm-size
  @media (min-width: 992px) { max-width: 992px; } // --md-size

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  p {
    padding: 10px 0px;
  }
`

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
