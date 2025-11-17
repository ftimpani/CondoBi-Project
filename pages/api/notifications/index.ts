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
      return getNotifications(req, res, session);
    case 'PUT':
      return markAsRead(req, res, session);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getNotifications(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const where: any = {
      userId: session.user.id
    };

    if (unreadOnly === 'true') {
      where.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId: session.user.id,
          read: false
        }
      })
    ]);

    return res.status(200).json({
      notifications,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      },
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ message: 'Erro ao buscar notificações' });
  }
}

async function markAsRead(
  req: NextApiRequest,
  res: NextApiResponse,
  session: any
) {
  try {
    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({ message: 'IDs de notificação inválidos' });
    }

    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: session.user.id
      },
      data: {
        read: true
      }
    });

    return res.status(200).json({ message: 'Notificações marcadas como lidas' });
  } catch (error) {
    console.error('Mark as read error:', error);
    return res.status(500).json({ message: 'Erro ao atualizar notificações' });
  }
}
