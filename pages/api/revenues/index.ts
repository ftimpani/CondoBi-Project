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
      return getRevenues(req, res, session);
    case 'POST':
      return createRevenue(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getRevenues(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  try {
    const {
      condominiumId,
      page = 1,
      limit = 10,
      category,
      startDate,
      endDate
    } = req.query;

    if (!condominiumId) {
      return res.status(400).json({ message: 'ID do condomínio é obrigatório' });
    }

    const where: any = {
      condominiumId: condominiumId as string
    };

    if (category) {
      where.category = category;
    }

    if (startDate || endDate) {
      where.receivedDate = {};
      if (startDate) {
        where.receivedDate.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.receivedDate.lte = new Date(endDate as string);
      }
    }

    const [revenues, total] = await Promise.all([
      prisma.revenue.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { receivedDate: 'desc' }
      }),
      prisma.revenue.count({ where })
    ]);

    // Calculate totals
    const totals = await prisma.revenue.aggregate({
      where,
      _sum: {
        amount: true
      }
    });

    return res.status(200).json({
      revenues,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      },
      totals: {
        total: totals._sum.amount || 0
      }
    });
  } catch (error) {
    console.error('Get revenues error:', error);
    return res.status(500).json({ message: 'Erro ao buscar receitas' });
  }
}

async function createRevenue(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  try {
    const {
      condominiumId,
      category,
      description,
      amount,
      receivedDate,
      notes
    } = req.body;

    // Validate required fields
    if (!condominiumId || !category || !description || !amount || !receivedDate) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    // Create revenue
    const revenue = await prisma.revenue.create({
      data: {
        condominiumId,
        category,
        description,
        amount: Number(amount),
        receivedDate: new Date(receivedDate),
        notes
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        entity: 'Revenue',
        entityId: revenue.id
      }
    });

    return res.status(201).json({
      message: 'Receita criada com sucesso',
      revenue
    });
  } catch (error) {
    console.error('Create revenue error:', error);
    return res.status(500).json({ message: 'Erro ao criar receita' });
  }
}
