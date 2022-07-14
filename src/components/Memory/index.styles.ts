import styled from 'styled-components'


export default styled.ol`
  position: relative;
  display: flex;

  margin: 0 0 10px 0;
  padding: 0;

  li {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 40px;
    width: 40px;

    border: 1px solid var(--primary-cl-light);
    box-shadow: 0 0 3px var(--primary-font-cl);
    
    &.empty {
      opacity: .6;
    }

    &.error {
      box-shadow: 0 0 3px var(--red-cl);
    }
  }
`

export const Pointer = styled.div`
  position: absolute;

  height: 10px;
  width: 40px;

  top: 36px;

  clip-path: polygon(50% 0, 100% 100%, 0 100%);
  background-color: var(--primary-font-cl);
`
