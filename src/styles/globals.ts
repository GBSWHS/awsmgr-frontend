import { styled } from 'styled-components'

export const Body = styled.div`
  width: 100%;
  height: calc(100% - 40px);
  padding: 10px;
`

export const Top = styled.span`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;

  > div {
    display: flex;
    align-items: center;
    font-size: 21px;

    svg {
      margin: 0 5px;
      cursor: pointer;
    }

    svg.disabled {
      cursor: default;
      opacity: .3 !important;
    }
  }

  p {
    font-size: 16px;
  }
`

export const Title = styled.p`
  font-size: 24px;
  font-weight: 700;
`
