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
      return getExpenses(req, res, session);
    case 'POST':
      return createExpense(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getExpenses(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  try {
    const {
      condominiumId,
      page = 1,
      limit = 10,
      status,
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

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    if (startDate || endDate) {
      where.dueDate = {};
      if (startDate) {
        where.dueDate.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.dueDate.lte = new Date(endDate as string);
      }
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          supplier: {
            select: {
              id: true,
              name: true
            }
          },
          contract: {
            select: {
              id: true,
              description: true
            }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { dueDate: 'desc' }
      }),
      prisma.expense.count({ where })
    ]);

    // Calculate totals
    const totals = await prisma.expense.aggregate({
      where,
      _sum: {
        amount: true
      }
    });

    const paidTotal = await prisma.expense.aggregate({
      where: { ...where, status: 'PAID' },
      _sum: {
        amount: true
      }
    });

    return res.status(200).json({
      expenses,
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
    console.error('Get expenses error:', error);
    return res.status(500).json({ message: 'Erro ao buscar despesas' });
  }
}

async function createExpense(
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
      dueDate,
      supplierId,
      contractId,
      notes
    } = req.body;

    // Validate required fields
    if (!condominiumId || !category || !description || !amount || !dueDate) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    // Create expense
    const expense = await prisma.expense.create({
      data: {
        condominiumId,
        category,
        description,
        amount: Number(amount),
        dueDate: new Date(dueDate),
        supplierId,
        contractId,
        notes,
        status: 'PENDING'
      },
      include: {
        supplier: true,
        contract: true
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        entity: 'Expense',
        entityId: expense.id
      }
    });

    return res.status(201).json({
      message: 'Despesa criada com sucesso',
      expense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    return res.status(500).json({ message: 'Erro ao criar despesa' });
  }
}
