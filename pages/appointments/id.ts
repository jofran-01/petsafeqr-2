// pages/api/appointments/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma'; // ajuste conforme sua estrutura

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    if (req.method === 'GET') {
      const appointment = await prisma.appointment.findUnique({
        where: { id },
      });

      if (!appointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }

      return res.status(200).json(appointment);
    }

    if (req.method === 'PUT') {
      const { status } = req.body;

      const updated = await prisma.appointment.update({
        where: { id },
        data: { status },
      });

      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
}
