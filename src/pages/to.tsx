import { useState, useEffect } from 'react'
import { Label, FormGroup } from 'reactstrap'
import nookies from 'nookies'

import FadeButton from '../components/FadeButton'
import ToBrainfuck from '../scripts/ToBrainfuck'
import Button from '../components/Button'
import Input from '../components/Input.styles'
import Range from '../components/Range'
import Code from '../components/Code/block'

import { Header, Editor, Main, EditorBackground, ResultPanel, Hero, HeroBackground, CodeInput } from '../styles/to.styles'

type Result = {
  ascii: number
  memory: number[]
  index: number
  char: string
  result: string
  error: string
}


const To = () => {
  const [ PauseInterpreter, SetPauseInterpreter ] = useState(true)
  const [ Result, SetResult ] = useState({} as Result)
  const [ Speed, SetSpeed ] = useState(30)
  const [ Text, SetText ] = useState(nookies.get()['to-text'] || 'Panda')

  const [ Interpreter, SetInterpreter ] = useState<Generator | null>({} as Generator)
  const [ State, SetState ] = useState('stopped')
  const [ Timer, SetTimer ] = useState({} as NodeJS.Timeout)

  function interpreterNext() {
    const response = Interpreter?.next() as { value: Result, done: boolean }

    if (response.value)
      SetResult(response.value)

    if (response.done) {
      SetState('stopped')
      clearInterval(Timer)
      SetInterpreter(null)
    }
    else if (State === 'stepped')
      Interpreter?.next()
  }

  function startTimer() {
    SetTimer(setInterval(interpreterNext, Speed))
  }

  function startInterpreter() {
    SetInterpreter(
      ToBrainfuck(Text, PauseInterpreter)
    )
  }


  const $btnExecute_click = () => {
    startInterpreter()
    SetState('executing')
  }

  const $btnStop_click = () => {
    SetState('stopped')
    SetInterpreter(null)
    clearInterval(Timer)
    SetResult({} as Result)
  }

  const $btnPause_click = () => {
    SetState('paused')
    clearInterval(Timer)
  }

  const $btnContinue_click = () => {
    startTimer()
    SetState('executing')
  }

  const $btnStep_click = () => {
    clearInterval(Timer)

    if (Interpreter === null)
      startInterpreter()
    else
      interpreterNext()

    SetState('stepped')
  }

  const $btnReset_click = () => {
    SetText('')
    SetResult({} as Result)
    SetSpeed(30)
    SetPauseInterpreter(true)
    SetState('stopped')
    SetInterpreter({} as Generator)
    SetTimer({} as NodeJS.Timeout)
  }

  window.onbeforeunload = () => {
    nookies.set(null, 'to-text', Text)
  }

  useEffect(() => {
    if (State === 'executing')
      startTimer()

    if (State === 'stepped')
      interpreterNext()

  }, [ State ])

  document.title = 'Brainfuck.org | To'

  return <>
    <Hero>
      <HeroBackground/>
    </Hero>

    <label>Algorithm in tests</label>

    <Header>
      <div>
        {
          (State === 'stopped') &&
          <>
            <Button color='success' className='mini' onClick={ $btnExecute_click }>Execute</Button>
            <Button color='success' className='mini' onClick={ $btnStep_click }>Step</Button>
            <Button color='primary' outline className='mini' onClick={ $btnReset_click }>Reset</Button>
          </>
        }
        {
          (State === 'executing') &&
          <>
            <Button color='error' className='mini' onClick={ $btnStop_click }>Stop</Button>
            <Button color='error' outline className='mini' onClick={ $btnPause_click }>Pause</Button>
          </>
        }
        {
          (State === 'paused' || State === 'stepped') &&
          <>
            <Button color='error' className='mini' onClick={ $btnStop_click }>Stop</Button>
            <Button color='success' className='mini' onClick={ $btnStep_click }>Step</Button>
            <Button color='success' outline className='mini' onClick={ $btnContinue_click }>Continue</Button>
          </>
        }
      </div>

      <div>
        <div>
          <label>Velocity:</label>
          <Range
            value={ Speed }
            className='range'
            onSlide={ _value => SetSpeed(_value) }
          />
        </div>

        <FormGroup check inline>
          <Input
            type='checkbox'
            defaultChecked={ PauseInterpreter }
            onChange={ ($: any) => SetPauseInterpreter($.currentTarget.checked) }
          />
          <Label check>Pause</Label>
        </FormGroup>
      </div>
    </Header>

    <Main>
      <header>
        <p className='red'>{ Result ? Result.error : '' }</p>
      </header>

      <Editor>
        <CodeInput
          type='text'
          defaultValue={ Text }
          onChange={ ($: any) => SetText($.currentTarget.value) }
        />

        {
          (State !== 'stopped') ? (
            <EditorBackground
              dangerouslySetInnerHTML={{ __html: Result ? Result.char : '' }}
            />
          ) : ''
        }
      </Editor>

      {
        Result?.result &&
        <ResultPanel>
          <FadeButton text='JSON Response'>
            <Code language='json' code={ JSON.stringify(Result) }/>
          </FadeButton>

          <label>Result:</label>

          <Code language='brainfuck' code={ Result.result || '' }/>
          <Button onClick={ () => navigator.clipboard.writeText(Result?.result) } color='primary' outline className='mini'>Copy</Button>
        </ResultPanel>
      }
    </Main>
  </>
}


export default To