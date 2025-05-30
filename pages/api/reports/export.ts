// pages/api/reports/export.ts
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

  // GET - Exportar dados para relatórios
  if (req.method === 'GET') {
    try {
      const { type } = req.query;
      
      // Exportar lista de animais
      if (type === 'pets') {
        const pets = await prisma.pet.findMany({
          where: {
            clinicId: clinicId,
          },
          orderBy: {
            name: 'asc',
          },
        });
        
        // Formatar dados para CSV
        const formattedPets = pets.map(pet => ({
          id: pet.id,
          nome: pet.name,
          especie: pet.species,
          raca: pet.breed,
          sexo: pet.gender,
          idade: pet.age,
          cor: pet.color,
          nome_tutor: pet.ownerName,
          telefone_tutor: pet.ownerPhone,
          status_perdido: pet.lostStatus ? 'Sim' : 'Não',
          data_cadastro: pet.createdAt.toISOString().split('T')[0],
        }));
        
        return res.status(200).json(formattedPets);
      }
      
      // Exportar agendamentos
      if (type === 'appointments') {
        const appointments = await prisma.appointment.findMany({
          where: {
            clinicId: clinicId,
          },
          orderBy: {
            dateTime: 'desc',
          },
          include: {
            pet: true,
          },
        });
        
        // Formatar dados para CSV
        const formattedAppointments = appointments.map(appointment => ({
          id: appointment.id,
          data_hora: appointment.dateTime.toISOString(),
          nome_pet: appointment.petName,
          nome_tutor: appointment.ownerName,
          telefone_tutor: appointment.ownerPhone,
          status: appointment.status,
          observacoes: appointment.notes || '',
        }));
        
        return res.status(200).json(formattedAppointments);
      }
      
      // Tipo de relatório não suportado
      return res.status(400).json({ error: 'Tipo de relatório não suportado' });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      return res.status(500).json({ error: 'Erro ao gerar relatório' });
    }
  }

  // Método não permitido
  return res.status(405).json({ error: 'Método não permitido' });
}
