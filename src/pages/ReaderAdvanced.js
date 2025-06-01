import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

// Componentes mejorados
import ReaderControls from '../components/ReaderControls';
import ReadingSettings from '../components/ReadingSettings';
import SearchPanel from '../components/SearchPanel';
import NotesPanel from '../components/NotesPanel';
import ProgressBar from '../components/ProgressBar';
import { useTranslationAPI } from '../hooks/useTranslationAPI';
import { useReadingPreferences } from '../hooks/useReadingPreferences';
import { useBookmarks } from '../hooks/useBookmarks';

// Componentes estilizados mejorados
const ReaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  background-color: ${props => {
    switch(props.theme.name) {
      case 'dark': return '#1a1a1a';
      case 'sepia': return '#f4f1ea';
      default: return '#ffffff';
    }
  }};
  transition: background-color 0.3s ease;
`;

const MainHeader = styled.div`
  background-color: ${props => props.theme.colors.surface};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: ${props => props.theme.spacing(3)} ${props => props.theme.spacing(5)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 100;
`;

const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  h1 {
    font-size: 1.2rem;
    margin: 0;
    color: ${props => props.theme.colors.primary};
  }
  
  .chapter-info {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textLight};
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing(2)};
  align-items: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: ${props => props.theme.spacing(2)};
  border-radius: ${props => props.theme.borderRadius.small};
  transition: background-color 0.2s ease;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  background-color: ${props => props.active ? props.theme.colors.primary + '22' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const SidePanel = styled.div`
  width: ${props => props.isOpen ? '300px' : '0'};
  background-color: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ReadingArea = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ReaderPane = styled.div`
  flex: ${props => props.viewMode === 'dual' ? '1' : '1'};
  overflow-y: auto;
  padding: ${props => props.theme.spacing(6)};
  background-color: ${props => {
    switch(props.readingTheme) {
      case 'dark': return '#2d2d2d';
      case 'sepia': return '#f7f4e9';
      default: return '#ffffff';
    }
  }};
  border-right: ${props => props.viewMode === 'dual' ? `1px solid ${props.theme.colors.border}` : 'none'};
  position: relative;
  
  &:last-child {
    border-right: none;
  }
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }
`;

const PageContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  font-family: ${props => props.fontFamily || "'Merriweather', serif"};
  line-height: ${props => props.lineHeight || 1.8};
  font-size: ${props => props.fontSize || '1.1rem'};
  color: ${props => {
    switch(props.readingTheme) {
      case 'dark': return '#e0e0e0';
      case 'sepia': return '#5c4b37';
      default: return '#333333';
    }
  }};
  transition: all 0.3s ease;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    color: ${props => {
      switch(props.readingTheme) {
        case 'dark': return '#ffffff';
        case 'sepia': return '#8b4513';
        default: return props.theme.colors.primary;
      }
    }};
  }
  
  p {
    margin-bottom: 1em;
    text-align: justify;
  }
  
  /* Highlighting for search results */
  .search-highlight {
    background-color: ${props => props.theme.colors.warning};
    padding: 2px 4px;
    border-radius: 2px;
  }
  
  /* Notes markers */
  .note-marker {
    background-color: ${props => props.theme.colors.secondary + '44'};
    border-left: 3px solid ${props => props.theme.colors.secondary};
    padding: 2px 4px;
    margin: 2px 0;
    cursor: pointer;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: ${props => props.theme.spacing(4)};
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AutoReadingOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing(6)};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.large};
  z-index: 2000;
  display: ${props => props.isVisible ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing(4)};
`;

// Componente principal mejorado
const ReaderAdvanced = () => {
  const { bookId } = useParams();
  
  // Estados principales
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [viewMode, setViewMode] = useState('dual'); // 'original', 'translation', 'dual'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [originalContent, setOriginalContent] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  
  // Estados de la interfaz
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isAutoReading, setIsAutoReading] = useState(false);
  const [autoReadingSpeed, setAutoReadingSpeed] = useState(200); // palabras por minuto
  
  // Hooks personalizados
  const { translate, isTranslating } = useTranslationAPI();
  const { preferences, updatePreference } = useReadingPreferences();
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks(bookId);
  
  // Referencias
  const originalPaneRef = useRef(null);
  const translatedPaneRef = useRef(null);
  const autoReadingInterval = useRef(null);
  
  // Función para sincronizar scroll
  const syncScroll = useCallback((sourceRef, targetRef) => {
    if (sourceRef.current && targetRef.current && viewMode === 'dual') {
      const sourceEl = sourceRef.current;
      const targetEl = targetRef.current;
      
      const scrollRatio = sourceEl.scrollTop / (sourceEl.scrollHeight - sourceEl.clientHeight);
      const targetScrollTop = scrollRatio * (targetEl.scrollHeight - targetEl.clientHeight);
      
      targetEl.scrollTop = targetScrollTop;
    }
  }, [viewMode]);
  
  // Cargar contenido del libro
  useEffect(() => {
    const loadBookContent = async () => {
      setLoading(true);
      
      try {
        // Simulación de carga de datos
        setTimeout(async () => {
          setBookTitle('La Daga de Kushiel');
          setChapterTitle('Capítulo Uno');
          
          const originalText = `
            <h2>Chapter One</h2>
            <p>Lest anyone should suppose that I am a cuckoo's child, got on the wrong side of the blanket by lusty peasant stock and sold into indenture in a shortfallen season, I may say that I am House-born and reared in the Night Court proper, for all the good it did me.</p>
            <p>It is hard for me to resent my parents, although I envy them their naiveté. No one told them when I was born that I was one of the Rare Ones, or what it meant. When I was born, they still had reason for hope.</p>
            <p>My eyes, scant though they were, were still of indeterminate color, and the appearance of a newborn babe is a fluid thing, changing from week to week. Golden hair may give way to dark locks, the pallor of birth may deepen to a richness like amber, and so forth. But when my changes came, they were unmistakable.</p>
            <p>I was marked.</p>
            <p>It is not, of course, that I lacked beauty, even as a babe. I am D'Angeline, after all, and ever since Blessed Elua set foot on the soil of our fair nation and called it home, the world has known what it means to be D'Angeline. My soft features echoed my mother's, carved in miniature perfection. My skin, too fair for the canon of Jasmine House, was nonetheless a perfectly acceptable shade of ivory. My hair, which grew to curve in luxurious abundance, was the color of sable in shadow, which would have caused a sensation in some of the Houses. My limbs were straight and supple, my bones a marvel of delicate strength.</p>
            <p>No, the problem lay elsewhere.</p>
            <p>It lay, without question, in my eyes; and not even in both, but only in the left.</p>
          `;
          
          setOriginalContent(originalText);
          
          // Traducir el contenido
          if (originalText) {
            setTranslating(true);
            try {
              const translated = await translate(originalText, 'en', 'es');
              setTranslatedContent(translated);
            } catch (error) {
              console.error('Error translating:', error);
              // Fallback a traducción de demostración
              setTranslatedContent(`
                <h2>Capítulo Uno</h2>
                <p>Para que nadie piense que soy hija bastarda, engendrada en el lado incorrecto de las sábanas por lujuria rústica y vendida en servidumbre durante tiempos aciagos, he de decir que nací y fui criada en la mismísima Corte Nocturna, aunque de poco me valiera.</p>
                <p>Es difícil para mí guardar rencor a mis padres, aunque les envidio su ingenuidad. Nadie les dijo, cuando nací, que era una de las Raras, o lo que significaba. Cuando nací, aún tenían motivos para la esperanza.</p>
                <p>Mis ojos, escasos aunque fueran, eran aún de color indeterminado, y la apariencia de un bebé recién nacido es algo fluido, que cambia de semana en semana. El cabello dorado puede dar paso a mechones oscuros, la palidez del nacimiento puede profundizarse hasta una riqueza como el ámbar, y así sucesivamente. Pero cuando llegaron mis cambios, fueron inconfundibles.</p>
                <p>Estaba marcada.</p>
                <p>No es, por supuesto, que me faltara belleza, incluso siendo bebé. Soy D'Angeline, después de todo, y desde que el Bendito Elua pisó el suelo de nuestra hermosa nación y la llamó hogar, el mundo ha sabido lo que significa ser D'Angeline. Mis suaves facciones hacían eco de las de mi madre, talladas en perfección en miniatura. Mi piel, demasiado clara para el canon de la Casa Jazmín, era, no obstante, un tono perfectamente aceptable de marfil. Mi cabello, que creció para curvarse en abundancia lujuriosa, era del color del sable en las sombras, lo que habría causado sensación en algunas de las Casas. Mis extremidades eran rectas y flexibles, mis huesos una maravilla de fuerza delicada.</p>
                <p>No, el problema estaba en otra parte.</p>
                <p>Estaba, sin duda, en mis ojos; y ni siquiera en ambos, sino solo en el izquierdo.</p>
              `);
            } finally {
              setTranslating(false);
            }
          }
          
          setTotalPages(25);
          setLoading(false);
        }, 1500);
        
      } catch (error) {
        console.error('Error loading book:', error);
        setLoading(false);
      }
    };
    
    loadBookContent();
  }, [bookId, translate]);
  
  // Función de lectura automática
  const startAutoReading = useCallback(() => {
    if (isAutoReading) {
      clearInterval(autoReadingInterval.current);
      setIsAutoReading(false);
      return;
    }
    
    setIsAutoReading(true);
    const wordsPerMinute = autoReadingSpeed;
    const msPerWord = 60000 / wordsPerMinute;
    
    autoReadingInterval.current = setInterval(() => {
      const activePane = viewMode === 'original' ? originalPaneRef.current : 
                         viewMode === 'translation' ? translatedPaneRef.current : originalPaneRef.current;
      
      if (activePane) {
        activePane.scrollBy({
          top: 30,
          behavior: 'smooth'
        });
        
        // Si llegamos al final, parar la lectura automática
        if (activePane.scrollTop + activePane.clientHeight >= activePane.scrollHeight - 10) {
          clearInterval(autoReadingInterval.current);
          setIsAutoReading(false);
        }
      }
    }, msPerWord * 10); // Ajustar según velocidad
  }, [isAutoReading, autoReadingSpeed, viewMode]);
  
  // Cleanup del intervalo
  useEffect(() => {
    return () => {
      if (autoReadingInterval.current) {
        clearInterval(autoReadingInterval.current);
      }
    };
  }, []);
  
  // Función para navegar páginas
  const navigatePage = (direction) => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Aquí cargaríamos el contenido de la nueva página
    }
  };
  
  // Función para descargar traducción
  const downloadTranslation = () => {
    // En implementación real, generaríamos un EPUB
    alert('Función de descarga disponible en versión completa');
  };
  
  // Renderizar contenido según modo de visualización
  const renderContent = () => {
    if (loading) {
      return (
        <LoadingOverlay>
          <LoadingSpinner />
          <p>Cargando libro...</p>
        </LoadingOverlay>
      );
    }
    
    const commonProps = {
      readingTheme: preferences.theme,
      fontSize: preferences.fontSize,
      fontFamily: preferences.fontFamily,
      lineHeight: preferences.lineHeight
    };
    
    switch (viewMode) {
      case 'original':
        return (
          <ReaderPane 
            ref={originalPaneRef}
            viewMode={viewMode}
            readingTheme={preferences.theme}
          >
            <PageContent {...commonProps}>
              <div dangerouslySetInnerHTML={{ __html: originalContent }} />
            </PageContent>
          </ReaderPane>
        );
        
      case 'translation':
        return (
          <ReaderPane 
            ref={translatedPaneRef}
            viewMode={viewMode}
            readingTheme={preferences.theme}
          >
            <PageContent {...commonProps}>
              <div dangerouslySetInnerHTML={{ __html: translatedContent }} />
            </PageContent>
            {translating && (
              <LoadingOverlay>
                <LoadingSpinner />
                <p>Traduciendo contenido...</p>
              </LoadingOverlay>
            )}
          </ReaderPane>
        );
        
      case 'dual':
      default:
        return (
          <>
            <ReaderPane 
              ref={originalPaneRef}
              viewMode={viewMode}
              readingTheme={preferences.theme}
              onScroll={() => syncScroll(originalPaneRef, translatedPaneRef)}
            >
              <PageContent {...commonProps}>
                <div dangerouslySetInnerHTML={{ __html: originalContent }} />
              </PageContent>
            </ReaderPane>
            
            <ReaderPane 
              ref={translatedPaneRef}
              viewMode={viewMode}
              readingTheme={preferences.theme}
              onScroll={() => syncScroll(translatedPaneRef, originalPaneRef)}
            >
              <PageContent {...commonProps}>
                <div dangerouslySetInnerHTML={{ __html: translatedContent }} />
              </PageContent>
              {translating && (
                <LoadingOverlay>
                  <LoadingSpinner />
                  <p>Traduciendo contenido...</p>
                </LoadingOverlay>
              )}
            </ReaderPane>
          </>
        );
    }
  };
  
  return (
    <ReaderContainer theme={{ name: preferences.theme }}>
      {/* Barra de progreso */}
      <ProgressBar currentPage={currentPage} totalPages={totalPages} />
      
      {/* Header principal */}
      <MainHeader>
        <BookInfo>
          <h1>{bookTitle}</h1>
          <div className="chapter-info">
            {chapterTitle} - Página {currentPage} de {totalPages}
          </div>
        </BookInfo>
        
        <ControlsContainer>
          <IconButton 
            active={showSettings}
            onClick={() => setShowSettings(!showSettings)}
            title="Configuración"
          >
            ⚙️
          </IconButton>
          
          <IconButton 
            active={showSearch}
            onClick={() => setShowSearch(!showSearch)}
            title="Buscar"
          >
            🔍
          </IconButton>
          
          <IconButton 
            active={showNotes}
            onClick={() => setShowNotes(!showNotes)}
            title="Notas"
          >
            📝
          </IconButton>
          
          <IconButton 
            active={isAutoReading}
            onClick={startAutoReading}
            title="Lectura automática"
          >
            {isAutoReading ? '⏸️' : '▶️'}
          </IconButton>
        </ControlsContainer>
      </MainHeader>
      
      {/* Controles de lectura */}
      <ReaderControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentPage={currentPage}
        totalPages={totalPages}
        onNavigate={navigatePage}
        onDownload={downloadTranslation}
      />
      
      {/* Área de contenido */}
      <ContentArea>
        {/* Panel lateral */}
        <SidePanel isOpen={showSettings || showSearch || showNotes}>
          {showSettings && (
            <ReadingSettings 
              preferences={preferences}
              updatePreference={updatePreference}
              onClose={() => setShowSettings(false)}
            />
          )}
          
          {showSearch && (
            <SearchPanel 
              content={viewMode === 'original' ? originalContent : translatedContent}
              onClose={() => setShowSearch(false)}
            />
          )}
          
          {showNotes && (
            <NotesPanel 
              bookId={bookId}
              currentPage={currentPage}
              onClose={() => setShowNotes(false)}
            />
          )}
        </SidePanel>
        
        {/* Área de lectura */}
        <ReadingArea>
          {renderContent()}
        </ReadingArea>
      </ContentArea>
      
      {/* Overlay de lectura automática */}
      <AutoReadingOverlay isVisible={isAutoReading}>
        <h3>Lectura Automática Activada</h3>
        <p>Velocidad: {autoReadingSpeed} palabras por minuto</p>
        <div>
          <IconButton onClick={() => setAutoReadingSpeed(Math.max(50, autoReadingSpeed - 50))}>
            ⏪
          </IconButton>
          <IconButton onClick={startAutoReading}>
            ⏸️
          </IconButton>
          <IconButton onClick={() => setAutoReadingSpeed(Math.min(500, autoReadingSpeed + 50))}>
            ⏩
          </IconButton>
        </div>
      </AutoReadingOverlay>
    </ReaderContainer>
  );
};

export default ReaderAdvanced;