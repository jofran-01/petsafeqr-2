// pages/pets/[id]/card.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../../components/layout/MainLayout';
import QRCodeGenerator from '../../../components/qrcode/QRCodeGenerator';

const PetCardPage: React.FC = () => {
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
      <MainLayout title="Carteirinha">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Carteirinha">
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
      <MainLayout title="Carteirinha">
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
    <MainLayout title={`Carteirinha - ${pet.name}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Carteirinha de {pet.name}</h1>
        <p className="text-gray-600">Carteirinha digital do animal</p>
      </div>
      
      <div className="card">
        <div id="pet-card" className="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg border-2 border-indigo-600 print:border-0">
          <div className="bg-indigo-600 text-white p-4 text-center">
            <h2 className="text-2xl font-bold">CARTEIRINHA PET</h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-200">
                  <img 
                    src={pet.photo || '/images/pet-placeholder.jpg'} 
                    alt={pet.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-2/3 md:pl-6">
                <h3 className="text-xl font-bold text-indigo-800">{pet.name}</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-gray-500 text-sm">Espécie</p>
                    <p className="font-medium">{pet.species}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Raça</p>
                    <p className="font-medium">{pet.breed}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Sexo</p>
                    <p className="font-medium">{pet.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Idade</p>
                    <p className="font-medium">{pet.age}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <hr className="my-4 border-gray-200" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-indigo-800 mb-2">Informações do Tutor</h4>
                <p><span className="text-gray-500">Nome:</span> {pet.ownerName}</p>
                <p><span className="text-gray-500">Telefone:</span> {pet.ownerPhone}</p>
              </div>
              
              <div className="flex justify-center items-center">
                <QRCodeGenerator 
                  petId={pet.id} 
                  petName={pet.name} 
                  baseUrl={baseUrl} 
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 text-center text-sm text-gray-600">
            <p>Escaneie o QR Code para acessar informações completas do animal</p>
            <p className="mt-1">PetSafe QR - Sistema de Gerenciamento para Clínicas Veterinárias</p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => window.print()}
            className="btn-primary"
          >
            <i className="fas fa-print mr-2"></i> Imprimir Carteirinha
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default PetCardPage;
