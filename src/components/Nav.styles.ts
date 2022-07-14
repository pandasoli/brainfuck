import styled from 'styled-components'
import { Nav } from 'reactstrap'


export default styled(Nav)`
  width: 100%;

  margin-bottom: 20px;

  border-bottom: 1px solid var(--primary-cl-light);

  a {
    color: var(--secondary-cl) !important;

    transition: opacity .2s;

    &:hover {
      opacity: .8;
    }
  }
`
