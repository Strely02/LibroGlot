// Utilidades de traducción
import { splitTextForTranslation } from './ebookUtils';

/**
 * Cache de traducciones para evitar llamadas repetidas a la API
 */
const translationCache = {};

/**
 * Traducir un texto usando traducciones preprocesadas
 * Esto es una simplificación para evitar usar APIs pagas.
 * En una implementación real, usaríamos una API como Google Translate o DeepL.
 * 
 * @param {String} text - Texto a traducir
 * @param {String} sourceLang - Idioma de origen (en, es, de)
 * @param {String} targetLang - Idioma de destino (en, es, de)
 * @returns {Promise} - Promesa con el texto traducido
 */
export const translateText = async (text, sourceLang, targetLang) => {
  // Si es el mismo idioma, no traducir
  if (sourceLang === targetLang) {
    return text;
  }
  
  // Clave para el caché
  const cacheKey = `${text}_${sourceLang}_${targetLang}`;
  
  // Si ya tenemos esta traducción en caché, devolverla
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }
  
  // Para demostraciones, usamos un diccionario simple con algunas traducciones
  // En una implementación real, esto se conectaría a una API de traducción
  
  // Este es un diccionario muy simple para demo
  const demoTranslations = {
    // Inglés a Español
    'en_es': {
      'Chapter': 'Capítulo',
      'One': 'Uno',
      'Two': 'Dos',
      'Three': 'Tres',
      'Four': 'Cuatro',
      'Lest anyone should suppose': 'Para que nadie piense',
      'I am a cuckoo\'s child': 'que soy hija bastarda',
      'It is hard for me to resent my parents': 'Es difícil para mí guardar rencor a mis padres',
      'although I envy them their naiveté': 'aunque les envidio su ingenuidad',
      // Añadir más traducciones de demostración
    },
    
    // Español a Inglés
    'es_en': {
      'Capítulo': 'Chapter',
      'Uno': 'One',
      'Dos': 'Two',
      'Para que nadie piense': 'Lest anyone should suppose',
      'que soy hija bastarda': 'I am a cuckoo\'s child',
      // Añadir más traducciones de demostración
    },
    
    // Inglés a Alemán
    'en_de': {
      'Chapter': 'Kapitel',
      'One': 'Eins',
      'Two': 'Zwei',
      // Añadir más traducciones de demostración
    }
  };
  
  // Intentar encontrar una traducción aproximada
  const translationDict = demoTranslations[`${sourceLang}_${targetLang}`] || {};
  
  // Dividir el texto en fragmentos más pequeños
  const fragments = splitTextForTranslation(text);
  
  // Traducir cada fragmento
  let translatedText = text;
  
  // Intentar encontrar coincidencias en nuestro diccionario de demostración
  Object.keys(translationDict).forEach(sourcePhrase => {
    if (text.includes(sourcePhrase)) {
      translatedText = translatedText.replace(
        new RegExp(sourcePhrase, 'g'), 
        translationDict[sourcePhrase]
      );
    }
  });
  
  // En una implementación real aquí llamaríamos a la API de traducción
  
  // Simular retraso de red
  return new Promise(resolve => {
    setTimeout(() => {
      // Guardar en caché para futuras solicitudes
      translationCache[cacheKey] = translatedText;
      resolve(translatedText);
    }, 300);
  });
};

/**
 * Traducir un capítulo completo
 * @param {Object} chapter - Capítulo con contenido HTML
 * @param {String} sourceLang - Idioma de origen
 * @param {String} targetLang - Idioma de destino
 * @returns {Promise} - Promesa con el capítulo traducido
 */
export const translateChapter = async (chapter, sourceLang, targetLang) => {
  // En una implementación real, deberíamos analizar el HTML,
  // extraer el texto, traducirlo y reconstruir el HTML
  
  // Para simplificar, solo simulamos la traducción
  const translatedContent = await translateText(
    chapter.content,
    sourceLang,
    targetLang
  );
  
  return {
    ...chapter,
    content: translatedContent
  };
};

/**
 * Traducir un libro completo
 * @param {Object} book - Datos del libro con capítulos
 * @param {String} sourceLang - Idioma de origen
 * @param {String} targetLang - Idioma de destino
 * @returns {Promise} - Promesa con el libro traducido
 */
export const translateBook = async (book, sourceLang, targetLang) => {
  // Traducir cada capítulo
  const translatedChaptersPromises = book.chapters.map(chapter => 
    translateChapter(chapter, sourceLang, targetLang)
  );
  
  // Esperar a que se traduzcan todos los capítulos
  const translatedChapters = await Promise.all(translatedChaptersPromises);
  
  // Devolver el libro con capítulos traducidos
  return {
    ...book,
    chapters: translatedChapters
  };
};