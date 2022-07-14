import MemoryC, { Pointer } from './index.styles'

type Props = {
  items: number[]
  pointer: number
  max?: number
}


const Memory = (props: Props) => {
  function fillArray(length: number, startBy: number = 0) {
    const res = []

    for (let x = startBy; x <= length; x++)
      res.push(null)

    return res
  }

  return (
    <MemoryC>
      {
        props.items
        .map(($, _) =>
          <li
            key={ _ }
            className={ _ > (props.max || props.items.length) - 1 ? 'error' : '' }
          >{ $ }</li>
        )
      }
      {
        fillArray(
          (props.max || props.items.length - 1) - (props.items.length + 1)
        )
        .map(($, _) =>
          <li key={ _ } className='empty'>0</li>
        )
      }

      <Pointer style={{ left: `calc(${props.pointer} * 40px)` }}/>
    </MemoryC>
  )
}


export default Memory