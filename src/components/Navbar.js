import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: ${props => props.theme.colors.surface};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 0 ${props => props.theme.spacing(5)};
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const Logo = styled(Link)`
  font-family: 'Merriweather', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: none;
  }
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing(5)};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background-color: ${props => props.theme.colors.surface};
    padding: ${props => props.theme.spacing(4)};
    box-shadow: ${props => props.theme.shadows.medium};
    gap: ${props => props.theme.spacing(3)};
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: ${props => props.isActive ? '600' : '400'};
  text-decoration: none;
  padding: ${props => props.theme.spacing(2)} ${props => props.theme.spacing(3)};
  border-radius: ${props => props.theme.borderRadius.medium};
  transition: background-color ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
    text-decoration: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.primary};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <Nav>
      <Logo to="/">
        Libro<span>Glot</span>
      </Logo>
      
      <MobileMenuButton onClick={toggleMenu}>
        {isOpen ? '✕' : '☰'}
      </MobileMenuButton>
      
      <NavLinks isOpen={isOpen}>
        <NavLink to="/" isActive={location.pathname === '/'}>
          Inicio
        </NavLink>
        <NavLink to="/upload" isActive={location.pathname === '/upload'}>
          Subir Libro
        </NavLink>
        <NavLink to="/library" isActive={location.pathname === '/library'}>
          Mi Biblioteca
        </NavLink>
      </NavLinks>
    </Nav>
  );
};

export default Navbar;