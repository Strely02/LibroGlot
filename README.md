# LibroGlot - Tu Lector Bilingüe Personal

LibroGlot es una aplicación web que te permite leer libros en formato bilingüe para aprender idiomas mientras disfrutas de tus lecturas favoritas.

## Características

- **Carga de libros:** Sube tus propios archivos EPUB y PDF
- **Lectura bilingüe:** Visualiza el original y la traducción en paralelo
- **Múltiples idiomas:** Soporte para inglés, español, alemán y más
- **Modos de visualización:** Original, traducción o ambos simultáneamente
- **Descarga de traducciones:** Obtén la versión traducida en formato EPUB
- **Totalmente gratuito:** Sin costos ocultos ni limitaciones

## Tecnologías utilizadas

- React.js para la interfaz de usuario
- Firebase (plan gratuito) para almacenamiento
- EPUBjs para procesamiento de libros electrónicos
- Styled Components para estilos
- Sistema de traducción basado en caché

## Configuración del proyecto

### Prerrequisitos

- Node.js (versión 14 o superior)
- Cuenta de Firebase (plan gratuito)

### Instalación

1. Clona este repositorio:
```
git clone https://github.com/tu-usuario/libroglot.git
cd libroglot
```

2. Instala las dependencias:
```
npm install
```

3. Configura Firebase:
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita Firebase Storage y Firestore
   - Copia tus credenciales en `src/utils/firebase.js`

4. Inicia el servidor de desarrollo:
```
npm start
```

## Despliegue

### Despliegue en Vercel (Gratis)

1. Crea una cuenta en [Vercel](https://vercel.com/)
2. Instala la CLI de Vercel:
```
npm install -g vercel
```

3. Despliega el proyecto:
```
vercel
```

### Despliegue en Netlify (Gratis)

1. Crea una cuenta en [Netlify](https://www.netlify.com/)
2. Crea un archivo `netlify.toml` en la raíz del proyecto:
```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

3. Despliega usando la interfaz web de Netlify o CLI

## Uso del sistema de traducción

LibroGlot utiliza un sistema de traducción inteligente que evita el uso de APIs pagas. Para implementar la traducción real:

1. **Opción gratuita:** Utiliza nuestra implementación basada en caché precompilada para traducir libros comunes.
2. **Integración con APIs:** Si deseas usar Google Translate o DeepL, puedes configurar estas APIs en `src/utils/translationUtils.js`.

## Personalización

- Modifica los colores y estilos en `src/styles/Theme.js`
- Añade nuevos idiomas en los componentes de selección
- Extiende las funcionalidades de procesamiento de libros en `src/utils/ebookUtils.js`

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.