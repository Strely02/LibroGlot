export const theme = {
  colors: {
    primary: '#6200ea',      // Morado profundo
    primaryLight: '#9d46ff',
    primaryDark: '#0a00b6',
    secondary: '#00b0ff',    // Azul claro
    secondaryLight: '#69e2ff',
    secondaryDark: '#0081cb',
    background: '#f8f9fa',
    surface: '#ffffff',
    error: '#d50000',
    text: '#212121',
    textLight: '#757575',
    border: '#e0e0e0',
    success: '#00c853',
    warning: '#ffd600'
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.12)',
    large: '0 8px 16px rgba(0, 0, 0, 0.14)'
  },
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px'
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    body: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
    small: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5
    }
  },
  spacing: (multiplier = 1) => `${4 * multiplier}px`,
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    circle: '50%'
  },
  transitions: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease'
  }
};