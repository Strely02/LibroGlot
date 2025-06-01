import React, { useState } from 'react';
import styled from 'styled-components';

// Componentes estilizados
const SettingsContainer = styled.div`
  padding: ${props => props.theme.spacing(6)};
  background-color: ${props => props.theme.colors.surface};
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing(6)};
  padding-bottom: ${props => props.theme.spacing(3)};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SettingsTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.primary};
  font-size: 1.3rem;
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

const SettingsSection = styled.div`
  margin-bottom: ${props => props.theme.spacing(6)};
`;

const SectionTitle = styled.h3`
  margin-bottom: ${props => props.theme.spacing(4)};
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(2)};
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing(3)} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border + '44'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.label`
  flex: 1;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  
  .description {
    display: block;
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textLight};
    font-weight: normal;
    margin-top: 2px;
  }
`;

const SettingControl = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(2)};
`;

const Slider = styled.input`
  width: 100px;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.theme.colors.background};
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
    border: none;
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing(2)} ${props => props.theme.spacing(3)};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: white;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Toggle = styled.input`
  position: relative;
  width: 50px;
  height: 24px;
  appearance: none;
  background: ${props => props.checked ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.checked ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left 0.3s ease;
  }
`;

const ColorPicker = styled.input`
  width: 40px;
  height: 30px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.small};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing(1)};
`;

const ThemeButton = styled.button`
  padding: ${props => props.theme.spacing(2)} ${props => props.theme.spacing(3)};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FontSizeControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(2)};
`;

const FontSizeButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: white;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const FontSizeDisplay = styled.span`
  min-width: 60px;
  text-align: center;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
`;

const ResetButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing(3)};
  background-color: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: 600;
  cursor: pointer;
  margin-top: ${props => props.theme.spacing(4)};
  
  &:hover {
    background-color: ${props => props.theme.colors.error + 'dd'};
  }
`;

const StatsCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing(4)};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-top: ${props => props.theme.spacing(4)};
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing(2)};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Componente principal
const ReadingSettings = ({ preferences, updatePreference, onClose }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Funciones de ajuste de fuente
  const increaseFontSize = () => {
    const currentSize = parseFloat(preferences.fontSize);
    const newSize = Math.min(currentSize + 0.1, 2.0);
    updatePreference('fontSize', `${newSize.toFixed(1)}rem`);
  };

  const decreaseFontSize = () => {
    const currentSize = parseFloat(preferences.fontSize);
    const newSize = Math.max(currentSize - 0.1, 0.8);
    updatePreference('fontSize', `${newSize.toFixed(1)}rem`);
  };

  // Reset de preferencias
  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres restablecer todas las configuraciones?')) {
      // Aquí llamarías a resetPreferences si estuviera disponible
      const defaultPrefs = {
        theme: 'light',
        fontSize: '1.1rem',
        fontFamily: "'Merriweather', serif",
        lineHeight: 1.8,
        readingSpeed: 200,
        highlightColor: '#ffeb3b',
        autoSave: true,
        syncScroll: true,
        animations: true,
        soundEffects: false
      };
      
      Object.entries(defaultPrefs).forEach(([key, value]) => {
        updatePreference(key, value);
      });
    }
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>⚙️ Configuración</SettingsTitle>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </SettingsHeader>

      {/* Tema */}
      <SettingsSection>
        <SectionTitle>🎨 Tema de Lectura</SectionTitle>
        <SettingItem>
          <SettingLabel>
            Modo de visualización
            <span className="description">Elige el tema que más te guste</span>
          </SettingLabel>
          <SettingControl>
            <ButtonGroup>
              <ThemeButton 
                active={preferences.theme === 'light'}
                onClick={() => updatePreference('theme', 'light')}
              >
                ☀️ Claro
              </ThemeButton>
              <ThemeButton 
                active={preferences.theme === 'dark'}
                onClick={() => updatePreference('theme', 'dark')}
              >
                🌙 Oscuro
              </ThemeButton>
              <ThemeButton 
                active={preferences.theme === 'sepia'}
                onClick={() => updatePreference('theme', 'sepia')}
              >
                📜 Sepia
              </ThemeButton>
            </ButtonGroup>
          </SettingControl>
        </SettingItem>
      </SettingsSection>

      {/* Tipografía */}
      <SettingsSection>
        <SectionTitle>📝 Tipografía</SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            Tamaño de fuente
            <span className="description">Ajusta el tamaño del texto</span>
          </SettingLabel>
          <SettingControl>
            <FontSizeControls>
              <FontSizeButton onClick={decreaseFontSize}>-</FontSizeButton>
              <FontSizeDisplay>{preferences.fontSize}</FontSizeDisplay>
              <FontSizeButton onClick={increaseFontSize}>+</FontSizeButton>
            </FontSizeControls>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            Familia de fuente
            <span className="description">Tipo de letra para el texto</span>
          </SettingLabel>
          <SettingControl>
            <Select 
              value={preferences.fontFamily}
              onChange={(e) => updatePreference('fontFamily', e.target.value)}
            >
              <option value="'Merriweather', serif">Merriweather</option>
              <option value="'Georgia', serif">Georgia</option>
              <option value="'Times New Roman', serif">Times</option>
              <option value="'Open Sans', sans-serif">Open Sans</option>
              <option value="'Roboto', sans-serif">Roboto</option>
              <option value="'Arial', sans-serif">Arial</option>
            </Select>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            Espaciado de líneas
            <span className="description">Altura entre líneas de texto</span>
          </SettingLabel>
          <SettingControl>
            <Slider
              type="range"
              min="1.2"
              max="2.5"
              step="0.1"
              value={preferences.lineHeight}
              onChange={(e) => updatePreference('lineHeight', parseFloat(e.target.value))}
            />
            <span>{preferences.lineHeight.toFixed(1)}</span>
          </SettingControl>
        </SettingItem>
      </SettingsSection>

      {/* Lectura */}
      <SettingsSection>
        <SectionTitle>📖 Experiencia de Lectura</SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            Velocidad de lectura
            <span className="description">Palabras por minuto para lectura automática</span>
          </SettingLabel>
          <SettingControl>
            <Slider
              type="range"
              min="100"
              max="400"
              step="10"
              value={preferences.readingSpeed}
              onChange={(e) => updatePreference('readingSpeed', parseInt(e.target.value))}
            />
            <span>{preferences.readingSpeed} ppm</span>
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            Color de resaltado
            <span className="description">Color para resaltar texto seleccionado</span>
          </SettingLabel>
          <SettingControl>
            <ColorPicker
              type="color"
              value={preferences.highlightColor}
              onChange={(e) => updatePreference('highlightColor', e.target.value)}
            />
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            Sincronizar desplazamiento
            <span className="description">Sincronizar scroll entre paneles</span>
          </SettingLabel>
          <SettingControl>
            <Toggle
              type="checkbox"
              checked={preferences.syncScroll}
              onChange={(e) => updatePreference('syncScroll', e.target.checked)}
            />
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            Guardado automático
            <span className="description">Guardar progreso automáticamente</span>
          </SettingLabel>
          <SettingControl>
            <Toggle
              type="checkbox"
              checked={preferences.autoSave}
              onChange={(e) => updatePreference('autoSave', e.target.checked)}
            />
          </SettingControl>
        </SettingItem>

        <SettingItem>
          <SettingLabel>
            Animaciones
            <span className="description">Efectos de transición suaves</span>
          </SettingLabel>
          <SettingControl>
            <Toggle
              type="checkbox"
              checked={preferences.animations}
              onChange={(e) => updatePreference('animations', e.target.checked)}
            />
          </SettingControl>
        </SettingItem>

        {showAdvanced && (
          <SettingItem>
            <SettingLabel>
              Efectos de sonido
              <span className="description">Sonidos para navegación</span>
            </SettingLabel>
            <SettingControl>
              <Toggle
                type="checkbox"
                checked={preferences.soundEffects}
                onChange={(e) => updatePreference('soundEffects', e.target.checked)}
              />
            </SettingControl>
          </SettingItem>
        )}
      </SettingsSection>

      {/* Configuración avanzada */}
      <SettingsSection>
        <SectionTitle>
          ⚡ Configuración Avanzada
          <button 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              marginLeft: 'auto',
              fontSize: '0.9rem'
            }}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Ocultar' : 'Mostrar'}
          </button>
        </SectionTitle>
        
        {showAdvanced && (
          <>
            <StatsCard>
              <h4 style={{ marginBottom: '12px', color: '#666' }}>📊 Estadísticas de Lectura</h4>
              <StatItem>
                <span>Velocidad configurada:</span>
                <strong>{preferences.readingSpeed} ppm</strong>
              </StatItem>
              <StatItem>
                <span>Tema actual:</span>
                <strong>{preferences.theme === 'light' ? 'Claro' : preferences.theme === 'dark' ? 'Oscuro' : 'Sepia'}</strong>
              </StatItem>
              <StatItem>
                <span>Tamaño de fuente:</span>
                <strong>{preferences.fontSize}</strong>
              </StatItem>
              <StatItem>
                <span>Configuraciones personalizadas:</span>
                <strong>Activas</strong>
              </StatItem>
            </StatsCard>
          </>
        )}
      </SettingsSection>

      {/* Reset */}
      <ResetButton onClick={handleReset}>
        🔄 Restablecer Configuración
      </ResetButton>
    </SettingsContainer>
  );
};

export default ReadingSettings;