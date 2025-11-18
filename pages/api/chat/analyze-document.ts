import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { analyzeDocument } from '@/lib/openai'

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
    const { documentText, question } = req.body

    if (!documentText || typeof documentText !== 'string') {
      return res.status(400).json({ message: 'Documento inválido' })
    }

    // Analisar documento
    const analysis = await analyzeDocument(documentText, question)

    return res.status(200).json({
      analysis,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro ao analisar documento:', error)
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Erro ao analisar documento'
    })
  }
}
