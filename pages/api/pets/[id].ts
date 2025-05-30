// pages/api/pets/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar autenticação
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const clinicId = session.user.id;
  const petId = req.query.id as string;

  // Verificar se o ID é válido
  if (!petId) {
    return res.status(400).json({ error: 'ID do animal não fornecido' });
  }

  // GET - Buscar um pet específico
  if (req.method === 'GET') {
    try {
      const pet = await prisma.pet.findFirst({
        where: {
          id: petId,
          clinicId: clinicId,
        },
      });
      
      if (!pet) {
        return res.status(404).json({ error: 'Animal não encontrado' });
      }
      
      return res.status(200).json(pet);
    } catch (error) {
      console.error('Erro ao buscar pet:', error);
      return res.status(500).json({ error: 'Erro ao buscar pet' });
    }
  }
  
  // PUT - Atualizar um pet
  if (req.method === 'PUT') {
    try {
      const {
        name,
        species,
        breed,
        gender,
        age,
        color,
        ownerName,
        ownerPhone,
        photo,
        observations,
        lostStatus,
      } = req.body;

      // Validação básica
      if (!name || !species || !ownerName || !ownerPhone) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      }

      // Verificar se o pet existe e pertence à clínica
      const existingPet = await prisma.pet.findFirst({
        where: {
          id: petId,
          clinicId: clinicId,
        },
      });

      if (!existingPet) {
        return res.status(404).json({ error: 'Animal não encontrado ou não pertence a esta clínica' });
      }

      const updatedPet = await prisma.pet.update({
        where: {
          id: petId,
        },
        data: {
          name,
          species,
          breed,
          gender,
          age,
          color,
          ownerName,
          ownerPhone,
          photo,
          observations,
          lostStatus: lostStatus !== undefined ? lostStatus : existingPet.lostStatus,
        },
      });
      
      return res.status(200).json(updatedPet);
    } catch (error) {
      console.error('Erro ao atualizar pet:', error);
      return res.status(500).json({ error: 'Erro ao atualizar pet' });
    }
  }

  // DELETE - Excluir um pet
  if (req.method === 'DELETE') {
    try {
      // Verificar se o pet existe e pertence à clínica
      const existingPet = await prisma.pet.findFirst({
        where: {
          id: petId,
          clinicId: clinicId,
        },
      });

      if (!existingPet) {
        return res.status(404).json({ error: 'Animal não encontrado ou não pertence a esta clínica' });
      }

      // Excluir o pet
      await prisma.pet.delete({
        where: {
          id: petId,
        },
      });
      
      return res.status(200).json({ message: 'Animal excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir pet:', error);
      return res.status(500).json({ error: 'Erro ao excluir pet' });
    }
  }

  // Método não permitido
  return res.status(405).json({ error: 'Método não permitido' });
}
