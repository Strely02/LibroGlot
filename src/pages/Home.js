import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  text-align: center;
  padding: ${props => props.theme.spacing(20)} ${props => props.theme.spacing(5)};
  border-radius: 0 0 ${props => props.theme.borderRadius.large} ${props => props.theme.borderRadius.large};
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing(4)};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: ${props => props.theme.spacing(8)};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing(5)};
  justify-content: center;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  padding: ${props => props.theme.spacing(4)} ${props => props.theme.spacing(8)};
  border-radius: ${props => props.theme.borderRadius.medium};
  transition: transform ${props => props.theme.transitions.fast}, box-shadow ${props => props.theme.transitions.fast};
  text-decoration: none;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.medium};
    text-decoration: none;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  background-color: transparent;
  color: white;
  font-weight: 600;
  padding: ${props => props.theme.spacing(4)} ${props => props.theme.spacing(8)};
  border-radius: ${props => props.theme.borderRadius.medium};
  border: 2px solid white;
  transition: background-color ${props => props.theme.transitions.fast};
  text-decoration: none;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    text-decoration: none;
  }
`;

const FeaturesSection = styled.section`
  padding: ${props => props.theme.spacing(20)} ${props => props.theme.spacing(5)};
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing(12)};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing(8)};
`;

const FeatureCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing(8)};
  box-shadow: ${props => props.theme.shadows.small};
  text-align: center;
  transition: transform ${props => props.theme.transitions.fast}, box-shadow ${props => props.theme.transitions.fast};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing(4)};
`;

const FeatureTitle = styled.h3`
  margin-bottom: ${props => props.theme.spacing(3)};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
`;

const Home = () => {
  return (
    <>
      <HeroSection>
        <HeroTitle>Aprende idiomas mientras disfrutas tus libros favoritos</HeroTitle>
        <HeroSubtitle>
          LibroGlot te permite leer tus libros en su idioma original y traducidos al mismo tiempo, 
          facilitando el aprendizaje de inglés, español, alemán y más.
        </HeroSubtitle>
        <ButtonsContainer>
          <PrimaryButton to="/upload">Subir un Libro</PrimaryButton>
          <SecondaryButton to="/library">Explorar Biblioteca</SecondaryButton>
        </ButtonsContainer>
      </HeroSection>
      
      <FeaturesSection>
        <SectionTitle>¿Por qué usar LibroGlot?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>📚</FeatureIcon>
            <FeatureTitle>Lectura Bilingüe</FeatureTitle>
            <FeatureDescription>
              Lee tus libros favoritos mostrando el idioma original y la traducción en paralelo, 
              perfectamente sincronizados página a página.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔄</FeatureIcon>
            <FeatureTitle>Múltiples Idiomas</FeatureTitle>
            <FeatureDescription>
              Soporte para inglés, español, alemán y más idiomas. Aprende varias lenguas 
              con el mismo libro.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>Compatibilidad Total</FeatureTitle>
            <FeatureDescription>
              Compatible con archivos EPUB y PDF. Sube tus propios libros y conviértelos 
              en herramientas de aprendizaje.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💾</FeatureIcon>
            <FeatureTitle>Descarga Traducciones</FeatureTitle>
            <FeatureDescription>
              Descarga la versión traducida completa de tus libros en formato EPUB para 
              leerla en cualquier dispositivo.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>Aprendizaje Personalizado</FeatureTitle>
            <FeatureDescription>
              Elige entre ver solo el original, solo la traducción o ambos a la vez según 
              tus necesidades de aprendizaje.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🆓</FeatureIcon>
            <FeatureTitle>Totalmente Gratuito</FeatureTitle>
            <FeatureDescription>
              Sin costos ocultos, planes premium o limitaciones. Una herramienta de 
              aprendizaje completamente gratuita.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </>
  );
};

export default Home;