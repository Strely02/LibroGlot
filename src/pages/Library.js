import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Componentes estilizados
const LibraryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing(10)};
`;

const PageTitle = styled.h1`
  margin-bottom: ${props => props.theme.spacing(6)};
  text-align: center;
`;

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: ${props => props.theme.spacing(10)};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing(3)} ${props => props.theme.spacing(4)};
  border: 1px solid ${props => props.theme.colors.border};
  border-right: none;
  border-radius: ${props => props.theme.borderRadius.medium} 0 0 ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing(3)} ${props => props.theme.spacing(5)};
  border-radius: 0 ${props => props.theme.borderRadius.medium} ${props => props.theme.borderRadius.medium} 0;
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing(6)};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing(4)};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FilterLabel = styled.span`
  font-weight: 600;
  margin-right: ${props => props.theme.spacing(2)};
`;

const FilterSelect = styled.select`
  padding: ${props => props.theme.spacing(2)} ${props => props.theme.spacing(4)};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing(6)};
`;

const BookCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
  transition: transform ${props => props.theme.transitions.fast}, box-shadow ${props => props.theme.transitions.fast};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const BookCover = styled.div`
  height: 280px;
  background-color: ${props => props.theme.colors.primaryLight};
  background-image: ${props => props.cover ? `url(${props.cover})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const BookLanguageBadge = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing(3)};
  right: ${props => props.theme.spacing(3)};
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  font-size: 0.8rem;
  padding: ${props => props.theme.spacing(1)} ${props => props.theme.spacing(2)};
  border-radius: ${props => props.theme.borderRadius.small};
`;

const BookInfo = styled.div`
  padding: ${props => props.theme.spacing(4)};
`;

const BookTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: ${props => props.theme.spacing(1)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BookAuthor = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing(3)};
`;

const BookLink = styled(Link)`
  display: block;
  text-align: center;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  font-size: 0.9rem;
  padding: ${props => props.theme.spacing(2)};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.small};
  transition: background-color ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryLight + '22'};
    text-decoration: none;
  }
`;

const EmptyLibrary = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing(10)};
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing(4)};
  color: ${props => props.theme.colors.textLight};
`;

const UploadButton = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-weight: 600;
  padding: ${props => props.theme.spacing(3)} ${props => props.theme.spacing(6)};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-top: ${props => props.theme.spacing(6)};
  transition: background-color ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    text-decoration: none;
  }
`;

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  
  // Datos de ejemplo para la biblioteca (en una implementación real, estos vendrían de una base de datos)
  const sampleBooks = [
    {
      id: 'kushiels-dart-123',
      title: 'La Daga de Kushiel',
      author: 'Jacqueline Carey',
      cover: null,
      originalLanguage: 'en',
      translatedLanguages: ['es'],
      uploadDate: new Date('2023-05-15')
    },
    {
      id: 'sample-book-456',
      title: 'El Nombre del Viento',
      author: 'Patrick Rothfuss',
      cover: null,
      originalLanguage: 'en',
      translatedLanguages: ['es', 'de'],
      uploadDate: new Date('2023-06-02')
    },
    {
      id: 'sample-book-789',
      title: 'Cien Años de Soledad',
      author: 'Gabriel García Márquez',
      cover: null,
      originalLanguage: 'es',
      translatedLanguages: ['en', 'de'],
      uploadDate: new Date('2023-04-20')
    }
  ];
  
  // Filtramos los libros según los criterios de búsqueda y filtros
  const filteredBooks = sampleBooks.filter(book => {
    // Filtrar por término de búsqueda
    if (searchTerm && !book.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !book.author.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtrar por idioma
    if (languageFilter !== 'all') {
      if (languageFilter === book.originalLanguage || book.translatedLanguages.includes(languageFilter)) {
        return true;
      }
      return false;
    }
    
    return true;
  });
  
  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    // En una implementación real, aquí podrías hacer una solicitud al backend
    console.log('Buscando:', searchTerm);
  };
  
  return (
    <LibraryContainer>
      <PageTitle>Mi Biblioteca</PageTitle>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Buscar por título o autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>Buscar</SearchButton>
      </SearchContainer>
      
      <FilterBar>
        <div>
          <FilterLabel>Idioma:</FilterLabel>
          <FilterSelect
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="en">Inglés</option>
            <option value="es">Español</option>
            <option value="de">Alemán</option>
          </FilterSelect>
        </div>
      </FilterBar>
      
      {filteredBooks.length > 0 ? (
        <BooksGrid>
          {filteredBooks.map(book => (
            <BookCard key={book.id}>
              <BookCover cover={book.cover}>
                <BookLanguageBadge>
                  {book.originalLanguage.toUpperCase()} → {book.translatedLanguages.join(', ').toUpperCase()}
                </BookLanguageBadge>
              </BookCover>
              <BookInfo>
                <BookTitle>{book.title}</BookTitle>
                <BookAuthor>{book.author}</BookAuthor>
                <BookLink to={`/reader/${book.id}`}>
                  Continuar Leyendo
                </BookLink>
              </BookInfo>
            </BookCard>
          ))}
        </BooksGrid>
      ) : (
        <EmptyLibrary>
          <EmptyIcon>📚</EmptyIcon>
          <h2>Tu biblioteca está vacía</h2>
          <p>Sube tu primer libro para comenzar a aprender idiomas mientras lees.</p>
          <UploadButton to="/upload">Subir un Libro</UploadButton>
        </EmptyLibrary>
      )}
    </LibraryContainer>
  );
};

export default Library;