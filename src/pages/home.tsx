import nookies from 'nookies'

import Button from '../components/Button'
import Memory from '../components/Memory'
import InlineCode from '../components/Code/inline'
import BlockCode from '../components/Code/block'
import Nav from '../components/Nav.styles'
import NavLink from '../components/NavLink'
import { NavItem } from 'reactstrap'
import { Hero, HeroBackground, HeroHeader, HeroMain, HeroTitle, Main, P } from '../styles/home.styles'


const Home = () => {
  const CodeProps = (code: string) => ({
    code,
    language: 'brainfuck'
  })

  return <>
    <Hero>
      <HeroBackground/>
      <HeroHeader>
        <HeroTitle>Brainfuck</HeroTitle>

        <span>The best site to learn and play with Brainfuck</span>
        <span>The most complete site for Brainfuck study</span>
      </HeroHeader>

      <HeroMain>
        <Button color='primary' outline href='/from'>Convert from Brainfuck</Button>
        <Button color='primary' outline href='/to'>Convert to Brainfuck</Button>
        <Button color='primary' href='#main'>Get started</Button>
      </HeroMain>
    </Hero>

    <Main id='main'>
      <Nav justified>
        <NavItem><NavLink href='#history'>History</NavLink></NavItem>
        <NavItem><NavLink href='#code'>Code</NavLink></NavItem>
      </Nav>

      <h2 id='history'>The bored part (history)</h2>
      <P>
        Brainfuck is one of the most famous esoteric programming languages.

        Brainfuck operates on an array of memory cells, each initially set to zero. (originaly the array was 30,000 cells long).
      </P>

      <br/>
      <h2 id='code'>LET'S FUCKING CODE</h2>

      <P>Well, Brainfuck is written based on a memory, just as it is:</P>
      <Memory items={[ 0, 3, 2, 0, 0 ]} pointer={ 2 }/>

      <P>
        To add 1 to the memory we use the code <InlineCode { ...CodeProps('+') }/><br/>
        to decrease 1                          <InlineCode { ...CodeProps('-') }/>
      </P>
      <P>
        to print                   <InlineCode { ...CodeProps('.') }/><br/>
        to ask a character (input) <InlineCode { ...CodeProps(',') }/>
      </P>
      <P>
        If you need to end the program before the end, use <InlineCode { ...CodeProps('!') }/>.
      </P>
      <P>
        To move the memory pointer to the left <InlineCode { ...CodeProps('<') }/>,<br/>
        to the right                           <InlineCode { ...CodeProps('>') }/>.
      </P>
      <P>
        Sometimes it is difficult to make big changes in value,<br/>
        for that we use loops. <InlineCode { ...CodeProps('[') }/> open and <InlineCode { ...CodeProps(']') }/> close.
      </P>
      <P>
        The loop ends when the memory space is 0,<br/>
        so to fill a memory space with loops,<br/>
        we use two or more memory spaces.
      </P>

      <P>One example is:</P>
      <BlockCode { ...CodeProps('++++++\n[\n\t> ++++++++++\n\t< -\n]\n> +++++ .') }/>

      <P>The same code in JavaScript is:</P>
      <BlockCode { ...CodeProps('for (let x = 0; x < 6; x++) {\n\tmemory[pointer] += 10\n}\nmemory[pointer] += 5\nconsole.log( String.fromCharCode(memory[pointer]) )') } language='javascript'/>

      <P>And the memory will be:</P>
      <Memory items={[ 0, 60 ]} pointer={ 1 }/>

      <P>And the output:</P>
      <BlockCode code='A'/>

      <Button
        onClick={ () => nookies.set(null, 'from-code', '') }
        color='primary'
        href='/from'
      >Let's code your first code?</Button>

    </Main>
  </>
}


export default Home