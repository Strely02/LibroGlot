import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    height: 100%;
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  
  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Merriweather', serif;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: ${props => props.theme.colors.secondary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  button, input, select, textarea {
    font-family: inherit;
    font-size: 100%;
  }
  
  img, svg {
    max-width: 100%;
    height: auto;
  }
`;

export default GlobalStyle;