import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para manejar marcadores de libros
 * Guarda marcadores en localStorage con sincronización opcional con Firebase
 */
const useBookmarks = (bookId) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clave para localStorage
  const storageKey = `libroglot_bookmarks_${bookId}`;

  // Cargar marcadores al inicializar
  useEffect(() => {
    const loadBookmarks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Cargar desde localStorage
        const savedBookmarks = localStorage.getItem(storageKey);
        if (savedBookmarks) {
          const parsed = JSON.parse(savedBookmarks);
          setBookmarks(parsed);
        }

        // TODO: En una implementación completa, también cargaríamos desde Firebase
        // const firebaseBookmarks = await loadFromFirebase(bookId);
        // if (firebaseBookmarks) {
        //   setBookmarks(firebaseBookmarks);
        // }

      } catch (err) {
        console.error('Error loading bookmarks:', err);
        setError('Error al cargar marcadores');
      } finally {
        setIsLoading(false);
      }
    };

    if (bookId) {
      loadBookmarks();
    }
  }, [bookId, storageKey]);

  // Guardar marcadores en localStorage
  const saveBookmarks = useCallback((newBookmarks) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newBookmarks));
      
      // TODO: También guardar en Firebase en implementación completa
      // await saveToFirebase(bookId, newBookmarks);
      
    } catch (err) {
      console.error('Error saving bookmarks:', err);
      setError('Error al guardar marcadores');
    }
  }, [storageKey]);

  // Agregar marcador
  const addBookmark = useCallback((pageNumber, title = '', note = '', selectedText = '') => {
    const newBookmark = {
      id: Date.now().toString(),
      bookId,
      page: pageNumber,
      title: title || `Marcador - Página ${pageNumber}`,
      note,
      selectedText,
      timestamp: new Date().toISOString(),
      color: 'yellow' // Color por defecto
    };

    setBookmarks(prev => {
      // Verificar que no exista ya un marcador en esa página
      const existingBookmark = prev.find(bookmark => bookmark.page === pageNumber);
      if (existingBookmark) {
        // Actualizar marcador existente
        const updated = prev.map(bookmark =>
          bookmark.page === pageNumber
            ? { ...bookmark, title: newBookmark.title, note, selectedText, timestamp: newBookmark.timestamp }
            : bookmark
        );
        saveBookmarks(updated);
        return updated;
      } else {
        // Agregar nuevo marcador
        const updated = [...prev, newBookmark].sort((a, b) => a.page - b.page);
        saveBookmarks(updated);
        return updated;
      }
    });

    return newBookmark;
  }, [bookId, saveBookmarks]);

  // Eliminar marcador
  const removeBookmark = useCallback((bookmarkId) => {
    setBookmarks(prev => {
      const updated = prev.filter(bookmark => bookmark.id !== bookmarkId);
      saveBookmarks(updated);
      return updated;
    });
  }, [saveBookmarks]);

  // Eliminar marcador por página
  const removeBookmarkByPage = useCallback((pageNumber) => {
    setBookmarks(prev => {
      const updated = prev.filter(bookmark => bookmark.page !== pageNumber);
      saveBookmarks(updated);
      return updated;
    });
  }, [saveBookmarks]);

  // Actualizar marcador
  const updateBookmark = useCallback((bookmarkId, updates) => {
    setBookmarks(prev => {
      const updated = prev.map(bookmark =>
        bookmark.id === bookmarkId
          ? { ...bookmark, ...updates, updatedAt: new Date().toISOString() }
          : bookmark
      );
      saveBookmarks(updated);
      return updated;
    });
  }, [saveBookmarks]);

  // Verificar si una página tiene marcador
  const hasBookmark = useCallback((pageNumber) => {
    return bookmarks.some(bookmark => bookmark.page === pageNumber);
  }, [bookmarks]);

  // Obtener marcador por página
  const getBookmarkByPage = useCallback((pageNumber) => {
    return bookmarks.find(bookmark => bookmark.page === pageNumber);
  }, [bookmarks]);

  // Obtener marcadores ordenados por página
  const getSortedBookmarks = useCallback(() => {
    return [...bookmarks].sort((a, b) => a.page - b.page);
  }, [bookmarks]);

  // Obtener próximo marcador desde página actual
  const getNextBookmark = useCallback((currentPage) => {
    const sortedBookmarks = getSortedBookmarks();
    return sortedBookmarks.find(bookmark => bookmark.page > currentPage);
  }, [getSortedBookmarks]);

  // Obtener marcador anterior desde página actual
  const getPreviousBookmark = useCallback((currentPage) => {
    const sortedBookmarks = getSortedBookmarks();
    const reversed = [...sortedBookmarks].reverse();
    return reversed.find(bookmark => bookmark.page < currentPage);
  }, [getSortedBookmarks]);

  // Exportar marcadores
  const exportBookmarks = useCallback(() => {
    const exportData = {
      bookId,
      bookmarks,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookmarks_${bookId}_${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [bookId, bookmarks]);

  // Importar marcadores
  const importBookmarks = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          
          if (importData.bookmarks && Array.isArray(importData.bookmarks)) {
            // Validar estructura de marcadores
            const validBookmarks = importData.bookmarks.filter(bookmark =>
              bookmark.id && bookmark.page && bookmark.title
            );
            
            if (validBookmarks.length > 0) {
              setBookmarks(validBookmarks);
              saveBookmarks(validBookmarks);
              resolve(validBookmarks.length);
            } else {
              reject('No se encontraron marcadores válidos en el archivo');
            }
          } else {
            reject('Formato de archivo inválido');
          }
        } catch (err) {
          reject('Error al leer el archivo: ' + err.message);
        }
      };
      
      reader.onerror = () => {
        reject('Error al leer el archivo');
      };
      
      reader.readAsText(file);
    });
  }, [saveBookmarks]);

  // Limpiar todos los marcadores
  const clearAllBookmarks = useCallback(() => {
    setBookmarks([]);
    saveBookmarks([]);
  }, [saveBookmarks]);

  // Obtener estadísticas de marcadores
  const getBookmarkStats = useCallback(() => {
    const total = bookmarks.length;
    const withNotes = bookmarks.filter(b => b.note && b.note.trim()).length;
    const withSelectedText = bookmarks.filter(b => b.selectedText && b.selectedText.trim()).length;
    const colors = bookmarks.reduce((acc, b) => {
      acc[b.color] = (acc[b.color] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      withNotes,
      withSelectedText,
      colors,
      lastAdded: bookmarks.length > 0 ? 
        Math.max(...bookmarks.map(b => new Date(b.timestamp).getTime())) : null
    };
  }, [bookmarks]);

  return {
    bookmarks: getSortedBookmarks(),
    isLoading,
    error,
    addBookmark,
    removeBookmark,
    removeBookmarkByPage,
    updateBookmark,
    hasBookmark,
    getBookmarkByPage,
    getNextBookmark,
    getPreviousBookmark,
    exportBookmarks,
    importBookmarks,
    clearAllBookmarks,
    getBookmarkStats
  };
};

export default useBookmarks;