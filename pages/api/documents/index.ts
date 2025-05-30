// pages/api/documents/index.ts
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

  // GET - Listar documentos de um pet específico
  if (req.method === 'GET') {
    try {
      const { petId } = req.query;
      
      if (!petId) {
        return res.status(400).json({ error: 'ID do animal não fornecido' });
      }

      // Verificar se o pet pertence à clínica
      const pet = await prisma.pet.findFirst({
        where: {
          id: petId as string,
          clinicId: clinicId,
        },
      });

      if (!pet) {
        return res.status(404).json({ error: 'Animal não encontrado ou não pertence a esta clínica' });
      }

      const documents = await prisma.document.findMany({
        where: {
          petId: petId as string,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      return res.status(200).json(documents);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      return res.status(500).json({ error: 'Erro ao buscar documentos' });
    }
  }
  
  // POST - Criar um novo documento
  if (req.method === 'POST') {
    try {
      const {
        petId,
        name,
        filePath,
        fileType,
      } = req.body;

      // Validação básica
      if (!petId || !name || !filePath || !fileType) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      }

      // Verificar se o pet pertence à clínica
      const pet = await prisma.pet.findFirst({
        where: {
          id: petId,
          clinicId: clinicId,
        },
      });

      if (!pet) {
        return res.status(404).json({ error: 'Animal não encontrado ou não pertence a esta clínica' });
      }

      const document = await prisma.document.create({
        data: {
          petId,
          name,
          filePath,
          fileType,
        },
      });
      
      return res.status(201).json(document);
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      return res.status(500).json({ error: 'Erro ao criar documento' });
    }
  }

  // Método não permitido
  return res.status(405).json({ error: 'Método não permitido' });
}
