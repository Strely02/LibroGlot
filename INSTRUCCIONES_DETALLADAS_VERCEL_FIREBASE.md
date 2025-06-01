# 🚀 Guía Ultra-Detallada: Vercel + Firebase para LibroGlot

Esta guía te llevará paso a paso para configurar y desplegar LibroGlot usando **Vercel** (hosting) y **Firebase** (base de datos y almacenamiento), ¡todo completamente gratuito!

## 📋 Índice
1. [Preparación inicial](#preparación-inicial)
2. [Configuración de Firebase](#configuración-de-firebase)
3. [Configuración del proyecto local](#configuración-del-proyecto-local)
4. [Configuración de Vercel](#configuración-de-vercel)
5. [Conexión Firebase + Vercel](#conexión-firebase--vercel)
6. [Variables de entorno](#variables-de-entorno)
7. [Despliegue final](#despliegue-final)
8. [Configuración de Google Translate API](#configuración-de-google-translate-api)
9. [Solución de problemas](#solución-de-problemas)

---

## 🎯 Preparación Inicial

### 📝 **Cuentas que necesitas (todas gratuitas):**
- ✅ **GitHub** - Para almacenar tu código
- ✅ **Vercel** - Para hosting del sitio web
- ✅ **Firebase** - Para base de datos y almacenamiento
- ✅ **Google Cloud** - Para API de traducción (opcional)

### 💻 **Software necesario:**
- ✅ **Node.js** (versión 16 o superior)
- ✅ **Git** 
- ✅ **Editor de código** (VS Code recomendado)

---

## 🔥 Configuración de Firebase

### **Paso 1: Crear proyecto en Firebase**

1. **Ve a Firebase Console**
   - Abre https://console.firebase.google.com/
   - Haz clic en "Agregar proyecto" o "Create a project"

2. **Configurar el proyecto**
   ```
   Nombre del proyecto: libroglot-tu-nombre
   ✅ Habilitar Google Analytics (opcional)
   Ubicación: Elige tu país
   ```

3. **Esperar a que se cree** (puede tomar 1-2 minutos)

### **Paso 2: Configurar Firebase Storage**

1. **Ir a Storage**
   - En el menú lateral, haz clic en "Storage"
   - Clic en "Get started" o "Comenzar"

2. **Configurar reglas de seguridad**
   - Elige "Start in test mode" (modo de prueba)
   - Selecciona ubicación más cercana (ej: us-central1)
   - Clic en "Done"

3. **Configurar reglas personalizadas**
   - Ve a la pestaña "Rules"
   - Reemplaza el contenido con:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /books/{userId}/{allPaths=**} {
         allow read, write: if true; // Para desarrollo
         // En producción, cambia por autenticación real
       }
     }
   }
   ```
   - Clic en "Publish"

### **Paso 3: Configurar Firestore Database**

1. **Ir a Firestore Database**
   - En el menú lateral, clic en "Firestore Database"
   - Clic en "Create database"

2. **Configurar modo de seguridad**
   - Selecciona "Start in test mode"
   - Elige la misma ubicación que Storage
   - Clic en "Create"

3. **Configurar reglas de Firestore**
   - Ve a la pestaña "Rules"
   - Reemplaza con:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /books/{document=**} {
         allow read, write: if true; // Para desarrollo
       }
       match /users/{document=**} {
         allow read, write: if true; // Para desarrollo
       }
       match /bookmarks/{document=**} {
         allow read, write: if true; // Para desarrollo
       }
     }
   }
   ```
   - Clic en "Publish"

### **Paso 4: Obtener credenciales de Firebase**

1. **Configurar aplicación web**
   - En la página principal del proyecto, clic en el ícono web `</>`
   - Nombre de la app: `libroglot-web`
   - ✅ Marca "Firebase Hosting" si aparece
   - Clic en "Register app"

2. **Copiar configuración**
   - Te aparecerá un código como este:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "libroglot-tu-nombre.firebaseapp.com",
     projectId: "libroglot-tu-nombre",
     storageBucket: "libroglot-tu-nombre.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcd1234"
   };
   ```
   - **¡COPIA ESTA INFORMACIÓN!** La necesitarás más tarde
   - Guárdala en un archivo temporal

---

## 💻 Configuración del Proyecto Local

### **Paso 1: Clonar/Descargar el proyecto**

1. **Si tienes el proyecto en ZIP:**
   ```bash
   # Extraer el archivo
   unzip libroglot_v2.zip
   cd libroglot_v2
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

### **Paso 2: Configurar Firebase en el proyecto**

1. **Abrir archivo de configuración**
   - Abre `src/utils/firebase.js`

2. **Reemplazar configuración**
   - Reemplaza las líneas que dicen "TU_API_KEY" etc. con los valores que copiaste:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...", // Tu API key real
     authDomain: "libroglot-tu-nombre.firebaseapp.com",
     projectId: "libroglot-tu-nombre",
     storageBucket: "libroglot-tu-nombre.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcd1234"
   };
   ```

3. **Crear archivo de variables de entorno**
   - En la raíz del proyecto, crea un archivo llamado `.env.local`
   - Añade el contenido:
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSyC...
   REACT_APP_FIREBASE_AUTH_DOMAIN=libroglot-tu-nombre.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=libroglot-tu-nombre
   REACT_APP_FIREBASE_STORAGE_BUCKET=libroglot-tu-nombre.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcd1234
   ```

### **Paso 3: Probar localmente**

1. **Iniciar servidor de desarrollo:**
   ```bash
   npm start
   ```

2. **Verificar que funciona:**
   - Abre http://localhost:3000
   - Debería cargar la aplicación sin errores
   - Revisa la consola del navegador (F12) para verificar que no hay errores de Firebase

---

## 🚀 Configuración de Vercel

### **Paso 1: Crear cuenta en Vercel**

1. **Ir a Vercel**
   - Visita https://vercel.com
   - Clic en "Sign Up"
   - **Importante:** Regístrate usando tu cuenta de GitHub

2. **Autorizar GitHub**
   - Permite que Vercel acceda a tus repositorios
   - Esto facilita el despliegue automático

### **Paso 2: Subir código a GitHub**

1. **Crear repositorio en GitHub**
   - Ve a https://github.com
   - Clic en "New repository"
   - Nombre: `libroglot`
   - Visibilidad: Public (para plan gratuito)
   - Clic en "Create repository"

2. **Subir tu código**
   ```bash
   # En tu carpeta del proyecto
   git init
   git add .
   git commit -m "Initial commit - LibroGlot app"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/libroglot.git
   git push -u origin main
   ```

### **Paso 3: Importar proyecto en Vercel**

1. **Importar desde GitHub**
   - En Vercel, clic en "New Project"
   - Busca tu repositorio "libroglot"
   - Clic en "Import"

2. **Configurar el despliegue**
   ```
   Project Name: libroglot
   Framework Preset: Create React App (se detecta automáticamente)
   Root Directory: ./
   Build and Output Settings: (dejar por defecto)
   ```

3. **NO desplegues todavía** - Primero necesitamos configurar las variables de entorno

---

## 🔗 Conexión Firebase + Vercel

### **Paso 1: Configurar variables de entorno en Vercel**

1. **En la página de configuración del proyecto en Vercel:**
   - Ve a "Settings" > "Environment Variables"

2. **Añadir cada variable:**
   ```
   Name: REACT_APP_FIREBASE_API_KEY
   Value: AIzaSyC... (tu API key)
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

   ```
   Name: REACT_APP_FIREBASE_AUTH_DOMAIN
   Value: libroglot-tu-nombre.firebaseapp.com
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

   ```
   Name: REACT_APP_FIREBASE_PROJECT_ID
   Value: libroglot-tu-nombre
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

   ```
   Name: REACT_APP_FIREBASE_STORAGE_BUCKET
   Value: libroglot-tu-nombre.appspot.com
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

   ```
   Name: REACT_APP_FIREBASE_MESSAGING_SENDER_ID
   Value: 123456789
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

   ```
   Name: REACT_APP_FIREBASE_APP_ID
   Value: 1:123456789:web:abcd1234
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

### **Paso 2: Actualizar configuración de Firebase en el código**

1. **Modificar `src/utils/firebase.js`** para usar variables de entorno:
   ```javascript
   const firebaseConfig = {
     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.REACT_APP_FIREBASE_APP_ID
   };
   ```

2. **Actualizar en GitHub:**
   ```bash
   git add .
   git commit -m "Add environment variables for Firebase"
   git push
   ```

---

## 🚀 Despliegue Final

### **Paso 1: Desplegar en Vercel**

1. **Trigger deployment**
   - En Vercel, ve a tu proyecto
   - Clic en "Deployments"
   - Como subiste cambios a GitHub, debería desplegarse automáticamente
   - Si no, clic en "Redeploy"

2. **Esperar el despliegue** (1-3 minutos)
   - Verás el progreso en tiempo real
   - Al completarse, obtendrás una URL como: `https://libroglot.vercel.app`

### **Paso 2: Configurar dominio de Firebase**

1. **Agregar dominio a Firebase**
   - Ve a Firebase Console > Authentication
   - Pestaña "Settings" > "Authorized domains"
   - Clic en "Add domain"
   - Añade tu dominio de Vercel: `libroglot.vercel.app`

### **Paso 3: Verificar funcionamiento**

1. **Probar la aplicación**
   - Visita tu URL de Vercel
   - Intenta subir un archivo de prueba
   - Verifica que no hay errores en la consola

---

## 🌐 Configuración de Google Translate API

### **Paso 1: Habilitar Google Translate API**

1. **Ir a Google Cloud Console**
   - Visita https://console.cloud.google.com/
   - Si es tu primera vez, acepta los términos

2. **Crear proyecto (si no tienes uno)**
   - Clic en el selector de proyecto en la parte superior
   - "New Project"
   - Nombre: "LibroGlot Translate"
   - Clic en "Create"

3. **Habilitar Cloud Translation API**
   - Ve a "APIs & Services" > "Library"
   - Busca "Cloud Translation API"
   - Clic en la API y luego "Enable"

### **Paso 2: Crear API Key**

1. **Crear credenciales**
   - Ve a "APIs & Services" > "Credentials"
   - Clic en "Create Credentials" > "API Key"
   - Se creará una nueva API key

2. **Configurar restricciones (recomendado)**
   - Clic en tu nueva API key para editarla
   - En "Application restrictions":
     - Selecciona "HTTP referrers"
     - Añade: `https://libroglot.vercel.app/*`
     - Añade: `http://localhost:3000/*` (para desarrollo)
   - En "API restrictions":
     - Selecciona "Restrict key"
     - Marca solo "Cloud Translation API"
   - Clic en "Save"

### **Paso 3: Añadir API Key a Vercel**

1. **En Vercel, añadir nueva variable de entorno:**
   ```
   Name: REACT_APP_GOOGLE_TRANSLATE_KEY
   Value: [tu API key de Google]
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

2. **Redesplegár**
   - Clic en "Redeploy" en Vercel para que tome las nuevas variables

---

## 🛠️ Solución de Problemas

### **Problema: "Firebase configuration error"**
**Solución:**
- Verifica que todas las variables de entorno estén bien escritas
- Asegúrate de que no hay espacios extra
- Redespliega en Vercel

### **Problema: "Storage bucket access denied"**
**Solución:**
```javascript
// En Firebase Console > Storage > Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### **Problema: "Build failed in Vercel"**
**Solución:**
- Verifica que `package.json` tenga todas las dependencias
- Asegúrate de que no hay errores de sintaxis
- Revisa los logs de build en Vercel

### **Problema: "Google Translate quota exceeded"**
**Solución:**
- Google ofrece $200 USD gratis mensuales
- Para uso personal típico, es más que suficiente
- Si se agota, la app seguirá funcionando con traducciones de demostración

### **Problema: "CORS errors"**
**Solución:**
- Verifica que tu dominio esté en "Authorized domains" de Firebase
- Asegúrate de que las restricciones de API key incluyan tu dominio

---

## 🎉 ¡Felicitaciones!

Si llegaste hasta aquí, ¡ya tienes LibroGlot funcionando completamente en línea!

### **URLs importantes que debes guardar:**
- 🌐 **Tu aplicación:** https://libroglot.vercel.app (o tu dominio personalizado)
- 🔥 **Firebase Console:** https://console.firebase.google.com/project/libroglot-tu-nombre
- 🚀 **Vercel Dashboard:** https://vercel.com/dashboard

### **Próximos pasos sugeridos:**
1. **Personalizar dominio:** Configura un dominio personalizado en Vercel
2. **Analytics:** Añade Google Analytics para monitorear uso
3. **Backup:** Configura backups automáticos de Firestore
4. **Performance:** Optimiza la aplicación con Service Workers

---

## 📞 ¿Necesitas ayuda?

Si te encuentras con algún problema que no está cubierto aquí:

1. **Revisa los logs:**
   - En Vercel: Ve a tu proyecto > Functions > View details
   - En Firebase: Ve a tu proyecto > Functions > Logs
   - En el navegador: Abre Developer Tools (F12) > Console

2. **Comunidades útiles:**
   - Firebase Discord
   - Vercel Discord
   - Stack Overflow (en español)

¡Tu aplicación de lectura bilingüe está lista para ayudarte a aprender idiomas! 🚀📚