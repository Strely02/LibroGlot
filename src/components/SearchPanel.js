import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';

// Componentes estilizados
const SearchContainer = styled.div`
  padding: ${props => props.theme.spacing(6)};
  background-color: ${props => props.theme.colors.surface};
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const SearchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing(6)};
  padding-bottom: ${props => props.theme.spacing(3)};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SearchTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.primary};
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(2)};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: ${props => props.theme.colors.textLight};
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.spacing(4)};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing(3)} ${props => props.theme.spacing(4)};
  padding-right: ${props => props.theme.spacing(12)};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight + '44'};
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: ${props => props.theme.spacing(1)};
  top: 50%;
  transform: translateY(-50%);
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.spacing(2)} ${props => props.theme.spacing(3)};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.textLight};
    cursor: not-allowed;
  }
`;

const SearchOptions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing(4)};
  margin-bottom: ${props => props.theme.spacing(6)};
  flex-wrap: wrap;
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(2)};
  cursor: pointer;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  
  input[type="checkbox"] {
    accent-color: ${props => props.theme.colors.primary};
  }
`;

const SearchStats = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing(3)};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: ${props => props.theme.spacing(4)};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
`;

const ResultsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ResultItem = styled.div`
  padding: ${props => props.theme.spacing(4)};
  border-bottom: 1px solid ${props => props.theme.colors.border + '44'};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ResultText = styled.div`
  margin-bottom: ${props => props.theme.spacing(2)};
  line-height: 1.5;
  
  .highlight {
    background-color: ${props => props.theme.colors.warning};
    padding: 2px 4px;
    border-radius: 2px;
    font-weight: 600;
  }
`;

const ResultMeta = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing(8)};
  color: ${props => props.theme.colors.textLight};
  
  .icon {
    font-size: 2rem;
    margin-bottom: ${props => props.theme.spacing(4)};
  }
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: ${props => props.theme.spacing(4)} auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const RecentSearches = styled.div`
  margin-bottom: ${props => props.theme.spacing(4)};
`;

const RecentSearchItem = styled.button`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.spacing(2)} ${props => props.theme.spacing(3)};
  margin-right: ${props => props.theme.spacing(2)};
  margin-bottom: ${props => props.theme.spacing(2)};
  cursor: pointer;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight + '22'};
    border-color: ${props => props.theme.colors.primary};
  }
`;

// Componente principal
const SearchPanel = ({ content, onClose, onResultClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    caseSensitive: false,
    wholeWords: false,
    regex: false
  });
  const [recentSearches, setRecentSearches] = useState([]);

  // Cargar búsquedas recientes al inicializar
  useEffect(() => {
    const saved = localStorage.getItem('libroglot_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Función para agregar a búsquedas recientes
  const addToRecentSearches = useCallback((term) => {
    if (!term.trim()) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== term);
      const updated = [term, ...filtered].slice(0, 5); // Mantener solo 5
      localStorage.setItem('libroglot_recent_searches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Función para limpiar HTML y extraer texto
  const extractTextFromHTML = useCallback((html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  }, []);

  // Función de búsqueda
  const performSearch = useCallback((term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simular un pequeño retraso para mostrar loading
    setTimeout(() => {
      try {
        const textContent = extractTextFromHTML(content);
        const results = [];
        
        let searchPattern;
        if (searchOptions.regex) {
          try {
            searchPattern = new RegExp(term, searchOptions.caseSensitive ? 'g' : 'gi');
          } catch (error) {
            console.error('Invalid regex:', error);
            setIsSearching(false);
            return;
          }
        } else {
          const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const pattern = searchOptions.wholeWords ? `\\b${escapedTerm}\\b` : escapedTerm;
          searchPattern = new RegExp(pattern, searchOptions.caseSensitive ? 'g' : 'gi');
        }

        // Dividir en párrafos para búsqueda contextual
        const paragraphs = textContent.split(/\n\s*\n/).filter(p => p.trim());
        
        paragraphs.forEach((paragraph, index) => {
          const matches = paragraph.match(searchPattern);
          if (matches) {
            // Crear contexto alrededor de cada coincidencia
            const contextLength = 150;
            let lastIndex = 0;
            
            matches.forEach(match => {
              const matchIndex = paragraph.indexOf(match, lastIndex);
              const start = Math.max(0, matchIndex - contextLength);
              const end = Math.min(paragraph.length, matchIndex + match.length + contextLength);
              
              let context = paragraph.substring(start, end);
              
              // Agregar puntos suspensivos si el contexto está truncado
              if (start > 0) context = '...' + context;
              if (end < paragraph.length) context = context + '...';
              
              // Resaltar el término encontrado
              const highlightedContext = context.replace(
                searchPattern,
                `<span class="highlight">${match}</span>`
              );
              
              results.push({
                id: `${index}-${matchIndex}`,
                text: highlightedContext,
                paragraph: index + 1,
                position: matchIndex,
                match: match
              });
              
              lastIndex = matchIndex + match.length;
            });
          }
        });

        setSearchResults(results);
        addToRecentSearches(term);
        
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, [content, searchOptions, extractTextFromHTML, addToRecentSearches]);

  // Manejar envío del formulario
  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  // Manejar click en resultado
  const handleResultClick = (result) => {
    if (onResultClick) {
      onResultClick(result);
    }
  };

  // Manejar búsqueda reciente
  const handleRecentSearch = (term) => {
    setSearchTerm(term);
    performSearch(term);
  };

  // Manejar cambio de opciones
  const handleOptionChange = (option, value) => {
    setSearchOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchTitle>
          🔍 Buscar en el Libro
        </SearchTitle>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </SearchHeader>

      {/* Formulario de búsqueda */}
      <form onSubmit={handleSearch}>
        <SearchInputContainer>
          <SearchInput
            type="text"
            placeholder="Ingresa término de búsqueda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchButton type="submit" disabled={isSearching}>
            {isSearching ? '⏳' : '🔍'}
          </SearchButton>
        </SearchInputContainer>
      </form>

      {/* Opciones de búsqueda */}
      <SearchOptions>
        <CheckboxOption>
          <input
            type="checkbox"
            checked={searchOptions.caseSensitive}
            onChange={(e) => handleOptionChange('caseSensitive', e.target.checked)}
          />
          Sensible a mayúsculas
        </CheckboxOption>
        
        <CheckboxOption>
          <input
            type="checkbox"
            checked={searchOptions.wholeWords}
            onChange={(e) => handleOptionChange('wholeWords', e.target.checked)}
          />
          Palabras completas
        </CheckboxOption>
        
        <CheckboxOption>
          <input
            type="checkbox"
            checked={searchOptions.regex}
            onChange={(e) => handleOptionChange('regex', e.target.checked)}
          />
          Expresión regular
        </CheckboxOption>
      </SearchOptions>

      {/* Búsquedas recientes */}
      {recentSearches.length > 0 && !searchTerm && (
        <RecentSearches>
          <h4 style={{ marginBottom: '8px', color: '#666', fontSize: '0.9rem' }}>
            Búsquedas Recientes:
          </h4>
          {recentSearches.map((term, index) => (
            <RecentSearchItem
              key={index}
              onClick={() => handleRecentSearch(term)}
            >
              {term}
            </RecentSearchItem>
          ))}
        </RecentSearches>
      )}

      {/* Estadísticas de búsqueda */}
      {searchResults.length > 0 && (
        <SearchStats>
          📊 Encontradas {searchResults.length} coincidencia{searchResults.length !== 1 ? 's' : ''} 
          para "{searchTerm}"
        </SearchStats>
      )}

      {/* Resultados */}
      <ResultsContainer>
        {isSearching && <LoadingSpinner />}
        
        {!isSearching && searchResults.length > 0 && (
          <>
            {searchResults.map((result) => (
              <ResultItem
                key={result.id}
                onClick={() => handleResultClick(result)}
              >
                <ResultText
                  dangerouslySetInnerHTML={{ __html: result.text }}
                />
                <ResultMeta>
                  <span>Párrafo {result.paragraph}</span>
                  <span>Posición {result.position}</span>
                </ResultMeta>
              </ResultItem>
            ))}
          </>
        )}
        
        {!isSearching && searchTerm && searchResults.length === 0 && (
          <NoResults>
            <div className="icon">🤷‍♀️</div>
            <p>No se encontraron resultados para "{searchTerm}"</p>
            <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>
              Intenta con otros términos o verifica la ortografía
            </p>
          </NoResults>
        )}
        
        {!searchTerm && !isSearching && (
          <NoResults>
            <div className="icon">🔍</div>
            <p>Ingresa un término para buscar</p>
            <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>
              Puedes buscar palabras, frases o usar expresiones regulares
            </p>
          </NoResults>
        )}
      </ResultsContainer>
    </SearchContainer>
  );
};

export default SearchPanel;