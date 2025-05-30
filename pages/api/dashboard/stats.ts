// pages/api/dashboard/stats.ts
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

  // GET - Obter estatísticas do dashboard
  if (req.method === 'GET') {
    try {
      // Total de animais
      const totalPets = await prisma.pet.count({
        where: {
          clinicId: clinicId,
        },
      });
      
      // Total de agendamentos
      const totalAppointments = await prisma.appointment.count({
        where: {
          clinicId: clinicId,
        },
      });
      
      // Agendamentos pendentes
      const pendingAppointments = await prisma.appointment.count({
        where: {
          clinicId: clinicId,
          status: 'pending',
        },
      });
      
      // Animais perdidos
      const lostPets = await prisma.pet.count({
        where: {
          clinicId: clinicId,
          lostStatus: true,
        },
      });
      
      return res.status(200).json({
        totalPets,
        totalAppointments,
        pendingAppointments,
        lostPets,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  }

  // Método não permitido
  return res.status(405).json({ error: 'Método não permitido' });
}
