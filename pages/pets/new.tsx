// pages/pets/new.tsx
import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import PetForm from '../../components/pets/PetForm';

const NewPetPage: React.FC = () => {
  return (
    <MainLayout title="Cadastrar Animal">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Cadastrar Novo Animal</h1>
        <p className="text-gray-600">Preencha os dados do animal e do tutor</p>
      </div>
      
      <div className="card">
        <PetForm />
      </div>
    </MainLayout>
  );
};

export default NewPetPage;
