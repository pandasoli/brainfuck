import React from 'react'

import SmoothScrollTo from '../../scripts/SmoothScrollTo'

import { ButtonProps } from 'reactstrap'
import ButtonStyle from './index.styles'


const Button = (props: ButtonProps) => {
  const _click = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (props.href) {
      if (props.href.startsWith('#')) {
        const to = (document.querySelector(props.href) as HTMLDivElement).offsetTop - 20
        SmoothScrollTo(0, to)
      }
      else
        window.location.href = props.href
    }

    if (props.onClick)
      props.onClick(ev)
  }

  return <ButtonStyle
    { ...props }
    href={ undefined }
    onClick={ _click }
  >
    { props.children }
  </ButtonStyle>
}


export default Button