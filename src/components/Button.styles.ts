import styled from 'styled-components'
import { Button } from 'reactstrap'


export default styled(Button)`
  &.btn {
    display: inline-block;

    margin: 4px;
    padding: 9px 40px;
    border-radius: 6px;

    font-size: min(4.4vw, 1.06rem);
    font-family: 'MavenPro';
    cursor: pointer;
    font-size: var(--text-regular);
    font-weight: var(--font-weight-medium);
    text-align: center;
    text-decoration: none;
    user-select: none;
    color: var(--primary-cl);

    background-color: var(--primary-font-cl);
    border-radius: 25px;
    transition: opacity .6s, background-color .6s, color .2s;
    border: 1px solid var(--primary-font-cl);
  }

  &.mini {
    padding: 5px 40px;
  }

  &.btn-outline-primary {
    color: var(--primary-font-cl);
    background-color: transparent;
  }

  &.btn-success {
    color: var(--primary-cl);
    background-color: var(--green-cl);
    border-color: var(--green-cl);
  }

  &.btn-error {
    color: var(--primary-cl);
    background-color: var(--red-cl);
    border-color: var(--red-cl);
  }

  &.btn-outline-success {
    color: var(--green-cl);
    background-color: transparent;
    border-color: var(--green-cl);
  }

  &:hover:not([disabled]),
  &:focus:not([disabled]) {
    &.btn-primary {
      color: var(--primary-font-cl);
      background-color: transparent;
    }

    &.btn-outline-primary {
      color: var(--primary-cl);
      background-color: var(--primary-font-cl);
    }

    &.btn-success {
      color: var(--green-cl);
      background-color: transparent;
    }

    &.btn-error {
      color: var(--red-cl);
      background-color: transparent;
    }

    &.btn-outline-success {
      color: var(--primary-cl);
      background-color: var(--green-cl);
    }
  }

  &:focus:not([disabled]) {
    box-shadow: 0 0 0 .25rem rgba(var(--primary-font-cl-rgb), .68);

    &.btn-error,
    &.btn-outline-error {
      box-shadow: 0 0 0 .25rem rgba(var(--red-cl-rgb), .68);
    }

    &.btn-success,
    &.btn-outline-success {
      box-shadow: 0 0 0 .25rem rgba(var(--green-cl-rgb), .68);
    }
  }

  &[disabled] {
    opacity: .7;

    &, & * {
      cursor: no-drop;
    }
  }
`

