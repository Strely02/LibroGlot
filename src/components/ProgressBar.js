import React from 'react';
import styled from 'styled-components';

// Componentes estilizados
const ProgressContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing(2)} ${props => props.theme.spacing(5)};
`;

const ProgressBarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(3)};
`;

const ProgressInfo = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
  min-width: 120px;
`;

const ProgressTrack = styled.div`
  flex: 1;
  height: 6px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 3px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, 
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryLight} 100%);
  border-radius: 3px;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ProgressStats = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textLight};
  min-width: 80px;
  text-align: right;
`;

const ProgressBar = ({ currentPage, totalPages, estimatedReadingTime }) => {
  const percentage = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;
  const remainingPages = totalPages - currentPage;
  
  // Calcular tiempo estimado de lectura (basado en 250 palabras por página, 200 palabras por minuto)
  const wordsPerPage = 250;
  const readingSpeedWPM = 200;
  const estimatedMinutes = remainingPages * wordsPerPage / readingSpeedWPM;
  
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  };

  return (
    <ProgressContainer>
      <ProgressBarWrapper>
        <ProgressInfo>
          Página {currentPage} de {totalPages}
        </ProgressInfo>
        
        <ProgressTrack>
          <ProgressFill percentage={percentage} />
        </ProgressTrack>
        
        <ProgressStats>
          {percentage.toFixed(1)}% • {formatTime(estimatedMinutes)} restante
        </ProgressStats>
      </ProgressBarWrapper>
    </ProgressContainer>
  );
};

export default ProgressBar;