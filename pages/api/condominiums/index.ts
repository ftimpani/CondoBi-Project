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
      return getCondominiums(req, res, session);
    case 'POST':
      return createCondominium(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getCondominiums(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const where: any = {
      active: true
    };

    // Filter by user access
    if (session.user.role !== 'ADMIN') {
      where.users = {
        some: {
          userId: session.user.id
        }
      };
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { cnpj: { contains: search as string } }
      ];
    }

    const [condominiums, total] = await Promise.all([
      prisma.condominium.findMany({
        where,
        include: {
          users: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: {
              units: true,
              buildings: true
            }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.condominium.count({ where })
    ]);

    return res.status(200).json({
      condominiums,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get condominiums error:', error);
    return res.status(500).json({ message: 'Erro ao buscar condomínios' });
  }
}

async function createCondominium(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  try {
    // Only admins can create condominiums
    if (session.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Sem permissão' });
    }

    const {
      name,
      cnpj,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      totalUnits
    } = req.body;

    // Validate required fields
    if (!name || !address || !city || !state || !zipCode || !totalUnits) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    // Check if CNPJ already exists
    if (cnpj) {
      const existingCondominium = await prisma.condominium.findUnique({
        where: { cnpj }
      });

      if (existingCondominium) {
        return res.status(400).json({ message: 'CNPJ já cadastrado' });
      }
    }

    // Create condominium
    const condominium = await prisma.condominium.create({
      data: {
        name,
        cnpj,
        address,
        city,
        state,
        zipCode,
        phone,
        email,
        totalUnits: Number(totalUnits),
        users: {
          create: {
            userId: session.user.id,
            role: 'ADMIN'
          }
        }
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        entity: 'Condominium',
        entityId: condominium.id
      }
    });

    return res.status(201).json({
      message: 'Condomínio criado com sucesso',
      condominium
    });
  } catch (error) {
    console.error('Create condominium error:', error);
    return res.status(500).json({ message: 'Erro ao criar condomínio' });
  }
}
