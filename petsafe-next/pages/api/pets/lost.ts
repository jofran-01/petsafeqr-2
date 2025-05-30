// pages/api/pets/lost.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET - Listar animais perdidos (endpoint público)
  if (req.method === 'GET' && req.query.public === 'true') {
    try {
      const pets = await prisma.pet.findMany({
        where: {
          lostStatus: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          clinic: {
            select: {
              name: true,
              phone: true,
              address: true,
            },
          },
        },
      });
      
      return res.status(200).json(pets);
    } catch (error) {
      console.error('Erro ao buscar animais perdidos:', error);
      return res.status(500).json({ error: 'Erro ao buscar animais perdidos' });
    }
  }

  // Para outros métodos, verificar autenticação
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const clinicId = session.user.id;

  // GET - Listar animais perdidos da clínica
  if (req.method === 'GET') {
    try {
      const pets = await prisma.pet.findMany({
        where: {
          clinicId: clinicId,
          lostStatus: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      
      return res.status(200).json(pets);
    } catch (error) {
      console.error('Erro ao buscar animais perdidos:', error);
      return res.status(500).json({ error: 'Erro ao buscar animais perdidos' });
    }
  }
  
  // PUT - Marcar/desmarcar animal como perdido
  if (req.method === 'PUT') {
    try {
      const { petId, lostStatus } = req.body;

      // Validação básica
      if (!petId || lostStatus === undefined) {
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
          lostStatus: lostStatus,
        },
      });
      
      return res.status(200).json(updatedPet);
    } catch (error) {
      console.error('Erro ao atualizar status do animal:', error);
      return res.status(500).json({ error: 'Erro ao atualizar status do animal' });
    }
  }

  // Método não permitido
  return res.status(405).json({ error: 'Método não permitido' });
}
