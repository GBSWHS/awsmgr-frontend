import { createGlobalStyle, styled } from "styled-components";
import reset from "styled-reset";

export const GlobalStyles = createGlobalStyle`
  ${reset}
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
  }

  html,
  body {
    max-width: 100vw;
    width: 100vw;
    height: 100vh;
    font-size: 1.4rem;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  b {
    font-weight: 700;
  }

  header, nav, div {
    display: block;
  }
`

export const Body = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
`

export const Top = styled.span`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
`

export const Title = styled.p`
  font-size: 24px;
  font-weight: 700;
`