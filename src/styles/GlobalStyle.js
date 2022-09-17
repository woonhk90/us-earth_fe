import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  
  * {
    font-size: 14px;
    font-size: 16px;
    margin:0;
    padding:0;
    font-family:'Noto Sans';
  }
  html,body{
    width:100vw;
    height:100vh;
    overflow:hidden;
  }
  body {
    background: #ffffff;
    box-sizing: border-box;
    margin: 0 auto;
  }
  h1 {
    margin: 0;
    font-size: 32px;
  }
  h2 {
    margin: 0;
    font-size: 28px;
  }
  h3 {
    margin: 0;
    font-size: 24px;
  }
  ul {
    list-style: none;
  }
  p {
    margin: 0;
  }
`;

export default GlobalStyle;