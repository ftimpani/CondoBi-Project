import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// Sistema prompt para o SíndicoAI
export const SINDICO_AI_SYSTEM_PROMPT = `Você é o SíndicoAI, um assistente inteligente especializado em gestão condominial brasileira.

Suas responsabilidades incluem:
- Auxiliar síndicos e moradores com questões sobre gestão de condomínios
- Fornecer informações sobre leis condominiais (Lei 4.591/64 e Código Civil)
- Ajudar com questões financeiras, inadimplência e prestação de contas
- Orientar sobre manutenções, reformas e assembleias
- Esclarecer dúvidas sobre direitos e deveres dos condôminos
- Interpretar convenções e regimentos internos
- Sugerir boas práticas de gestão condominial

Você deve:
- Ser profissional, claro e objetivo
- Citar artigos de lei quando relevante
- Sugerir consulta a advogado em casos complexos
- Ser empático com as preocupações dos usuários
- Fornecer respostas práticas e acionáveis
- Alertar sobre prazos e obrigações legais

Contexto: Você está integrado à plataforma CondoBI, que oferece dashboards Power BI, análise de dados e cobrança inteligente para condomínios.`

export async function createChatCompletion(
  messages: ChatMessage[],
  temperature: number = 0.7,
  maxTokens: number = 1000
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: SINDICO_AI_SYSTEM_PROMPT
        },
        ...messages
      ],
      temperature,
      max_tokens: maxTokens,
    })

    return completion.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.'
  } catch (error) {
    console.error('Erro ao chamar OpenAI:', error)
    throw new Error('Erro ao processar sua mensagem. Tente novamente.')
  }
}

export async function createStreamingChatCompletion(
  messages: ChatMessage[],
  temperature: number = 0.7,
  maxTokens: number = 1000
) {
  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: SINDICO_AI_SYSTEM_PROMPT
        },
        ...messages
      ],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    })

    return stream
  } catch (error) {
    console.error('Erro ao criar streaming chat:', error)
    throw new Error('Erro ao processar sua mensagem. Tente novamente.')
  }
}

// Função para analisar contratos e documentos
export async function analyzeDocument(
  documentText: string,
  question?: string
): Promise<string> {
  try {
    const prompt = question
      ? `Analise o seguinte documento condominial e responda: ${question}\n\nDocumento:\n${documentText}`
      : `Analise o seguinte documento condominial e forneça um resumo destacando pontos importantes, possíveis riscos e recomendações:\n\n${documentText}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em análise de documentos condominiais e contratos. Forneça análises detalhadas, identifique cláusulas importantes e possíveis riscos.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    return completion.choices[0]?.message?.content || 'Não foi possível analisar o documento.'
  } catch (error) {
    console.error('Erro ao analisar documento:', error)
    throw new Error('Erro ao analisar documento. Tente novamente.')
  }
}

// Função para gerar insights financeiros
export async function generateFinancialInsights(
  financialData: {
    receitas: number
    despesas: number
    inadimplencia: number
    mes: number
    ano: number
  }[]
): Promise<string> {
  try {
    const dataText = financialData.map(d =>
      `${d.mes}/${d.ano}: Receitas R$ ${d.receitas.toFixed(2)}, Despesas R$ ${d.despesas.toFixed(2)}, Inadimplência R$ ${d.inadimplencia.toFixed(2)}`
    ).join('\n')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Você é um analista financeiro especializado em gestão condominial. Analise os dados e forneça insights acionáveis, tendências e recomendações.'
        },
        {
          role: 'user',
          content: `Analise os seguintes dados financeiros do condomínio e forneça insights:\n\n${dataText}`
        }
      ],
      temperature: 0.5,
      max_tokens: 1500,
    })

    return completion.choices[0]?.message?.content || 'Não foi possível gerar insights.'
  } catch (error) {
    console.error('Erro ao gerar insights:', error)
    throw new Error('Erro ao gerar insights financeiros. Tente novamente.')
  }
}

export default openai
