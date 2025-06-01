import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

// Pages
import Home from './pages/Home';
import Reader from './pages/Reader';
import Upload from './pages/Upload';
import Library from './pages/Library';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Styles
import GlobalStyle from './styles/GlobalStyle';
import { theme } from './styles/Theme';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const ContentWrapper = styled.main`
  flex: 1;
  padding-top: 70px; // Navbar height
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <Navbar />
          <ContentWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/library" element={<Library />} />
              <Route path="/reader/:bookId" element={<Reader />} />
            </Routes>
          </ContentWrapper>
          <Footer />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;