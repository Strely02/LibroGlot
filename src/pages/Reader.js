import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ePub from 'epubjs';

// Componentes estilizados
const ReaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  background-color: ${props => props.theme.colors.background};
`;

const ControlsBar = styled.div`
  background-color: ${props => props.theme.colors.surface};
  box-shadow: ${props => props.theme.shadows.small};
  padding: ${props => props.theme.spacing(3)} ${props => props.theme.spacing(5)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-wrap: wrap;
    gap: ${props => props.theme.spacing(2)};
  }
`;

const BookTitle = styled.div`
  font-weight: 600;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%;
    margin-bottom: ${props => props.theme.spacing(2)};
  }
`;

const ViewControls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing(2)};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-wrap: wrap;
  }
`;

const ViewButton = styled.button`
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.spacing(1)} ${props => props.theme.spacing(3)};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background};
  }
`;

const NavigationControls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing(2)};
`;

const NavButton = styled.button`
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.spacing(1)} ${props => props.theme.spacing(3)};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DownloadButton = styled.button`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.spacing(1)} ${props => props.theme.spacing(3)};
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(1)};
  transition: background-color ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.theme.colors.secondaryDark};
  }
`;

const ReaderContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ReaderPane = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing(5)};
  background-color: ${props => props.singleView ? props.theme.colors.background : props.theme.colors.surface};
  border-right: ${props => props.singleView ? 'none' : `1px solid ${props.theme.colors.border}`};
  
  &:last-child {
    border-right: none;
  }
`;

const PageContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Merriweather', serif;
  line-height: 1.8;
  font-size: 1.1rem;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  p {
    margin-bottom: 1em;
  }
`;

const ChapterTitle = styled.h2`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing(8)};
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.textLight};
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: ${props => props.theme.spacing(4)};
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Componente Reader
const Reader = () => {
  const { bookId } = useParams();
  const [viewMode, setViewMode] = useState('dual'); // 'original', 'translation', 'dual'
  const [loading, setLoading] = useState(true);
  const [chapterTitle, setChapterTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [originalContent, setOriginalContent] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');
  
  const originalPaneRef = useRef(null);
  const translatedPaneRef = useRef(null);
  
  // Sincronizar el scroll entre los paneles
  const syncScroll = (sourceRef, targetRef) => {
    if (sourceRef.current && targetRef.current) {
      const sourceEl = sourceRef.current;
      const targetEl = targetRef.current;
      
      targetEl.scrollTop = (sourceEl.scrollTop / sourceEl.scrollHeight) * targetEl.scrollHeight;
    }
  };
  
  // Efecto para cargar los datos del libro
  useEffect(() => {
    const loadBookData = async () => {
      setLoading(true);
      
      try {
        // Aquí normalmente cargaríamos el archivo EPUB desde el servidor
        // Para esta demostración, usaremos contenido de ejemplo
        
        // Simulamos un tiempo de carga
        setTimeout(() => {
          // Para demostración, usamos el primer capítulo traducido de Kushiel's Dart
          setChapterTitle('Capítulo Uno');
          
          // Contenido original (inglés)
          setOriginalContent(`
            <h2>Chapter One</h2>
            <p>Lest anyone should suppose that I am a cuckoo's child, got on the wrong side of the blanket by lusty peasant stock and sold into indenture in a shortfallen season, I may say that I am House-born and reared in the Night Court proper, for all the good it did me.</p>
            <p>It is hard for me to resent my parents, although I envy them their naiveté. No one told them when I was born that I was one of the Rare Ones, or what it meant. Servants of Naamah they were and had been for generations, proud of their heritage, and never more so than upon the birth of their only daughter, whom they named in the D'Angeline fashion: Phèdre nó Delaunay.</p>
            <p>The Delaunay, of course, was the House; all of us bore it, unless and until we were old enough to be Chosen by one of Blessed Elua's Companions. My parents had chosen my first name in accordance with an ancient tradition of Terre d'Ange, and it pleased them to apply it to me. Phèdre, the tragic heroine of Thelesis de Mornay's masterwork, a woman wronged and betrayed, but possessing still a great nobility of spirit.</p>
            <p>Nobility of spirit!</p>
            <p>Well, I daresay, if they'd known—but they didn't. None of us did. How could we?</p>
          `);
          
          // Contenido traducido (español)
          setTranslatedContent(`
            <h2>Capítulo Uno</h2>
            <p>Para que nadie piense que soy hija bastarda, engendrada en el lado incorrecto de las sábanas por lujuria rústica y vendida en servidumbre durante tiempos aciagos, he de decir que nací y fui criada en la mismísima Corte Nocturna, aunque de poco me valiera.</p>
            <p>Es difícil para mí guardar rencor a mis padres, aunque les envidio su ingenuidad. Nadie les dijo, cuando nací, que me habían obsequiado con un nombre maldito. Phèdre, me llamaron, sin saber que es un nombre heleno y maldito.</p>
            <p>El Delaunay, por supuesto, era la Casa; todos lo llevábamos, a menos que fuéramos lo suficientemente mayores para ser Elegidos por uno de los Compañeros del Bendito Elua. Mis padres habían elegido mi primer nombre de acuerdo con una antigua tradición de Terre d'Ange, y les complació aplicármelo. Phèdre, la heroína trágica de la obra maestra de Thelesis de Mornay, una mujer agraviada y traicionada, pero que aún posee una gran nobleza de espíritu.</p>
            <p>¡Nobleza de espíritu!</p>
            <p>Bueno, me atrevo a decir, si hubieran sabido... pero no lo sabían. Ninguno de nosotros lo sabía. ¿Cómo podríamos?</p>
          `);
          
          setTotalPages(20); // Para demostración
          setLoading(false);
        }, 1500);
        
      } catch (error) {
        console.error('Error loading book:', error);
        setLoading(false);
      }
    };
    
    loadBookData();
  }, [bookId]);
  
  // Función para navegar entre páginas
  const navigatePage = (direction) => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      
      // Aquí cargaríamos el contenido de la nueva página
      // Para la demostración, solo cambiamos el número de página
    }
  };
  
  // Función para descargar la traducción
  const downloadTranslation = () => {
    // En una implementación real, generaríamos un EPUB desde el backend
    alert('La función de descarga estaría disponible en la implementación final.');
  };
  
  // Renderizar el contenido del lector según el modo de visualización
  const renderReaderContent = () => {
    if (loading) {
      return (
        <LoadingState>
          <LoadingSpinner />
          <p>Cargando libro...</p>
        </LoadingState>
      );
    }
    
    switch (viewMode) {
      case 'original':
        return (
          <ReaderPane singleView={true}>
            <PageContent dangerouslySetInnerHTML={{ __html: originalContent }} />
          </ReaderPane>
        );
        
      case 'translation':
        return (
          <ReaderPane singleView={true}>
            <PageContent dangerouslySetInnerHTML={{ __html: translatedContent }} />
          </ReaderPane>
        );
        
      case 'dual':
      default:
        return (
          <>
            <ReaderPane 
              ref={originalPaneRef}
              onScroll={() => syncScroll(originalPaneRef, translatedPaneRef)}
            >
              <PageContent dangerouslySetInnerHTML={{ __html: originalContent }} />
            </ReaderPane>
            
            <ReaderPane 
              ref={translatedPaneRef}
              onScroll={() => syncScroll(translatedPaneRef, originalPaneRef)}
            >
              <PageContent dangerouslySetInnerHTML={{ __html: translatedContent }} />
            </ReaderPane>
          </>
        );
    }
  };
  
  return (
    <ReaderContainer>
      <ControlsBar>
        <BookTitle>
          La Daga de Kushiel - Página {currentPage} de {totalPages}
        </BookTitle>
        
        <ViewControls>
          <ViewButton 
            active={viewMode === 'original'} 
            onClick={() => setViewMode('original')}
          >
            Original (EN)
          </ViewButton>
          <ViewButton 
            active={viewMode === 'translation'} 
            onClick={() => setViewMode('translation')}
          >
            Traducción (ES)
          </ViewButton>
          <ViewButton 
            active={viewMode === 'dual'} 
            onClick={() => setViewMode('dual')}
          >
            Dual
          </ViewButton>
        </ViewControls>
        
        <NavigationControls>
          <NavButton 
            onClick={() => navigatePage('prev')}
            disabled={currentPage === 1}
          >
            ← Anterior
          </NavButton>
          <NavButton 
            onClick={() => navigatePage('next')}
            disabled={currentPage === totalPages}
          >
            Siguiente →
          </NavButton>
        </NavigationControls>
        
        <DownloadButton onClick={downloadTranslation}>
          ↓ Descargar EPUB
        </DownloadButton>
      </ControlsBar>
      
      <ReaderContent>
        {renderReaderContent()}
      </ReaderContent>
    </ReaderContainer>
  );
};

export default Reader;