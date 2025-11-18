import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { getReportsInWorkspace } from '@/lib/powerbi'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  // Verificar autenticação e permissões (apenas ADMIN ou SINDICO)
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user) {
    return res.status(401).json({ message: 'Não autenticado' })
  }

  if (!['ADMIN', 'SINDICO'].includes(session.user.role)) {
    return res.status(403).json({ message: 'Sem permissão' })
  }

  try {
    const { condominioId } = req.query

    const targetCondominioId = condominioId || session.user.condominioId

    if (!targetCondominioId) {
      return res.status(400).json({ message: 'Condomínio não especificado' })
    }

    // Buscar configuração do Power BI
    const powerBIConfig = await prisma.powerBIConfig.findUnique({
      where: {
        condominioId: targetCondominioId as string
      }
    })

    if (!powerBIConfig) {
      return res.status(404).json({
        message: 'Configuração do Power BI não encontrada'
      })
    }

    // Buscar relatórios do workspace
    const reports = await getReportsInWorkspace(powerBIConfig.workspaceId)

    return res.status(200).json({
      reports,
      total: reports.length
    })
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error)
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Erro ao buscar relatórios'
    })
  }
}
