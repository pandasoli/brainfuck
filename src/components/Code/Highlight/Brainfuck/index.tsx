import Line, {
  MoveRight,
  MoveLeft,
  StartLoop,
  EndLoop,
  Increment,
  Decrement,
  Print,
  AskChar,
  EndProgram,
  Comment,
  NewLine
} from './index.styles'

type Props = {
  code: string
  focusAt?: number
  error?: boolean | undefined
  warnings?: number[]
}


const Brainfuck = (props: Props) => {
  const ElementProps = (key: number, line: number) => {
    const lines = props.code.replace(/\t/g, '  ').split('\n')
    let charId = key + line

    for (let x = 0; x < line; x++)
      charId += lines[x].length

    return {
      key,
      className: `
        ${charId === props.focusAt ? 'focused' : ''}
        ${props.error ? 'error' : ''}
        ${props.warnings?.includes(charId) ? 'warning' : ''}
      `
    }
  }

  return <label>
    {
      props.code.split('\n').map(($, _line) =>
        <Line key={ _line }>
          { $ === '' && <NewLine/> }
          {
            $.split('').map(($, _) =>
              $ === '>' ? <MoveRight { ...ElementProps(_, _line) }>{ $ }</MoveRight>   :
              $ === '<' ? <MoveLeft { ...ElementProps(_, _line) }>{ $ }</MoveLeft>     :
              $ === '[' ? <StartLoop { ...ElementProps(_, _line) }>{ $ }</StartLoop>   :
              $ === ']' ? <EndLoop { ...ElementProps(_, _line) }>{ $ }</EndLoop>       :
              $ === '+' ? <Increment { ...ElementProps(_, _line) }>{ $ }</Increment>   :
              $ === '-' ? <Decrement { ...ElementProps(_, _line) }>{ $ }</Decrement>   :
              $ === '.' ? <Print { ...ElementProps(_, _line) }>{ $ }</Print>           :
              $ === ',' ? <AskChar { ...ElementProps(_, _line) }>{ $ }</AskChar>       :
              $ === '!' ? <EndProgram { ...ElementProps(_, _line) }>{ $ }</EndProgram> :
              <Comment { ...ElementProps(_, _line) }>
                {
                  $ === ' ' ? <>&nbsp;</> :
                  $ === '\t' ? <>&nbsp;&nbsp;</> :
                  $
                }
              </Comment>
            )
          }
        </Line>
      )
    }
  </label>
}


export default Brainfuck