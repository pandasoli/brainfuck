import styled from 'styled-components'


export default styled.label`
  display: block;
`

const Char = styled.span`
  display: inline-block;

  &.focused {
    padding: 0 10px;

    color: var(--primary-font-cl);

    &.error {
      color: var(--primary-font-cl);

      transform: scale(1.4, 1.4);
      border: 1px solid var(--primary-font-cl);
      background-color: #de5971;
    }
  }

  &.warning {
    width: 14px;

    text-align: center;

    border-radius: 2px;
    background-color: var(--secondary-cl);
  }
`

export const NewLine = styled(Char)`
  height: 14px;
`

export const MoveRight = styled(Char)`
  color: #7aa2f7;
`

export const MoveLeft = styled(Char)`
  color: #7aa2f7;
`

export const StartLoop = styled(Char)`
  color: #7aa2f7;
`

export const EndLoop = styled(Char)`
  color: #7aa2f7;
`

export const Increment = styled(Char)`
  color: #de5971;
`

export const Decrement = styled(Char)`
  color: #7dcfff;
`

export const Print = styled(Char)`
  color: #9ece6a;
`

export const AskChar = styled(Char)`
  color: #9ece6a;
`

export const EndProgram = styled(Char)`
  color: #bb9af7;
`

export const Comment = styled(Char)`
  color: #565f89;
`
