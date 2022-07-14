import { useState } from 'react'

import { Title, NavItem } from './index.styles'
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavLink } from 'reactstrap'


const Header = () => {
  const [ Open, SetOpen ] = useState(false)

  const buttons = [
    { link: '/', text: 'Home' },
    { link: '/from', text: 'From Brainfuck' },
    { link: '/to', text: 'To Brainfuck' },
    { link: '/ascii', text: 'ASCII' },
    { link: '/interpreters', text: 'Interpreters' }
  ]

  return (
    <Navbar color='faded' light expand='md' dark>
      <NavbarBrand href='/'>
        <Title>BrainFuck</Title>
      </NavbarBrand>

      <NavbarToggler onClick={ () => SetOpen(!Open) }/>

      <Collapse navbar isOpen={ Open }>
        <Nav navbar className='ms-auto align-items-center'>
          {
            buttons.map(($, _) =>
              <NavItem key={ _ } className={ document.location.pathname === $.link ? 'selected' : '' }>
                <NavLink href={ $.link }>{ $.text }</NavLink>
              </NavItem>
            )
          }
        </Nav>
      </Collapse>
    </Navbar>
  )
}


export default Header