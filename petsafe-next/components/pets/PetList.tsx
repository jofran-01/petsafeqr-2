// components/pets/PetList.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  ownerName: string;
  photo?: string;
  lostStatus: boolean;
}

interface PetListProps {
  pets: Pet[];
  loading: boolean;
}

const PetList: React.FC<PetListProps> = ({ pets, loading }) => {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="text-center p-8">
        <i className="fas fa-paw text-4xl text-gray-300 mb-4"></i>
        <p className="text-gray-500">Nenhum animal cadastrado ainda.</p>
        <Link href="/pets/new" className="btn-primary inline-block mt-4">
          <i className="fas fa-plus mr-2"></i> Cadastrar Animal
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map((pet) => (
        <div key={pet.id} className="pet-card">
          <div className="relative">
            <img 
              src={pet.photo || '/images/pet-placeholder.jpg'} 
              alt={pet.name} 
              className="pet-img"
            />
            {pet.lostStatus && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                PERDIDO
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
            <p className="text-gray-600">{pet.species} - {pet.breed}</p>
            <p className="text-gray-500 text-sm">Tutor: {pet.ownerName}</p>
            
            <div className="mt-4 flex justify-between">
              <button 
                onClick={() => router.push(`/pets/${pet.id}`)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                <i className="fas fa-eye mr-1"></i> Detalhes
              </button>
              <button 
                onClick={() => router.push(`/pets/${pet.id}/qrcode`)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                <i className="fas fa-qrcode mr-1"></i> QR Code
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetList;
