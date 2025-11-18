import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  // Verificar autenticação
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user) {
    return res.status(401).json({ message: 'Não autenticado' })
  }

  try {
    const { limit = '50' } = req.query

    const messages = await prisma.chatMessage.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit as string),
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      }
    })

    return res.status(200).json({
      messages: messages.reverse(),
      total: messages.length
    })
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return res.status(500).json({ message: 'Erro ao buscar histórico' })
  }
}
