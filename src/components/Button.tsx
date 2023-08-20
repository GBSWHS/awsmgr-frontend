import { styled } from 'styled-components'

const Button = styled.button`
  width: 100px;
  height: 35px;
  border: none;
  cursor: pointer;
  border-radius: 2px;
  font-weight: 900;

  &:disabled {
    opacity: 0.5;
  }
`

export default Button
