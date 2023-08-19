import { createGlobalStyle, styled } from 'styled-components'
import reset from 'styled-reset'

export const GlobalStyles = createGlobalStyle`
  ${reset}
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-weight: 400;
  }

  html,
  body {
    max-width: 100vw;
    width: 100vw;
    height: 100vh;
    font-size: 1.4rem;
    font-family: 'Noto Sans', sans-serif;
  }

  #root {
    height: 100%;
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
  
  .ButtonList {
    word-break: keep-all !important;
  }

  .blueButton {
    background-color: #007dbc !important;
    border-color: #007dbc !important;
  }

  .blueButton:hover {
    background-color: #0972d3 !important;
    border-color: #0972d3 !important;
  }

  .redButton {
    background-color: #df3312 !important;
    border-color: #df3312 !important;
  }

  .redButton:hover {
    background-color: #d91515 !important;
    border-color: #d91515 !important;
  }

  .orangeButton {
    background-color: #ff9900 !important;
    border-color: #ff9900 !important;
  }

  .orangeButton:hover {
    background-color: #ec7211 !important;
    border-color: #ec7211 !important;
  }

  .greenButton {
    background-color: rgb(60, 135, 0) !important;
    border-color: rgb(60, 135, 0) !important; 
  }

  .greenButton:hover {
    background-color: #037f0c !important;
    border-color: #037f0c !important; 
  }
`

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
