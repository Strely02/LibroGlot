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
  
  /* Estilos para el modo oscuro */
  .dark-mode {
    background-color: #1a1a1a;
    color: #e0e0e0;
  }
  
  /* Estilos para el modo sepia */
  .sepia-mode {
    background-color: #f4f1ea;
    color: #5c4b37;
  }
  
  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
  
  /* Animaciones globales */
  .fade-in {
    animation: fadeIn 0.3s ease-in;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .slide-in {
    animation: slideIn 0.3s ease-in;
  }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
`;

export default GlobalStyle;