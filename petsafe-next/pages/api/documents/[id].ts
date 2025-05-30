// pages/api/documents/[id].ts
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
  const documentId = req.query.id as string;

  // Verificar se o ID é válido
  if (!documentId) {
    return res.status(400).json({ error: 'ID do documento não fornecido' });
  }

  // GET - Buscar um documento específico
  if (req.method === 'GET') {
    try {
      const document = await prisma.document.findUnique({
        where: {
          id: documentId,
        },
        include: {
          pet: true,
        },
      });
      
      if (!document) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }
      
      // Verificar se o pet pertence à clínica
      if (document.pet.clinicId !== clinicId) {
        return res.status(403).json({ error: 'Acesso negado a este documento' });
      }
      
      return res.status(200).json(document);
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      return res.status(500).json({ error: 'Erro ao buscar documento' });
    }
  }
  
  // DELETE - Excluir um documento
  if (req.method === 'DELETE') {
    try {
      // Buscar o documento com o pet relacionado
      const document = await prisma.document.findUnique({
        where: {
          id: documentId,
        },
        include: {
          pet: true,
        },
      });

      if (!document) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }
      
      // Verificar se o pet pertence à clínica
      if (document.pet.clinicId !== clinicId) {
        return res.status(403).json({ error: 'Acesso negado a este documento' });
      }

      // Excluir o documento
      await prisma.document.delete({
        where: {
          id: documentId,
        },
      });
      
      return res.status(200).json({ message: 'Documento excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      return res.status(500).json({ error: 'Erro ao excluir documento' });
    }
  }

  // Método não permitido
  return res.status(405).json({ error: 'Método não permitido' });
}
