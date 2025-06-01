import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing(8)} ${props => props.theme.spacing(5)};
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing(8)};
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterHeading = styled.h3`
  color: white;
  margin-bottom: ${props => props.theme.spacing(4)};
  font-size: 1.2rem;
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: ${props => props.theme.spacing(2)};
  text-decoration: none;
  transition: color ${props => props.theme.transitions.fast};
  
  &:hover {
    color: white;
    text-decoration: none;
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing(8)};
  padding-top: ${props => props.theme.spacing(4)};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterHeading>LibroGlot</FooterHeading>
          <FooterLink href="/">Inicio</FooterLink>
          <FooterLink href="/about">Acerca de</FooterLink>
          <FooterLink href="/contact">Contacto</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterHeading>Recursos</FooterHeading>
          <FooterLink href="/faq">Preguntas Frecuentes</FooterLink>
          <FooterLink href="/tutorial">Tutorial</FooterLink>
          <FooterLink href="/support">Soporte</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterHeading>Legal</FooterHeading>
          <FooterLink href="/privacy">Política de Privacidad</FooterLink>
          <FooterLink href="/terms">Términos de Uso</FooterLink>
          <FooterLink href="/copyright">Derechos de Autor</FooterLink>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        &copy; {currentYear} LibroGlot. Todos los derechos reservados. Creado para aprendizaje de idiomas.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;