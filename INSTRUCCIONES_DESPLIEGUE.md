# 🚀 Instrucciones de Despliegue - LibroGlot

Este documento contiene las instrucciones paso a paso para desplegar LibroGlot en varios servicios de hosting **completamente gratuitos**.

## 📋 Requisitos Previos

- Cuenta de GitHub (gratuita)
- Node.js instalado en tu computadora (para desarrollo local)
- Cuenta de Firebase (plan gratuito)

## 🔄 Opciones de Despliegue (Todas Gratuitas)

### 📦 Opción 1: Despliegue en Vercel (Más Recomendada)

Vercel ofrece hosting gratuito para proyectos React con excelente rendimiento.

#### Pasos:

1. **Crea una cuenta en Vercel**
   - Visita [vercel.com](https://vercel.com) y regístrate (puedes usar tu cuenta de GitHub)

2. **Sube tu código a GitHub**
   - Crea un nuevo repositorio en GitHub
   - Sube el código de LibroGlot al repositorio

3. **Importa el proyecto en Vercel**
   - En el dashboard de Vercel, haz clic en "Import Project"
   - Selecciona tu repositorio de GitHub
   - Mantén la configuración predeterminada (Vercel detectará automáticamente que es un proyecto React)
   - Haz clic en "Deploy"

4. **¡Listo!** Tu aplicación estará disponible en una URL de Vercel (ejemplo: libroglot.vercel.app)

### 📦 Opción 2: Despliegue en Netlify

Netlify es otra excelente opción gratuita para hosting de sitios web estáticos.

#### Pasos:

1. **Crea una cuenta en Netlify**
   - Visita [netlify.com](https://www.netlify.com/) y regístrate

2. **Prepara tu proyecto**
   - Crea un archivo `netlify.toml` en la raíz del proyecto con el siguiente contenido:
   ```toml
   [build]
     command = "npm run build"
     publish = "build"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Despliega en Netlify**
   - Sube tu código a GitHub
   - En Netlify, haz clic en "New site from Git"
   - Selecciona GitHub y autoriza a Netlify
   - Selecciona tu repositorio
   - Mantén la configuración predeterminada
   - Haz clic en "Deploy site"

### 📦 Opción 3: GitHub Pages

GitHub Pages ofrece hosting gratuito directamente desde tu repositorio.

#### Pasos:

1. **Instala gh-pages**
   ```
   npm install --save-dev gh-pages
   ```

2. **Modifica package.json**
   - Añade la propiedad "homepage":
   ```json
   "homepage": "https://tu-usuario.github.io/libroglot",
   ```
   - Añade scripts de despliegue:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build",
     // otros scripts...
   }
   ```

3. **Despliega**
   ```
   npm run deploy
   ```

4. **Configura GitHub Pages**
   - En la configuración del repositorio, sección "GitHub Pages"
   - Selecciona la rama "gh-pages" como fuente

## 🔧 Configuración de Firebase (Plan Gratuito)

Para que la aplicación funcione correctamente, necesitas configurar Firebase:

1. **Crea un proyecto en Firebase**
   - Visita [console.firebase.google.com](https://console.firebase.google.com/)
   - Haz clic en "Añadir proyecto"
   - Sigue los pasos para crear un nuevo proyecto

2. **Habilita los servicios necesarios**
   - En la consola de Firebase, habilita:
     - **Firebase Storage**: Para almacenar archivos
     - **Firestore Database**: Para guardar metadatos de libros
   - Configura las reglas de seguridad para permitir acceso

3. **Obtén las credenciales**
   - En la consola de Firebase, ve a Configuración del Proyecto
   - En la sección "Tus aplicaciones", haz clic en el icono de web (</>) para añadir una aplicación web
   - Registra la aplicación y copia las credenciales

4. **Actualiza la configuración en el proyecto**
   - Abre el archivo `src/utils/firebase.js`
   - Reemplaza las credenciales de muestra con las tuyas:
   ```javascript
   const firebaseConfig = {
     apiKey: "TU_API_KEY",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "TU_MESSAGING_SENDER_ID",
     appId: "TU_APP_ID"
   };
   ```

## 🧪 Probando la Aplicación Localmente

Antes de desplegar, es recomendable probar la aplicación en tu entorno local:

1. **Instala las dependencias**
   ```
   npm install
   ```

2. **Inicia el servidor de desarrollo**
   ```
   npm start
   ```

3. **Accede a la aplicación**
   - Abre tu navegador y visita [http://localhost:3000](http://localhost:3000)

## 📱 Adaptación para Móviles

LibroGlot ya está diseñado con un enfoque "mobile-first" utilizando media queries. La aplicación se adaptará automáticamente a diferentes tamaños de pantalla.

## 🔒 Consideraciones de Seguridad

1. **No incluyas credenciales sensibles en el código fuente**
2. **Configura reglas de seguridad adecuadas en Firebase**
3. **Utiliza variables de entorno para las API keys en producción**

## 🚀 ¡Comienza a usar LibroGlot!

Una vez desplegada, tu aplicación estará lista para ser utilizada. ¡Comparte la URL con amigos y disfruta aprendiendo idiomas mientras lees!

## 📞 Soporte

Si encuentras problemas durante el despliegue, consulta la documentación oficial de:
- [React](https://reactjs.org/docs/getting-started.html)
- [Vercel](https://vercel.com/docs)
- [Netlify](https://docs.netlify.com/)
- [Firebase](https://firebase.google.com/docs)