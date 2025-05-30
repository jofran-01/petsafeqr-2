// pages/reports/index.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import { CSVLink } from 'react-csv';

const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [petsData, setPetsData] = useState<any[]>([]);
  const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
  const router = useRouter();

  const fetchPetsReport = async () => {
    try {
      setLoading(true);
      setError('');
      
      const res = await fetch('/api/reports/export?type=pets');
      
      if (!res.ok) {
        throw new Error('Erro ao gerar relatório de animais');
      }
      
      const data = await res.json();
      setPetsData(data);
    } catch (err: any) {
      console.error('Erro ao gerar relatório:', err);
      setError(err.message || 'Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentsReport = async () => {
    try {
      setLoading(true);
      setError('');
      
      const res = await fetch('/api/reports/export?type=appointments');
      
      if (!res.ok) {
        throw new Error('Erro ao gerar relatório de agendamentos');
      }
      
      const data = await res.json();
      setAppointmentsData(data);
    } catch (err: any) {
      console.error('Erro ao gerar relatório:', err);
      setError(err.message || 'Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const petsHeaders = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'nome' },
    { label: 'Espécie', key: 'especie' },
    { label: 'Raça', key: 'raca' },
    { label: 'Sexo', key: 'sexo' },
    { label: 'Idade', key: 'idade' },
    { label: 'Cor', key: 'cor' },
    { label: 'Nome do Tutor', key: 'nome_tutor' },
    { label: 'Telefone do Tutor', key: 'telefone_tutor' },
    { label: 'Status Perdido', key: 'status_perdido' },
    { label: 'Data de Cadastro', key: 'data_cadastro' }
  ];

  const appointmentsHeaders = [
    { label: 'ID', key: 'id' },
    { label: 'Data e Hora', key: 'data_hora' },
    { label: 'Nome do Animal', key: 'nome_pet' },
    { label: 'Nome do Tutor', key: 'nome_tutor' },
    { label: 'Telefone do Tutor', key: 'telefone_tutor' },
    { label: 'Status', key: 'status' },
    { label: 'Observações', key: 'observacoes' }
  ];

  return (
    <MainLayout title="Relatórios">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Relatórios e Exportação</h1>
        <p className="text-gray-600">Gere relatórios e exporte dados do sistema</p>
      </div>
      
      {error && (
        <div className="alert-danger mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Relatório de Animais</h2>
          <p className="text-gray-600 mb-4">
            Exporte a lista completa de animais cadastrados no sistema.
          </p>
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={fetchPetsReport}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando...
                </span>
              ) : (
                <span><i className="fas fa-sync-alt mr-2"></i> Gerar Relatório</span>
              )}
            </button>
            
            {petsData.length > 0 && (
              <CSVLink
                data={petsData}
                headers={petsHeaders}
                filename="relatorio_animais.csv"
                className="btn-success text-center"
              >
                <i className="fas fa-file-csv mr-2"></i> Baixar CSV
              </CSVLink>
            )}
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Relatório de Agendamentos</h2>
          <p className="text-gray-600 mb-4">
            Exporte a lista completa de agendamentos registrados no sistema.
          </p>
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={fetchAppointmentsReport}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando...
                </span>
              ) : (
                <span><i className="fas fa-sync-alt mr-2"></i> Gerar Relatório</span>
              )}
            </button>
            
            {appointmentsData.length > 0 && (
              <CSVLink
                data={appointmentsData}
                headers={appointmentsHeaders}
                filename="relatorio_agendamentos.csv"
                className="btn-success text-center"
              >
                <i className="fas fa-file-csv mr-2"></i> Baixar CSV
              </CSVLink>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;
