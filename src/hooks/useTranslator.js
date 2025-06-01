import { useState } from 'react';
import { translateText, translateChapter, translateBook } from '../utils/translationUtils';

/**
 * Hook personalizado para manejar traducciones
 * @returns {Object} - Métodos y estado para traducciones
 */
const useTranslator = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Traducir un texto
   * @param {String} text - Texto a traducir
   * @param {String} sourceLang - Idioma de origen (en, es, de)
   * @param {String} targetLang - Idioma de destino (en, es, de)
   * @returns {Promise} - Promesa que se resuelve con el texto traducido
   */
  const translate = async (text, sourceLang, targetLang) => {
    try {
      setIsTranslating(true);
      setProgress(0);
      setError(null);

      const result = await translateText(text, sourceLang, targetLang);
      
      setIsTranslating(false);
      setProgress(100);
      
      return result;
    } catch (err) {
      setError('Error en la traducción: ' + err.message);
      setIsTranslating(false);
      throw err;
    }
  };

  /**
   * Traducir un capítulo
   * @param {Object} chapter - Capítulo a traducir
   * @param {String} sourceLang - Idioma de origen
   * @param {String} targetLang - Idioma de destino
   * @returns {Promise} - Promesa que se resuelve con el capítulo traducido
   */
  const translateChapterWithProgress = async (chapter, sourceLang, targetLang) => {
    try {
      setIsTranslating(true);
      setProgress(0);
      setError(null);

      const result = await translateChapter(chapter, sourceLang, targetLang);
      
      setIsTranslating(false);
      setProgress(100);
      
      return result;
    } catch (err) {
      setError('Error al traducir el capítulo: ' + err.message);
      setIsTranslating(false);
      throw err;
    }
  };

  /**
   * Traducir un libro completo
   * @param {Object} book - Libro con capítulos
   * @param {String} sourceLang - Idioma de origen
   * @param {String} targetLang - Idioma de destino
   * @returns {Promise} - Promesa que se resuelve con el libro traducido
   */
  const translateBookWithProgress = async (book, sourceLang, targetLang) => {
    try {
      setIsTranslating(true);
      setProgress(0);
      setError(null);

      // Total de capítulos
      const totalChapters = book.chapters.length;
      
      // Traducir capítulos uno por uno para actualizar el progreso
      const translatedChapters = [];
      
      for (let i = 0; i < totalChapters; i++) {
        // Traducir capítulo
        const translatedChapter = await translateChapter(
          book.chapters[i], 
          sourceLang, 
          targetLang
        );
        
        // Añadir a la lista de capítulos traducidos
        translatedChapters.push(translatedChapter);
        
        // Actualizar progreso
        const currentProgress = Math.round(((i + 1) / totalChapters) * 100);
        setProgress(currentProgress);
      }
      
      // Crear libro traducido
      const translatedBook = {
        ...book,
        chapters: translatedChapters
      };
      
      setIsTranslating(false);
      setProgress(100);
      
      return translatedBook;
    } catch (err) {
      setError('Error al traducir el libro: ' + err.message);
      setIsTranslating(false);
      throw err;
    }
  };

  return {
    translate,
    translateChapter: translateChapterWithProgress,
    translateBook: translateBookWithProgress,
    isTranslating,
    progress,
    error
  };
};

export default useTranslator;