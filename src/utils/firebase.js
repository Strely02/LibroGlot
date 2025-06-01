// Configuración de Firebase (plan gratuito)
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Esta configuración debe ser reemplazada con tus propias credenciales de Firebase
// Puedes obtenerlas al crear un proyecto en https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, storage, db };