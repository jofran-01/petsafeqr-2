// pages/pets/[id]/documents.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../../components/layout/MainLayout';
import DocumentUploader from '../../../components/documents/DocumentUploader';

interface Document {
  id: string;
  name: string;
  filePath: string;
  fileType: string;
  uploadedAt: string;
}

const PetDocumentsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [pet, setPet] = useState<any>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // Buscar dados do animal
      const petRes = await fetch(`/api/pets/${id}`);
      if (!petRes.ok) {
        throw new Error('Erro ao buscar dados do animal');
      }
      const petData = await petRes.json();
      setPet(petData);
      
      // Buscar documentos do animal
      const docsRes = await fetch(`/api/documents?petId=${id}`);
      if (!docsRes.ok) {
        throw new Error('Erro ao buscar documentos');
      }
      const docsData = await docsRes.json();
      setDocuments(docsData);
    } catch (err: any) {
      console.error('Erro ao buscar dados:', err);
      setError(err.message || 'Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Erro ao excluir documento');
      }
      
      // Atualizar a lista de documentos
      setDocuments(documents.filter(doc => doc.id !== documentId));
    } catch (err: any) {
      console.error('Erro ao excluir documento:', err);
      setError(err.message || 'Erro ao excluir documento');
    }
  };

  if (loading) {
    return (
      <MainLayout title="Documentos">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Documentos">
        <div className="alert-danger">
          <p>{error}</p>
          <button 
            onClick={() => router.push('/pets')}
            className="btn-primary mt-4"
          >
            Voltar para Lista
          </button>
        </div>
      </MainLayout>
    );
  }

  if (!pet) {
    return (
      <MainLayout title="Documentos">
        <div className="text-center">
          <p className="text-gray-500">Animal não encontrado</p>
          <button 
            onClick={() => router.push('/pets')}
            className="btn-primary mt-4"
          >
            Voltar para Lista
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`Documentos - ${pet.name}`}>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{pet.name} - Documentos</h1>
          <p className="text-gray-600">Gerenciamento de documentos do animal</p>
        </div>
        
        <button 
          onClick={() => router.push(`/pets/${id}`)}
          className="btn-secondary mt-4 md:mt-0"
        >
          <i className="fas fa-arrow-left mr-2"></i> Voltar para Detalhes
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Upload de Documento</h3>
            <DocumentUploader 
              petId={id as string} 
              onUploadSuccess={fetchData} 
            />
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Documentos</h3>
            
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-file-alt text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">Nenhum documento cadastrado ainda.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Upload</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{doc.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {doc.fileType.includes('pdf') ? (
                            <span className="text-red-600"><i className="fas fa-file-pdf mr-2"></i>PDF</span>
                          ) : doc.fileType.includes('image') ? (
                            <span className="text-blue-600"><i className="fas fa-file-image mr-2"></i>Imagem</span>
                          ) : (
                            <span className="text-gray-600"><i className="fas fa-file mr-2"></i>Documento</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <a 
                              href={doc.filePath} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <i className="fas fa-eye"></i>
                            </a>
                            <button 
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PetDocumentsPage;
