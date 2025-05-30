// pages/dashboard/index.tsx
import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { useSession } from 'next-auth/react';

interface DashboardStats {
  totalPets: number;
  totalAppointments: number;
  pendingAppointments: number;
  lostPets: number;
}

const Dashboard: React.FC = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalPets: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    lostPets: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentPets, setRecentPets] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch('/api/dashboard/stats');
        const statsData = await statsRes.json();
        
        // Fetch recent pets
        const petsRes = await fetch('/api/pets?limit=5');
        const petsData = await petsRes.json();
        
        // Fetch upcoming appointments
        const appointmentsRes = await fetch('/api/appointments?status=pending&limit=5');
        const appointmentsData = await appointmentsRes.json();
        
        setStats(statsData);
        setRecentPets(petsData);
        setUpcomingAppointments(appointmentsData);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  if (loading) {
    return (
      <MainLayout title="Dashboard">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <i className="fas fa-paw text-2xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Animais</p>
              <p className="text-2xl font-bold">{stats.totalPets}</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <i className="fas fa-calendar-check text-2xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Consultas</p>
              <p className="text-2xl font-bold">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <i className="fas fa-clock text-2xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Consultas Pendentes</p>
              <p className="text-2xl font-bold">{stats.pendingAppointments}</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <i className="fas fa-search text-2xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Animais Perdidos</p>
              <p className="text-2xl font-bold">{stats.lostPets}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Animais Recentes</h2>
          {recentPets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espécie</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutor</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentPets.map((pet: any) => (
                    <tr key={pet.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{pet.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{pet.species}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{pet.ownerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pet.lostStatus ? (
                          <span className="badge badge-lost">Perdido</span>
                        ) : (
                          <span className="badge badge-normal">Normal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Nenhum animal cadastrado ainda.</p>
          )}
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Próximos Agendamentos</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutor</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingAppointments.map((appointment: any) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(appointment.dateTime).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{appointment.petName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{appointment.ownerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {appointment.status === 'pending' ? 'Pendente' : appointment.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Nenhum agendamento pendente.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
