// pages/api/appointments/[id].ts
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
  const appointmentId = req.query.id as string;

  // Verificar se o ID é válido
  if (!appointmentId) {
    return res.status(400).json({ error: 'ID do agendamento não fornecido' });
  }

  // GET - Buscar um agendamento específico
  if (req.method === 'GET') {
    try {
      const appointment = await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          clinicId: clinicId,
        },
        include: {
          pet: true,
        },
      });
      
      if (!appointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado' });
      }
      
      return res.status(200).json(appointment);
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
      return res.status(500).json({ error: 'Erro ao buscar agendamento' });
    }
  }
  
  // PUT - Atualizar um agendamento (principalmente para confirmar/cancelar)
  if (req.method === 'PUT') {
    try {
      const { status, notes, dateTime } = req.body;

      // Verificar se o agendamento existe e pertence à clínica
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          clinicId: clinicId,
        },
      });

      if (!existingAppointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado ou não pertence a esta clínica' });
      }

      const updatedAppointment = await prisma.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          status: status || existingAppointment.status,
          notes: notes !== undefined ? notes : existingAppointment.notes,
          dateTime: dateTime ? new Date(dateTime) : existingAppointment.dateTime,
        },
      });
      
      return res.status(200).json(updatedAppointment);
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      return res.status(500).json({ error: 'Erro ao atualizar agendamento' });
    }
  }

  // DELETE - Excluir um agendamento
  if (req.method === 'DELETE') {
    try {
      // Verificar se o agendamento existe e pertence à clínica
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          clinicId: clinicId,
        },
      });

      if (!existingAppointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado ou não pertence a esta clínica' });
      }

      // Excluir o agendamento
      await prisma.appointment.delete({
        where: {
          id: appointmentId,
        },
      });
      
      return res.status(200).json({ message: 'Agendamento excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      return res.status(500).json({ error: 'Erro ao excluir agendamento' });
    }
  }

  // Método não permitido
  return res.status(405).json({ error: 'Método não permitido' });
}
