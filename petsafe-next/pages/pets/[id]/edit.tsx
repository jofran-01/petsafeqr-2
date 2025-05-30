// pages/pets/[id]/edit.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../../components/layout/MainLayout';
import PetForm from '../../../components/pets/PetForm';

const EditPetPage: React.FC = () => {
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

  if (loading) {
    return (
      <MainLayout title="Editar Animal">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Editar Animal">
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
      <MainLayout title="Editar Animal">
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
    <MainLayout title={`Editar ${pet.name}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar Animal</h1>
        <p className="text-gray-600">Atualize os dados do animal e do tutor</p>
      </div>
      
      <div className="card">
        <PetForm initialData={pet} isEditing={true} />
      </div>
    </MainLayout>
  );
};

export default EditPetPage;
