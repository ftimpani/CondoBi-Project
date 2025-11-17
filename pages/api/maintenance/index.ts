import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  switch (req.method) {
    case 'GET':
      return getMaintenanceRequests(req, res, session);
    case 'POST':
      return createMaintenanceRequest(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getMaintenanceRequests(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  try {
    const {
      condominiumId,
      status,
      priority,
      category,
      page = 1,
      limit = 10
    } = req.query;

    if (!condominiumId) {
      return res.status(400).json({ message: 'ID do condomínio é obrigatório' });
    }

    const where: any = {
      condominiumId: condominiumId as string
    };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (category) {
      where.category = category;
    }

    const [requests, total] = await Promise.all([
      prisma.maintenanceRequest.findMany({
        where,
        include: {
          unit: {
            select: {
              id: true,
              number: true
            }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.maintenanceRequest.count({ where })
    ]);

    return res.status(200).json({
      requests,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get maintenance requests error:', error);
    return res.status(500).json({ message: 'Erro ao buscar solicitações' });
  }
}

async function createMaintenanceRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  try {
    const {
      condominiumId,
      unitId,
      title,
      description,
      category,
      priority = 'MEDIUM'
    } = req.body;

    // Validate required fields
    if (!condominiumId || !title || !description || !category) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    // Create maintenance request
    const request = await prisma.maintenanceRequest.create({
      data: {
        condominiumId,
        unitId,
        title,
        description,
        category,
        priority,
        status: 'OPEN',
        requestedBy: session.user.id
      },
      include: {
        unit: true
      }
    });

    // Create notification for admins
    const adminUsers = await prisma.userCondominium.findMany({
      where: {
        condominiumId,
        role: { in: ['ADMIN', 'SYNDIC'] }
      },
      select: {
        userId: true
      }
    });

    await Promise.all(
      adminUsers.map((admin) =>
        prisma.notification.create({
          data: {
            userId: admin.userId,
            title: 'Nova Solicitação de Manutenção',
            message: `${title} - ${category}`,
            type: priority === 'URGENT' ? 'ALERT' : 'INFO'
          }
        })
      )
    );

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        entity: 'MaintenanceRequest',
        entityId: request.id
      }
    });

    return res.status(201).json({
      message: 'Solicitação criada com sucesso',
      request
    });
  } catch (error) {
    console.error('Create maintenance request error:', error);
    return res.status(500).json({ message: 'Erro ao criar solicitação' });
  }
}
