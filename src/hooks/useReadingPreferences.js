import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para manejar las preferencias de lectura del usuario
 * Guarda configuraciones en localStorage para persistencia
 */
const useReadingPreferences = () => {
  // Preferencias por defecto
  const defaultPreferences = {
    theme: 'light', // 'light', 'dark', 'sepia'
    fontSize: '1.1rem',
    fontFamily: "'Merriweather', serif",
    lineHeight: 1.8,
    textAlign: 'justify',
    columnWidth: 'single', // 'single', 'dual'
    autoSave: true,
    readingSpeed: 200, // palabras por minuto
    highlightColor: '#ffeb3b',
    language: 'es',
    autoTranslate: false,
    syncScroll: true,
    animations: true,
    soundEffects: false
  };

  const [preferences, setPreferences] = useState(defaultPreferences);

  // Cargar preferencias desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('libroglot_reading_preferences');
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error loading reading preferences:', error);
    }
  }, []);

  // Guardar preferencias en localStorage cuando cambian
  const savePreferences = useCallback((newPreferences) => {
    try {
      localStorage.setItem('libroglot_reading_preferences', JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Error saving reading preferences:', error);
    }
  }, []);

  // Función para actualizar una preferencia específica
  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      savePreferences(updated);
      return updated;
    });
  }, [savePreferences]);

  // Función para actualizar múltiples preferencias
  const updatePreferences = useCallback((updates) => {
    setPreferences(prev => {
      const updated = { ...prev, ...updates };
      savePreferences(updated);
      return updated;
    });
  }, [savePreferences]);

  // Función para resetear preferencias a valores por defecto
  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
    savePreferences(defaultPreferences);
  }, [savePreferences]);

  // Función para exportar preferencias
  const exportPreferences = useCallback(() => {
    return JSON.stringify(preferences, null, 2);
  }, [preferences]);

  // Función para importar preferencias
  const importPreferences = useCallback((preferencesString) => {
    try {
      const imported = JSON.parse(preferencesString);
      const validatedPreferences = { ...defaultPreferences, ...imported };
      setPreferences(validatedPreferences);
      savePreferences(validatedPreferences);
      return true;
    } catch (error) {
      console.error('Error importing preferences:', error);
      return false;
    }
  }, [savePreferences]);

  // Funciones de utilidad para temas
  const getThemeColors = useCallback((themeName = preferences.theme) => {
    const themes = {
      light: {
        background: '#ffffff',
        surface: '#f8f9fa',
        text: '#333333',
        textSecondary: '#666666',
        border: '#e0e0e0',
        accent: '#6200ea'
      },
      dark: {
        background: '#1a1a1a',
        surface: '#2d2d2d',
        text: '#e0e0e0',
        textSecondary: '#b0b0b0',
        border: '#404040',
        accent: '#bb86fc'
      },
      sepia: {
        background: '#f4f1ea',
        surface: '#f7f4e9',
        text: '#5c4b37',
        textSecondary: '#8b7355',
        border: '#d4c4a8',
        accent: '#8b4513'
      }
    };

    return themes[themeName] || themes.light;
  }, [preferences.theme]);

  // Función para obtener estilos CSS personalizados
  const getCustomCSS = useCallback(() => {
    const colors = getThemeColors();
    
    return `
      :root {
        --reading-font-size: ${preferences.fontSize};
        --reading-font-family: ${preferences.fontFamily};
        --reading-line-height: ${preferences.lineHeight};
        --reading-text-align: ${preferences.textAlign};
        --reading-bg-color: ${colors.background};
        --reading-text-color: ${colors.text};
        --reading-surface-color: ${colors.surface};
        --reading-border-color: ${colors.border};
        --reading-accent-color: ${colors.accent};
        --reading-highlight-color: ${preferences.highlightColor};
      }
      
      .reading-content {
        font-size: var(--reading-font-size);
        font-family: var(--reading-font-family);
        line-height: var(--reading-line-height);
        text-align: var(--reading-text-align);
        background-color: var(--reading-bg-color);
        color: var(--reading-text-color);
        transition: all 0.3s ease;
      }
      
      .reading-content p {
        margin-bottom: 1em;
      }
      
      .reading-content h1,
      .reading-content h2,
      .reading-content h3,
      .reading-content h4,
      .reading-content h5,
      .reading-content h6 {
        color: var(--reading-accent-color);
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }
      
      .highlight {
        background-color: var(--reading-highlight-color);
        padding: 2px 4px;
        border-radius: 2px;
      }
      
      ${preferences.animations ? `
        .reading-content {
          transition: all 0.3s ease;
        }
        
        .page-transition {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      ` : ''}
    `;
  }, [preferences, getThemeColors]);

  // Función para validar y ajustar el tamaño de fuente
  const adjustFontSize = useCallback((direction) => {
    const currentSize = parseFloat(preferences.fontSize);
    const increment = 0.1;
    const min = 0.8;
    const max = 2.0;

    let newSize;
    if (direction === 'increase') {
      newSize = Math.min(currentSize + increment, max);
    } else {
      newSize = Math.max(currentSize - increment, min);
    }

    updatePreference('fontSize', `${newSize.toFixed(1)}rem`);
  }, [preferences.fontSize, updatePreference]);

  // Función para alternar entre temas
  const toggleTheme = useCallback(() => {
    const themes = ['light', 'dark', 'sepia'];
    const currentIndex = themes.indexOf(preferences.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    updatePreference('theme', themes[nextIndex]);
  }, [preferences.theme, updatePreference]);

  // Función para obtener información del tema actual
  const getCurrentThemeInfo = useCallback(() => {
    const themeInfo = {
      light: { name: 'Claro', icon: '☀️', description: 'Tema claro para lectura diurna' },
      dark: { name: 'Oscuro', icon: '🌙', description: 'Tema oscuro para lectura nocturna' },
      sepia: { name: 'Sepia', icon: '📜', description: 'Tema sepia para reducir fatiga visual' }
    };

    return themeInfo[preferences.theme] || themeInfo.light;
  }, [preferences.theme]);

  // Función para obtener estadísticas de lectura
  const getReadingStats = useCallback(() => {
    const wordsPerPage = 250; // Estimación promedio
    const readingTimePerPage = wordsPerPage / preferences.readingSpeed; // en minutos

    return {
      wordsPerMinute: preferences.readingSpeed,
      estimatedTimePerPage: readingTimePerPage,
      theme: getCurrentThemeInfo(),
      fontSizeLevel: parseFloat(preferences.fontSize),
      customizations: Object.keys(preferences).filter(key => 
        preferences[key] !== defaultPreferences[key]
      ).length
    };
  }, [preferences, getCurrentThemeInfo]);

  return {
    preferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
    exportPreferences,
    importPreferences,
    getThemeColors,
    getCustomCSS,
    adjustFontSize,
    toggleTheme,
    getCurrentThemeInfo,
    getReadingStats
  };
};

export default useReadingPreferences;