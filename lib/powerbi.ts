import { ConfidentialClientApplication } from '@azure/msal-node'
import * as powerbi from 'powerbi-client'

interface PowerBIConfig {
  workspaceId: string
  reportId: string
  datasetId?: string
}

interface EmbedConfig {
  type: 'report'
  id: string
  embedUrl: string
  accessToken: string
  tokenExpiration: string
  permissions: string
}

// Configuração do MSAL (Microsoft Authentication Library)
const msalConfig = {
  auth: {
    clientId: process.env.POWERBI_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.POWERBI_TENANT_ID || 'common'}`,
    clientSecret: process.env.POWERBI_CLIENT_SECRET || '',
  }
}

// Scopes necessários para Power BI
const scopes = ['https://analysis.windows.net/powerbi/api/.default']

/**
 * Obtém token de acesso do Azure AD para Power BI
 */
export async function getAccessToken(): Promise<string> {
  try {
    const cca = new ConfidentialClientApplication(msalConfig)

    const authResult = await cca.acquireTokenByClientCredential({
      scopes,
      skipCache: false,
    })

    if (!authResult || !authResult.accessToken) {
      throw new Error('Falha ao obter token de acesso')
    }

    return authResult.accessToken
  } catch (error) {
    console.error('Erro ao obter token Power BI:', error)
    throw new Error('Erro na autenticação com Power BI')
  }
}

/**
 * Obtém configuração de embed para um relatório específico
 */
export async function getEmbedConfig(
  workspaceId: string,
  reportId: string
): Promise<EmbedConfig> {
  try {
    const accessToken = await getAccessToken()

    // URL da API do Power BI
    const embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${workspaceId}`

    // Calcular expiração do token (1 hora)
    const tokenExpiration = new Date()
    tokenExpiration.setHours(tokenExpiration.getHours() + 1)

    return {
      type: 'report',
      id: reportId,
      embedUrl,
      accessToken,
      tokenExpiration: tokenExpiration.toISOString(),
      permissions: 'All', // ou 'View' para somente leitura
    }
  } catch (error) {
    console.error('Erro ao obter embed config:', error)
    throw new Error('Erro ao configurar relatório Power BI')
  }
}

/**
 * Obtém lista de relatórios disponíveis em um workspace
 */
export async function getReportsInWorkspace(workspaceId: string) {
  try {
    const accessToken = await getAccessToken()

    const response = await fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Power BI API erro: ${response.statusText}`)
    }

    const data = await response.json()
    return data.value
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error)
    throw new Error('Erro ao buscar relatórios do Power BI')
  }
}

/**
 * Atualiza dataset do Power BI (útil para refresh de dados)
 */
export async function refreshDataset(
  workspaceId: string,
  datasetId: string
): Promise<void> {
  try {
    const accessToken = await getAccessToken()

    const response = await fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}/refreshes`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifyOption: 'NoNotification'
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Erro ao atualizar dataset: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Erro ao refresh dataset:', error)
    throw new Error('Erro ao atualizar dados do Power BI')
  }
}

/**
 * Valida se as credenciais do Power BI estão configuradas
 */
export function validatePowerBIConfig(): boolean {
  return !!(
    process.env.POWERBI_CLIENT_ID &&
    process.env.POWERBI_CLIENT_SECRET &&
    process.env.POWERBI_TENANT_ID
  )
}

/**
 * Gera configuração para embed do Power BI no frontend
 */
export function generateEmbedSettings(embedConfig: EmbedConfig) {
  return {
    type: 'report',
    id: embedConfig.id,
    embedUrl: embedConfig.embedUrl,
    accessToken: embedConfig.accessToken,
    tokenType: powerbi.models.TokenType.Aad,
    permissions: powerbi.models.Permissions.All,
    settings: {
      panes: {
        filters: {
          expanded: false,
          visible: true
        },
        pageNavigation: {
          visible: true
        }
      },
      background: powerbi.models.BackgroundType.Transparent,
      layoutType: powerbi.models.LayoutType.Custom,
      customLayout: {
        displayOption: powerbi.models.DisplayOption.FitToPage
      }
    }
  }
}

export default {
  getAccessToken,
  getEmbedConfig,
  getReportsInWorkspace,
  refreshDataset,
  validatePowerBIConfig,
  generateEmbedSettings,
}
