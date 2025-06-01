import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Componentes estilizados
const NotesContainer = styled.div`
  padding: ${props => props.theme.spacing(6)};
  background-color: ${props => props.theme.colors.surface};
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const NotesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing(6)};
  padding-bottom: ${props => props.theme.spacing(3)};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const NotesTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.primary};
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(2)};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: ${props => props.theme.colors.textLight};
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: ${props => props.theme.spacing(4)};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button`
  flex: 1;
  padding: ${props => props.theme.spacing(3)} ${props => props.theme.spacing(4)};
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textLight};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const AddNoteSection = styled.div`
  margin-bottom: ${props => props.theme.spacing(6)};
  padding: ${props => props.theme.spacing(4)};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: ${props => props.theme.spacing(3)};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight + '44'};
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing(2)};
  margin-top: ${props => props.theme.spacing(3)};
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing(2)} ${props => props.theme.spacing(4)};
  border: 1px solid ${props => props.primary ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.primary ? props.theme.colors.primary : 'white'};
  color: ${props => props.primary ? 'white' : props.theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.primary ? props.theme.colors.primaryDark : props.theme.colors.background};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NotesListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const NoteItem = styled.div`
  padding: ${props => props.theme.spacing(4)};
  border-bottom: 1px solid ${props => props.theme.colors.border + '44'};
  background-color: ${props => props.isBookmark ? props.theme.colors.warning + '22' : 'transparent'};
  border-left: ${props => props.isBookmark ? `3px solid ${props.theme.colors.warning}` : 'none'};
  margin-bottom: ${props => props.theme.spacing(2)};
  border-radius: ${props => props.theme.borderRadius.small};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing(2)};
`;

const NoteType = styled.span`
  background-color: ${props => props.isBookmark ? props.theme.colors.warning : props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing(1)} ${props => props.theme.spacing(2)};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.8rem;
  font-weight: 600;
`;

const NoteActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing(1)};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${props => props.theme.spacing(1)};
  border-radius: ${props => props.theme.borderRadius.small};
  color: ${props => props.theme.colors.textLight};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.danger ? props.theme.colors.error : props.theme.colors.text};
  }
`;

const NoteContent = styled.div`
  margin-bottom: ${props => props.theme.spacing(2)};
  line-height: 1.5;
  color: ${props => props.theme.colors.text};
`;

const NoteMeta = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textLight};
  display: flex;
  justify-content: between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing(2)};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing(8)};
  color: ${props => props.theme.colors.textLight};
  
  .icon {
    font-size: 2rem;
    margin-bottom: ${props => props.theme.spacing(4)};
  }
`;

const BookmarkButton = styled.button`
  position: fixed;
  bottom: ${props => props.theme.spacing(6)};
  right: ${props => props.theme.spacing(6)};
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.medium};
  transition: all 0.2s ease;
  z-index: 1000;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondaryDark};
    transform: scale(1.1);
  }
`;

// Hook para manejar notas y marcadores
const useNotesAndBookmarks = (bookId, currentPage) => {
  const [notes, setNotes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  // Cargar notas y marcadores al inicializar
  useEffect(() => {
    const loadData = () => {
      try {
        const savedNotes = localStorage.getItem(`libroglot_notes_${bookId}`);
        const savedBookmarks = localStorage.getItem(`libroglot_bookmarks_${bookId}`);
        
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }
        
        if (savedBookmarks) {
          setBookmarks(JSON.parse(savedBookmarks));
        }
      } catch (error) {
        console.error('Error loading notes and bookmarks:', error);
      }
    };

    loadData();
  }, [bookId]);

  // Guardar datos cuando cambien
  const saveData = (newNotes, newBookmarks) => {
    try {
      localStorage.setItem(`libroglot_notes_${bookId}`, JSON.stringify(newNotes));
      localStorage.setItem(`libroglot_bookmarks_${bookId}`, JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Error saving notes and bookmarks:', error);
    }
  };

  const addNote = (content, type = 'note') => {
    const newNote = {
      id: Date.now().toString(),
      content: content.trim(),
      type,
      page: currentPage,
      timestamp: new Date().toISOString(),
      bookId
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveData(updatedNotes, bookmarks);
    return newNote;
  };

  const addBookmark = (title = '') => {
    const bookmark = {
      id: Date.now().toString(),
      title: title || `Marcador - Página ${currentPage}`,
      page: currentPage,
      timestamp: new Date().toISOString(),
      bookId
    };

    const updatedBookmarks = [...bookmarks, bookmark];
    setBookmarks(updatedBookmarks);
    saveData(notes, updatedBookmarks);
    return bookmark;
  };

  const removeNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    saveData(updatedNotes, bookmarks);
  };

  const removeBookmark = (bookmarkId) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== bookmarkId);
    setBookmarks(updatedBookmarks);
    saveData(notes, updatedBookmarks);
  };

  const editNote = (noteId, newContent) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId 
        ? { ...note, content: newContent, editedAt: new Date().toISOString() }
        : note
    );
    setNotes(updatedNotes);
    saveData(updatedNotes, bookmarks);
  };

  return {
    notes,
    bookmarks,
    addNote,
    addBookmark,
    removeNote,
    removeBookmark,
    editNote
  };
};

// Componente principal
const NotesPanel = ({ bookId, currentPage, onClose, onNavigateToPage }) => {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' o 'bookmarks'
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const {
    notes,
    bookmarks,
    addNote,
    addBookmark,
    removeNote,
    removeBookmark,
    editNote
  } = useNotesAndBookmarks(bookId, currentPage);

  // Manejar agregar nota
  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      addNote(newNoteContent);
      setNewNoteContent('');
    }
  };

  // Manejar agregar marcador
  const handleAddBookmark = () => {
    addBookmark();
  };

  // Manejar edición de nota
  const handleStartEdit = (note) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const handleSaveEdit = () => {
    if (editingContent.trim()) {
      editNote(editingNoteId, editingContent);
    }
    setEditingNoteId(null);
    setEditingContent('');
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingContent('');
  };

  // Formatear fecha
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Combinar y ordenar elementos por timestamp
  const allItems = [
    ...notes.map(note => ({ ...note, type: 'note' })),
    ...bookmarks.map(bookmark => ({ ...bookmark, type: 'bookmark' }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Filtrar según tab activo
  const filteredItems = activeTab === 'all' 
    ? allItems 
    : allItems.filter(item => item.type === activeTab || (activeTab === 'bookmarks' && item.type === 'bookmark'));

  return (
    <>
      <NotesContainer>
        <NotesHeader>
          <NotesTitle>
            📝 Notas y Marcadores
          </NotesTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </NotesHeader>

        {/* Tabs */}
        <TabsContainer>
          <Tab 
            active={activeTab === 'notes'}
            onClick={() => setActiveTab('notes')}
          >
            📝 Notas ({notes.length})
          </Tab>
          <Tab 
            active={activeTab === 'bookmarks'}
            onClick={() => setActiveTab('bookmarks')}
          >
            🔖 Marcadores ({bookmarks.length})
          </Tab>
          <Tab 
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          >
            📚 Todo
          </Tab>
        </TabsContainer>

        {/* Sección para agregar nota */}
        {activeTab === 'notes' && (
          <AddNoteSection>
            <h4 style={{ marginBottom: '12px', color: '#666' }}>✍️ Nueva Nota</h4>
            <TextArea
              placeholder="Escribe tu nota aquí..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
            />
            <ButtonsRow>
              <Button 
                primary 
                onClick={handleAddNote}
                disabled={!newNoteContent.trim()}
              >
                💾 Guardar Nota
              </Button>
              <Button onClick={() => setNewNoteContent('')}>
                🗑️ Limpiar
              </Button>
            </ButtonsRow>
          </AddNoteSection>
        )}

        {/* Lista de elementos */}
        <NotesListContainer>
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <NoteItem key={item.id} isBookmark={item.type === 'bookmark'}>
                <NoteHeader>
                  <NoteType isBookmark={item.type === 'bookmark'}>
                    {item.type === 'bookmark' ? '🔖 Marcador' : '📝 Nota'}
                  </NoteType>
                  <NoteActions>
                    {item.type === 'note' && (
                      <ActionButton onClick={() => handleStartEdit(item)}>
                        ✏️
                      </ActionButton>
                    )}
                    <ActionButton 
                      danger
                      onClick={() => {
                        if (item.type === 'bookmark') {
                          removeBookmark(item.id);
                        } else {
                          removeNote(item.id);
                        }
                      }}
                    >
                      🗑️
                    </ActionButton>
                  </NoteActions>
                </NoteHeader>

                {editingNoteId === item.id ? (
                  <>
                    <TextArea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                    <ButtonsRow>
                      <Button primary onClick={handleSaveEdit}>
                        💾 Guardar
                      </Button>
                      <Button onClick={handleCancelEdit}>
                        ❌ Cancelar
                      </Button>
                    </ButtonsRow>
                  </>
                ) : (
                  <>
                    <NoteContent>
                      {item.type === 'bookmark' ? item.title : item.content}
                    </NoteContent>
                    <NoteMeta>
                      <span>📄 Página {item.page}</span>
                      <span>🕒 {formatDate(item.timestamp)}</span>
                      {item.editedAt && (
                        <span>✏️ Editado: {formatDate(item.editedAt)}</span>
                      )}
                      {onNavigateToPage && (
                        <Button 
                          onClick={() => onNavigateToPage(item.page)}
                          style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                        >
                          📍 Ir a página
                        </Button>
                      )}
                    </NoteMeta>
                  </>
                )}
              </NoteItem>
            ))
          ) : (
            <EmptyState>
              <div className="icon">
                {activeTab === 'notes' ? '📝' : activeTab === 'bookmarks' ? '🔖' : '📚'}
              </div>
              <p>
                {activeTab === 'notes' 
                  ? 'No hay notas guardadas'
                  : activeTab === 'bookmarks'
                  ? 'No hay marcadores guardados'
                  : 'No hay notas ni marcadores'
                }
              </p>
              <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>
                {activeTab === 'notes' 
                  ? 'Escribe una nota arriba para empezar'
                  : 'Usa el botón flotante para crear un marcador'
                }
              </p>
            </EmptyState>
          )}
        </NotesListContainer>
      </NotesContainer>

      {/* Botón flotante para agregar marcador */}
      {activeTab === 'bookmarks' && (
        <BookmarkButton onClick={handleAddBookmark} title="Agregar marcador">
          🔖
        </BookmarkButton>
      )}
    </>
  );
};

export default NotesPanel;