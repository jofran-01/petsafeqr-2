// pages/appointments/new.tsx
import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import AppointmentForm from '../../components/appointments/AppointmentForm';

const NewAppointmentPage: React.FC = () => {
  return (
    <MainLayout title="Novo Agendamento">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Agendar Nova Consulta</h1>
        <p className="text-gray-600">Preencha os dados para agendar uma consulta</p>
      </div>
      
      <div className="card">
        <AppointmentForm />
      </div>
    </MainLayout>
  );
};

export default NewAppointmentPage;
