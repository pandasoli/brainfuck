import styled from 'styled-components'
import { Input } from 'reactstrap'


export default styled(Input)`
  &[type='text'],
  &[type='number'] {
    transition: color .2s;
    border-color: var(--primary-cl-light);
    background-color: var(--primary-cl-light);

    &:focus {
      color: var(--primary-font-cl);
      box-shadow: 0 0 0 .25rem rgb(var(--secondary-cl-rgb), .68);
    }
  }

  &[type='number'] {
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none !important;
      margin: 0 !important;
    }
  }

  &[type='checkbox'] {
    border-color: var(--primary-cl-light);
    background-color: var(--primary-cl-light);

    &:checked {
      background-color: var(--secondary-cl);
    }

    &:focus {
      box-shadow: 0 0 0 .25rem rgb(var(--secondary-cl-rgb), .68);
    }
  }
`