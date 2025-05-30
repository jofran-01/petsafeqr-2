// pages/p/[id].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import QRCode from 'qrcode.react';
import AppointmentForm from '../../components/appointments/AppointmentForm';

const PublicPetPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [pet, setPet] = useState<any>(null);
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('info'); // info, appointment
  
  // URL atual para o QR Code
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    const fetchPetData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Em um ambiente real, este seria um endpoint público específico
        // Aqui estamos simulando com o endpoint existente
        const res = await fetch(`/api/pets/${id}`);
        
        if (!res.ok) {
          throw new Error('Erro ao buscar dados do animal');
        }
        
        const data = await res.json();
        setPet(data);
        
        // Buscar dados da clínica
        const clinicRes = await fetch(`/api/clinics/${data.clinicId}`);
        if (clinicRes.ok) {
          const clinicData = await clinicRes.json();
          setClinic(clinicData);
        }
      } catch (err: any) {
        console.error('Erro ao buscar animal:', err);
        setError(err.message || 'Erro ao buscar animal');
      } finally {
        setLoading(false);
      }
    };

    fetchPetData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <i className="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Animal não encontrado</h1>
          <p className="text-gray-600 mb-6">
            {error || 'Não foi possível encontrar informações sobre este animal.'}
          </p>
          <Link href="/" className="btn-primary inline-block">
            Voltar para Página Inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-paw text-2xl mr-2"></i>
            <h1 className="text-xl font-bold">PetSafe QR</h1>
          </div>
          {clinic && (
            <div className="text-sm text-right">
              <p className="font-medium">{clinic.name}</p>
              <p>{clinic.phone}</p>
            </div>
          )}
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="relative">
            <img 
              src={pet.photo || '/images/pet-placeholder.jpg'} 
              alt={pet.name} 
              className="w-full h-48 object-cover"
            />
            {pet.lostStatus && (
              <div className="absolute inset-0 bg-red-500 bg-opacity-70 flex flex-col items-center justify-center text-white">
                <i className="fas fa-exclamation-triangle text-4xl mb-2"></i>
                <h2 className="text-2xl font-bold">ANIMAL PERDIDO</h2>
                <p className="text-lg">Por favor, entre em contato!</p>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{pet.name}</h1>
              {pet.lostStatus && (
                <span className="badge badge-lost mt-2 md:mt-0">PERDIDO</span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-3 text-indigo-700">Informações do Animal</h2>
                <div className="grid grid-cols-2 gap-3">
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
                </div>
                
                {pet.observations && (
                  <div className="mt-4">
                    <p className="text-gray-500 text-sm">Observações</p>
                    <p className="font-medium whitespace-pre-line">{pet.observations}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-3 text-indigo-700">Informações do Tutor</h2>
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">Nome</p>
                  <p className="font-medium">{pet.ownerName}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">Telefone</p>
                  <p className="font-medium">{pet.ownerPhone}</p>
                </div>
                
                <div className="flex flex-col items-center mt-6">
                  <a 
                    href={`tel:${pet.ownerPhone}`}
                    className="btn-primary w-full text-center mb-3"
                  >
                    <i className="fas fa-phone-alt mr-2"></i> Ligar para o Tutor
                  </a>
                  
                  {pet.lostStatus && (
                    <p className="text-red-600 text-sm font-medium mt-2">
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      Este animal está perdido. Por favor, entre em contato se o encontrou!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'info'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('info')}
              >
                <i className="fas fa-qrcode mr-2"></i> QR Code
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'appointment'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('appointment')}
              >
                <i className="fas fa-calendar-alt mr-2"></i> Agendar Consulta
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'info' && (
              <div className="flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-4 text-center">QR Code de {pet.name}</h2>
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <QRCode 
                    value={currentUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                    renderAs="svg"
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Escaneie este QR Code para acessar as informações de {pet.name} a qualquer momento.
                </p>
              </div>
            )}
            
            {activeTab === 'appointment' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Agendar Consulta para {pet.name}</h2>
                <AppointmentForm 
                  petId={pet.id}
                  petName={pet.name}
                  ownerName={pet.ownerName}
                  ownerPhone={pet.ownerPhone}
                  isPublic={true}
                  clinicId={pet.clinicId}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        <p>PetSafe QR &copy; 2025 - Sistema de Gerenciamento para Clínicas Veterinárias</p>
      </footer>
    </div>
  );
};

export default PublicPetPage;
