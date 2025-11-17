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

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'ID inválido' });
  }

  switch (req.method) {
    case 'GET':
      return getCondominium(req, res, session, id);
    case 'PUT':
      return updateCondominium(req, res, session, id);
    case 'DELETE':
      return deleteCondominium(req, res, session, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getCondominium(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
  id: string
) {
  try {
    const condominium = await prisma.condominium.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        },
        buildings: {
          include: {
            _count: {
              select: { units: true }
            }
          }
        },
        units: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          take: 10
        },
        _count: {
          select: {
            units: true,
            expenses: true,
            revenues: true,
            assemblies: true
          }
        }
      }
    });

    if (!condominium) {
      return res.status(404).json({ message: 'Condomínio não encontrado' });
    }

    // Check if user has access
    if (session.user.role !== 'ADMIN') {
      const hasAccess = condominium.users.some(
        (u) => u.userId === session.user.id
      );
      if (!hasAccess) {
        return res.status(403).json({ message: 'Sem permissão' });
      }
    }

    return res.status(200).json({ condominium });
  } catch (error) {
    console.error('Get condominium error:', error);
    return res.status(500).json({ message: 'Erro ao buscar condomínio' });
  }
}

async function updateCondominium(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
  id: string
) {
  try {
    // Check if condominium exists and user has access
    const existing = await prisma.condominium.findUnique({
      where: { id },
      include: {
        users: true
      }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Condomínio não encontrado' });
    }

    // Check permission
    const isAdmin = session.user.role === 'ADMIN';
    const userRole = existing.users.find((u) => u.userId === session.user.id)?.role;

    if (!isAdmin && userRole !== 'ADMIN') {
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
      totalUnits,
      active
    } = req.body;

    // Update condominium
    const condominium = await prisma.condominium.update({
      where: { id },
      data: {
        name,
        cnpj,
        address,
        city,
        state,
        zipCode,
        phone,
        email,
        totalUnits: totalUnits ? Number(totalUnits) : undefined,
        active
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        entity: 'Condominium',
        entityId: condominium.id,
        changes: req.body
      }
    });

    return res.status(200).json({
      message: 'Condomínio atualizado com sucesso',
      condominium
    });
  } catch (error) {
    console.error('Update condominium error:', error);
    return res.status(500).json({ message: 'Erro ao atualizar condomínio' });
  }
}

async function deleteCondominium(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
  id: string
) {
  try {
    // Only admins can delete
    if (session.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Sem permissão' });
    }

    const condominium = await prisma.condominium.findUnique({
      where: { id }
    });

    if (!condominium) {
      return res.status(404).json({ message: 'Condomínio não encontrado' });
    }

    // Soft delete
    await prisma.condominium.update({
      where: { id },
      data: { active: false }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        entity: 'Condominium',
        entityId: id
      }
    });

    return res.status(200).json({ message: 'Condomínio deletado com sucesso' });
  } catch (error) {
    console.error('Delete condominium error:', error);
    return res.status(500).json({ message: 'Erro ao deletar condomínio' });
  }
}
