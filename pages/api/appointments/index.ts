// pages/api/appointments/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar autenticação para métodos que exigem autenticação
  if (req.method !== 'POST' || req.query.public !== 'true') {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
  }

  // GET - Listar agendamentos da clínica
  if (req.method === 'GET') {
    try {
      const session = await getServerSession(req, res, authOptions);
      const clinicId = session?.user.id;
      const { status, date } = req.query;
      
      const whereClause: any = {
        clinicId: clinicId,
      };
      
      // Filtrar por status se fornecido
      if (status) {
        whereClause.status = status;
      }
      
      // Filtrar por data se fornecida
      if (date) {
        const startDate = new Date(date as string);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date as string);
        endDate.setHours(23, 59, 59, 999);
        
        whereClause.dateTime = {
          gte: startDate,
          lte: endDate,
        };
      }
      
      const appointments = await prisma.appointment.findMany({
        where: whereClause,
        orderBy: {
          dateTime: 'desc',
        },
        include: {
          pet: true,
        },
      });
      
      return res.status(200).json(appointments);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
  }
  
  // POST - Criar um novo agendamento (pode ser público ou autenticado)
  if (req.method === 'POST') {
    try {
      const {
        petId,
        clinicId,
        dateTime,
        petName,
        ownerName,
        ownerPhone,
        notes,
      } = req.body;

      // Validação básica
      if (!dateTime || !petName || !ownerName || !ownerPhone) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      }

      // Se for uma solicitação pública, verificar se a clínica existe
      if (req.query.public === 'true') {
        if (!clinicId) {
          return res.status(400).json({ error: 'ID da clínica não fornecido' });
        }
        
        const clinic = await prisma.clinic.findUnique({
          where: {
            id: clinicId,
          },
        });
        
        if (!clinic) {
          return res.status(404).json({ error: 'Clínica não encontrada' });
        }
      } else {
        // Se for uma solicitação autenticada, usar o ID da clínica da sessão
        const session = await getServerSession(req, res, authOptions);
        const sessionClinicId = session?.user.id;
        
        // Verificar se o pet pertence à clínica, se fornecido
        if (petId) {
          const pet = await prisma.pet.findFirst({
            where: {
              id: petId,
              clinicId: sessionClinicId,
            },
          });
          
          if (!pet) {
            return res.status(404).json({ error: 'Animal não encontrado ou não pertence a esta clínica' });
          }
        }
      }

      // Criar o agendamento
      const appointment = await prisma.appointment.create({
        data: {
          petId: petId || null,
          clinicId: req.query.public === 'true' ? clinicId : (await getServerSession(req, res, authOptions))?.user.id as string,
          dateTime: new Date(dateTime),
          petName,
          ownerName,
          ownerPhone,
          notes,
          status: 'pending',
        },
      });
      
      return res.status(201).json(appointment);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
  }

  // Método não permitido
  return res.status(405).json({ error: 'Método não permitido' });
}
