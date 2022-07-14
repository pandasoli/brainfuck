import ReactSimpleCodeEditor from 'react-simple-code-editor'
import { Button } from 'reactstrap'

import BFHighlight from '../Code/Highlight/Brainfuck'
import Container, { LineNumbers, Background, DivWarning } from './index.styles'

type CodeType = {
  edited: boolean
  code: string
  warnings: number[]
}

type Props = {
  Code: CodeType
  SetCode: (_: CodeType) => any
  State: string
  Result: {
    index: number
    char: string
    error: string
    warning: string
  }
  $btnStop_click: () => any
  $btnContinue_click: () => any
}


const Editor = (props: Props) => {
  function fillArray(_length: number, _startBy: number = 0): null[] {
    const Result = []

    for (let x = _startBy; x <= _length; x++)
      Result.push(null)

    return Result
  }

  return (
    <Container>
      <LineNumbers>
        {
          fillArray(
            props.Code.code
            .split('')
            .filter($ => $ === '\n').length
          )
          .map(($, _) =>
            <li key={ _ }>{ _ + 1 }</li>
          )
        }
      </LineNumbers>

      <ReactSimpleCodeEditor
        className='editorType'
        value={ props.Code.code }
        onValueChange={ _code => props.SetCode({ edited: true, code: _code, warnings: [] }) }
        highlight={
          _code => <BFHighlight
            code={ _code }
            focusAt={ !props.Code.edited ? props.Result?.index : -1 }
            warnings={ props.Code.warnings }
            error={ props.Result?.error !== '' }
          />
        }
        padding={ 10 }
      />

      {
        props.State !== 'stopped' &&
          <Background>
            <div>
              <BFHighlight code={ props.Result.char || '' }/>
            </div>

            {
              props.Result?.warning && (
                <DivWarning>
                  <label className='warning'>{ props.Result?.warning }</label>

                  <div>
                    <Button err mini onClick={ props.$btnStop_click } text='Stop'/>
                    <Button success mini onClick={ props.$btnContinue_click } text='Continue'/>
                  </div>
                </DivWarning>
              )
            }
          </Background>
      }
    </Container>
  )
}


export default Editor