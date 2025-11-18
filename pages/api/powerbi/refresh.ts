import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { refreshDataset } from '@/lib/powerbi'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
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
    const { condominioId } = req.body

    const targetCondominioId = condominioId || session.user.condominioId

    if (!targetCondominioId) {
      return res.status(400).json({ message: 'Condomínio não especificado' })
    }

    // Buscar configuração do Power BI
    const powerBIConfig = await prisma.powerBIConfig.findUnique({
      where: {
        condominioId: targetCondominioId
      }
    })

    if (!powerBIConfig) {
      return res.status(404).json({
        message: 'Configuração do Power BI não encontrada'
      })
    }

    if (!powerBIConfig.datasetId) {
      return res.status(400).json({
        message: 'Dataset ID não configurado'
      })
    }

    // Atualizar dataset
    await refreshDataset(powerBIConfig.workspaceId, powerBIConfig.datasetId)

    return res.status(200).json({
      message: 'Atualização do dataset iniciada com sucesso',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro ao atualizar dataset:', error)
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Erro ao atualizar dados'
    })
  }
}
