// pages/pets/index.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import PetList from '../../components/pets/PetList';

const PetsPage: React.FC = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, lost
  const router = useRouter();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/pets');
        const data = await res.json();
        setPets(data);
      } catch (error) {
        console.error('Erro ao buscar animais:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const filteredPets = pets.filter((pet: any) => {
    // Filtrar por termo de busca
    const matchesSearch = 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por status (perdido ou todos)
    const matchesFilter = filter === 'all' || (filter === 'lost' && pet.lostStatus);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <MainLayout title="Animais">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Gerenciamento de Animais</h1>
        <button 
          onClick={() => router.push('/pets/new')}
          className="btn-primary"
        >
          <i className="fas fa-plus mr-2"></i> Cadastrar Animal
        </button>
      </div>
      
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Buscar</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                id="search"
                type="text"
                placeholder="Buscar por nome, tutor, espécie..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="filter" className="sr-only">Filtrar</label>
            <select
              id="filter"
              className="form-input"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Todos os animais</option>
              <option value="lost">Apenas perdidos</option>
            </select>
          </div>
        </div>
      </div>
      
      <PetList pets={filteredPets} loading={loading} />
    </MainLayout>
  );
};

export default PetsPage;
