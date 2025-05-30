// components/pets/PetForm.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

interface PetFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const PetForm: React.FC<PetFormProps> = ({ initialData = {}, isEditing = false }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError('');

      const url = isEditing ? `/api/pets/${initialData.id}` : '/api/pets';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar animal');
      }

      router.push('/pets');
    } catch (err: any) {
      setError(err.message);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Informações do Animal</h3>
          
          <div className="mb-4">
            <label htmlFor="name" className="form-label">Nome*</label>
            <input
              id="name"
              type="text"
              className={`form-input ${errors.name ? 'border-red-500' : ''}`}
              {...register('name', { required: 'Nome é obrigatório' })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message?.toString()}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="species" className="form-label">Espécie*</label>
            <select
              id="species"
              className={`form-input ${errors.species ? 'border-red-500' : ''}`}
              {...register('species', { required: 'Espécie é obrigatória' })}
            >
              <option value="">Selecione</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
              <option value="Ave">Ave</option>
              <option value="Roedor">Roedor</option>
              <option value="Réptil">Réptil</option>
              <option value="Outro">Outro</option>
            </select>
            {errors.species && (
              <p className="mt-1 text-sm text-red-600">{errors.species.message?.toString()}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="breed" className="form-label">Raça*</label>
            <input
              id="breed"
              type="text"
              className={`form-input ${errors.breed ? 'border-red-500' : ''}`}
              {...register('breed', { required: 'Raça é obrigatória' })}
            />
            {errors.breed && (
              <p className="mt-1 text-sm text-red-600">{errors.breed.message?.toString()}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="gender" className="form-label">Sexo*</label>
            <select
              id="gender"
              className={`form-input ${errors.gender ? 'border-red-500' : ''}`}
              {...register('gender', { required: 'Sexo é obrigatório' })}
            >
              <option value="">Selecione</option>
              <option value="Macho">Macho</option>
              <option value="Fêmea">Fêmea</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender.message?.toString()}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="age" className="form-label">Idade*</label>
            <input
              id="age"
              type="text"
              className={`form-input ${errors.age ? 'border-red-500' : ''}`}
              {...register('age', { required: 'Idade é obrigatória' })}
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age.message?.toString()}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="color" className="form-label">Cor*</label>
            <input
              id="color"
              type="text"
              className={`form-input ${errors.color ? 'border-red-500' : ''}`}
              {...register('color', { required: 'Cor é obrigatória' })}
            />
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">{errors.color.message?.toString()}</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Informações do Tutor</h3>
          
          <div className="mb-4">
            <label htmlFor="ownerName" className="form-label">Nome do Tutor*</label>
            <input
              id="ownerName"
              type="text"
              className={`form-input ${errors.ownerName ? 'border-red-500' : ''}`}
              {...register('ownerName', { required: 'Nome do tutor é obrigatório' })}
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
            />
            {errors.ownerPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.ownerPhone.message?.toString()}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="photo" className="form-label">Foto (URL)</label>
            <input
              id="photo"
              type="text"
              className="form-input"
              {...register('photo')}
            />
            <p className="mt-1 text-sm text-gray-500">URL da imagem do animal</p>
          </div>

          <div className="mb-4">
            <label htmlFor="observations" className="form-label">Observações</label>
            <textarea
              id="observations"
              rows={4}
              className="form-input"
              {...register('observations')}
            ></textarea>
          </div>

          {isEditing && (
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  id="lostStatus"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  {...register('lostStatus')}
                />
                <label htmlFor="lostStatus" className="ml-2 block text-sm text-gray-900">
                  Marcar como perdido
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </span>
          ) : (
            <span>{isEditing ? 'Atualizar' : 'Cadastrar'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default PetForm;
