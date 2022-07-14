import styled from 'styled-components'


export default styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 200px;

  padding: 4px;
  margin: 4px 10px;
`

export const Viwer = styled.div`
  position: absolute;
  height: 30px;
  min-width: 40px;

  top: -36px;
  left: 0px;

  padding: 4px 10px;
  border-radius: 2px;

  visibility: hidden;
  transition: opacity .2s, visibility .2s;

  opacity: 0;
  background-color: var(--primary-cl-light);

  label {
    display: block;

    width: 100%;

    text-align: center;
  }

  div {
    position: absolute;

    height: 6px;
    width: 100%;
    max-width: 40px;

    top: 100%;
    left: calc(50% - min(100%, 20px));

    clip-path: polygon(50% 100%, 0 0, 100% 0);
    background-color: var(--primary-cl-light);
  }
`

export const Input = styled.input`
  height: 5px;
  width: 100%;
  min-width: 0px;

  margin: 0px;
  padding: 0px;
  border-radius: 4px;

  border: none;
  background-color: var(--primary-cl-light);

  &::-webkit-slider-thumb {
    height: 14px;
    width: 14px;

    border-radius: 50%;

    cursor: pointer;
    appearance: none;
    background-color: var(--primary-font-cl);
  }
`
