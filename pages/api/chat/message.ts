import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { createChatCompletion, ChatMessage } from '@/lib/openai'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  // Verificar autenticação
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user) {
    return res.status(401).json({ message: 'Não autenticado' })
  }

  try {
    const { message, conversationHistory = [] } = req.body

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Mensagem inválida' })
    }

    // Construir histórico de mensagens
    const messages: ChatMessage[] = [
      ...conversationHistory.slice(-10), // Últimas 10 mensagens
      {
        role: 'user' as const,
        content: message
      }
    ]

    // Chamar OpenAI
    const aiResponse = await createChatCompletion(messages)

    // Salvar mensagens no banco
    await prisma.$transaction([
      // Mensagem do usuário
      prisma.chatMessage.create({
        data: {
          userId: session.user.id,
          role: 'user',
          content: message,
        }
      }),
      // Resposta da IA
      prisma.chatMessage.create({
        data: {
          userId: session.user.id,
          role: 'assistant',
          content: aiResponse,
        }
      })
    ])

    return res.status(200).json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro no chat:', error)
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Erro ao processar mensagem'
    })
  }
}
