// components/pets/PetCard.tsx
import React from 'react';
import { useRouter } from 'next/router';

interface PetCardProps {
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string;
    ownerName: string;
    photo?: string;
    lostStatus: boolean;
  };
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const router = useRouter();

  return (
    <div className="pet-card">
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
  );
};

export default PetCard;
