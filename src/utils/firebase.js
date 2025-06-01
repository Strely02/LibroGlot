// Configuración de Firebase para LibroGlot 2.0
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Configuración usando variables de entorno para mayor seguridad
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "TU_API_KEY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "tu-proyecto.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "tu-proyecto",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "tu-proyecto.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "TU_MESSAGING_SENDER_ID",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// Verificar configuración
if (firebaseConfig.apiKey === "TU_API_KEY") {
  console.warn('⚠️ Firebase no configurado correctamente. Por favor, configura las variables de entorno.');
  console.log('📚 Consulta INSTRUCCIONES_DETALLADAS_VERCEL_FIREBASE.md para más información.');
}

export { app, storage, db };