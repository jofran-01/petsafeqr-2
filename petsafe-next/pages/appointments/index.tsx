// pages/appointments/index.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';

interface Appointment {
  id: string;
  petName: string;
  ownerName: string;
  dateTime: string;
  status: string;
  pet?: {
    id: string;
    name: string;
  };
}

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, canceled
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/appointments');
        
        if (!res.ok) {
          throw new Error('Erro ao buscar agendamentos');
        }
        
        const data = await res.json();
        setAppointments(data);
      } catch (err: any) {
        console.error('Erro ao buscar agendamentos:', err);
        setError(err.message || 'Erro ao buscar agendamentos');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        throw new Error('Erro ao atualizar status');
      }
      
      // Atualizar a lista de agendamentos
      setAppointments(appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus } 
          : appointment
      ));
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
      setError(err.message || 'Erro ao atualizar status');
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-yellow-100 text-yellow-800">Pendente</span>;
      case 'confirmed':
        return <span className="badge bg-green-100 text-green-800">Confirmado</span>;
      case 'canceled':
        return <span className="badge bg-red-100 text-red-800">Cancelado</span>;
      default:
        return <span className="badge bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <MainLayout title="Agendamentos">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Gerenciamento de Agendamentos</h1>
        <button 
          onClick={() => router.push('/appointments/new')}
          className="btn-primary"
        >
          <i className="fas fa-plus mr-2"></i> Novo Agendamento
        </button>
      </div>
      
      {error && (
        <div className="alert-danger mb-6">
          {error}
        </div>
      )}
      
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div>
            <label htmlFor="filter" className="form-label">Filtrar por Status</label>
            <select
              id="filter"
              className="form-input"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Todos os agendamentos</option>
              <option value="pending">Pendentes</option>
              <option value="confirmed">Confirmados</option>
              <option value="canceled">Cancelados</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data e Hora</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutor</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(appointment.dateTime).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointment.pet ? (
                        <a 
                          href={`/pets/${appointment.pet.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {appointment.pet.name}
                        </a>
                      ) : (
                        appointment.petName
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{appointment.ownerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                              title="Confirmar"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                            <button 
                              onClick={() => handleStatusChange(appointment.id, 'canceled')}
                              className="text-red-600 hover:text-red-900"
                              title="Cancelar"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button 
                            onClick={() => handleStatusChange(appointment.id, 'canceled')}
                            className="text-red-600 hover:text-red-900"
                            title="Cancelar"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                        {appointment.status === 'canceled' && (
                          <button 
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900"
                            title="Reativar"
                          >
                            <i className="fas fa-redo"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AppointmentsPage;
