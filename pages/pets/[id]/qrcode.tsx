// pages/pets/[id]/qrcode.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../../components/layout/MainLayout';
import QRCodeGenerator from '../../../components/qrcode/QRCodeGenerator';

const PetQRCodePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // URL base para o QR Code
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const res = await fetch(`/api/pets/${id}`);
        
        if (!res.ok) {
          throw new Error('Erro ao buscar dados do animal');
        }
        
        const data = await res.json();
        setPet(data);
      } catch (err: any) {
        console.error('Erro ao buscar animal:', err);
        setError(err.message || 'Erro ao buscar animal');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  if (loading) {
    return (
      <MainLayout title="QR Code">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="QR Code">
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
      <MainLayout title="QR Code">
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
    <MainLayout title={`QR Code - ${pet.name}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">QR Code de {pet.name}</h1>
        <p className="text-gray-600">Escaneie para acessar informações do animal</p>
      </div>
      
      <div className="card flex flex-col items-center py-8">
        <QRCodeGenerator 
          petId={pet.id} 
          petName={pet.name} 
          baseUrl={baseUrl} 
        />
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => window.print()}
            className="btn-primary"
          >
            <i className="fas fa-print mr-2"></i> Imprimir QR Code
          </button>
          
          <button 
            onClick={() => router.push(`/pets/${id}/card`)}
            className="btn-primary"
          >
            <i className="fas fa-id-card mr-2"></i> Gerar Carteirinha
          </button>
          
          <button 
            onClick={() => router.push(`/pets/${id}`)}
            className="btn-secondary"
          >
            <i className="fas fa-arrow-left mr-2"></i> Voltar
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default PetQRCodePage;
