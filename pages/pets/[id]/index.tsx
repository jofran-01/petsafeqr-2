// pages/pets/[id]/index.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../../components/layout/MainLayout';
import Link from 'next/link';

const PetDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este animal?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/pets/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Erro ao excluir animal');
      }
      
      router.push('/pets');
    } catch (err: any) {
      console.error('Erro ao excluir animal:', err);
      setError(err.message || 'Erro ao excluir animal');
    }
  };

  const handleToggleLostStatus = async () => {
    try {
      const res = await fetch('/api/pets/lost', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: id,
          lostStatus: !pet.lostStatus,
        }),
      });
      
      if (!res.ok) {
        throw new Error('Erro ao atualizar status do animal');
      }
      
      const data = await res.json();
      setPet({
        ...pet,
        lostStatus: data.lostStatus,
      });
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
      setError(err.message || 'Erro ao atualizar status');
    }
  };

  if (loading) {
    return (
      <MainLayout title="Detalhes do Animal">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Detalhes do Animal">
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
      <MainLayout title="Detalhes do Animal">
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
    <MainLayout title={`${pet.name} - Detalhes`}>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{pet.name}</h1>
          <p className="text-gray-600">{pet.species} - {pet.breed}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Link href={`/pets/${id}/edit`} className="btn-primary">
            <i className="fas fa-edit mr-2"></i> Editar
          </Link>
          <Link href={`/pets/${id}/qrcode`} className="btn-primary">
            <i className="fas fa-qrcode mr-2"></i> QR Code
          </Link>
          <Link href={`/pets/${id}/documents`} className="btn-primary">
            <i className="fas fa-file-medical mr-2"></i> Documentos
          </Link>
          <button 
            onClick={handleToggleLostStatus}
            className={`${pet.lostStatus ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-2 px-4 rounded`}
          >
            <i className={`fas ${pet.lostStatus ? 'fa-check' : 'fa-search'} mr-2`}></i>
            {pet.lostStatus ? 'Marcar como Encontrado' : 'Marcar como Perdido'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="relative">
              <img 
                src={pet.photo || '/images/pet-placeholder.jpg'} 
                alt={pet.name} 
                className="w-full h-64 object-cover rounded-t-lg"
              />
              {pet.lostStatus && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  PERDIDO
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-bold text-center mb-4">{pet.name}</h3>
              
              <div className="flex justify-center space-x-4 mb-4">
                <Link href={`/pets/${id}/card`} className="text-indigo-600 hover:text-indigo-800">
                  <i className="fas fa-id-card mr-1"></i> Carteirinha
                </Link>
                <Link href={`/pets/${id}/appointments`} className="text-indigo-600 hover:text-indigo-800">
                  <i className="fas fa-calendar-alt mr-1"></i> Agendamentos
                </Link>
              </div>
              
              <button 
                onClick={handleDelete}
                className="w-full btn-danger mt-4"
              >
                <i className="fas fa-trash mr-2"></i> Excluir Animal
              </button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h3 className="text-xl font-bold mb-4">Informações do Animal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <p className="text-gray-500 text-sm">Cor</p>
                <p className="font-medium">{pet.color}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <p className="font-medium">
                  {pet.lostStatus ? (
                    <span className="badge badge-lost">Perdido</span>
                  ) : (
                    <span className="badge badge-normal">Normal</span>
                  )}
                </p>
              </div>
            </div>
            
            {pet.observations && (
              <div className="mt-4">
                <p className="text-gray-500 text-sm">Observações</p>
                <p className="font-medium whitespace-pre-line">{pet.observations}</p>
              </div>
            )}
          </div>
          
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Informações do Tutor</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Nome</p>
                <p className="font-medium">{pet.ownerName}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Telefone</p>
                <p className="font-medium">{pet.ownerPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PetDetailsPage;
