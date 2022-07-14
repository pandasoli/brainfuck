import { useRef, useState } from 'react'
import Container, { Input, Viwer } from './index.styles'

type Props = {
  max?: number
  min?: number
  value?: number
  step?: string
  className?: string

  onSlide?: (_value: number) => any
}


const Range = (props: Props) => {
  const [ value, setValue ] = useState(props.value || (props.min || 0))

  const $input = useRef<HTMLInputElement>({} as HTMLInputElement)
  const $viewer = useRef<HTMLDivElement>({} as HTMLInputElement)

  const calc_left = () => {
    setValue(Number($input.current.value))
    return `calc(${(value - (props.min || 0)) / ((props.max || 100) - (props.min || 0)) * 100}% - ${$viewer.current.clientWidth / 2}px)`
  }

  const $range_input = () =>
    $viewer.current.setAttribute('style', `opacity: 1; visibility: visible; left: ${calc_left()}`)

  const $range_mouseup = () => {
    $viewer.current.setAttribute('style', `opacity: 0; visibility: hidden; left: ${calc_left()}`)

    if (props.onSlide)
      props.onSlide(value)
  }

  return (
    <Container className={ props.className }>
      <Viwer ref={ $viewer }>
        <label>{ value }</label>
        <div></div>
      </Viwer>

      <Input
        type='range'
        min={ props.min || 0 }
        max={ props.max || 100 }
        defaultValue={ value }
        step={ props.step || 'normal' }
        onInput={ $range_input }
        onMouseUp={ $range_mouseup }
        ref={ $input }
      />
    </Container>
  )
}

export default Range