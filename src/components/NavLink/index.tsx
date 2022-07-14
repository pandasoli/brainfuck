import { ReactNode } from 'react'

import SmoothScrollTo from '../../scripts/SmoothScrollTo'

import NavLinkStyle from './index.styles'

type Props = {
  href?: string
  children: ReactNode
}


const NavLink = (props: Props) => {

  const _click = () => {
    if (props.href) {
      const to = (document.querySelector(props.href) as HTMLDivElement).offsetTop - 20
      SmoothScrollTo(0, to)
    }
  }

  return (
    <NavLinkStyle onClick={ _click }>{ props.children }</NavLinkStyle>
  )
}


export default NavLink