import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { getEmbedConfig } from '@/lib/powerbi'
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
    const { condominioId } = req.query

    // Usar o condomínio do usuário se não especificado
    const targetCondominioId = condominioId || session.user.condominioId

    if (!targetCondominioId) {
      return res.status(400).json({ message: 'Condomínio não especificado' })
    }

    // Buscar configuração do Power BI para o condomínio
    const powerBIConfig = await prisma.powerBIConfig.findUnique({
      where: {
        condominioId: targetCondominioId as string
      }
    })

    if (!powerBIConfig) {
      return res.status(404).json({
        message: 'Configuração do Power BI não encontrada para este condomínio'
      })
    }

    // Obter token e configuração de embed
    const embedConfig = await getEmbedConfig(
      powerBIConfig.workspaceId,
      powerBIConfig.reportId
    )

    // Atualizar token no banco
    await prisma.powerBIConfig.update({
      where: {
        condominioId: targetCondominioId as string
      },
      data: {
        accessToken: embedConfig.accessToken,
        tokenExpires: new Date(embedConfig.tokenExpiration)
      }
    })

    return res.status(200).json(embedConfig)
  } catch (error) {
    console.error('Erro ao obter embed config:', error)
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Erro ao configurar Power BI'
    })
  }
}
