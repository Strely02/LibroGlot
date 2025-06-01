import { useState, useCallback } from 'react';

/**
 * Hook para manejo de traducción con Google Translate API
 * Incluye caché local para optimizar llamadas y reducir costos
 */
const useTranslationAPI = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState(new Map());

  // Configuración de Google Translate API
  const GOOGLE_TRANSLATE_API_KEY = process.env.REACT_APP_GOOGLE_TRANSLATE_KEY || 'YOUR_API_KEY_HERE';
  const GOOGLE_TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2';

  /**
   * Función para limpiar HTML y preparar texto para traducción
   */
  const prepareTextForTranslation = useCallback((htmlContent) => {
    // Crear un elemento temporal para extraer texto limpio
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Extraer texto pero mantener estructura básica
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Dividir en párrafos para traducir por chunks
    return textContent.split('\n').filter(paragraph => paragraph.trim().length > 0);
  }, []);

  /**
   * Función para reconstruir HTML con texto traducido
   */
  const reconstructHTML = useCallback((originalHTML, originalTexts, translatedTexts) => {
    let result = originalHTML;
    
    // Reemplazar cada texto original con su traducción
    for (let i = 0; i < originalTexts.length && i < translatedTexts.length; i++) {
      if (originalTexts[i].trim() && translatedTexts[i].trim()) {
        result = result.replace(originalTexts[i], translatedTexts[i]);
      }
    }
    
    return result;
  }, []);

  /**
   * Función principal de traducción
   */
  const translate = useCallback(async (text, sourceLang = 'en', targetLang = 'es') => {
    // Crear clave para caché
    const cacheKey = `${sourceLang}-${targetLang}-${text.substring(0, 100)}`;
    
    // Verificar caché primero
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    setIsTranslating(true);
    setError(null);

    try {
      // Si no hay API key configurada, usar traducción de demostración
      if (!GOOGLE_TRANSLATE_API_KEY || GOOGLE_TRANSLATE_API_KEY === 'YOUR_API_KEY_HERE') {
        return await translateWithDemo(text, sourceLang, targetLang);
      }

      // Preparar texto para traducción
      const textChunks = prepareTextForTranslation(text);
      const translatedChunks = [];

      // Traducir cada chunk
      for (const chunk of textChunks) {
        if (chunk.trim().length === 0) continue;

        const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: chunk,
            source: sourceLang,
            target: targetLang,
            format: 'text'
          })
        });

        if (!response.ok) {
          throw new Error(`Error en traducción: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.data && data.data.translations && data.data.translations.length > 0) {
          translatedChunks.push(data.data.translations[0].translatedText);
        } else {
          translatedChunks.push(chunk); // Fallback al texto original
        }

        // Pequeña pausa para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Reconstruir HTML con traducciones
      const translatedHTML = reconstructHTML(text, textChunks, translatedChunks);

      // Guardar en caché
      setCache(prev => new Map(prev.set(cacheKey, translatedHTML)));

      return translatedHTML;

    } catch (err) {
      console.error('Error en traducción:', err);
      setError(err.message);
      
      // Fallback a traducción de demostración en caso de error
      return await translateWithDemo(text, sourceLang, targetLang);
      
    } finally {
      setIsTranslating(false);
    }
  }, [cache, prepareTextForTranslation, reconstructHTML]);

  /**
   * Sistema de traducción de demostración para cuando no hay API key
   */
  const translateWithDemo = useCallback(async (text, sourceLang, targetLang) => {
    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 800));

    // Diccionario básico para demostración
    const translations = {
      'en-es': {
        'Chapter': 'Capítulo',
        'One': 'Uno', 
        'Two': 'Dos',
        'Three': 'Tres',
        'Lest anyone should suppose': 'Para que nadie piense',
        'that I am a cuckoo\'s child': 'que soy hija bastarda',
        'got on the wrong side of the blanket': 'engendrada en el lado incorrecto de las sábanas',
        'by lusty peasant stock': 'por lujuria rústica',
        'and sold into indenture': 'y vendida en servidumbre',
        'in a shortfallen season': 'durante tiempos aciagos',
        'I may say that I am House-born': 'he de decir que nací en casa',
        'and reared in the Night Court proper': 'y fui criada en la mismísima Corte Nocturna',
        'for all the good it did me': 'aunque de poco me valiera',
        'It is hard for me to resent my parents': 'Es difícil para mí guardar rencor a mis padres',
        'although I envy them their naiveté': 'aunque les envidio su ingenuidad',
        'No one told them when I was born': 'Nadie les dijo cuando nací',
        'that I was one of the Rare Ones': 'que era una de las Raras',
        'or what it meant': 'o lo que significaba',
        'When I was born': 'Cuando nací',
        'they still had reason for hope': 'aún tenían motivos para la esperanza',
        'My eyes, scant though they were': 'Mis ojos, escasos aunque fueran',
        'were still of indeterminate color': 'eran aún de color indeterminado',
        'and the appearance of a newborn babe': 'y la apariencia de un bebé recién nacido',
        'is a fluid thing': 'es algo fluido',
        'changing from week to week': 'que cambia de semana en semana',
        'I was marked': 'Estaba marcada',
        'It is not, of course, that I lacked beauty': 'No es, por supuesto, que me faltara belleza',
        'even as a babe': 'incluso siendo bebé',
        'I am D\'Angeline, after all': 'Soy D\'Angeline, después de todo'
      },
      'es-en': {
        'Capítulo': 'Chapter',
        'Uno': 'One',
        'Para que nadie piense': 'Lest anyone should suppose',
        'que soy hija bastarda': 'that I am a cuckoo\'s child'
      }
    };

    const translationKey = `${sourceLang}-${targetLang}`;
    const dict = translations[translationKey] || {};

    let translatedText = text;

    // Aplicar traducciones del diccionario
    Object.entries(dict).forEach(([original, translation]) => {
      const regex = new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      translatedText = translatedText.replace(regex, translation);
    });

    // Si no se encontraron traducciones específicas, mostrar mensaje informativo
    if (translatedText === text && sourceLang !== targetLang) {
      // Para HTML, insertar mensaje al inicio
      if (text.includes('<')) {
        translatedText = `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; margin: 10px 0; border-radius: 5px;">
            <strong>💡 Modo de Demostración:</strong> Para obtener traducciones completas y precisas, 
            configura tu API key de Google Translate en las variables de entorno. 
            Esta es una traducción parcial de demostración.
          </div>
          ${translatedText}
        `;
      }
    }

    return translatedText;
  }, []);

  /**
   * Función para traducir por lotes (más eficiente)
   */
  const translateBatch = useCallback(async (textArray, sourceLang = 'en', targetLang = 'es') => {
    setIsTranslating(true);
    setError(null);

    try {
      const translations = await Promise.all(
        textArray.map(text => translate(text, sourceLang, targetLang))
      );
      return translations;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsTranslating(false);
    }
  }, [translate]);

  /**
   * Función para limpiar caché (útil para liberar memoria)
   */
  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  /**
   * Función para obtener idiomas soportados
   */
  const getSupportedLanguages = useCallback(() => {
    return [
      { code: 'en', name: 'Inglés', nativeName: 'English' },
      { code: 'es', name: 'Español', nativeName: 'Español' },
      { code: 'de', name: 'Alemán', nativeName: 'Deutsch' },
      { code: 'fr', name: 'Francés', nativeName: 'Français' },
      { code: 'it', name: 'Italiano', nativeName: 'Italiano' },
      { code: 'pt', name: 'Portugués', nativeName: 'Português' },
      { code: 'ru', name: 'Ruso', nativeName: 'Русский' },
      { code: 'ja', name: 'Japonés', nativeName: '日本語' },
      { code: 'ko', name: 'Coreano', nativeName: '한국어' },
      { code: 'zh', name: 'Chino', nativeName: '中文' }
    ];
  }, []);

  return {
    translate,
    translateBatch,
    isTranslating,
    error,
    clearCache,
    getSupportedLanguages,
    cacheSize: cache.size
  };
};

export default useTranslationAPI;