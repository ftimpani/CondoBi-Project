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
      return getUnits(req, res, session);
    case 'POST':
      return createUnit(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getUnits(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  try {
    const {
      condominiumId,
      buildingId,
      type,
      page = 1,
      limit = 20
    } = req.query;

    if (!condominiumId) {
      return res.status(400).json({ message: 'ID do condomínio é obrigatório' });
    }

    const where: any = {
      condominiumId: condominiumId as string,
      active: true
    };

    if (buildingId) {
      where.buildingId = buildingId as string;
    }

    if (type) {
      where.type = type;
    }

    const [units, total] = await Promise.all([
      prisma.unit.findMany({
        where,
        include: {
          building: {
            select: {
              id: true,
              name: true
            }
          },
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          tenant: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { number: 'asc' }
      }),
      prisma.unit.count({ where })
    ]);

    return res.status(200).json({
      units,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get units error:', error);
    return res.status(500).json({ message: 'Erro ao buscar unidades' });
  }
}

async function createUnit(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  try {
    const {
      condominiumId,
      buildingId,
      number,
      floor,
      type,
      area,
      fraction
    } = req.body;

    // Validate required fields
    if (!condominiumId || !number || !type) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    // Check if unit number already exists
    const existingUnit = await prisma.unit.findUnique({
      where: {
        condominiumId_number: {
          condominiumId,
          number
        }
      }
    });

    if (existingUnit) {
      return res.status(400).json({
        message: 'Número de unidade já existe neste condomínio'
      });
    }

    // Create unit
    const unit = await prisma.unit.create({
      data: {
        condominiumId,
        buildingId,
        number,
        floor: floor ? Number(floor) : null,
        type,
        area: area ? Number(area) : null,
        fraction: fraction ? Number(fraction) : 1.0
      },
      include: {
        building: true
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        entity: 'Unit',
        entityId: unit.id
      }
    });

    return res.status(201).json({
      message: 'Unidade criada com sucesso',
      unit
    });
  } catch (error) {
    console.error('Create unit error:', error);
    return res.status(500).json({ message: 'Erro ao criar unidade' });
  }
}
