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
      return getCharges(req, res, session);
    case 'POST':
      return createCharges(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getCharges(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  try {
    const {
      condominiumId,
      unitId,
      month,
      year,
      status,
      page = 1,
      limit = 10
    } = req.query;

    const where: any = {};

    if (unitId) {
      where.unitId = unitId as string;
    } else if (condominiumId) {
      where.unit = {
        condominiumId: condominiumId as string
      };
    } else {
      return res.status(400).json({
        message: 'ID do condomínio ou unidade é obrigatório'
      });
    }

    if (month) {
      where.month = Number(month);
    }

    if (year) {
      where.year = Number(year);
    }

    if (status) {
      where.status = status;
    }

    const [charges, total] = await Promise.all([
      prisma.charge.findMany({
        where,
        include: {
          unit: {
            select: {
              id: true,
              number: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: [
          { year: 'desc' },
          { month: 'desc' }
        ]
      }),
      prisma.charge.count({ where })
    ]);

    // Calculate totals
    const totals = await prisma.charge.aggregate({
      where,
      _sum: {
        amount: true
      }
    });

    const paidTotal = await prisma.charge.aggregate({
      where: { ...where, status: 'PAID' },
      _sum: {
        amount: true
      }
    });

    return res.status(200).json({
      charges,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      },
      totals: {
        total: totals._sum.amount || 0,
        paid: paidTotal._sum.amount || 0,
        pending: (totals._sum.amount || 0) - (paidTotal._sum.amount || 0)
      }
    });
  } catch (error) {
    console.error('Get charges error:', error);
    return res.status(500).json({ message: 'Erro ao buscar cobranças' });
  }
}

async function createCharges(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  try {
    const {
      condominiumId,
      month,
      year,
      baseAmount,
      dueDay = 10
    } = req.body;

    // Validate required fields
    if (!condominiumId || !month || !year || !baseAmount) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    // Get all active units in the condominium
    const units = await prisma.unit.findMany({
      where: {
        condominiumId,
        active: true
      },
      select: {
        id: true,
        fraction: true
      }
    });

    if (units.length === 0) {
      return res.status(400).json({
        message: 'Nenhuma unidade ativa encontrada'
      });
    }

    // Check if charges already exist for this period
    const existingCharges = await prisma.charge.findFirst({
      where: {
        unit: {
          condominiumId
        },
        month: Number(month),
        year: Number(year)
      }
    });

    if (existingCharges) {
      return res.status(400).json({
        message: 'Cobranças já existem para este período'
      });
    }

    // Calculate due date
    const dueDate = new Date(Number(year), Number(month) - 1, Number(dueDay));

    // Create charges for all units
    const charges = await Promise.all(
      units.map((unit) =>
        prisma.charge.create({
          data: {
            unitId: unit.id,
            month: Number(month),
            year: Number(year),
            amount: Number(baseAmount) * unit.fraction,
            dueDate,
            status: 'PENDING'
          }
        })
      )
    );

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_BULK',
        entity: 'Charge',
        changes: {
          condominiumId,
          month,
          year,
          count: charges.length
        }
      }
    });

    return res.status(201).json({
      message: `${charges.length} cobranças criadas com sucesso`,
      count: charges.length
    });
  } catch (error) {
    console.error('Create charges error:', error);
    return res.status(500).json({ message: 'Erro ao criar cobranças' });
  }
}
