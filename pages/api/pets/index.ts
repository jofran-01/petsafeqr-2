// pages/api/pets/index.ts
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

  // GET - Listar todos os pets da clínica
  if (req.method === 'GET') {
    try {
      const pets = await prisma.pet.findMany({
        where: {
          clinicId: clinicId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      return res.status(200).json(pets);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      return res.status(500).json({ error: 'Erro ao buscar pets' });
    }
  }
  
  // POST - Criar um novo pet
  if (req.method === 'POST') {
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
      } = req.body;

      // Validação básica
      if (!name || !species || !ownerName || !ownerPhone) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      }

      const pet = await prisma.pet.create({
        data: {
          clinicId,
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
        },
      });
      
      return res.status(201).json(pet);
    } catch (error) {
      console.error('Erro ao criar pet:', error);
      return res.status(500).json({ error: 'Erro ao criar pet' });
    }
  }

  // Método não permitido
  return res.status(405).json({ error: 'Método não permitido' });
}
