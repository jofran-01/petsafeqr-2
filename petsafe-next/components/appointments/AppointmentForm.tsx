// components/appointments/AppointmentForm.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

interface AppointmentFormProps {
  petId?: string;
  petName?: string;
  ownerName?: string;
  ownerPhone?: string;
  isPublic?: boolean;
  clinicId?: string;
  onSuccess?: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  petId, 
  petName = '', 
  ownerName = '', 
  ownerPhone = '', 
  isPublic = false,
  clinicId,
  onSuccess 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      petName,
      ownerName,
      ownerPhone,
      dateTime: '',
      notes: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const url = isPublic ? `/api/appointments?public=true` : '/api/appointments';
      
      const payload = {
        ...data,
        petId: petId || null,
        clinicId: isPublic ? clinicId : undefined
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao agendar consulta');
      }

      setSuccess(true);
      
      if (onSuccess) {
        onSuccess();
      } else if (!isPublic) {
        router.push('/appointments');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert-success" role="alert">
          <p>Agendamento realizado com sucesso!</p>
          {isPublic && (
            <p className="mt-2">Entraremos em contato para confirmar sua consulta.</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="petName" className="form-label">Nome do Animal*</label>
            <input
              id="petName"
              type="text"
              className={`form-input ${errors.petName ? 'border-red-500' : ''}`}
              {...register('petName', { required: 'Nome do animal é obrigatório' })}
              disabled={!!petName}
            />
            {errors.petName && (
              <p className="mt-1 text-sm text-red-600">{errors.petName.message?.toString()}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="ownerName" className="form-label">Nome do Tutor*</label>
            <input
              id="ownerName"
              type="text"
              className={`form-input ${errors.ownerName ? 'border-red-500' : ''}`}
              {...register('ownerName', { required: 'Nome do tutor é obrigatório' })}
              disabled={!!ownerName}
            />
            {errors.ownerName && (
              <p className="mt-1 text-sm text-red-600">{errors.ownerName.message?.toString()}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="ownerPhone" className="form-label">Telefone do Tutor*</label>
            <input
              id="ownerPhone"
              type="text"
              className={`form-input ${errors.ownerPhone ? 'border-red-500' : ''}`}
              {...register('ownerPhone', { required: 'Telefone do tutor é obrigatório' })}
              disabled={!!ownerPhone}
            />
            {errors.ownerPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.ownerPhone.message?.toString()}</p>
            )}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <label htmlFor="dateTime" className="form-label">Data e Hora*</label>
            <input
              id="dateTime"
              type="datetime-local"
              className={`form-input ${errors.dateTime ? 'border-red-500' : ''}`}
              {...register('dateTime', { required: 'Data e hora são obrigatórios' })}
            />
            {errors.dateTime && (
              <p className="mt-1 text-sm text-red-600">{errors.dateTime.message?.toString()}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="notes" className="form-label">Observações</label>
            <textarea
              id="notes"
              rows={4}
              className="form-input"
              {...register('notes')}
              placeholder="Descreva o motivo da consulta ou outras informações relevantes"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {!isPublic && (
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="btn-primary"
          disabled={loading || success}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Agendando...
            </span>
          ) : (
            'Agendar Consulta'
          )}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;
