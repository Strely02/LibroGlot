import React, { useState } from 'react';
import styled from 'styled-components';

// Componentes estilizados
const ControlsContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  box-shadow: ${props => props.theme.shadows.small};
  padding: ${props => props.theme.spacing(3)} ${props => props.theme.spacing(5)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing(3)};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing(2)} ${props => props.theme.spacing(3)};
    gap: ${props => props.theme.spacing(2)};
  }
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(2)};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-wrap: wrap;
  }
`;

const ViewModeSelector = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing(1)};
`;

const ViewModeButton = styled.button`
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.spacing(2)} ${props => props.theme.spacing(3)};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  white-space: nowrap;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.primaryLight + '22'};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing(1)} ${props => props.theme.spacing(2)};
    font-size: 0.8rem;
  }
`;

const NavigationControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(2)};
`;

const NavButton = styled.button`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.spacing(2)} ${props => props.theme.spacing(3)};
  cursor: pointer;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(1)};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primaryLight + '22'};
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing(1)} ${props => props.theme.spacing(2)};
    font-size: 0.8rem;
  }
`;

const PageJumper = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(2)};
  
  input {
    width: 60px;
    padding: ${props => props.theme.spacing(1)} ${props => props.theme.spacing(2)};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.small};
    text-align: center;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    display: none;
  }
`;

const ActionButton = styled.button`
  background-color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.colors.primary;
      case 'secondary': return props.theme.colors.secondary;
      case 'success': return props.theme.colors.success;
      default: return props.theme.colors.background;
    }
  }};
  color: ${props => props.variant ? 'white' : props.theme.colors.text};
  border: ${props => props.variant ? 'none' : `1px solid ${props.theme.colors.border}`};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: ${props => props.theme.spacing(2)} ${props => props.theme.spacing(3)};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(1)};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.small};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing(1)} ${props => props.theme.spacing(2)};
    font-size: 0.8rem;
  }
`;

const LanguageSelector = styled.select`
  padding: ${props => props.theme.spacing(2)} ${props => props.theme.spacing(3)};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: white;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing(1)} ${props => props.theme.spacing(2)};
    font-size: 0.8rem;
  }
`;

const QuickStats = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textLight};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(2)};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

// Componente principal
const ReaderControls = ({ 
  viewMode, 
  setViewMode, 
  currentPage, 
  totalPages, 
  onNavigate, 
  onDownload,
  isTranslating = false,
  sourceLang = 'en',
  targetLang = 'es',
  onLanguageChange
}) => {
  const [jumpToPage, setJumpToPage] = useState(currentPage);

  // Manejar salto a página específica
  const handlePageJump = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onNavigate('jump', pageNum);
    }
  };

  // Manejar navegación con teclado
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (action === 'prev') onNavigate('prev');
      if (action === 'next') onNavigate('next');
    }
  };

  // Calcular progreso
  const progressPercentage = totalPages > 0 ? (currentPage / totalPages * 100).toFixed(1) : 0;

  return (
    <ControlsContainer>
      {/* Selector de modo de vista */}
      <ControlGroup>
        <ViewModeSelector>
          <ViewModeButton
            active={viewMode === 'original'}
            onClick={() => setViewMode('original')}
          >
            🇬🇧 Original
          </ViewModeButton>
          <ViewModeButton
            active={viewMode === 'translation'}
            onClick={() => setViewMode('translation')}
          >
            🇪🇸 Traducción
          </ViewModeButton>
          <ViewModeButton
            active={viewMode === 'dual'}
            onClick={() => setViewMode('dual')}
          >
            🔄 Dual
          </ViewModeButton>
        </ViewModeSelector>

        {/* Selector de idiomas */}
        {onLanguageChange && (
          <ControlGroup>
            <LanguageSelector
              value={sourceLang}
              onChange={(e) => onLanguageChange('source', e.target.value)}
              title="Idioma original"
            >
              <option value="en">🇬🇧 Inglés</option>
              <option value="es">🇪🇸 Español</option>
              <option value="de">🇩🇪 Alemán</option>
              <option value="fr">🇫🇷 Francés</option>
              <option value="it">🇮🇹 Italiano</option>
              <option value="pt">🇵🇹 Portugués</option>
            </LanguageSelector>
            
            <span style={{ color: '#666' }}>→</span>
            
            <LanguageSelector
              value={targetLang}
              onChange={(e) => onLanguageChange('target', e.target.value)}
              title="Idioma de traducción"
            >
              <option value="es">🇪🇸 Español</option>
              <option value="en">🇬🇧 Inglés</option>
              <option value="de">🇩🇪 Alemán</option>
              <option value="fr">🇫🇷 Francés</option>
              <option value="it">🇮🇹 Italiano</option>
              <option value="pt">🇵🇹 Portugués</option>
            </LanguageSelector>
          </ControlGroup>
        )}
      </ControlGroup>

      {/* Controles de navegación */}
      <ControlGroup>
        <NavigationControls>
          <NavButton
            onClick={() => onNavigate('prev')}
            onKeyPress={(e) => handleKeyPress(e, 'prev')}
            disabled={currentPage === 1}
            title="Página anterior (←)"
          >
            ← Anterior
          </NavButton>

          <PageJumper>
            <form onSubmit={handlePageJump}>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                onFocus={(e) => e.target.select()}
                title="Ir a página específica"
              />
            </form>
          </PageJumper>

          <NavButton
            onClick={() => onNavigate('next')}
            onKeyPress={(e) => handleKeyPress(e, 'next')}
            disabled={currentPage === totalPages}
            title="Página siguiente (→)"
          >
            Siguiente →
          </NavButton>
        </NavigationControls>

        {/* Estadísticas rápidas */}
        <QuickStats>
          📊 {progressPercentage}% completado
          {isTranslating && <span>• 🔄 Traduciendo...</span>}
        </QuickStats>
      </ControlGroup>

      {/* Acciones principales */}
      <ControlGroup>
        <ActionButton
          variant="secondary"
          onClick={onDownload}
          title="Descargar traducción completa"
        >
          ⬇️ Descargar EPUB
        </ActionButton>

        <ActionButton
          onClick={() => window.print()}
          title="Imprimir página actual"
        >
          🖨️ Imprimir
        </ActionButton>

        <ActionButton
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'LibroGlot - Lectura Bilingüe',
                text: `Estoy leyendo en LibroGlot (página ${currentPage} de ${totalPages})`,
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Enlace copiado al portapapeles');
            }
          }}
          title="Compartir progreso"
        >
          📤 Compartir
        </ActionButton>
      </ControlGroup>
    </ControlsContainer>
  );
};

export default ReaderControls;