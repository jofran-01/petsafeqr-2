// components/documents/DocumentUploader.tsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DocumentUploaderProps {
  petId: string;
  onUploadSuccess: () => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ petId, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [documentName, setDocumentName] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    if (!documentName.trim()) {
      setError('Por favor, informe um nome para o documento');
      return;
    }

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', documentName);
    formData.append('petId', petId);

    try {
      setUploading(true);
      setError('');

      // Simulação de upload - em produção, usaria um endpoint real
      // Aqui estamos apenas simulando o envio para a API
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: JSON.stringify({
          petId,
          name: documentName,
          filePath: URL.createObjectURL(file), // Simulação - em produção seria o caminho real
          fileType: file.type
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer upload do documento');
      }

      setDocumentName('');
      onUploadSuccess();
    } catch (err: any) {
      console.error('Erro no upload:', err);
      setError(err.message || 'Erro ao fazer upload do documento');
    } finally {
      setUploading(false);
    }
  }, [petId, documentName, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    disabled: uploading || !documentName.trim()
  });

  return (
    <div className="mb-6">
      {error && (
        <div className="alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="documentName" className="form-label">Nome do Documento*</label>
        <input
          id="documentName"
          type="text"
          className="form-input"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder="Ex: Carteira de Vacinação, Exame de Sangue, etc."
          disabled={uploading}
        />
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
        } ${uploading || !documentName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
            <p>Enviando documento...</p>
          </div>
        ) : (
          <>
            <i className="fas fa-file-upload text-4xl text-indigo-500 mb-2"></i>
            <p className="text-gray-700">
              {isDragActive
                ? 'Solte o arquivo aqui...'
                : 'Arraste e solte um arquivo aqui, ou clique para selecionar'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Formatos aceitos: PDF, JPG, PNG
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentUploader;
