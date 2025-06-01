import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../utils/firebase';

/**
 * Hook personalizado para subir archivos a Firebase Storage
 * @returns {Object} - Métodos y estado para la subida de archivos
 */
const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  /**
   * Subir un archivo a Firebase Storage
   * @param {File} file - Archivo a subir
   * @param {String} path - Ruta en Storage (ej: 'books/user123')
   * @returns {Promise} - Promesa que se resuelve con la URL de descarga
   */
  const uploadFile = (file, path) => {
    return new Promise((resolve, reject) => {
      // Validar que hay un archivo
      if (!file) {
        setError('No se ha seleccionado ningún archivo');
        reject('No se ha seleccionado ningún archivo');
        return;
      }

      setIsUploading(true);
      setProgress(0);
      setError(null);
      setDownloadUrl(null);
      
      // Crear referencia al archivo en Firebase Storage
      const storageRef = ref(storage, `${path}/${file.name}`);
      
      // Crear tarea de subida
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Escuchar eventos de la subida
      uploadTask.on(
        'state_changed',
        // Progreso
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        // Error
        (error) => {
          setIsUploading(false);
          setError('Error al subir el archivo: ' + error.message);
          reject(error);
        },
        // Completado
        async () => {
          try {
            // Obtener URL de descarga
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setDownloadUrl(url);
            setIsUploading(false);
            resolve(url);
          } catch (error) {
            setIsUploading(false);
            setError('Error al obtener la URL de descarga: ' + error.message);
            reject(error);
          }
        }
      );
    });
  };

  return {
    uploadFile,
    isUploading,
    progress,
    error,
    downloadUrl
  };
};

export default useFileUpload;