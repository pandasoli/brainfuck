import { ReactNode } from 'react'

import TableC, { Cel, Item, HeaderItem, TBody } from './index.styles'

type Props = {
  columns: string[]
  children: ReactNode
}


const Table = (props: Props) =>
  <TableC>
    <thead>
      <Cel>
        {
          props.columns.map(($, _) =>
            <HeaderItem key={ _ }>{ $ }</HeaderItem>
          )
        }
      </Cel>
    </thead>
    <TBody>
      { props.children }
    </TBody>
  </TableC>


export { Cel, Item }
export default Table