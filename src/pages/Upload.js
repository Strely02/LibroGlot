import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Componentes y estilos
const UploadContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing(10)};
`;

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing(10)};
`;

const UploadArea = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: ${props => props.theme.spacing(8)};
`;

const UploadBox = styled.div`
  border: 2px dashed ${props => props.isDragActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing(12)};
  text-align: center;
  cursor: pointer;
  transition: border-color ${props => props.theme.transitions.fast}, background-color ${props => props.theme.transitions.fast};
  background-color: ${props => props.isDragActive ? props.theme.colors.primaryLight + '22' : 'transparent'};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primaryLight + '11'};
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing(4)};
`;

const UploadText = styled.p`
  margin-bottom: ${props => props.theme.spacing(4)};
  color: ${props => props.theme.colors.textLight};
`;

const FileInput = styled.input`
  display: none;
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing(3)} ${props => props.theme.spacing(6)};
  font-weight: 600;
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.textLight};
    cursor: not-allowed;
  }
`;

const SupportedFormats = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
  margin-top: ${props => props.theme.spacing(4)};
`;

const Form = styled.form`
  margin-top: ${props => props.theme.spacing(8)};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing(6)};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing(2)};
  font-weight: 600;
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing(3)};
  border-radius: ${props => props.theme.borderRadius.medium};
  border: 1px solid ${props => props.theme.colors.border};
  background-color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight + '44'};
  }
`;

const FileName = styled.div`
  padding: ${props => props.theme.spacing(4)};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-top: ${props => props.theme.spacing(6)};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileNameText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.error};
  cursor: pointer;
  padding: ${props => props.theme.spacing(1)};
  margin-left: ${props => props.theme.spacing(2)};
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  padding: ${props => props.theme.spacing(4)};
  margin-top: ${props => props.theme.spacing(6)};
`;

const ProcessingState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing(8)};
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto ${props => props.theme.spacing(6)};
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [originalLanguage, setOriginalLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const navigate = useNavigate();

  // Función para manejar el arrastre de archivos
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  // Función para manejar la selección de archivos
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    // Verificar si el archivo es EPUB o PDF
    const fileType = file.type;
    if (fileType === 'application/epub+zip' || fileType === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Por favor, selecciona un archivo EPUB o PDF válido.');
    }
  };

  // Función para eliminar el archivo seleccionado
  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  // Función para procesar el archivo y navegar al lector
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setProcessingStep('Subiendo archivo...');
    
    // Simulamos un proceso de carga para demostración
    setTimeout(() => {
      setProcessingStep('Procesando libro...');
      
      setTimeout(() => {
        setProcessingStep('Preparando traducción...');
        
        setTimeout(() => {
          setProcessingStep('¡Listo! Redirigiendo al lector...');
          
          // Simular un ID de libro - en una implementación real, esto vendría del backend
          const bookId = 'kushiels-dart-' + Date.now();
          
          // Navegar al lector con el ID del libro
          setTimeout(() => {
            setIsProcessing(false);
            navigate(`/reader/${bookId}`);
          }, 1000);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  // Renderizar el estado de procesamiento
  if (isProcessing) {
    return (
      <UploadContainer>
        <ProcessingState>
          <LoadingSpinner />
          <h2>Procesando Tu Libro</h2>
          <p>{processingStep}</p>
          <p>Esto puede tomar unos momentos...</p>
        </ProcessingState>
      </UploadContainer>
    );
  }

  return (
    <UploadContainer>
      <PageTitle>Sube tu Libro</PageTitle>
      
      <UploadArea>
        <UploadBox
          isDragActive={isDragActive}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <UploadIcon>📚</UploadIcon>
          <UploadText>
            Arrastra y suelta tu archivo aquí o haz clic para seleccionar
          </UploadText>
          <Button as="span">Seleccionar Archivo</Button>
          <FileInput
            id="fileInput"
            type="file"
            accept=".epub,.pdf"
            onChange={handleFileChange}
          />
        </UploadBox>
        
        <SupportedFormats>
          Formatos soportados: EPUB, PDF
        </SupportedFormats>
        
        {selectedFile && (
          <FileName>
            <FileNameText>{selectedFile.name}</FileNameText>
            <RemoveFileButton onClick={handleRemoveFile}>
              Eliminar
            </RemoveFileButton>
          </FileName>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="originalLanguage">Idioma Original</Label>
            <Select
              id="originalLanguage"
              value={originalLanguage}
              onChange={(e) => setOriginalLanguage(e.target.value)}
            >
              <option value="en">Inglés</option>
              <option value="es">Español</option>
              <option value="de">Alemán</option>
              <option value="fr">Francés</option>
              <option value="it">Italiano</option>
              <option value="pt">Portugués</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="targetLanguage">Idioma de Traducción</Label>
            <Select
              id="targetLanguage"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="de">Alemán</option>
              <option value="fr">Francés</option>
              <option value="it">Italiano</option>
              <option value="pt">Portugués</option>
            </Select>
          </FormGroup>
          
          <SubmitButton type="submit" disabled={!selectedFile}>
            Comenzar Lectura Bilingüe
          </SubmitButton>
        </Form>
      </UploadArea>
    </UploadContainer>
  );
};

export default Upload;